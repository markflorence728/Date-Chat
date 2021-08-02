import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import routes from './routes/routes';
import { ThemeProvider } from '@material-ui/core/styles';
import { PubNubProvider } from 'pubnub-react';
import NotificationComponent from './common/components/Notification';
import CustomRoute from './routes/CustomRoute';
import theme from './common/material/theme';
import pubnub from './@pubnub';
import PubnubComponent from './PubnubComponent';
import { parseError } from './@http-api/helpers';
import UserService from './modules/user/services/user.service';
import { AlertSeverity, notificationState } from './recoil/atoms/notification.atom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { meState } from './recoil/atoms/users.atom';
import { ConsoleService } from './common/services/console.service';
import { pubnubUUIDMetadataState } from './recoil/atoms/pubnub.atom';
import { loadingState } from './recoil/atoms/loading.atom';
import { browser } from '.';
import { initFCMTOken } from './@firebase/notification';

const leaveApplication = () => {
  pubnub.unsubscribeAll();
};

const App = (props: any) => {
  const history = useHistory();
  const [me, setMe] = useRecoilState(meState);
  const setLoading = useSetRecoilState(loadingState);
  const setNotification = useSetRecoilState(notificationState);
  const setPubnubUUIDMetadata = useSetRecoilState(pubnubUUIDMetadataState);

  useEffect(() => {
    (async function _() {
      setLoading(old => ({ ...old, loadingAccount: true }));

      const token = localStorage.getItem('privatedate.id_token');
      if (token && token !== 'null') {
        try {
          const resp = await UserService.me();
          setMe({
            ...resp.data,
            authorized: true
          });
        } catch (e) {
          const { errorMessage, errorStatus } = parseError(e);

          setNotification({
            open: true,
            severity: AlertSeverity.ERROR,
            message: errorMessage
          });

          if (errorStatus === 401) {
            setMe(null);
            localStorage.removeItem('privatedate.id_token');
            history.push('/login');
          }
        }
      }

      setLoading(old => ({ ...old, loadingAccount: false }));
    })();
  }, []);

  const getPubnubUUIDMetadata = async () => {
    setLoading(old => ({ ...old, loadingAccount: true }));

    try {
      const response = await pubnub.objects.getUUIDMetadata();
      setPubnubUUIDMetadata({ ...response.data });
    } catch (e) {
      if (e.status.statusCode === 404) {
        try {
          const data = {
            externalId: me?.uuid,
            name: `${me?.name}`,
            profileUrl: me?.photos && me?.photos.length > 0 ? me?.photos[0] : '',
            email: me?.email
          };
          const response = await pubnub.objects.setUUIDMetadata({ data });
          setPubnubUUIDMetadata({ ...response.data });
        } catch (e) {
          ConsoleService.error(e);
        }
      }
    }

    setLoading(old => ({ ...old, loadingAccount: false }));
  };

  useEffect(() => {
    if (me?.uuid && me?.authorized) {
      pubnub.setUUID(me.uuid);
      getPubnubUUIDMetadata();
    }
  }, [me?.authorized]);

  useEffect(() => {
    if (
      browser?.os &&
      browser?.name &&
      !['Mac OS', 'iOS'].includes(browser.os) &&
      !['ios', 'safari', 'ios-webview'].includes(browser.name)
    ) {
      Notification.requestPermission(status => {
        console.log('Notification permission status:', status);
        if (status == 'granted') {
          initFCMTOken();
        }
      });
    }

    window.addEventListener('beforeunload', leaveApplication);
    return leaveApplication;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <PubNubProvider client={pubnub}>
        <PubnubComponent />
        <CssBaseline />
        <NotificationComponent />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          {routes.map(route => (
            <CustomRoute
              path={route.path}
              component={route.component}
              key={route.path}
              exact={route.exact}
              required_auth={route.required_auth}
            />
          ))}
        </Switch>
      </PubNubProvider>
    </ThemeProvider>
  );
};

export default App;
