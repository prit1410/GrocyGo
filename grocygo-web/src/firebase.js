// Firebase web config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDwZQDYYbWHPnvHHPmCqLcv3gu7qeEb-QQ",
  authDomain: "grocygo-c9820.firebaseapp.com",
  projectId: "grocygo-c9820",
  storageBucket: "grocygo-c9820.appspot.com",
  messagingSenderId: "90041522201",
  appId: "1:90041522201:web:56f663babafa7b8973b288",
  measurementId: "G-0LNT8ZGD4P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
