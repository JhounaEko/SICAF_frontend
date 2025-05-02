import React, { useEffect, useState } from 'react';
import useCloseSesion from './../../../pages/login/AuthLogin.jsx';
import { ReactNotifications, Store } from 'react-notifications-component';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useForm, } from 'react-hook-form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import CryptoJS from 'crypto-js';
import { addNotification } from './../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';

function DropdownProfile({ props }) {
	const CloseSesion = useCloseSesion();
	const navigation = useNavigate();

	const handleCloseSesion = () => {
		Swal.fire({
			title: '<strong>¿Esta seguro de cerrar sesion?</strong>',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "Cancelar",
			confirmButtonText: "Cerrar sesión"
		}).then((result) => {
			if (result.isConfirmed) {
				CloseSesion();
			}
		});
	}

	/** begin password */
	const { register, handleSubmit, unregister, reset, setValue, formState: { errors }, getValues } = useForm();
	const [StatusModalChangePassword, setStatusModalChangePassword] = useState(false);
	const [stateButtonChangePassword, setStateButtonChangePassword] = useState(false);

	const reserFormChangePasswordForm = () => {
		reset();
		setStatusModalChangePassword(false);
	}


	const [showPasswordCurrent, setshowPasswordCurrent] = useState(true);
	const togglePasswordVisibilityCurrent = () => { setshowPasswordCurrent(!showPasswordCurrent); };
	const [showPassword, setShowPassword] = useState(true);
	const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
	const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);
	const togglePasswordVisibilityConfirmar = () => { setShowPasswordConfirmar(!showPasswordConfirmar); };
	const openModalChangePassword = () => {
		console.log(userProps);
		setStatusModalChangePassword(true);
	}

	const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
	let decryptedToken;
	if (sessionTokenSicaf) {
		decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
	} else {
		decryptedToken = "not session"
	}
	const onSubmitFormChangePassword = (dataFormChangePassword) => {
		if (dataFormChangePassword.password == dataFormChangePassword.password_confirmation) {
			setStateButtonChangePassword(true);
			axios({
				method: "POST",
				url: process.env.REACT_APP_API_URL + '/api/v1/users/password',
				data: dataFormChangePassword,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + decryptedToken,
				}
			}).then(response => {
				console.log(response);
				reserFormChangePasswordForm();
				Swal.fire({
					title: "Acualización de datos existoso",
					text: "Intentos permitidos " + (3 - response.data.results.password_change_count) + " de 3",
					icon: "success",
					draggable: true,
					timer: 3000,
					confirmButtonColor: "#3085d6",
				});
			}).catch(error => {
				console.log(error);
				if (error.code == "ERR_BAD_REQUEST") {
					addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
				} else {
					if (error.code == "ERR_BAD_REQUEST") {
						if (error.response.data.message === "Unauthenticated.") {
							Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
							Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
							Swal.fire({
								title: "Sesion finalizada",
								icon: "success",
								draggable: true,
								timer: 3000,
								confirmButtonColor: "#3085d6",
							});
							navigation('/');
						}
					}
				}

			}).finally(() => {
				setStateButtonChangePassword(false);
			});
		} else {
			addNotification('warning', 'Verificar las contraseñas', 'Las contraseñas no coincide', 'top-right', 8000, "fas fa-exclamation-circle", null)
		}
	}
	/** end password */

	useEffect(() => {
		axios({
			method: "GET",
			url: process.env.REACT_APP_API_URL + '/api/v1/notifications',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + decryptedToken,
			}
		}).then(response => {
			const dataNotification = response.data.results;
			if (!dataNotification.length === 0) {

			} else {

			}
		}).catch(error => {
			console.log(error);
		}).finally(() => {
		});
	}, []);


	const userProps = props || JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA))

	return (
		<>
			<Modal show={StatusModalChangePassword} onHide={reserFormChangePasswordForm} scrollable={true} backdrop="static" keyboard={false}>
				<ReactNotifications />
				<Modal.Header closeButton>
					<Modal.Title><h4 className="modal-title"><i className="fas fa-user"></i> Cambiar contraseña de </h4></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={handleSubmit(onSubmitFormChangePassword)} id="myFormChangePassword">
						<fieldset>
							<legend className="mb-3"></legend>
							<div className="mb-3 position-relative">
								<label className="required form-label" htmlFor="current_password"><i className="fas fa-key"></i>&nbsp;Contraseña actual</label>
								<input className="form-control"
									type={showPasswordCurrent ? "text" : "password"}
									id="current_password"
									placeholder="contraseña"
									{...register("current_password", {
										required: "La contraseña es obligatoria",
										minLength: {
											value: 8,
											message: "La contraseña debe tener al menos 8 caracteres",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
											message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
										},
									})}
									disabled={false}
								/>
								<i
									className={`fas ${showPasswordCurrent ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
									onClick={togglePasswordVisibilityCurrent}
									style={{
										color: '#008080',
										position: 'absolute',
										right: '10px',
										top: '70%',
										transform: 'translateY(-50%)',
										cursor: 'pointer',
									}}
								/>
							</div>
							{errors.current_password && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.current_password.message)}</div>}
							<div className="mb-3 position-relative">
								<label className="required form-label" htmlFor="password"><i className="fas fa-key"></i>&nbsp;Nueva contraseña</label>
								<input className="form-control"
									type={showPassword ? "text" : "password"}
									id="password"
									placeholder="contraseña"
									{...register("password", {
										required: "La contraseña es obligatoria",
										minLength: {
											value: 8,
											message: "La contraseña debe tener al menos 8 caracteres",
										},
										pattern: {
											value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
											message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
										},
									})}
									disabled={false}
								/>
								<i
									className={`fas ${showPassword ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
									onClick={togglePasswordVisibility}
									style={{
										color: '#008080',
										position: 'absolute',
										right: '10px',
										top: '70%',
										transform: 'translateY(-50%)',
										cursor: 'pointer',
									}}
								/>
							</div>
							{errors.password && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.password.message)}</div>}
							<div className="mb-3 position-relative">
								<label className="required form-label" htmlFor="password_confirmation"> <i className='fas fa-key'></i> &nbsp; Confirmar nueva contraseña</label>
								<input className="form-control"
									type={showPasswordConfirmar ? "text" : "password"}
									id="password_confirmation"
									placeholder="confirmar contraseña"
									{...register("password_confirmation", {
										required: "La contraseña es obligatoria",
										minLength: {
											value: 8,
											message: "La contraseña debe tener al menos 8 caracteres",
										},
									})}
									disabled={false}
								/>
								<i
									className={`fas ${showPasswordConfirmar ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
									onClick={togglePasswordVisibilityConfirmar}
									style={{
										color: '#008080',
										position: 'absolute',
										right: '10px',
										top: '70%',
										transform: 'translateY(-50%)',
										cursor: 'pointer',
									}}
								/>
							</div>
							{errors.password_confirmation && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.password_confirmation.message)}</div>}
						</fieldset>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button className='btn btn-danger' type='button' onClick={reserFormChangePasswordForm} > <i className="fas fa-close"></i> Cerrar</Button>
					<Button variant="primary" type='submit' form="myFormChangePassword" disabled={stateButtonChangePassword}> {stateButtonChangePassword ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
				</Modal.Footer>
			</Modal>
			<div className="navbar-item navbar-user dropdown">
				<a href="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
					<img src="/assets/img/user/user8-128x128.jpg" alt="" />
					<span>
						<span className="d-none d-md-inline">{userProps.first_name} {userProps.last_name}</span>
						<b className="caret"></b>
					</span>
				</a>
				<div className="dropdown-menu dropdown-menu-end me-1">
					<span className="dropdown-item"> <b>ROL</b> {userProps.roles[0].name}</span>
					<a className="dropdown-item" onClick={handleCloseSesion}> <i className="fas fa-sign-out-alt fa-1_5x" style={{ "color": "#f13d1e" }}></i> Cerrar sesión</a>
					<a className="dropdown-item" onClick={openModalChangePassword}> <i className="fas fa-key fa-1_5x"></i> Cambiar contraseña</a>
				</div>
			</div>
		</>
	);
};

export default DropdownProfile;
