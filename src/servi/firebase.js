import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyB6wo3vY4anU0EGpgOopYoPosDNZFLiBns',
	authDomain: 'crud-react-97d74.firebaseapp.com',
	databaseURL: 'https://crud-react-97d74-default-rtdb.firebaseio.com',
	projectId: 'crud-react-97d74',
	storageBucket: 'crud-react-97d74.appspot.com',
	messagingSenderId: '447521778683',
	appId: '1:447521778683:web:f718a72a9a35cda773795e',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth, firebase };
