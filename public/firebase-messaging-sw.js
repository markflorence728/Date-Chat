importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.21.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCz9r9T_OnU2CHo42vY_n8YWltowV3lheE',
  authDomain: 'privatedate-43920.firebaseapp.com',
  databaseURL: 'https://privatedate-43920.firebaseio.com',
  projectId: 'privatedate-43920',
  storageBucket: 'privatedate-43920.appspot.com',
  messagingSenderId: '424875388453',
  appId: '1:424875388453:web:b720a866fef5ef2d8b99cc',
  measurementId: 'G-YLG3J8SLL6'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  console.log('NOTIFICATION CLICK EVENT', event);
});
