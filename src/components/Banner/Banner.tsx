import { useEffect, useState } from "react";
import Image from "../../assets/image 8.png";

const Banner = () => {
  const [coefficient, setCoefficient] = useState(1);
  useEffect(() => {
    const eventHandler = () => {
      if (window.innerWidth <= 400) {
        setCoefficient(window.innerWidth / 400);
      }
    };
    eventHandler();
    window.addEventListener("resize", eventHandler);
    return () => window.removeEventListener("resize", eventHandler);
  }, []);
  return (
    <div
      style={{
        height: `${164 - 32}px`,
        background: "radial-gradient(circle at 90% 135%,#A2845E,#312A28 55%)",
        borderRadius: "26px",
        padding: "16px 20px",
        color: "white",
        display: "flex",
        position: "relative",
      }}
    >
      <p
        style={{
          width: "160px",
          fontSize: `${coefficient}em`,
        }}
      >
        Видеоинструкция по подключению и работе с камерой
      </p>
      <img
        src={Image}
        alt="image"
        style={{
          right: "0px",
          bottom: "0",
          position: "absolute",
          scale: coefficient,
          transformOrigin: "bottom right",
        }}
      />
    </div>
  );
};

export default Banner;
