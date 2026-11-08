import { useCallback } from "react";

export function useSpeech() {
  const speak = useCallback((text: string, rate = 1) => {
    if (!("speechSynthesis" in window) || !text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = rate;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
