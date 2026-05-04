import { NavLink } from "react-router";
import FallbackImage from "../../assets/image 8.png";
import { useSettings } from "../../utils/settings";

const Banner = () => {
  const settings = useSettings();
  const text = settings?.banner_text || "Видеоинструкция по подключению и работе с камерой";
  const imageUrl = settings?.banner_image_url ?? FallbackImage;

  return (
    <NavLink to="/videos">
      <div
        className="relative rounded-outer overflow-hidden flex items-center"
        style={{
          height: "132px",
          background: "radial-gradient(circle at 90% 135%, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, #000) 55%)",
          padding: "16px 20px",
        }}
      >
        <p className="text-white font-medium leading-snug w-40 text-[15px] z-10">
          {text}
        </p>
        <img
          src={imageUrl}
          alt=""
          className="absolute right-0 bottom-0 h-full object-contain object-bottom pointer-events-none select-none"
        />
      </div>
    </NavLink>
  );
};

export default Banner;
