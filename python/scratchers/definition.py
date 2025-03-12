import requests
from bs4 import BeautifulSoup
from typing import Dict, List
from collections import defaultdict
import json
import os

from constants import (
    DEFAULT_HEADERS,
    BASE_URL,
)



def scrape_priberam_dictionary(word: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Scrape definitions from Priberam dictionary
    
    Args:
        word: The word to look up
        
    Returns:
        Dictionary containing word and its definitions grouped by category
    """
    try:
        url = f"{BASE_URL}/{word}"
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        definitions_by_category = defaultdict(list)
        
        definition_div = soup.select_one('.dp-definicao')
        if not definition_div:
            return {"word": word, "definitions": [], "error": None}
            
        current_category = None
        current_definitions = []
        
        for element in definition_div.find_all(['h4', 'div']):
            # Only process h4 elements that have the 'varpt' class
            if element.name == 'h4':
                if not element.get('class') or 'varpt' not in element.get('class'):
                    continue
                
                # If we have a previous category, save its definitions
                if current_category:
                    
                    definitions_by_category[current_category].extend(current_definitions)
                
                # Extract text from the span element inside h4
                category_span = element.select_one('span')
                
                current_category = category_span.get_text(strip=True) if category_span else element.get_text(strip=True)
                current_definitions = []
                
            elif element.name == 'div' and 'dp-definicao-linha' in element.get('class', []):
                def_text = element.select_one('.def')
                if def_text:
                    # Use separator=' ' to preserve spaces between text nodes
                    definition = def_text.get_text(separator=' ', strip=True)
                    if not definition.startswith('•'):
                        current_definitions.append(definition)
        
        # Add the last category's definitions
        if current_category:
            definitions_by_category[current_category].extend(current_definitions)
        
        definitions = [
            {
                "category": category,
                "definitions": definition_list
            }
            for category, definition_list in definitions_by_category.items()
        ]
        
        return {
            "word": word,
            "definitions": definitions,
            "error": None
        }
        
    except requests.RequestException as e:
        return {
            "word": word,
            "definitions": [],
            "error": f"Failed to fetch definition for '{word}': {str(e)}"
        }



def main():
    try:
        word = 'viu'
        # Get the dictionary data
        result = scrape_priberam_dictionary(word)
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        os.makedirs(output_dir, exist_ok=True)
        
        # Write to JSON file
        output_file = os.path.join(output_dir, f'definition_{word}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to output/definition_{word}.json")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()