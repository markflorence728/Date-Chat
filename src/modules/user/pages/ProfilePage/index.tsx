import { Tab, Tabs } from '@material-ui/core';
import clsx from 'clsx';
import React, { ChangeEvent, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useRecoilValue } from 'recoil';
import BottomNav from '../../../../common/components/BottomNav';
import { TabPanel } from '../../../../common/components/TabPannel';
import { loadingState } from '../../../../recoil/atoms/loading.atom';
import { PasswordTapContent } from './PasswordTapContent';
import { ProfileHeader } from './ProfileHeader';
import { ProfileTapContent } from './ProfileTapContent';

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const ProfilePage = () => {
  const [value, setValue] = useState(0);
  const { loadingAccount } = useRecoilValue(loadingState);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="h-screen flex flex-col">
      <ProfileHeader />

      {loadingAccount ? (
        <div className={clsx('h-screen flex justify-center items-center')}>
          <ClipLoader size={32} color="#ff4b4b" />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="shadow">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="simple tabs example"
            >
              <Tab label="Profile" {...a11yProps(0)} />
              <Tab label="Password" {...a11yProps(1)} />
            </Tabs>
          </div>
          <div className="h-full overflow-y-auto">
            <TabPanel value={value} index={0}>
              <ProfileTapContent />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PasswordTapContent />
            </TabPanel>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
