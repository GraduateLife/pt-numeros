import requests
from bs4 import BeautifulSoup
import time
from typing import Dict, List
import json
import os

from constants import DEFAULT_RATE_LIMIT, DEFAULT_PARSER

def scrape_priberam_conjugations(verb: str) -> Dict[str, Dict[str, List[str]]]:
    """
    Scrape verb conjugations from Priberam
    
    Args:
        verb: The verb to look up conjugations for
        
    Returns:
        Dictionary containing tenses and their conjugations
    """
    # Add delay to be respectful to the server
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        # Make request to the conjugation page
        url = f"https://dicionario.priberam.org/Conjugar/{requests.utils.quote(verb)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        
        conjugations = {}

        content = soup.select_one('.dp-conteudo__esquerda')
        if not content:
            return {"verb": verb, "conjugations": {}}
            

            
        # Handle moods
        for section in content.select('h2'):
            mood = section.get_text(strip=True)
            if not mood or mood == 'Imperativo' or mood in ['Condicional', 'Gerúndio', 'Particípio Passado']:  # Skip Imperativo and Condicional
                continue
                
            conjugations[mood] = {}
            
            mood_wrapper = section.find_next_sibling('div', class_='dp-wrap-conj')
            if mood_wrapper:
                for tense_div in mood_wrapper.find_all('div', recursive=False):
                    tense_title = tense_div.find('h5')
                    if not tense_title:
                        continue
                        
                    tense = tense_title.get_text(strip=True)
                    conjugations[mood][tense] = []
                    
                    conj_wrapper = tense_div.find('div', recursive=False)
                    if conj_wrapper:
                        person_forms = conj_wrapper.find_all('div', class_='ConjugaNumeroPessoa')
                        if person_forms:
                            for form in conj_wrapper.find_all('div', recursive=False):
                                person = form.find('div', class_='ConjugaNumeroPessoa')
                                if person:
                                    person_text = person.get_text(strip=True)
                                    conjugation = form.get_text().replace(person_text, '').strip()
                                    conjugations[mood][tense].append({
                                        'person': person_text,
                                        'conjugation': conjugation
                                    })
                        else:
                            conjugation = conj_wrapper.get_text().strip()
                            conjugations[mood][tense].append({
                                'conjugation': conjugation
                            })
        
        return {
            "verb": verb,
            "conjugations": conjugations
        }
        
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch conjugations for '{verb}': {str(e)}")

def main():
    try:
        # Example usage
        verb = 'jantar'
        print(f"Fetching conjugations for: {verb}")
        
        result = scrape_priberam_conjugations(verb)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write results to a JSON file in the output folder
        output_file = os.path.join('output', f"conjugations_{verb}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"\nResults written to {output_file}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        # Print full traceback for debugging
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()