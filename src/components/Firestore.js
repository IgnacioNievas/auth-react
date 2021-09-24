import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { db } from '../servi/firebase';

function Firestore({ user }) {
	const [tareas, setTareas] = useState([]);
	const [tarea, setTarea] = useState('');
	const [modo, setModo] = useState(false);
	const [modoTarea, setModoTarea] = useState(true);
	const [id, setId] = useState('');

	useEffect(() => {
		const obtenerDatos = async () => {
			try {
				const data = await db.collection(user.email).orderBy('fecha').get();
				const arrayData = await data.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setTareas(arrayData);

				if (tareas.length === 0) {
					setModoTarea(false);
				} else {
					setModoTarea(true);
				}
			} catch (e) {
				console.log(e);
			}
		};

		obtenerDatos();
	}, [user.email, tareas]);

	const agregar = (e) => {
		setTarea(e.target.value);
	};

	const agregarTarea = async (e) => {
		e.preventDefault();

		if (!tarea.trim()) {
			return;
		}

		if (tarea.length > 350) {
			Swal.fire({
				icon: 'warning',
				text: 'Supero el limite de caracteres permitidos de 350',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			return;
		}

		try {
			const nuevoCampo = {
				texto: tarea,
				fecha: Date.now(),
			};
			const data = await db.collection(user.email).add(nuevoCampo);

			setTareas([...tareas, { ...nuevoCampo, id: data.id }]);

			setTarea('');
		} catch (e) {
			console.log(e);
		}
	};

	const modoEdicion = (docs) => {
		setId(docs.id);
		setModo(true);
		setTarea(docs.texto);
	};

	const editarTarea = async (e) => {
		e.preventDefault();

		if (!tarea.trim()) {
			return;
		}
		if (tarea.length > 350) {
			Swal.fire({
				icon: 'warning',
				text: 'Supero el limite de caracteres permitidos de 350',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			});
			return;
		}

		try {
			await db.collection(user.email).doc(id).update({ texto: tarea });
			const arrayEditado = tareas.map((item) =>
				item.id === id ? { id: item.id, fecha: item.fecha, texto: tarea } : item
			);

			setTareas(arrayEditado);
			setTarea('');
			setId('');
			setModo(false);
		} catch (e) {
			console.log(e);
		}
	};

	const eliminar = (id) => {
		db.collection(user.email).doc(id).delete();

		const arrayFiltrado = tareas.filter((item) => item.id !== id);

		setTareas(arrayFiltrado);
	};

	const eliminarTarea = (docs) => {
		Swal.fire({
			title: 'Estas seguro!! ',
			text: `que deseas eliminar ${docs.texto}?`,
			icon: 'question',
			confirmButtonText: 'Si , deseo eliminarla',
			confirmButtonColor: 'red',
			confirmButtonAriaLabel: 'Si , deseo eliminarla',
			cancelButtonText: 'No quiero eliminarla',
			cancelButtonColor: 'lime',
			cancelButtonAriaLabel: 'No quiero eliminarla',
			allowEscapeKey: false,
			allowOutsideClick: false,
			allowEnterKey: false,
			showCancelButton: true,
		}).then((resp) => {
			if (resp.value) {
				eliminar(docs.id);
			}
		});
	};

	return (
		<div className='container mt-5'>
			<div className='d-flex flex-wrap justify-content-around '>
				<div>
					<h1 className='text-center'>Lista de Tareas</h1>

					<ul className='list-group '>
						{modoTarea === false && tareas.length === 0 ? (
							<div className='alert alert-warning text-center mt-3 '>
								<h4 className='alert-heading'>No hay tareas</h4>
								<p>
									<i className='fas fa-exclamation-circle   fa-2x'></i>
								</p>
							</div>
						) : tareas.length > 0 ? (
							tareas.map((docs, index) => (
								<li className='list-group-item' key={index}>
									{docs.texto}
									<button
										disabled={modo}
										onClick={() => eliminarTarea(docs)}
										className='btn btn-danger btn-sm float-sm-end mx-2'>
										<i className='fas fa-trash'></i>
									</button>
									<button
										onClick={() => modoEdicion(docs)}
										className='btn btn-warning btn-sm float-sm-end ms-2 '>
										<i className='fas fa-edit'></i>
									</button>
								</li>
							))
						) : (
							<div className='alert alert-primary text-center mt-3 '>
								<h4 className='alert-heading'>Cargando</h4>
								<p>
									<i className='fa fa fa-sync-alt  fa-spin fa-2x'></i>
								</p>
								<p>Espere por favor</p>
							</div>
						)}
					</ul>
				</div>
				<div>
					<h1 className='text-center'>
						{modo ? 'Editar Tarea' : 'Agregar Tarea'}
					</h1>
					<form className='d-grid gap-2'>
						<input
							type='text'
							className='form-control mb-2'
							placeholder='Ingrese nueva tarea'
							onChange={agregar}
							value={tarea}
							// maxLength='50'
						/>
						{modo ? (
							<button
								onClick={editarTarea}
								className=' btn btn-success '
								type='submit'>
								Editar
							</button>
						) : (
							<button
								onClick={agregarTarea}
								className=' btn btn-dark '
								type='submit'>
								Agregar
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}

export default Firestore;
