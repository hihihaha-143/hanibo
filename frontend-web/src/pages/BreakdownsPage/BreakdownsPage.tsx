import { useSearchParams } from "react-router-dom";
import ChipsBlock from "../../components/ChipsBlock/ChipsBlock";
import AchievementsStrip from "../../components/AchievementsStrip/AchievementsStrip";
import BreakdownsHomeTab from "./BreakdownsHomeTab";
import BreakdownsCatalogTab from "./BreakdownsCatalogTab";
import BreakdownsAccountTab from "./BreakdownsAccountTab";
import {
  BREAKDOWN_TABS,
  DEFAULT_BREAKDOWN_TAB,
  isBreakdownsTabId,
  type BreakdownsTabId,
} from "./breakdownTabs";

const SUBTITLES: Record<BreakdownsTabId, string> = {
  home: "Новые манхвы и дорамы с разбором корейского",
  catalog: "Каталог разборов по типу, уровню и жанру",
  account: "Твой прогресс и сохранённые фразы",
};

export default function BreakdownsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: BreakdownsTabId = isBreakdownsTabId(rawTab)
    ? rawTab
    : DEFAULT_BREAKDOWN_TAB;

  const handleTabChange = (tab: BreakdownsTabId) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { replace: false });
  };

  return (
    <div className="page breakdowns-page">
      <header className="page__header breakdowns-page__header">
        <h1 className="page__title">Разборы</h1>
        <p className="breakdowns-page__subtitle">{SUBTITLES[activeTab]}</p>
      </header>

      <ChipsBlock
        tabs={BREAKDOWN_TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        layoutId="breakdowns-chip-highlight"
      />

      <AchievementsStrip categoryCode="breakdowns" />

      <div className="breakdowns-page__content">
        {activeTab === "home" && <BreakdownsHomeTab />}
        {activeTab === "catalog" && <BreakdownsCatalogTab />}
        {activeTab === "account" && <BreakdownsAccountTab />}
      </div>
    </div>
  );
}
