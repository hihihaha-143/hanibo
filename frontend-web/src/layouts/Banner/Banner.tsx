import bannerImage from "../../assets/banner.png";
import { useAuth } from "../../context/useAuth";
import BannerStats from "./BannerStats";

export default function Banner() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="banner">
      <img className="banner__image" src={bannerImage} alt="hanibo" />
      {isAuthenticated && <BannerStats />}
    </div>
  );
}
