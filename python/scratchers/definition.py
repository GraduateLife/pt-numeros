import requests
from bs4 import BeautifulSoup
from typing import Dict, List
from collections import defaultdict
import json
import os

from constants import (
    DEFAULT_HEADERS,
    BASE_URL,
    DEFAULT_PARSER
)



def scrape_priberam_dictionary(word: str, justCategory: bool = False) -> Dict[str, List[Dict[str, str]]]:
    """
    Scrape definitions from Priberam dictionary
    
    Args:
        word: The word to look up
        justCategory: If True, only return category information without definitions
        
    Returns:
        Dictionary containing word and its definitions grouped by category
    """
    try:
        encoded_word = requests.utils.quote(word)
        url = f"{BASE_URL}/{encoded_word}"
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        definitions_by_category = defaultdict(list)
        
        definition_div = soup.select_one('.dp-definicao')
        if not definition_div:
            return {"word": word, "definitions": [], "error": None}
            
        current_category = None
        current_definitions = []
        categories = []  # New list to store just categories
        
        for element in definition_div.find_all(['h4', 'div']):
            # Only process h4 elements that have the 'varpt' class
            # print(element)
            if element.name == 'h4':
                if not element.get('class') or 'varpt' not in element.get('class'):
                    continue
                
                if current_category and not justCategory:
                    definitions_by_category[current_category].extend(current_definitions)
                category_span = element.select_one('span')
                current_category = category_span.get_text(strip=True) if category_span else element.get_text(strip=True)
                if justCategory:
                    categories.append(current_category)
                else:
                    current_definitions = []
                
            elif not justCategory and element.name == 'div' and 'dp-definicao-linha' in element.get('class', []):
                # Check if there's a span with a number at the start
                number_span = element.select_one('.--pequeno')
                if not number_span or not number_span.get_text(strip=True).replace('.', '').isdigit():
                    continue
                    
                def_text = element.select_one('.def')
                if def_text:
                    definition_parts = []
                    for content in def_text.contents:
                    
                        if isinstance(content, str):
                            print('in instance')
                            definition_parts.append(content.strip())
                            
                        elif content.name == 'aao':
                            print('in aao')
                            # First try to get word spans
                            word_spans = content.select('.word')
                            if word_spans:
                                definition_parts.extend(span.get_text(strip=True) for span in word_spans)
                            else:
                                # If no word spans, get the direct text content
                                definition_parts.append(content.get_text(strip=True))
                        elif content.name == 'i':
                            print('in i')
                            definition_parts.append(content.get_text(strip=True))
                        else:
                            print('in else')
                            
                    
                    definition = ' '.join(part for part in definition_parts if part)
                    if definition:
                        current_definitions.append(definition)
            else:
                if element.name == 'div' and 'dp-definicao-cartao' in element.get('class', []):
                    print('in dp-definicao-cartao')
                    
        
        if current_category and not justCategory:
            definitions_by_category[current_category].extend(current_definitions)
        
        if justCategory:
            return {
                "word": word,
                "categories": categories,
                "error": None
            }
            
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
            "definitions": [] if not justCategory else [],
            "categories": [] if justCategory else None,
            "error": f"Failed to fetch definition for '{word}': {str(e)}"
        }



def main():
    try:
        word = 'autocarro'
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