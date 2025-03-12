import requests
from bs4 import BeautifulSoup
from typing import Dict, List
import json
import os
from constants import (
    DEFAULT_HEADERS,
    BASE_URL,
    DEFAULT_PARSER,
    DEFAULT_RATE_LIMIT
)
import time
import re

def scrape_word_forms(word: str) -> Dict[str, List[str]]:
    """
    Scrape word forms from Priberam dictionary
    
    Args:
        word: The word to look up forms for
        
    Returns:
        Dictionary containing word forms and error status
    """
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        encoded_word = requests.utils.quote(word)
        url = f"{BASE_URL}/{encoded_word}"
        response = requests.get(url, headers=DEFAULT_HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, DEFAULT_PARSER)
        forms = []
        
        # Find the forma description paragraph
        forma_section = soup.find('p', class_='dp-forma')
        if forma_section:
            forma_text = forma_section.get_text(strip=True, separator=' ')
            # Clean up duplicate words
            forma_text = ' '.join([w for i, w in enumerate(forma_text.split()) 
                                 if i == 0 or w != forma_text.split()[i-1]])
            
            # Extract the parts within brackets and strip whitespace
            bracketed_forms = [form.strip() for form in re.findall(r'\[(.*?)\]', forma_text)]
            if bracketed_forms:
                forms.extend(bracketed_forms)
        
        # Find the word forms section
        forms_section = soup.find('div', class_='dp-formas-palavras')
        if forms_section:
            # Extract all word forms
            for form in forms_section.find_all('a', class_='word'):
                form_text = form.get_text(strip=True)
                if form_text and form_text not in forms:
                    forms.append(form_text)
        
        return {
            "word": word,
            "forma": forms,
            "error": None
        }
        
    except Exception as e:
        return {
            "word": word,
            "forma": [],
            "error": str(e)
        }

def main():
    try:
        word = 'jantar'  # Example word
        result = scrape_word_forms(word)
        
        # Create output directory if it doesn't exist
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'output')
        os.makedirs(output_dir, exist_ok=True)
        
        # Write to JSON file
        output_file = os.path.join(output_dir, f'forms_{word}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
            
        print(f"Results written to {output_file}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
