import { useEffect, useState } from "react";
import Image from "../../assets/image 8.png";
import { themeParams } from "@telegram-apps/sdk";

const makeDarker = (color: string, darkOffset: number) => {
  let newColor: string = "#";
  for (let i = 1; i <= 5; i = i + 2) {
    console.log(color.slice(i, i + 2));
    const additionalPart = (
      parseInt(color.slice(i, i + 2), 16) - darkOffset > 0
        ? parseInt(color.slice(i, i + 2), 16) - darkOffset
        : 0
    ).toString(16);

    newColor += (additionalPart.length === 1 ? "0" : "") + additionalPart;
  }
  console.log(color);
  return newColor;
};

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
        background: `radial-gradient(circle at 90% 135%, ${themeParams.buttonColor()}, ${makeDarker(
          themeParams.buttonColor() as string,
          100
        )} 55%)`,
        borderRadius: "26px",
        padding: "16px 20px",
        color: themeParams.buttonTextColor(),
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
