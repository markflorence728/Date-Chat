import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil/dist';
import { meState, selectedGirlState } from '../../../../recoil/atoms/users.atom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Chip, createStyles, Theme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import ChatIcon from '@material-ui/icons/Chat';
import BottomNav from '../../../../common/components/BottomNav';
import clsx from 'clsx';
import { useHistory, useParams } from 'react-router';
import { Slide } from 'react-slideshow-image';
import './style.scss';
import { parseError } from '../../../../@http-api/helpers';
import { AlertSeverity, notificationState } from '../../../../recoil/atoms/notification.atom';
import UserService from '../../../user/services/user.service';
import { loadingState } from '../../../../recoil/atoms/loading.atom';
import { ClipLoader } from 'react-spinners';

const slideImageProperties = {
  duration: 5000,
  transitionDuration: 100,
  infinite: true,
  indicators: () => <div className="indicator" />,
  prevArrow: (
    <div style={{ width: '35px', marginRight: '-35px', paddingLeft: '8px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff">
        <path
          d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12    C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084    c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864    l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"
          fill="#ffffff"
        />
      </svg>
    </div>
  ),
  nextArrow: (
    <div style={{ width: '35px', marginLeft: '-35px', paddingRight: '8px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff">
        <path
          d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744   L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284   c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z"
          fill="#ffffff"
        />
      </svg>
    </div>
  )
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0),
      paddingBottom: theme.spacing(8)
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    },
    expand: {
      marginLeft: 'auto'
    },
    avatar: {
      backgroundColor: red[500]
    }
  })
);

const RateItem = (props: any) => {
  const { rate } = props;
  return (
    <div className="py-1 flex items-center">
      <Chip label={`$${rate.rate}`} size="small" />
      <div className="ml-2">
        {rate.hours} HOUR(S) / {rate.description}
      </div>
    </div>
  );
};

const AvailabilityItem = (props: any) => {
  const { availability } = props;
  return (
    <div className="py-1">
      <div>
        {availability.days} / {availability.times}
      </div>
      <div>{availability.description}</div>
    </div>
  );
};

const GirlDetailPage = (props: any) => {
  const history = useHistory();
  const classes = useStyles();
  const [selectedGirl, setSelectedGirl] = useRecoilState(selectedGirlState);
  const setMe = useSetRecoilState(meState);
  const setNotification = useSetRecoilState(notificationState);
  const [{ loadingAccount }, setLoading] = useRecoilState(loadingState);
  const [photo, setPhoto] = useState('');

  const { uuid } = useParams() as { uuid: string };

  useEffect(() => {
    (async function _() {
      setLoading(old => ({ ...old, loadingGirlInfo: true }));

      try {
        const resp = await UserService.getGirl(uuid);
        setSelectedGirl(resp.data);
      } catch (e) {
        const { errorMessage, errorStatus } = parseError(e);

        setNotification({
          open: true,
          severity: AlertSeverity.ERROR,
          message: errorMessage
        });

        if (errorStatus === 401) {
          setMe(null);
          history.push('/login');
        }
      }

      setLoading(old => ({ ...old, loadingAccount: false }));
    })();
  }, [history, setLoading, setMe, setNotification, setSelectedGirl, uuid]);

  useEffect(() => {
    setPhoto(selectedGirl?.photos && selectedGirl?.photos.length > 0 
      ? selectedGirl.photos[selectedGirl.photos.length - 1] : '/assets/images/no-photo.png');
  }, [selectedGirl]);

  return (
    <>
      {loadingAccount || !selectedGirl || selectedGirl.uuid !== uuid ? (
        <div className="h-screen flex justify-center items-center">
          <ClipLoader size={32} color="#ff4b4b" />
        </div>
      ) : (
        <div className={clsx(classes.root)}>
          <div className="relative">
            {selectedGirl?.photos && selectedGirl?.photos.length > 0 ? (
              <Slide {...slideImageProperties}>
                {selectedGirl.photos.slice(0).reverse().map((each, index) => (
                  <div key={index} className="each-slide">
                    {/* <div style={{ backgroundImage: `url(${each})` }} /> */}
                    <img className="w-full" src={each} alt="" />
                  </div>
                ))}
              </Slide>
            ) : (
              <div className="each-slide">
                {/* <div style={{ backgroundImage: `url(${photo})` }} /> */}
                <img className="w-full" src={photo} alt="" />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-2 shadow-md">
            <div className="flex flex-col">
              <div className="text-xl">{selectedGirl?.name}</div>
              <p className="text-xs truncate">{selectedGirl?.home}</p>
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ChatIcon />}
                onClick={() => history.push(`/chat/messages`)}
              >
                MESSAGE
              </Button>
            </div>
          </div>
          <div className="p-4 font-light">
            {selectedGirl?.introduction?.split(/\n|\r|↵/g).map(line => (<div>{line}</div>))}
          </div>
          <div className="px-4 mb-4">
            <p className="text-md, font-normal">RATES</p>
            {selectedGirl?.rates?.map((rate, i) => (
              <RateItem rate={rate} key={i} />
            ))}
          </div>

          <div className="px-4 mb-4">
            <p className="text-md font-normal">AVAILABILITY</p>
            {selectedGirl?.availabilities?.map((availability, i) => (
              <AvailabilityItem availability={availability} key={i} />
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
};

export default GirlDetailPage;
