import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, } from 'react-hook-form';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { ReactNotifications } from 'react-notifications-component';
import { useInitSesion } from './AuthLogin.jsx';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {

	const InitSesion = useInitSesion();
	const navigate = useNavigate();

	const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
	const [botonSubmitDisabled, setBotonSubmitDisabled] = useState(false);
	const [checked, setChecked] = useState(false);

	useEffect(() => {
		const savedUsername = Cookies.get(process.env.REACT_APP_COOKIES_NAME_USER);
		const savedPassword = Cookies.get(process.env.REACT_APP_COOKIES_NAME_PASS);
		if (savedUsername && savedPassword) {
			const bytesUsername = (CryptoJS.AES.decrypt(savedUsername, process.env.REACT_APP_API_KEY)).toString(CryptoJS.enc.Utf8);
			const bytesPassword = (CryptoJS.AES.decrypt(savedPassword, process.env.REACT_APP_API_KEY)).toString(CryptoJS.enc.Utf8);
			setValue("username", bytesUsername);
			setValue("password", bytesPassword);
			setChecked(true);
		}
	}, [setValue]);

	const changeOptionBoton = (ref) => {
		setBotonSubmitDisabled(ref);
	}

	/*** ======================== Modal Roles ================ */
	const [dataUserRolesMenus, setDataUserRolesMenus] = useState({ roles: [] });
	const addDataUserRolesMenus = (ref) => {
		setDataUserRolesMenus(ref);
	}

	const [modalVisible, setModalVisible] = useState(false);
	const handleClose = () => {
		setModalVisible(false);
		setDataUserRolesMenus({ roles: [] });
		Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
		Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
	}
	const openModal = () => {
		setModalVisible(true);
	}

	const handleRoleClick = (rolUser) => {		
		dataUserRolesMenus.roles = [ rolUser];	
		Cookies.set(process.env.REACT_APP_COOKIES_NAME_DATA, JSON.stringify(dataUserRolesMenus), { expires: parseInt(process.env.REACT_APP_TIME_COOKIES, 10) });							
		navigate('/dashboard/v1', { state: dataUserRolesMenus });	
	}

	/*** ==========================  form login ======================== */
	const onSubmit = (data) => {
		setBotonSubmitDisabled(true);
		InitSesion(data, checked, { changeOptionBoton, openModal, addDataUserRolesMenus });
	}

	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

	return (
		<>
			<Modal show={modalVisible} onHide={() => handleClose}>
				<Modal.Header >
					<Modal.Title>Roles asignados</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{(dataUserRolesMenus.roles).map((rol) => (
						
						<Button
							key={rol.id}
							variant="outline-primary"
							className="m-2"
							onClick={() => handleRoleClick(rol)}
						>
							{rol.name}
						</Button>
					))}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
			<div className="login login-v2 fw-bold">
				<div className="login-cover">
					<div className="login-cover-img" style={{ backgroundImage: `url(/assets/img/img-03.jpeg` }}></div>
					<div className="login-cover-bg"></div>
				</div>

				<div className="login-container">
					<div className="login-header">
						<div className="brand">
							<div className="d-flex align-items-center">
								<span className="logo"></span> <b>Sistema de Activos Fijos</b>
							</div>
							<small>S.I.C.A.F </small>
						</div>
						<div className="icon">
							<i className="fa fa-lock"></i>
						</div>
					</div>

					<div className="login-content">
						<ReactNotifications />
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className={`form-floating ${errors.username ? 'mb-10px' : 'mb-20px'} `}>
								<input type="text"
									className={`form-control fs-13px h-45px border-0 ${errors.username ? 'mb-1' : 'mb-3'}`}
									placeholder="Usuario"
									id="username"
									{...register("username", {
										required: 'Introduzca su usuario',
										maxLength: {
											value: 30,
											message: 'Cantidad máxima de caracteres 30',
										},
										pattern: {
											value: /^[A-Za-z0-9]+$/i,
											message: 'Solo se permite números y texto',
										},
									})}
								/>
								<label htmlFor="username" className="d-flex align-items-center text-gray-600 fs-13px">Usuario</label>
							</div>
							{errors.username && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.username.message)}</div>}

							<div className={`form-floating ${errors.password ? 'mb-10px' : 'mb-20px'} `}>
								<input type={`${showPassword ? 'text' : 'password'}`}
									id="password"
									className={`form-control fs-13px h-45px border-0 ${errors.password ? 'mb-1' : 'mb-3'}`}
									placeholder="Contraceña"
									{...register("password", {
										required: 'La contraseña es requerida',
										minLength: {
											value: 8,
											message: 'Cantidad mínima de caracteres 8',
										},
									})}
								/>
								<i
									className={`fas ${showPassword ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
									onClick={togglePasswordVisibility}
									style={{
										color: '#008080',
										position: 'absolute',
										right: '10px',
										top: '50%',
										transform: 'translateY(-50%)',
										cursor: 'pointer',
									}}
								/>
								<label htmlFor="password" className="d-flex align-items-center text-gray-600 fs-13px">Contraseña</label>
							</div>
							{errors.password && <div className='mb-3' style={{ color: 'red' }}>{String(errors.password.message)}</div>}

							<div className="form-check mb-20px">
								<input className="form-check-input border-0"
									type="checkbox"
									id="rememberMe"
									checked={checked}
									onChange={(e) => setChecked(e.target.checked)} />
								<label className="form-check-label fs-13px text-gray-500" htmlFor="rememberMe">
									Recordar credenciales
								</label>
							</div>
							<div className="mb-20px">
								<button type="submit" className="btn btn-theme d-block w-100 h-45px btn-lg" disabled={botonSubmitDisabled}> {botonSubmitDisabled ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-sign-in-alt fa-1_5x"></i>)}  &nbsp; Ingresar</button>
							</div>
							<hr />
							<p className="fs-13px text-gray-500 text-center">--- Registrarme ---</p>
							<div className="d-flex">
								<div className="text-gray-500 me-3">
									<Link to="/user" className="btn btn-theme" title="Persona administrativo del Sistema y Control de Activos Fijos (S.I.C.A.F.)" >Personal del sistema S.I.C.A.F.</Link>
								</div>
								<div className="text-gray-500">
									<Link to="/personal" className="btn btn-theme" title="Personal del Gobierno Autonomo Municipal de El Alto">Personal del G.A.M.E.A.</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

		</>
	);
}

export default Login;