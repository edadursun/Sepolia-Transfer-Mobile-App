import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore} from "firebase/firestore"

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
	apiKey: '....',
	authDomain: 'metamaskproject2.firebaseapp.com',
	projectId: 'metamaskproject2',
	storageBucket: 'metamaskproject2.appspot.com',
	messagingSenderId: '....',
	appId: '....',
};

export const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const authT = getAuth(app);
export const firestoreT = getFirestore(app);
