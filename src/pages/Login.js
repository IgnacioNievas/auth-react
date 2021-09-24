import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router';
import { db, auth, firebase } from '../servi/firebase';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const Login = (props) => {
	const [email, setEmail] = useState(
		'' || JSON.parse(localStorage.getItem('email'))
	);
	const [pass, setPass] = useState(
		'' || JSON.parse(localStorage.getItem('password'))
	);
	const [username, setUsername] = useState('');
	const [fecha, setFecha] = useState('');
	const [esRegistro, setEsregistro] = useState(false);
	const [recordar, setRecordar] = useState(
		false || JSON.parse(localStorage.getItem('check'))
	);

	const nuevoEmail = (e) => {
		setEmail(e.target.value);
	};

	const nuevoPass = (e) => {
		setPass(e.target.value);
	};
	const nuevoUsername = (e) => {
		setUsername(e.target.value);
	};

	const nuevoFecha = (e) => {
		setFecha(e.target.value);
	};

	const procesandoDatos = (e) => {
		e.preventDefault();

		if (esRegistro) {
			resgistra();
		} else {
			login();
		}
	};

	const cambioLogin = () => {
		setEsregistro(!esRegistro);
	};

	const login = useCallback(async () => {
		try {
			await auth.signInWithEmailAndPassword(email, pass);

			setPass('');
			setEmail('');

			props.history.push('/admin');
		} catch (e) {
			if (e.code === 'auth/invalid-email') {
				Swal.fire({
					text: 'email invalido..',
					timer: 2000,
					showConfirmButton: false,
					icon: 'error',
					timerProgressBar: true,
				});
			} else if (e.code === 'auth/wrong-password') {
				Swal.fire({
					text: 'contraseña invalido..',
					timer: 2000,
					showConfirmButton: false,
					icon: 'error',
					timerProgressBar: true,
				});
			} else {
				Swal.fire({
					text: 'email no resgitrado..',
					timer: 2000,
					showConfirmButton: false,
					icon: 'error',
					timerProgressBar: true,
				});
			}
		}
	}, [email, pass, props.history]);

	const resgistra = useCallback(async () => {
		const localYear = new Date().getFullYear();
		const userYear = new Date(fecha).getFullYear();
		const localMonth = new Date().getUTCMonth() + 1;
		const userMonth = new Date(fecha).getUTCMonth() + 1;
		const localDay = new Date().getDate();
		const userDay = new Date(fecha).getUTCDate();

		const days = localDay - userDay;

		// debugger;
		if (userYear === localYear && userMonth === localMonth && days < 0) {
			Swal.fire({
				icon: 'warning',
				text: 'Fecha incorrecta, introduzca bien su fecha de nacimiento',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			return;
		} else if (
			(userYear === localYear && userMonth > localMonth && days > 0) ||
			(userYear === localYear && userMonth > localMonth && days <= 0)
		) {
			Swal.fire({
				icon: 'warning',
				text: 'Fecha incorrecta, introduzca bien su fecha de nacimiento',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			return;
		} else if (userYear > localYear) {
			Swal.fire({
				icon: 'warning',
				text: 'Fecha incorrecta, introduzca bien su fecha de nacimiento',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			return;
		}

		const userName = await db.collection('datos_usuarios').get();

		const usuarioName = await userName.docs.map((doc) => {
			return doc.data().username;
		});

		if (usuarioName.find((user) => user === username)) {
			Swal.fire({
				icon: 'warning',
				title: 'Nombre de usuario ya existente',
				text: `Pruebe con otros distintos a estos: ${usuarioName} , los cuales ya se encuentran registrados`,
				showConfirmButton: false,
				timer: 5000,
				timerProgressBar: true,
			});
			return;
		}

		try {
			const objDatos = {
				username: username,
				fecha: fecha,
			};

			const res = await auth.createUserWithEmailAndPassword(email, pass);

			await db.collection('datos_usuarios').doc(res.user.email).set(objDatos);

			setPass('');
			setFecha('');
			setUsername('');
			setEmail('');
			props.history.push('/admin');
		} catch (e) {
			if (e.code === 'auth/invalid-email') {
				Swal.fire({
					text: 'email invalido',
					timer: 2000,
					showConfirmButton: false,
					icon: 'error',
					timerProgressBar: true,
				});
			} else {
				Swal.fire({
					text: 'email ya registrado',
					timer: 2000,
					showConfirmButton: false,
					icon: 'error',
					timerProgressBar: true,
				});
			}
			if (pass.length < 6 || pass.length > 10) {
				Swal.fire({
					icon: 'error',
					text: 'La contraseña debe tener mas de 6  caracteres con maximo de 10 de caracteres',
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				});
			}
		}
	}, [email, pass, username, fecha, props.history]);

	const accederGoogle = useCallback(async () => {
		const provider = await new firebase.auth.GoogleAuthProvider();
		await auth.signInWithPopup(provider);
		props.history.push('/admin');
	}, [props.history]);

	const guardarUsuario = () => {
		if (recordar === false) {
			localStorage.setItem('email', JSON.stringify(email));
			localStorage.setItem('password', JSON.stringify(pass));
			setRecordar(true);
		} else {
			localStorage.removeItem('email');
			localStorage.removeItem('password');
			setRecordar(false);
		}
		if (email === null || pass === null) {
			return;
		}
		localStorage.setItem('check', JSON.stringify(!recordar));
	};

	const contrasenaNueva = () => {
		Swal.fire({
			title: 'Recuperación de contraseña',
			input: 'email',
			inputLabel: 'Introduzca su direccion de mail, por favor',
			inputPlaceholder: '*Email',
			allowOutsideClick: false,
			allowEscapeKey: false,
			allowEnterKey: false,
			showCancelButton: true,
			cancelButtonText: 'cerrar',
			cancelButtonAriaLabel: 'cerrar',
			cancelButtonColor: 'red',
			confirmButtonText: 'enviar',
			closeButtonAriaLabel: 'enviar',
			confirmButtonColor: '#6a5acd',
		}).then(async (mail) => {
			try {
				if (mail.isConfirmed) {
					await auth.sendPasswordResetEmail(mail.value);
				}
				if (mail.value) {
					Swal.fire({
						text: `ha sido enviado un mail a : ${mail.value}`,
						icon: 'success',
						showConfirmButton: false,
						timer: 3000,
						timerProgressBar: true,
					});
				}
			} catch (e) {
				if (e.code === 'auth/user-not-found')
					Swal.fire({
						icon: 'error',
						text: 'usuario no encontrado',
						showConfirmButton: false,
						timer: 3000,
						timerProgressBar: true,
					});
			}
		});
	};

	return (
		<div className='container mt-5'>
			<Navbar esRegistro={esRegistro} isLoding={props.isLoding} />
			<div className='mt-4 '>
				<h3 className='text-center'>
					{esRegistro ? ' Registro de usuarios ' : 'Acceda a la cuenta'}
				</h3>
				<hr />
				<div className='row justify-content-center'>
					<div className='col-12 col-sm-8  col-md-6 col-xl-4'>
						<form onSubmit={procesandoDatos}>
							<label htmlFor='mail' className='form-label'>
								*Ingrese su usuario
							</label>
							<input
								type='email'
								name='mail'
								placeholder='Ej: pedro@gmail.com'
								className=' form-control mb-2'
								onChange={nuevoEmail}
								value={email}
								required
							/>
							<label htmlFor='pass' className='form-label'>
								*Ingrese su contraseña
							</label>
							<input
								type='password'
								placeholder='Ej:1d4f5#ssdf'
								name='pass'
								className='form-control mb-2'
								onChange={nuevoPass}
								value={pass}
								required
							/>

							{esRegistro ? (
								<>
									<label htmlFor='username' className='form-label'>
										*Ingrese un nombre de usuario
									</label>
									<input
										type='text'
										placeholder='Ej:Nacho_bjj'
										className='form-control mb-2'
										name='username'
										onChange={nuevoUsername}
										value={username}
										required
									/>
									<label htmlFor='date' className='form-label'>
										*Ingresar su fecha de nacimiento
									</label>
									<input
										name='date'
										type='date'
										className='form-control mb-2'
										onChange={nuevoFecha}
										value={fecha}
										required
									/>
								</>
							) : (
								<label htmlFor='check'>
									<input
										name='remember-me'
										id='check'
										type='checkbox'
										onChange={guardarUsuario}
										checked={recordar}
									/>
									Recordar mi usuario
								</label>
							)}
							<div className='d-grid gap-2'>
								<button className='btn btn-dark btn-lg ' type='submit'>
									{esRegistro ? 'Registrarse' : 'Acceder a cuenta'}
								</button>
								<button
									className='btn btn-outline-dark btn-lg '
									onClick={accederGoogle}>
									Acceder con cuenta
									<i className='fab fa-google text-primary ms-1'></i>oogle
								</button>
								<button
									onClick={cambioLogin}
									className='btn btn-outline-info btn-sm  mb-2'
									type='button'>
									{esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
								</button>
								{!esRegistro ? (
									<button
										className='btn btn-outline-primary btn-sm  mb-2'
										onClick={contrasenaNueva}
										type='button'>
										¿olvidaste tu contrseña
									</button>
								) : null}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Login);
