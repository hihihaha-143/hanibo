import bannerImage from "../../assets/banner.png";
import { useAuth } from "../../context/useAuth";
import { resolveShopImage } from "../../lib/shopImages";
import BannerStats from "./BannerStats";

export default function Banner() {
  const { isAuthenticated, user } = useAuth();

  const activeBanner = user?.selected_banner ?? null;
  const activeBannerUrl = resolveShopImage(activeBanner?.image);
  const imageSrc = activeBannerUrl ?? bannerImage;

  return (
    <div className="banner">
      <img className="banner__image" src={imageSrc} alt="hanibo" />
      {isAuthenticated && <BannerStats />}
    </div>
  );
}
