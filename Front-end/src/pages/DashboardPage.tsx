import React from 'react';
import Box from '../componets/Box';
import ProgressBar from '../componets/ProgressBar';

interface DashboardPageProps {
}

const DashboardPage: React.FC<DashboardPageProps> = ({  }) => {
  return (
    <div className='text-white' >
      <div className="">
        <div className="w-80 flex flex-col gap-6 mt-8">
          <Box children = {
            <div className="flex flex-col gap-6">
              <div className="text-xl">
                1 Level
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
    </div>
  );
};

export default DashboardPage;
