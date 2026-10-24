import confetti from "canvas-confetti";

const COLORS = ["#FFD54A", "#FFB020", "#3B82F6", "#FF6B6B", "#4ECDC4"];

export function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: COLORS,
      startVelocity: 55,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: COLORS,
      startVelocity: 55,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  // первый мощный залп по центру
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors: COLORS,
    scalar: 1.1,
  });

  frame();
}
