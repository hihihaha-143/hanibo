const KOREAN_LANG = "ko-KR";

let lastRequestId = 0;

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

function pickKoreanVoice(): SpeechSynthesisVoice | undefined {
  const voices = getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ko")) ??
    voices.find((voice) => /korean|한국/i.test(voice.name))
  );
}

/**
 * Озвучивает корейский текст.
 *
 * - выбирает установленный корейский голос, а не первый попавшийся;
 * - отменяет предыдущую фразу, чтобы клики не наслаивались;
 * - setTimeout нужен из-за бага Chrome: cancel() и speak() в одном
 *   тике иногда отменяют только что созданную фразу.
 */
export function speakKorean(text: string, rate = 1): boolean {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  const normalized = text.trim();
  if (!normalized) return false;

  const synth = window.speechSynthesis;
  const requestId = ++lastRequestId;

  const utterance = new SpeechSynthesisUtterance(normalized);
  const voice = pickKoreanVoice();
  utterance.lang = voice?.lang ?? KOREAN_LANG;
  utterance.voice = voice ?? null;
  utterance.rate = Math.min(Math.max(rate, 0.5), 2);
  utterance.pitch = 1;

  synth.cancel();
  window.setTimeout(() => {
    if (requestId !== lastRequestId) return;
    synth.speak(utterance);
  }, 0);

  return true;
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
