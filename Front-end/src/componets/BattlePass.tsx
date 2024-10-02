import React from "react";
import Slider from "react-slick";

interface BattlePassProps {
}

const BattlePass: React.FC<BattlePassProps> = ({  }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <Slider {...settings}>
      <div className="h-[210px] rounded h-[300px] borderGradient">

      </div>
    </Slider>
  );
};

export default BattlePass;