import React, { ChangeEvent, useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Badge, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import { useRecoilValue, useSetRecoilState } from 'recoil/dist';
import { meState } from '../../recoil/atoms/users.atom';
import { useHistory } from 'react-router';
import { usePubNub } from 'pubnub-react';
import { getUnreadChannelCountState } from '../../recoil/selectors/pubnub.selector';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(0),
    right: theme.spacing(0),
    left: theme.spacing(0),
    paddingTop: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    fontWeight: 'bold',
    zIndex: 999
  },

  icon: {
    width: '26px',
    height: '26px'
  }
}));

const BottomNav = (props: any) => {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = useState('browse');

  const pubnub = usePubNub();
  const setMe = useSetRecoilState(meState);

  const unreadChannelCount = useRecoilValue(getUnreadChannelCountState);

  const logout = () => {
    pubnub.unsubscribeAll();
    setMe(null);
    localStorage.removeItem('privatedate.access_token');
    localStorage.removeItem('privatedate.id_token');

    history.push('/landing');
  };

  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    switch (newValue) {
      case 'browse':
        history.push('/dashboard');
        break;
      case 'messages':
        history.push('/chat/channels');
        break;
      case 'settings':
        history.push('/settings');
        break;
      case 'logout':
        logout();
        break;
    }

    setValue(newValue);
  };

  useEffect(() => {
    const pathname = history.location.pathname;
    if (pathname === '/dashboard') {
      setValue('browse');
    } else if (pathname === '/chat/channels') {
      setValue('messages');
    } else if (pathname === '/settings') {
      setValue('settings');
    }
  }, [props.history]);

  return (
    <div className={classes.root}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Browse" value="browse" icon={<ImageSearchIcon className={classes.icon} />} />
        <BottomNavigationAction
          label="Messages"
          value="messages"
          icon={
            <Badge badgeContent={unreadChannelCount} color="error">
              <MessageOutlinedIcon className={classes.icon} />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Settings"
          value="settings"
          icon={<SettingsOutlinedIcon className={classes.icon} />}
        />
        <BottomNavigationAction
          label="Logout"
          value="logout"
          icon={<ExitToAppOutlinedIcon className={classes.icon} />}
        />
      </BottomNavigation>
    </div>
  );
};

export default BottomNav;
