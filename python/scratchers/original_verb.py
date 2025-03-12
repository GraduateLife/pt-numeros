import requests
from bs4 import BeautifulSoup
import time
from typing import Dict, Optional
import json
import os
from constants import DEFAULT_RATE_LIMIT, DEFAULT_PARSER
def scrape_priberam_origin(verb: str) -> Dict[str, Optional[str]]:
    """
    Scrape verb origin information from Priberam
    
    Args:
        verb: The verb to look up origin for
        
    Returns:
        Dictionary containing the verb and its origin information
    """
    # Add delay to be respectful to the server
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        # Make request to the dictionary page
        url = f"https://dicionario.priberam.org/Conjugar/{requests.utils.quote(verb)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        
        # Find the verb title section
        title_section = soup.select_one('div.clearfix.pb-section-title.mb-32')
        
        # Get the verb
        verb_element = title_section.find('h1') if title_section else None
        verb_text = verb_element.get_text(strip=True) if verb_element else None
        
        return {
            "verb": verb_text,
            "original_query": verb
        }
        
    except requests.RequestException as e:
        raise Exception(f"Failed to fetch origin for '{verb}': {str(e)}")

def main():
    try:
        # Example usage
        verb = 'janto'
        print(f"Fetching origin for: {verb}")
        
        result = scrape_priberam_origin(verb)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write results to a JSON file in the output folder
        output_file = os.path.join('output', f"origin_{verb}.json")
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
