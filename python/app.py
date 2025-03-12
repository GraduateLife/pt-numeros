from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Dict, List, Optional
from pydantic import BaseModel
import sys
from pathlib import Path
import asyncio
from functools import partial, lru_cache
import time

sys.path.append(str(Path(__file__).parent / "scratchers"))

# Import existing scrapers
from case_normal import scrape_priberam_conjugations
from case_imperativo import scrape_imperativo
from case_condicional import scrape_condicional
from case_outros import scrape_gerundio_participio
from original_verb import scrape_priberam_origin
from has_conjugation import check_conjugation_availability
from definition import scrape_priberam_dictionary

app = FastAPI(title="Portuguese Verb Conjugation API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConjugationResponse(BaseModel):
    verb: str
    conjugations: Dict[str, Dict[str, List[Dict[str, str]]]] = {}
    has_conjugation: bool
    error: Optional[str] = None

class DefinitionResponse(BaseModel):
    word: str
    definitions: List[Dict[str, str]] = []
    error: Optional[str] = None

# Add a simple rate limiter
class RateLimiter:
    def __init__(self, rate_limit=0.3, concurrent_limit=3):  # Allow 3 concurrent requests
        self.rate_limit = rate_limit
        self.last_requests = []  # Track timestamps of recent requests
        self.lock = asyncio.Lock()
        self.concurrent_limit = concurrent_limit

    async def acquire(self):
        async with self.lock:
            now = time.time()
            
            # Remove timestamps older than rate_limit
            self.last_requests = [t for t in self.last_requests if now - t < self.rate_limit]
            
            # If we have too many recent requests, wait
            if len(self.last_requests) >= self.concurrent_limit:
                wait_time = self.last_requests[0] + self.rate_limit - now
                if wait_time > 0:
                    await asyncio.sleep(wait_time)
                self.last_requests.pop(0)
            
            self.last_requests.append(now)

rate_limiter = RateLimiter()

# Add caching decorator
@lru_cache(maxsize=1000)  # Cache up to 1000 words
def cache_scraping_result(verb: str, scraper_func, *args):
    return scraper_func(verb, *args)

@app.get("/conjugate/{verb}", response_model=ConjugationResponse)
async def get_conjugations(verb: str):
    """
    Get all conjugations for a Portuguese verb
    """
    try:
        loop = asyncio.get_event_loop()
        
        # Check availability first (cached)
        availability = cache_scraping_result(verb, check_conjugation_availability)
        
        if not availability['has_conjugation']:
            return {
                "verb": verb,
                "conjugations": {},
                "has_conjugation": False,
                "error": "This word does not have conjugations"
            }

        # Split scrapers into groups to manage concurrency better
        scrapers = [
            (scrape_priberam_origin, verb),
            (scrape_priberam_conjugations, verb),
            (scrape_imperativo, verb),
            (scrape_condicional, verb),
            (scrape_gerundio_participio, verb)
        ]

        results = []
        for i in range(0, len(scrapers), 3):  # Process in groups of 3
            group = scrapers[i:i+3]
            await rate_limiter.acquire()
            group_results = await asyncio.gather(
                *(loop.run_in_executor(None, partial(cache_scraping_result, verb, func)) 
                  for func, verb in group)
            )
            results.extend(group_results)

        original_form, normal, imperativo, condicional, outros = results
        
        # Start with the original form data
        result = original_form
        result['has_conjugation'] = True
        result['conjugations'] = normal['conjugations']
        
        # Add Imperativo
        if 'Imperativo' in imperativo:
            result['conjugations']['Imperativo'] = imperativo['Imperativo']
        
        # Add Condicional
        if 'Condicional' in condicional:
            result['conjugations']['Condicional'] = {
                'Presente': condicional['Condicional']
            }
        
        # Add Gerúndio and Particípio Passado to conjugations
        if 'Gerúndio' in outros:
            result['conjugations']['Gerúndio'] = {
                'Presente': [{
                    'conjugation': outros['Gerúndio']
                }]
            }
        if 'Particípio Passado' in outros:
            result['conjugations']['Particípio_Passado'] = {
                'Presente': [{
                    'conjugation': outros['Particípio Passado']
                }]
            }
        
        return result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/definition/{word}", response_model=DefinitionResponse)
async def get_definitions(word: str):
    """
    Get definitions for a Portuguese word
    """
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, scrape_priberam_dictionary, word)
        
        if not result['definitions']:
            return {
                "word": word,
                "definitions": [],
                "error": "No definitions found for this word"
            }
            
        return result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)