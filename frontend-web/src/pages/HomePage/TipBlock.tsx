import { useEffect, useState } from "react";
import { BookOpen, Globe } from "lucide-react";
import { getRandomTip, type Tip } from "../../api/tips";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 минут

export default function TipBlock() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTip = async () => {
    try {
      const data = await getRandomTip();
      setTip(data);
    } catch (e) {
      console.error("Не удалось загрузить совет:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTip();

    const interval = setInterval(loadTip, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="tip-block tip-block--loading">
        <p className="tip-block__content">Загрузка...</p>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  const Icon = tip.type === "advice" ? BookOpen : Globe;

  return (
    <div className="tip-block">
      <span className="tip-block__icon">
        <Icon size={22} />
      </span>
      <p className="tip-block__content">{tip.content}</p>
    </div>
  );
}
