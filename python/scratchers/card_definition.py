from bs4 import BeautifulSoup
from typing import Dict, List
from collections import defaultdict
import json
import os
import requests

from constants import (
    DEFAULT_HEADERS,
    BASE_URL,
    DEFAULT_PARSER
)

def scrape_card_definitions(word: str) -> Dict[str, List[str]]:
    """
    Scrape definitions from card-style definition blocks
    
    Args:
        word: The word to look up
        
    Returns:
        Dictionary containing definitions list and error status
    """
    try:
        encoded_word = requests.utils.quote(word)
        url = f"{BASE_URL}/{encoded_word}"
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        definitions = []
        card_definitions = soup.select('.dp-definicao-cartao')
        
        for card in card_definitions:
            def_text = card.select_one('.def')
            if def_text:
                definition_parts = []
                for content in def_text.contents:
                    if isinstance(content, str):
                        definition_parts.append(content.strip())
                    elif content.name == 'aao':
                        definition_parts.append(content.get_text(strip=True))
                    elif content.name == 'i':
                        definition_parts.append(content.get_text(strip=True))
                
                definition = ' '.join(part for part in definition_parts if part)
                if definition:
                    definitions.append(definition)
        
        return {
            "definitions": definitions,
            "error": None
        }
        
    except Exception as e:
        return {
            "definitions": [],
            "error": str(e)
        }

def main():
    try:
        word = 'ver'
        result = scrape_card_definitions(word)
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        os.makedirs(output_dir, exist_ok=True)
        
        # Write to JSON file
        output_file = os.path.join(output_dir, f'card_definitions_{word}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to {output_file}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()
