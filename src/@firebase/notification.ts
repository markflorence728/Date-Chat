import firebase from '.';

export const initFCMTOken = async () => {
  try {
    const messaging = firebase.messaging();
    const token = await messaging.getToken();
    console.log('FCM TOKEN', token);
    localStorage.setItem('privatedate.fcm_token', token);
    return token;
  } catch (error) {
    console.error(error);
  }
};
