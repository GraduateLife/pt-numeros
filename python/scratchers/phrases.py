from typing import Dict, List
import requests
from bs4 import BeautifulSoup
import os
import json
from constants import DEFAULT_PARSER
def scrape_priberam_phrases(word: str) -> List[Dict[str, List[str]]]:
    """
    Scrapes phrases and their definitions from the Priberam dictionary page
    Args:
        word: The word to look up phrases for
    Returns:
        List of dictionaries containing phrases and their definitions
    """
    try:
        url = f"https://dicionario.priberam.org/{requests.utils.quote(word)}"
        response = requests.get(url)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        phrases_definitions = []
        
        # Find all phrase markers
        phrase_markers = soup.find_all('h4', class_='mt-8 mb-4')        
        for i, marker in enumerate(phrase_markers):
            # Get text content with proper spacing
            phrase = ' '.join(
                text.strip() 
                for text in marker.stripped_strings 
                if text.strip()
            )
            
            definitions = []
            
            # Find the next marker or etymology section to know where to stop
            next_marker = None
            if i < len(phrase_markers) - 1:
                next_marker = phrase_markers[i + 1]
            
            # Get definitions between current marker and next marker
            current = marker.find_next('span', class_='def')
            while current:
                # Stop if we hit the etymology section
                if current.get('class') == ['ml-8', 'def', 'p'] and 'latim' in current.text:
                    break
                    
                # Stop if we hit the next phrase marker
                if next_marker and current.sourceline >= next_marker.sourceline:
                    break
                
                # Get the complete text content, including nested spans
                definition = ''
                for content in current.contents:
                    if isinstance(content, str):
                        definition += content
                    elif content.name == 'span':
                        definition += content.get_text(strip=True)
                    elif content.name in ['i', 'b']:  # Handle italic and bold text
                        definition += content.get_text(strip=True)
                
                definition = definition.strip().replace('•', '').strip()
                if definition:
                    # Remove duplicate definitions
                    if not definitions or definition != definitions[-1]:
                        definitions.append(definition)
                        
                current = current.find_next('span', class_='def')
            
            if definitions:
                phrases_definitions.append({
                    "phrase": phrase,
                    "definitions": definitions
                })
        
        return phrases_definitions
        
    except requests.RequestException as e:
        print(f"Error fetching data: {str(e)}")
        return []

def main():
    try:
        word = 'carro'
        result = scrape_priberam_phrases(word)
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        os.makedirs(output_dir, exist_ok=True)
        
        # Write to JSON file
        output_file = os.path.join(output_dir, f'phrases_{word}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to output/phrases_{word}.json")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()