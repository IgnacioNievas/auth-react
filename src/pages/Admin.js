import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { auth } from '../servi/firebase';

import Navbar from '../components/Navbar';
import Firestore from '../components/Firestore';

const Admin = (props) => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		if (auth.currentUser) {
			setUser(auth.currentUser);
		} else {
			props.history.push('/login');
		}
	}, [props.history]);

	return (
		<div>
			<Navbar />
			{user && (
				<h3>
					<Firestore user={user} />
				</h3>
			)}
		</div>
	);
};

export default withRouter(Admin);
