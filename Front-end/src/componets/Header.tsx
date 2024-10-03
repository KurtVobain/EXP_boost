import React from 'react';
import Logo from './Logo';
import CoinBox from './CoinBox';
import UserBox from './UserBox';
import { UserStore } from '../stores/UserStore';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = ({  }) => {
  const balance = UserStore(state => state.balance);
  const userName = UserStore(state => state.userName);
  console.log('---userName: ', userName);
  return (
    <div className='h-28 w-full flex flex-row justify-between px-8 items-center'>
      <div className="flex gap-10">
        <Logo />
        <div className="flex items-center text-lg">
          <div className="px-4">
            Dashboard
          </div>
          <div className="px-4">
            Courses
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <CoinBox balance = {balance} />
        <UserBox userName={userName}/>
      </div>
    </div>
  );
};

export default Header;