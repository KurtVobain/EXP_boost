import React, { useEffect, useState } from 'react';
import Box from '../componets/Box';
import ProgressBar from '../componets/ProgressBar';
import BattlePass from '../componets/BattlePass';
import axios from 'axios';
import { UserStore } from '../stores/UserStore';
import { BattlePassStore } from '../stores/BattlePassStore';
import { TypeAnimation } from 'react-type-animation';

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
        setLevels(response.data.data.levels);
      }).catch((error) => {
        console.log(error);
      });
    axios.get('http://localhost:3000/api/dailies', { params: { userId: 1 }
      }).then((response) => {
        console.log('---reasd: ', response.data.data);
      }).catch((error) => {
        console.log(error);
      });
  }, [setUserState]);

  return (
    <div className='text-white' >
      <div className="flex flex-row justify-between pt-8">
        <div className="w-80 flex flex-col gap-6">
          <Box children = {
            <div className="flex flex-col gap-6">
              <div className="text-xl">
                {profileLevel} Level
              </div>
              <ProgressBar maxValue={100} activeValue={50} />
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
          <div className="h-full flex justify-start w-[500px] items-center h-[290px]">
            <TypeAnimation
              sequence={[
                'Step by step to knowledge!',
                3000,
                'Learn today, Сonquer tomorrow.',
                3000,
                'Every mistake is a step forward.',
                3000,
                'You can learn anytime, anywhere!',
                3000,
                'Walk your path to success.',
                3000,
                'Small efforts lead to big victories.',
                3000,
                'Don\'t be afraid to learn something new.',
                3000,
                'Soon you\'ll surprise yourself.',
                3000,
                'Knowledge is a superpower.',
                3000,
                'Overcome yourself and become the best version.',
                3000
            ]}
              wrapper="span"
              speed={10}
              style={{ fontSize: '1.5em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </div>
          <div className="w-[330px]">
            <Box children = {
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className='text-xl'>Daily Progress</span>
                  <span className='text-[#AAAAAA]'>Check task if you are done!</span>
                </div>
              </div>
            }/>
          </div>
        </div>
      <div className=" mt-4">
        <BattlePass />
      </div>
    </div>
  );
};

export default DashboardPage;
