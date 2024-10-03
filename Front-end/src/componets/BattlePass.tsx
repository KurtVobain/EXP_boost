import axios from "axios";
import React from "react";
import Slider from "react-slick";
import { BattlePassStore } from "../stores/BattlePassStore";

interface BattlePassProps {
}

const BattlePass: React.FC<BattlePassProps> = ({  }) => {

  const levels = BattlePassStore((state) => state.levels);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };

  if (!levels) {
    return null;
  }
  return (
    <Slider {...settings}>
      {levels.map((level) => (
        <div key={level.id} className="flex flex-col w-[210px] pr-2 rounded overflow-hidden">
          <div className={`${level.isPremium ? "bg-[#FF7423]" : "bg-[#21C639]"}  `}>
            {level.isPremium ? 'Premium Rewards' : 'Free'}
          </div>
          <div className="">
            <span>{level.level} Level</span>
            <div className="">

            </div>
          </div>
          {level.experience}
        </div>
      ))}
    </Slider>
  );
};

export default BattlePass;