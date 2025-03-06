from transformers import VitsModel, AutoTokenizer
import torch
import soundfile as sf
import os
import json

model = VitsModel.from_pretrained("facebook/mms-tts-por")
tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-por")

src_dirname = "public/data/numbers_pt.json"
output_dirname = "public/audios"

# Read numbers from JSON file
json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), src_dirname)
with open(json_path, 'r', encoding='utf-8') as f:
    numbers = json.load(f)

# Create output directory if it doesn't exist

output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), output_dirname)
os.makedirs(output_dir, exist_ok=True)

# Generate audio files
for key, text in numbers.items():
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        speech = model(**inputs).waveform
    output_path = os.path.join(output_dir, f"number_{key}.wav")
    sf.write(output_path, speech.numpy().squeeze(), model.config.sampling_rate)
    print(f"Generated audio for number {key}")