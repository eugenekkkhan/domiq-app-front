import { themeParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";
import Slider, { type Settings } from "react-slick";
import "./News.css";
import axios from "axios";
import { convertTimeStampToDate } from "../../utils/convertTime";
import { NavLink } from "react-router";

const Card = ({
  text,
  id,
  date = "",
}: {
  text: string;
  id: number;
  date?: string;
}) => {
  return (
    <NavLink to={"news/" + id}>
      <div
        style={{
          borderRadius: "26px",
          padding: "24px",
          height: "calc(136px - 48px)",
          width: "calc(100% - 48px - 48px)",
          margin: "0 24px",
          background: themeParams.sectionBackgroundColor(),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            color: themeParams.sectionHeaderTextColor(),
          }}
        >
          {date && convertTimeStampToDate(date)}
        </p>
        <p style={{ color: themeParams.textColor() }}>{text}</p>
      </div>
    </NavLink>
  );
};

type NewsItem = {
  short: string;
  CreatedAt?: string;
  ID: number;
};

const NewsComponent = () => {
  const defaultData: NewsItem = {
    short: "",
    ID: 0,
  };
  const [newsData, setNewsData] = useState<NewsItem[]>([defaultData]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    axios
      .get(
        import.meta.env.VITE_APPLICATION_API_LINK + "public/news/get_all",
        {}
      )
      .then((res) => {
        setNewsData(res.data.reverse() as NewsItem[]);
      });
  }, []);

  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    centerMode: true,
    autoplaySpeed: 2000,
    customPaging: (i: number) => {
      return (
        <div
          style={{
            marginTop: "8px",
            width: "8px",
            height: "8px",
            borderRadius: "100%",
            backgroundColor:
              i !== currentSlideIndex
                ? themeParams.sectionSeparatorColor()
                : themeParams.textColor(),
          }}
        ></div>
      );
    },
    afterChange: (newIndex) => setCurrentSlideIndex(newIndex),
  };

  return (
    <div style={{ position: "relative", height: "160px", width: "100%" }}>
      <div
        style={{
          width: "calc(300vw - 8px)",
          left: "50%",
          right: "0",
          marginLeft: "calc(-150vw + 4px)",
          position: "absolute",
        }}
      >
        <Slider {...settings}>
          {newsData.map((item) => (
            <div>
              <Card
                date={item.CreatedAt}
                text={
                  item.short.length === 50 ? item.short + "..." : item.short
                }
                id={item.ID}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewsComponent;
