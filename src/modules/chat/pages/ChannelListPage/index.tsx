import React from 'react';
import { useGlobalStyles } from '../../../../common/material/globalStyles';
import BottomNav from '../../../../common/components/BottomNav';
import clsx from 'clsx';
import ChannelItem, { LoadingChannelItem } from './ChannelItem';
import { useRecoilValue } from 'recoil/dist';
import { PubnubChat } from '../../../../recoil/atoms/pubnub.atom';
import { loadingState } from '../../../../recoil/atoms/loading.atom';
import { getUnreadChannelCountState, sortPubnubChatListState } from '../../../../recoil/selectors/pubnub.selector';

const ChannelListPage = (props: any) => {
  const gClasses = useGlobalStyles();
  const sortPubnubChats = useRecoilValue(sortPubnubChatListState);
  const unreadChannelCount = useRecoilValue(getUnreadChannelCountState);
  const { loadingChatList, loadingAccount } = useRecoilValue(loadingState);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-center items-center py-3 bg-black fixed top-0 w-full z-50">
        <div className="text-white text-base font-bold flex items-center">
          Messsages 
          {/* <div 
            style={{ width: '20px', height: '20px' }} 
            className="bg-white font-black text-xs text-black rounded-full ml-2 flex justify-center items-center"
          >
            {unreadChannelCount}
          </div> */}
        </div>
      </div>
      <div className={clsx(gClasses.mainContainer, gClasses.footContainer, 'mt-10')}>
        <div className="divide-y divide-light-blue-400 flex-1">
          {loadingAccount || loadingChatList
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <LoadingChannelItem key={i} />)
            : sortPubnubChats.map((chat: PubnubChat) => <ChannelItem chat={chat} key={chat.channel} />)}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ChannelListPage;
