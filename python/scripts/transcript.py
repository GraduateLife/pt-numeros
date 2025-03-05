import whisper # type: ignore
import os

model = whisper.load_model("base")
output_dirname='output'
# Get the audio file path relative to project root
audio_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'audios', 'tests_jfk.flac')
result = model.transcribe(audio_file)

# Create output directory if it doesn't exist
output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), output_dirname)
os.makedirs(output_dir, exist_ok=True)

# Write the transcribed text to a file in the output directory
output_file = os.path.join(output_dir, 'transcription.txt')
with open(output_file, 'w') as f:
    f.write(result["text"])
