import React, { useState, useEffect } from 'react';
import Routes from './routes/Routes';
import { Loader } from './components/loading/loading';
import { auth } from '../src/servi/firebase';

function App() {
	const [isLoding, setIsLoding] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoding(user);
			} else {
				setIsLoding(null);
			}
		});
	}, []);

	return isLoding !== false ? (
		<div className='container mt-5'>
			<Routes isLoding={isLoding} />
		</div>
	) : (
		<Loader />
	);
}

export default App;
