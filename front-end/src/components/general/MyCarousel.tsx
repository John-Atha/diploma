import React, { ReactElement } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1100 },
    items: 4,
    paritialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1100, min: 464 },
    items: 3,
    paritialVisibilityGutter: 10,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    paritialVisibilityGutter: 10,
  },
};

interface CarouselProps {
  items: any[];
}
function MyCarousel({ items }: CarouselProps) {
  return (
    <div>
      <Carousel
        responsive={responsive}
        // autoPlaySpeed={3000}
        autoPlay={false}
        shouldResetAutoplay
        renderButtonGroupOutside
        swipeable
        draggable
        // renderArrowsWhenDisabled
        // partialVisbile
      >
        {items.map((item: any, index: number) => {
          return (
            <div
              key={index}
              draggable={false}
              style={{ padding: "4px", paddingLeft: 0 }}
            >
              {item}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}

export default MyCarousel;
