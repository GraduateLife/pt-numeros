import requests
from bs4 import BeautifulSoup
import time
import json
from typing import Dict
import os
from constants import DEFAULT_RATE_LIMIT, DEFAULT_PARSER

def scrape_gerundio_participio(verb: str) -> Dict[str, str]:
    """
    Scrape Gerúndio and Particípio Passado forms from Priberam
    
    Args:
        verb: The verb to look up
        
    Returns:
        Dictionary containing Gerúndio and Particípio Passado forms
    """
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        url = f"https://dicionario.priberam.org/Conjugar/{requests.utils.quote(verb)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        result = {}
        
        # Find Gerúndio using the correct class
        gerundio_wrapper = soup.find('div', class_='dp-wrap-conj__gerundio')
        if gerundio_wrapper:
            gerundio_div = gerundio_wrapper.find('div', class_='clearfix')
            if gerundio_div:
                # Get text excluding the empty ConjugaNumeroPessoa div
                gerundio = gerundio_div.get_text(strip=True)
                result['Gerúndio'] = gerundio
        
        # Find Particípio Passado (using correct class name)
        participio_wrapper = soup.find('div', class_='dp-wrap-conj__participio-passado')
        if participio_wrapper:
            participio_div = participio_wrapper.find('div', class_='clearfix')
            if participio_div:
                participio = participio_div.get_text(strip=True)
                result['Particípio Passado'] = participio
        
        return result
        
    except Exception as e:
        print(f"Error accessing URL: {str(e)}")
        return {}

def main():
    try:
        verb = 'jantar'
        result = scrape_gerundio_participio(verb)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write to JSON file in output folder
        output_file = os.path.join('output', f"gerundio_participio_{verb}.json")
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