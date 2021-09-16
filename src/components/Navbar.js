import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import Swal from 'sweetalert2';
import { auth } from '../servi/firebase';

const Navbar = ({ esRegistro, isLoding, history }) => {
	const link = {
		textDecoration: 'none',
		marginLeft: '20px',
		color: 'black',
		fontWeight: 'bolder',
	};
	const boton = { background: 'transparent', border: 'none', color: 'white' };

	const signOut = () => {
		auth.signOut().then(() => {
			history.push('./login');
		});
	};

	const confirmacionCerrarsesion = () => {
		Swal.fire({
			title: 'Estas seguro!! ',
			text: '¿Que quiere cerrar la sesion?',
			icon: 'warning',
			confirmButtonText: 'Si , estoy seguro',
			confirmButtonColor: 'lime',
			confirmButtonAriaLabel: 'Si , estoy seguro',
			cancelButtonText: 'No quiero',
			cancelButtonColor: 'red',
			cancelButtonAriaLabel: 'No quiero',
			allowEscapeKey: false,
			allowOutsideClick: false,
			allowEnterKey: false,
			showCancelButton: true,
		}).then((resp) => {
			if (resp.value) {
				signOut();
			}
		});
	};

	return (
		<div className='navbar navbar-dark bg-dark'>
			<Link className='navber-brand' to='/' style={link}>
				<i
					className='fas fa-address-card fa-2x'
					style={{ marginRight: '20px', color: 'grey' }}></i>
				AUTH
			</Link>
			<div>
				<div className='d-flex'>
					<NavLink to='/' exact className='btn btn-dark mr-2'>
						Inicio
					</NavLink>

					{isLoding !== null ? (
						<NavLink to='/admin' className='btn btn-dark mr-2'>
							Admin
						</NavLink>
					) : null}

					{isLoding !== null ? (
						<button style={boton} onClick={confirmacionCerrarsesion}>
							sign Out
						</button>
					) : (
						<NavLink to='/login' className='btn btn-dark mr-2'>
							<button style={boton}>
								{esRegistro ? '	Sign up' : 'Sign in'}
							</button>
						</NavLink>
					)}
				</div>
			</div>
		</div>
	);
};

export default withRouter(Navbar);
