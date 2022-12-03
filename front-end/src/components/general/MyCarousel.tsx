import React, { ReactElement } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  largeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 3000, min: 2000 },
    items: 5,
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

const responsiveSmall = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  largeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 3000, min: 2000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 2000, min: 1100 },
    items: 2,
    paritialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1100, min: 464 },
    items: 2,
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
  isSmallList?: boolean;
}
function MyCarousel({ items, isSmallList = false }: CarouselProps) {
  return (
    <div>
      <Carousel
        responsive={isSmallList ? responsiveSmall : responsive}
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
              style={{ padding: "8px", paddingLeft: 0 }}
              className="zoomable"
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
