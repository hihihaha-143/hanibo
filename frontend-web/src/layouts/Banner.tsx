import bannerImage from "../assets/banner.png";
import "../styles/layouts/Banner.scss";

export default function Banner() {
  return (
    <div className="banner">
      <img className="banner__image" src={bannerImage} alt="hanibo" />
    </div>
  );
}
