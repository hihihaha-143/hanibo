import { useCallback } from "react";
import { speakKorean } from "./speech";

export function useSpeech() {
  const speak = useCallback((text: string, rate = 1) => {
    speakKorean(text, rate);
  }, []);

  return { speak };
}
