import React from 'react';
import { useRecoilState } from 'recoil';
import { notificationState } from '../../recoil/atoms/notification.atom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const NotificationComponent = () => {
  const [notification, setNotification] = useRecoilState(notificationState);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Snackbar open={notification.open} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={notification.severity}>
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationComponent;
