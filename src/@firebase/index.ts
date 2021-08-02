import * as firebase from 'firebase';
import firebaseKeys from '../config/firebase-keys.json';

const config = {
  ...firebaseKeys
};

firebase.initializeApp(config);
firebase.analytics();

export default firebase;
