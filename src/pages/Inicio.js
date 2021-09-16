import Navbar from '../components/Navbar';

const Inicio = (props) => {
	return (
		<>
			<div style={{ marginBottom: '20px' }}>
				<Navbar isLoding={props.isLoding} />
			</div>
			<div style={{ backgroundColor: 'gray' }}>
				<div className='container'>
					<h1 className='display-4 '>Auth App</h1>
					<p className='lead  '>
						Estas es una simple aplicacion para crearse un usuario y utilizar la
						ruta privada. O poderse crear un usuario para poder hacerlo . En la
						ruta privada, hay para crearse una lista de pendientes , los cuales
						se podran modificar o eliminar , todos guardados en la base de datos
						del usuario.
					</p>
				</div>
			</div>
		</>
	);
};

export default Inicio;
