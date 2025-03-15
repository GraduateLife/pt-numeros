import requests
from bs4 import BeautifulSoup
from typing import Dict
import time
import os
from constants import (
    DEFAULT_HEADERS,
    BASE_URL,
    DEFAULT_PARSER,
    DEFAULT_RATE_LIMIT
)

def check_word_exists(word: str) -> Dict[str, any]:
    """
    Check if a word exists in the Priberam dictionary.
    Looks for the alert-info div which appears when word doesn't exist.
    
    Args:
        word: The word to look up
        
    Returns:
        Dictionary containing:
        - word: the searched word
        - exists: boolean indicating if word exists
        - error: error message if any occurred
    """
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        encoded_word = requests.utils.quote(word)
        url = f"{BASE_URL}/{encoded_word}"
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        # Save the HTML response to a file
        # output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        # os.makedirs(output_dir, exist_ok=True)
        # html_file = os.path.join(output_dir, f'response_{word}.html')
        
        # with open(html_file, 'w', encoding='utf-8') as f:
        #     f.write(response.text)
            
        # print(f"Saved HTML response to: {html_file}")
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        
        # # Also save the prettified HTML for easier inspection
        # pretty_html_file = os.path.join(output_dir, f'response_{word}_pretty.html')
        # with open(pretty_html_file, 'w', encoding='utf-8') as f:
        #     f.write(soup.prettify())
            
        # print(f"Saved prettified HTML to: {pretty_html_file}")
        
        # Look for any of the three patterns that indicate word doesn't exist:
        # 1. alert-info div
        # 2. heading about suggested words
        # 3. suggestions div
        not_found = soup.find('div', class_='alert alert-info') or \
                   soup.find('h6', text='Se procurava uma das palavras seguintes, clique nela para consultar a sua definição.') or \
                   soup.find('div', class_='pb-sugestoes-proximas')
        # print('word not found?', not_found is not None)
        
        if not_found:
            # print(f"Word '{word}' not found (alert message present)")  # Debug print
            return {
                "word": word,
                "exists": False,
                "error": None
            }
        else:
            # print(f"Word '{word}' exists (no alert message)")  # Debug print
            return {
                "word": word,
                "exists": True,
                "error": None
            }
        
    except Exception as e:
        return {
            "word": word,
            "exists": False,
            "error": str(e)
        }

def main():
    test_words = ['creg']  # Testing both real and fake words
    
    for word in test_words:
        result = check_word_exists(word)
        print(f"\nChecking word: {word}")
        print(f"Exists in dictionary: {result['exists']}")
        if result['error']:
            print(f"Error: {result['error']}")

if __name__ == "__main__":
    main()
