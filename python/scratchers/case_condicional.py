import requests
from bs4 import BeautifulSoup
import time
import json
from typing import Dict, List
import os
from constants import DEFAULT_RATE_LIMIT

def scrape_condicional(verb: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Scrape only the Condicional conjugations from Priberam
    
    Args:
        verb: The verb to look up
        
    Returns:
        Dictionary containing Condicional conjugations
    """
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        url = f"https://dicionario.priberam.org/Conjugar/{requests.utils.quote(verb)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the Condicional wrapper
        condicional_wrapper = soup.find('div', class_='dp-wrap-conj__condicional')
        if not condicional_wrapper:
            return {}
            
        conjugations = []
        
        # Get all conjugation forms
        conj_wrapper = condicional_wrapper.select_one('.dp-conj > .dp-conj__wrapper')
        if conj_wrapper:
            for form in conj_wrapper.find_all('div', class_='clearfix'):
                person = form.find('div', class_='ConjugaNumeroPessoa')
                if person:
                    person_text = person.get_text(strip=True)
                    conjugation = form.get_text().replace(person_text, '').strip()
                    conjugations.append({
                        'person': person_text,
                        'conjugation': conjugation
                    })
        
        return {'Condicional': conjugations}
    except Exception as e:
        print(f"Error accessing URL: {str(e)}")
        return {}

def main():
    try:
        verb = 'jantar'
        result = scrape_condicional(verb)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write to JSON file in output folder
        output_file = os.path.join('output', f"condicional_{verb}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to {output_file}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()