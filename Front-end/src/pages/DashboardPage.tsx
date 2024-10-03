import React, { useEffect, useState } from 'react';
import Box from '../componets/Box';
import ProgressBar from '../componets/ProgressBar';
import BattlePass from '../componets/BattlePass';
import axios from 'axios';
import { UserStore } from '../stores/UserStore';
import { BattlePassStore } from '../stores/BattlePassStore';

interface DashboardPageProps {
}

const DashboardPage: React.FC<DashboardPageProps> = ({  }) => {
  const setUserState = UserStore((state) => state.setUserState);

  const profileLevel = UserStore((state) => state.profileLevel);
  const setLevels = BattlePassStore((state) => state.setLevels);

  useEffect(() => {
    axios.get('http://localhost:3000/api/profile/1')
      .then((response) => {
        setUserState(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get('http://localhost:3000/api/battlepass/1', {
      }).then((response) => {
        console.log('---re: ', response.data.data);
        setLevels(response.data.data.levels);
      }).catch((error) => {
        console.log(error);
      });
  }, [setUserState]);

  return (
    <div className='text-white' >
      <div className="">
        <div className="w-80 flex flex-col gap-6 mt-8">
          <Box children = {
            <div className="flex flex-col gap-6">
              <div className="text-xl">
                {profileLevel} Level
              </div>
              <ProgressBar maxValue={100} activeValue={50} />
            </div>
          }/>
          <Box children = {
            <div className="flex flex-col gap-6 text-xl justify-center">
              <div className='text-center'>Badges</div>
            </div>
          }/>
          <Box children = {
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between text-center">
                <div className="flex gap-2 items-center text-xl">
                  <div className="h-3 w-3 rounded-full bg-purple"/>
                  Basic
                </div>
                <div className="text-sm text-[#AAAAAA]">
                  Subscription
                </div>
              </div>
              <div className="rounded bg-purple text-center py-2.5">
                Get Premium
              </div>
            </div>
          }/>

        </div>
      </div>
      <div className="h-[300px]">
        <BattlePass />
      </div>
    </div>
  );
};

export default DashboardPage;
