import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import Inicio from '../pages/Inicio';

const Routes = ({ isLoding }) => {
	return (
		<div className='container ml-5'>
			<Router>
				<Switch>
					<Route path='/login'>
						<Login isLoding={isLoding} />
					</Route>
					<Route path='/admin' component={Admin} />
					<Route path='/' exact>
						<Inicio isLoding={isLoding} />
					</Route>
				</Switch>
			</Router>
		</div>
	);
};

export default Routes;
