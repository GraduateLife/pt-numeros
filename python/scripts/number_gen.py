import json
import os
from num2words import num2words
from enum import Enum

class Language(Enum):
    PT_BR = 'pt_BR'
    PT = 'pt'

language = Language.PT.value
output_dirname = "public/data"


def generate_number_mappings(start=0, end=100):
    numbers = {}
    for num in range(start, end + 1):
        # Convert number to Portuguese words
        word = num2words(num, lang=language)
        numbers[str(num)] = word

    return numbers


output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), output_dirname)
os.makedirs(output_dir, exist_ok=True)

# Generate mappings and write to JSON file
numbers = generate_number_mappings(0, 100)  # You can change the range as needed
output_path = os.path.join(output_dir, f"numbers_{language}.json")
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(numbers, f, ensure_ascii=False, indent=2)

print(f"JSON file created at: {output_path}")