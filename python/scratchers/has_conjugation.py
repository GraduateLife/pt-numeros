import requests
from bs4 import BeautifulSoup
import time
from typing import Dict, Optional
import json
import os
from constants import DEFAULT_RATE_LIMIT
def check_conjugation_availability(word: str) -> Dict[str, bool]:
    """
    Check if conjugations are available for a given word on Priberam
    
    Args:
        word: The word to check for conjugation availability
        
    Returns:
        Dictionary containing the word and whether conjugations are available
    """
    # Add delay to be respectful to the server
    time.sleep(DEFAULT_RATE_LIMIT)
    
    try:
        # Make request to the conjugation page
        url = f"https://dicionario.priberam.org/Conjugar/{requests.utils.quote(word)}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Check for the alert message
        alert = soup.select_one('div.alert.alert-info')
        has_conjugation = not (alert and "não está disponível" in alert.get_text())
        
        return {
            "word": word,
            "has_conjugation": has_conjugation
        }
        
    except requests.RequestException as e:
        raise Exception(f"Failed to check conjugation availability for '{word}': {str(e)}")

def main():
    try:
        # Example usage
        word = 'viu'  # This should return False for has_conjugation
        print(f"Checking conjugation availability for: {word}")
        
        result = check_conjugation_availability(word)
        
        # Create output directory if it doesn't exist
        os.makedirs('output', exist_ok=True)
        
        # Write results to a JSON file in the output folder
        output_file = os.path.join('output', f"has_conjugation_{word}.json")
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
