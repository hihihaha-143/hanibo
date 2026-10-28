import bannerImage from "../../assets/banner.png";
import { useAuth } from "../../context/useAuth";
import BannerStats from "./BannerStats";

export default function Banner() {
  const { isAuthenticated, user } = useAuth();

  const activeBanner = user?.selected_banner ?? null;
  const imageSrc = activeBanner?.image ?? bannerImage;

  return (
    <div className="banner">
      <img className="banner__image" src={imageSrc} alt="hanibo" />
      {isAuthenticated && <BannerStats />}
    </div>
  );
}
