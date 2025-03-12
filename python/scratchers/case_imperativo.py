import requests
from bs4 import BeautifulSoup
import time
import json
from typing import Dict, List
import os
from constants import DEFAULT_RATE_LIMIT
def scrape_imperativo(verb: str) -> Dict[str, Dict[str, List[Dict[str, str]]]]:
    """
    Scrape only the Imperativo conjugations from Priberam
    
    Args:
        verb: The verb to look up
        
    Returns:
        Dictionary containing Imperativo conjugations (Afirmativo and Negativo)
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
        result = {'Imperativo': {}}
        
        # Find the Imperativo wrapper
        imperativo_wrapper = soup.find('div', class_='dp-wrap-conj__imperativo')
        if not imperativo_wrapper:
            return result
            
        # Handle Afirmativo
        afirmativo_div = imperativo_wrapper.find('div', class_='dp-conj')
        if afirmativo_div:
            result['Imperativo']['Afirmativo'] = []
            wrapper = afirmativo_div.find('div', class_='dp-conj__wrapper')
            if wrapper:
                for form in wrapper.find_all('div', class_='clearfix'):
                    conjugation = form.find('span', class_='Imperativo')
                    person = form.find('div', class_='ConjugaImperativoNumeroPessoa')
                    if conjugation and person:
                        result['Imperativo']['Afirmativo'].append({
                            'person': person.get_text(strip=True),
                            'conjugation': conjugation.get_text(strip=True)
                        })
        
        # Handle Negativo
        negativo_div = imperativo_wrapper.find_all('div', class_='dp-conj')[1]
        if negativo_div:
            result['Imperativo']['Negativo'] = []
            wrapper = negativo_div.find('div', class_='dp-conj__wrapper')
            if wrapper:
                for form in wrapper.find_all('div', class_='clearfix'):
                    conjugation_span = form.find('span', class_='ImperativoNegativo')
                    person = form.find('div', class_='ConjugaImperativoNumeroPessoa')
                    if conjugation_span and person:
                        # Get 'não' and the verb separately and join with a space
                        nao = conjugation_span.find('span', class_='smallText').get_text()
                        verb_part = conjugation_span.get_text().replace(nao, '', 1).strip()
                        full_conjugation = f"{nao}{verb_part}"
                        
                        result['Imperativo']['Negativo'].append({
                            'person': person.get_text(strip=True),
                            'conjugation': full_conjugation
                        })
        
        return result
    except Exception as e:
        print(f"Error accessing URL: {str(e)}")
        return {}

def main():
    try:
        verb = 'jantar'
        result = scrape_imperativo(verb)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write to JSON file in output folder
        output_file = os.path.join('output', f"imperativo_{verb}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to {output_file}")
        print("\nResult content:")
        print(json.dumps(result, ensure_ascii=False, indent=2))
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()