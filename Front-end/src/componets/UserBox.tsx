import React from 'react';

interface UserBoxProps {
}

const UserBox: React.FC<UserBoxProps> = ({  }) => {
  return (
    <div className='h-15 flex flex-row gap-2 rounded-full bg-[#2C3039] items-center px-3' >
      <div className="h-9 w-9 rounded-full bg-sky-700">
      </div>
      <div className="flex items-center">
        0x99ex3...1004
      </div>
    </div>
  );
};

export default UserBox;