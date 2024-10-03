import React from 'react';

interface CoinBoxProps {
  balance: number;
}

const CoinBox: React.FC<CoinBoxProps> = ({ balance }) => {
  return (
    <div className='h-15 p-4 flex flex-row gap-4 bg-[#16181C] rounded-lg' >
      <div className="">
        <svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_2082_6150)">
        <rect x="0.0283203" width="38" height="38" rx="19" fill="#16181C"/>
        <path d="M45.0896 0H0.0283203V28.6409C6.4422 24.2104 14.1465 18.7167 15.5139 16.3078C17.1856 13.3632 17.5377 10.5581 16.59 7.73756C16.3333 6.97321 16.335 6.97426 17.1526 8.06268C18.2251 9.49109 20.0469 11.0897 21.3996 11.7895C23.8787 13.072 26.7735 13.1402 30.0311 11.9922C31.0558 11.6312 31.6441 11.4897 31.3383 11.6782C30.3471 12.289 28.6568 13.9659 27.8277 15.1614C26.7399 16.7294 26.0276 19.403 26.1894 21.3117C26.3051 22.6797 26.9322 24.9417 27.5569 26.2456C27.8208 26.7963 27.736 26.7478 26.8634 25.8495C25.562 24.5095 24.0939 23.7161 21.9747 23.2075C17.8683 22.2221 7.70933 26.5288 0.0283203 30.263V45.0613H45.0896V0Z" fill="#492BFF"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.324 14.0094C22.513 14.7737 24.4999 14.9207 26.1121 14.3638L26.8732 14.1009L26.0721 14.8874C24.3839 16.545 23.8996 18.356 24.5259 20.6695C24.688 21.2685 24.7169 21.5904 24.5902 21.3852C24.1278 20.6365 22.5515 19.5327 21.5262 19.2395C20.4451 18.9305 18.5346 19.1027 17.6531 19.5885C17.3767 19.741 17.6397 19.3662 18.2932 18.6771C19.9746 16.903 20.3722 15.0024 19.5251 12.787L19.2056 11.9509L20.0005 12.8104C20.4377 13.283 21.0333 13.8226 21.324 14.0094Z" fill="#FF7423"/>
        </g>
        <defs>
        <clipPath id="clip0_2082_6150">
        <rect x="0.0283203" width="38" height="38" rx="19" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      </div>
      <div className="flex items-center">
        {balance}
      </div>
    </div>
  );
};

export default CoinBox;