import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAohC5fdfW4lVJMMu-_Qk5lLykxx8x16ho',
	authDomain: 'crud-react2-16378.firebaseapp.com',
	projectId: 'crud-react2-16378',
	storageBucket: 'crud-react2-16378.appspot.com',
	messagingSenderId: '510454623314',
	appId: '1:510454623314:web:ef7bd33aead4cbb05d438b',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, firebase, storage };
