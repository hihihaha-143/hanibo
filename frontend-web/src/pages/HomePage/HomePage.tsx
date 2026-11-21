import AboutBlock from "./AboutBlock";
import TipBlock from "./TipBlock";
import AuthPromptBlock from "./AuthPromptBlock";
import StreakBlock from "./StreakBlock";
import AchievementsStrip from "../../components/AchievementsStrip/AchievementsStrip";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-page__col home-page__col--about">
        <AboutBlock />
      </div>

      <div className="home-page__col home-page__col--side">
        <AchievementsStrip categoryCode="global" />
        <TipBlock />
        <StreakBlock />
        <AuthPromptBlock />
      </div>
    </div>
  );
}
