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
from phrases import scrape_priberam_phrases
from card_definition import scrape_card_definitions
from forma import scrape_word_forms

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

class Definition(BaseModel):
    category: str
    definitions: List[str]

class DefinitionResponse(BaseModel):
    word: str
    definitions: List[Definition] = []
    error: Optional[str] = None

class CategoryResponse(BaseModel):
    word: str
    categories: List[str] = []
    error: Optional[str] = None

class Phrase(BaseModel):
    phrase: str
    definitions: List[str]

class PhraseResponse(BaseModel):
    word: str
    phrases: List[Phrase] = []
    error: Optional[str] = None

class FormaResponse(BaseModel):
    word: str
    forma: List[str] = []
    error: Optional[str] = None

# Add a simple rate limiter
class RateLimiter:
    def __init__(self, rate_limit=0.5, concurrent_limit=5):  # Allow 3 concurrent requests
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
        for i in range(0, len(scrapers), 5):  # Process in groups of 3
            group = scrapers[i:i+5]
            await rate_limiter.acquire()
            group_results = await asyncio.gather(
                *(loop.run_in_executor(None, partial(cache_scraping_result, verb, func)) 
                  for func, verb in group)
            )
            results.extend(group_results)

        original_form, normal, imperativo, condicional, outros = results
        
        # Handle potential error in original_form
        if "error" in original_form:
            return {
                "verb": verb,
                "conjugations": {},
                "has_conjugation": False,
                "error": original_form["error"]
            }
        
        # Start with the original form data
        result = {
            "verb": original_form["original_word"] or verb,
            "has_conjugation": True,
            "conjugations": normal['conjugations']
        }
        
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
            result['conjugations']['Particípio Passado'] = {
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
        
        # If we got a result but definitions array is empty, try card definitions
        if result["error"] is None and len(result["definitions"][0]["definitions"])==0:
            print("No definitions found, trying card definitions")
            card_result = scrape_card_definitions(word)
            if card_result["definitions"]:
                # Use the category that was already fetched in the original result
                result["definitions"][0]["definitions"] = card_result["definitions"]
        
        return result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/category/{word}", response_model=CategoryResponse)
async def get_categories(word: str):
    """
    Get grammatical categories for a Portuguese word
    """
    try:
        loop = asyncio.get_event_loop()
        await rate_limiter.acquire()
        result = await loop.run_in_executor(
            None, 
            partial(cache_scraping_result, word, scrape_priberam_dictionary, True)  # Set justCategory=True
        )
        
        if not result['categories']:
            return {
                "word": word,
                "categories": [],
                "error": "No categories found for this word"
            }
            
        return result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/phrases/{word}", response_model=PhraseResponse)
async def get_phrases(word: str):
    """
    Get phrases and their definitions for a Portuguese word
    """
    try:
        loop = asyncio.get_event_loop()
        await rate_limiter.acquire()
        phrases = await loop.run_in_executor(
            None, 
            partial(cache_scraping_result, word, scrape_priberam_phrases)
        )
        
        if not phrases:
            return {
                "word": word,
                "phrases": [],
                "error": "No phrases found for this word"
            }
            
        return {
            "word": word,
            "phrases": phrases,
            "error": None
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forma/{word}", response_model=FormaResponse)
async def get_word_forms(word: str):
    """
    Get alternative forms for a Portuguese word
    """
    try:
        loop = asyncio.get_event_loop()
        await rate_limiter.acquire()
        result = await loop.run_in_executor(
            None, 
            partial(cache_scraping_result, word, scrape_word_forms)
        )
        
        if not result['forma']:
            return {
                "word": word,
                "forma": [],
                "error": "Could not find this word form"
            }
            
        return result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)