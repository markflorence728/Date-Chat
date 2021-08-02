import React, { useEffect, useState } from 'react';
import { useGlobalStyles } from '../../../../common/material/globalStyles';
import { useRecoilState } from 'recoil';
import { AlertSeverity, notificationState } from '../../../../recoil/atoms/notification.atom';
import { List } from '@material-ui/core';
import GirlListItemCard, { LoadingUserListItemCard } from './GirlListItemCard';
import { meState, girlListState, girlTotalCountState } from '../../../../recoil/atoms/users.atom';
import { useSetRecoilState } from 'recoil/dist';
import BottomNav from '../../../../common/components/BottomNav';
import clsx from 'clsx';
import { parseError } from '../../../../@http-api/helpers';
import UserService from '../../../user/services/user.service';
import { IGirlModel } from '../../../../models/girl.model';
import InfiniteScroll from 'react-infinite-scroll-component';

const DashboardPage = (props: any) => {
  const gClasses = useGlobalStyles();
  const [girlList, setGirlList] = useRecoilState(girlListState);
  const [girlTotalCount, setGirlTotalCount] = useRecoilState(girlTotalCountState);
  const setNotification = useSetRecoilState(notificationState);
  const setMe = useSetRecoilState(meState);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(Math.floor(girlList.length / 5) + 1);
  }, [girlList]);

  useEffect(() => {
    (async function _() {
      if (!girlList.length) {
        setLoading(true);
        await getGirls({}, 1);
        setLoading(false);
      }
    })();
  }, []);

  const getGirls = async (filter: any, page: number) => {
    try {
      const resp = await UserService.getGirls(filter, page);
      setGirlList(oldList => [...oldList, ...resp.data.users]);
      setGirlTotalCount(resp.data.totalCount);
    } catch (e) {
      const { errorMessage, errorStatus } = parseError(e);

      setNotification({
        open: true,
        severity: AlertSeverity.ERROR,
        message: errorMessage
      });

      if (errorStatus === 401) {
        setMe(null);
        props.history.push('/login');
      }
    }
  };

  const fetchMoreData = async () => {
    return await getGirls({}, page);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-center items-center py-3 bg-black fixed top-0 w-full z-50">
        <img src="assets/images/privatedate-lock.png" alt="" style={{ height: '18px' }} />
        <span className="text-white text-base font-bold ml-2">Los Angeles, CA</span>
      </div>
      <div className={clsx(gClasses.mainContainer, gClasses.footContainer, 'flex-1 mt-10')}>
        {loading ? (
          <List>
            {[1, 2, 3].map(i => (
              <LoadingUserListItemCard key={i} />
            ))}
          </List>
        ) : (
          <InfiniteScroll
            dataLength={girlTotalCount}
            next={fetchMoreData}
            hasMore={girlTotalCount > girlList.length}
            loader={<h4>Loading...</h4>}
            endMessage={<p className="text-center"></p>}
          >
            {girlList.map((girl: IGirlModel) => (
              <GirlListItemCard girl={girl} key={girl.uuid} {...props} />
            ))}
          </InfiniteScroll>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
