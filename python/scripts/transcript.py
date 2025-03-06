import whisper
import os

model = whisper.load_model("base")
input_filename = 'output/audios/number_78.wav'
output_dirname='output/transcripts'
# Get the audio file path relative to project root
audio_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__) )), input_filename)
result = model.transcribe(audio_file)

# Create output directory if it doesn't exist
output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), output_dirname)
os.makedirs(output_dir, exist_ok=True)

# Write the transcribed text to a file in the output directory
output_file = os.path.join(output_dir, f'transcription_{os.path.splitext(os.path.basename(input_filename))[0]}.txt')
with open(output_file, 'w') as f:
    f.write(result["text"])
