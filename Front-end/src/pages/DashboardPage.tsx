import React, { useCallback, useEffect, useState } from 'react';
import Box from '../componets/Box';
import ProgressBar from '../componets/ProgressBar';
import BattlePass from '../componets/BattlePass';
import axios from 'axios';
import { UserStore } from '../stores/UserStore';
import { BattlePassStore } from '../stores/BattlePassStore';
import { TypeAnimation } from 'react-type-animation';
import { DaylisDto } from '../types';
import { useLocation } from 'react-router-dom';
import { userIdStore } from '../stores/userIdStore';

interface DashboardPageProps {
}

const DashboardPage: React.FC<DashboardPageProps> = ({  }) => {
  const location = useLocation();
  const { user_id } = location.state || {}
  const hostname = import.meta.env.VITE_API_URL
  const setUserState = UserStore((state) => state.setUserState);
  const [daylis, setDaylis] = useState<DaylisDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const profileLevel = UserStore((state) => state.profileLevel);
  const setLevels = BattlePassStore((state) => state.setLevels);
  const curBPExp = UserStore((state) => state.curBPExp);

  const userId = userIdStore((state) => state.userId);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    axios.get(`${hostname}/profile/${userId}`)
      .then((response) => {
        setUserState(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get(`${hostname}/dailies`, { params: { userId: userId }
      }).then((response) => {
        setDaylis(response.data.data);
      }).catch((error) => {
        console.log(error);
      });
    }, [isLoading, userId]);

    

  useEffect(() => {
    axios.get(`${hostname}/profile/${userId}`)
      .then((response) => {
        setUserState(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get(`${hostname}/battlepass/${userId}`, {
      }).then((response) => {
        setLevels(response.data.data.levels);
      }).catch((error) => {
        console.log(error);
      });
    axios.get(`${hostname}/dailies`, { params: { userId: userId }
      }).then((response) => {
        setDaylis(response.data.data);
      }).catch((error) => {
        console.log(error);
      });
  }, [setUserState, userId]);

  const checkDaily = useCallback((dailyId: number) => {
    setIsLoading(true);
    axios.post(`${hostname}/daily/check?userId=${userId}&dailyId=${dailyId}`, {
    }).then((response) => {

      alert(`Your transaction URL:  ${response.data.transactionURL}`);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className='text-white' >
      <div className="flex flex-row justify-between pt-8">
        <div className="w-80 flex flex-col gap-6">
          <Box children = {
            <div className="flex flex-col gap-6">
              <div className="text-xl">
                {profileLevel} Level
              </div>
              <ProgressBar maxValue={100} activeValue={curBPExp} />
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
                <div className="flex flex-col gap-4">
                  {daylis.map((daily, index) => (
                    <div className="flex flex-row gap-4 items-center">
                      <div className="w-[190px]">
                        <span>{daily.title}</span>
                        <ProgressBar maxValue={1} activeValue={daily.isClosed ? 1 : 0} />
                      </div>
                      <div onClick={() => daily.isClosed ? {} : checkDaily(daily.dailyId)} className={`flex flex-row gap-2 cursor-pointer rounded-full px-2 ${daily.isClosed ? "bg-[#21C639]" :"bg-[#2C3039]"} items-center justify-center h-8 text-xs`}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={`#FFFFFF`} xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.05263 11.2155C8.93306 11.2155 11.2681 8.88041 11.2681 5.99999C11.2681 3.11956 8.93306 0.784515 6.05263 0.784515C3.1722 0.784515 0.837158 3.11956 0.837158 5.99999C0.837158 8.88041 3.1722 11.2155 6.05263 11.2155Z" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M4.48779 5.99999L5.53089 7.04308L7.61708 4.95689" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        { daily.isClosed ? "Done" : isLoading ? "Processing" : "Check"  }

                      </div>
                    </div>
                  ))}
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
