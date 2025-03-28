// Simple script to test Ollama connection
const testOllama = async () => {
  const url = "http://localhost:11434/api/version";
  console.log(`Testing Ollama connection to: ${url}`);

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log("Ollama is reachable! Version:", data.version);
    } else {
      console.error(`Error: Ollama responded with status ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to connect to Ollama:", error);
  }
};

testOllama();
