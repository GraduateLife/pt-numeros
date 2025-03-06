// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const speak = (str: string) => {
  // Try playing audio file first
  const audio = new Audio(`/audios/number_${str}.wav`);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  audio.play().catch((error) => {
    // Fallback to speech synthesis if audio file fails to play
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(str);
      utterance.lang = "pt-PT";
      speechSynthesis.speak(utterance);
    }
  });
  if (process.env.NODE_ENV === "development") {
    console.log("speakNumber", str);
  }
};
