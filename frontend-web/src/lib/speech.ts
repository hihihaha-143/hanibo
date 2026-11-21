export function speakKorean(text: string, rate = 1): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = rate;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
