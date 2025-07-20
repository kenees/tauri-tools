import { useState } from "react";
import "./index.css";

const data = [
  { id: 1, title: "测试1", imageUrl: "./card/1.jpeg" },
  { id: 2, title: "测试2", imageUrl: "./card/2.jpeg" },
  { id: 3, title: "测试3", imageUrl: "./card/3.jpeg" },
  { id: 4, title: "测试4", imageUrl: "./card/4.jpeg" },
  { id: 5, title: "测试5", imageUrl: "./card/5.jpeg" },
  { id: 6, title: "测试6", imageUrl: "./card/6.jpeg" },
];

export default () => {
  const [activeSlide, setActiveSlide] = useState<number | null>(null);
  const [lastIndex, setLastIndex] = useState<number | null>(null);

  const handleSlideClick = (index: number) => {
    if (activeSlide === null) {
      setActiveSlide(index);
    }
  };

  const handleCloseClick = (e: any) => {
    e.stopPropagation();
    setActiveSlide((v) => {
      setLastIndex(v);
      return null;
    });
  };

  return (
    <div className="containers">
      {data.map((slide, index) => (
        <div
          key={index}
          className={`slide 
            ${activeSlide === index ? "active" : ""} 
            ${
              activeSlide !== null && activeSlide !== index
                ? "anim-out"
                : "anim-in"
            } 
            ${
              activeSlide === null && index === lastIndex ? "last-viewed" : ""
            }`}
          onClick={() => handleSlideClick(index)}
        >
          <div
            className="image"
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          ></div>
          <div className="overlay"></div>
          <div className="content">
            <h1 className="title" data-title={slide.title}>
              {slide.title}
            </h1>
            <div
              className="emblem"
              //   style={{ backgroundImage: `url(${slide.emblemUrl})` }}
            ></div>
            <ul className="city-info">
              <li className="country">Country: 111</li>
              <li className="founded">Founded: 222</li>
              <li className="population">Population: 3333</li>
            </ul>
          </div>
          <div className="btn-close" onClick={handleCloseClick}></div>
        </div>
      ))}
    </div>
  );
};
