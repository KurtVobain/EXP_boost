import axios from "axios";
import React from "react";
import Slider from "react-slick";
import { BattlePassStore } from "../stores/BattlePassStore";
import ProgressBar from "./ProgressBar";

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
      {levels.map((level, index) => (
        <div className="w-[226px] pr-4 ">
          <div key={level.id} className="flex flex-col  rounded overflow-hidden borderGradient">
            <div className={`${level.isPremium ? "bg-[#FF7423]" : "bg-[#21C639]"} rounded-t text-xs py-2 text-center`}>
              {level.isPremium ? 'Premium Rewards' : 'Free'}
            </div>
            <div className="flex flex-col items-center justufy-center px-4 pb-2">
              <span className="my-3">{level.level} Level</span>
              <div className="w-[90px] rounded-full flex items-center justify-center overflow-hidden shadow-inner shadow-md">
              <img src={`../rewards/art 0${index + 1}.png`} alt="" />
              </div>
              {level.awards[0]?.amount > 0 && <div className="flex gap-2 items-center my-3">
                +{level.awards[0]?.amount}
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2175_859)">
                  <path d="M22.2576 0.505493H0.0883789V14.5962C3.24387 12.4165 7.03423 9.7137 7.70693 8.52859C8.52941 7.07991 8.70261 5.69984 8.23635 4.3122C8.11007 3.93616 8.11093 3.93668 8.51315 4.47216C9.04081 5.1749 9.9371 5.96138 10.6026 6.30568C11.8222 6.93665 13.2464 6.97019 14.8491 6.40541C15.3532 6.22777 15.6427 6.1582 15.4922 6.25092C15.0046 6.5514 14.173 7.37641 13.7651 7.96456C13.2299 8.73601 12.8794 10.0514 12.959 10.9904C13.016 11.6634 13.3245 12.7763 13.6319 13.4178C13.7617 13.6887 13.72 13.6648 13.2907 13.2229C12.6504 12.5637 11.9281 12.1733 10.8855 11.9231C8.86526 11.4383 3.86727 13.5571 0.0883789 15.3942V22.6747H22.2576V0.505493Z" fill="#492BFF"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5653 7.39779C11.1503 7.7738 12.1278 7.84614 12.921 7.57213L13.2954 7.44281L12.9013 7.82972C12.0707 8.64523 11.8325 9.53618 12.1406 10.6744C12.2203 10.9691 12.2345 11.1275 12.1722 11.0265C11.9447 10.6582 11.1692 10.1151 10.6648 9.97087C10.1329 9.81887 9.19299 9.90358 8.75931 10.1426C8.62333 10.2176 8.75273 10.0332 9.07422 9.69417C9.90145 8.82134 10.0971 7.8863 9.68032 6.79637L9.5231 6.38503L9.91419 6.80788C10.1293 7.04041 10.4223 7.30587 10.5653 7.39779Z" fill="#FF7423"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_2175_859">
                  <rect x="0.0883789" y="0.505493" width="18.6952" height="18.6952" rx="9.34759" fill="white"/>
                  </clipPath>
                  </defs>
                </svg>

              </div>}
              <div className="">
                
              </div>
              <ProgressBar maxValue={level.experience} activeValue={level.experience} />
                
            </div>

          </div>
        </div>
        
      ))}
    </Slider>
  );
};

export default BattlePass;