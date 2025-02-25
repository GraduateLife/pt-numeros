export const speak = (str: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(str);
    utterance.lang = "pt-PT";
    speechSynthesis.speak(utterance);
    console.log("speakNumber", str);
  }
};
