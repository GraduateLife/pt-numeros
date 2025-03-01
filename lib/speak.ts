export const speak = (str: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(str);
    utterance.lang = "pt-PT";
    speechSynthesis.speak(utterance);
    if (process.env.NODE_ENV === "development") {
      console.log("speakNumber", str);
    }
  }
};
