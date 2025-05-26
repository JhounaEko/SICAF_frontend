import React, { useState, useEffect, useRef } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import Modal from 'react-bootstrap/Modal';
import AsyncSelect from 'react-select/async';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { validacionesFirstName,validacionPassword , validacionesLastName, validacionesCI, validacionesComplementoCi, validacionesEmail, validacionesCelular, separarValorCiComplemento } from '../../../components/validaciones/validacionesModUsers.jsx';
import { messageFinallySesion, messageRegisterDataSuccess, messageUpdateDataSuccess } from './../../../components/alert/alert.jsx';
import { modelUseCreate, modelChageDataRow } from './../modelUsuarios.jsx';
import { useNavigate } from 'react-router-dom';
import { modelUseListRol } from './../../roles/modelRoles.jsx';
import { modelUseListSelectOfficeLocation } from './../../oficinas/modelOficina.jsx';

const CompModalCreateUpdate = ({ StatusModal, title, CloseModal, updateTableData, data, statusUpdate = false }) => {

	/** use method globales  */
	const useChangeDataRow = modelChageDataRow();
	const useCreate = modelUseCreate();
	const navigation = useNavigate();
	const useListRol = modelUseListRol();
	const useListSelectOfficeLocation = modelUseListSelectOfficeLocation();
	/** Complementos modal */
	const [stateButton, setStateButton] = useState(false);
	const idRef = useRef(data.id);

	/** ========================================== Complementos formulario =============================== */
	const { register, handleSubmit, unregister, reset, setValue, formState: { errors }, getValues } = useForm();
	const onSubmit = async (dataTable) => {
		if (getSelectOficce) {
			setSelectOficceStatus(false)
			/** Se verifica el campo de roles */
			if (getSelectRoles) {
				setSelectRolesStatus(false);
				if (dataTable.password == dataTable.password_confirmation) {
					setStateButton(true);
					if (dataTable.id == 0 || dataTable.id == "") {
						delete dataTable.id;
						dataTable.office_location_id = getSelectOficce.id
						const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
						dataTable.roles = arrayIdRoles;
						dataTable.place_id = 1;
						const returnData = await useCreate(dataTable);

						if (returnData.status) {
							reserForm();
							updateTableData();
							messageRegisterDataSuccess();
						} else {
							if (returnData.message == "Unauthenticated.") {
								messageFinallySesion();
								navigation('/');
							}
						}
						setStateButton(false);
					} else {
						dataTable.roles = getSelectRoles.map((elemento) => (elemento.id));
						dataTable.office_location_id = getSelectOficce.id
						const result = await useChangeDataRow(dataTable);
						if (result.status) {
							reserForm();
							updateTableData();
							messageUpdateDataSuccess();
						} else {
							if (result.message == "Unauthenticated.") {
								messageFinallySesion();
								navigation('/');
							}
						}
						setStateButton(false);
					}
				} else {
					addNotification('warning', 'Verificar las contraseñas', 'Las contraseñas no coincide', 'top-right', 8000, "fas fa-exclamation-circle", null)
				}
			} else {
				setSelectRolesStatus(true);
			}
		} else {
			setSelectOficceStatus(true)
		}

	}

	const reserForm = () => {
		idRef.current = 0;
		data.office = null;
		data.roles = null;
		CloseModal();
		setSelectOficceStatus(false);
		setSelectOficce(false);
		setSelectRoles(false);
		setSelectRolesStatus(false);
		reset();
	};

	/** ============================================ Select Office ========================================*/
	const pageCurrentOffice = useRef(1);
	const inputValueOffice = useRef('');
	const hasMoreOffice = useRef(true);
	const [isLoadingOffice, setIsLoadingOffice] = useState(false);
	const [getSelectOficce, setSelectOficce] = useState(
		(data.id === 0) ? null : data.office
	);
	const [getSelectOficceStatus, setSelectOficceStatus] = useState(false);
	const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);

	const peticionOficce = async (search, pageNumber) => {
		try {
			setIsLoadingOffice(true);
			const returnData = await useListSelectOfficeLocation(search, pageNumber);
			/** Se verifica que la pagina actual sea menor a la ultima pagina */
			if (returnData.status) {
				if (returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page) {
					hasMoreOffice.current = true;
				} else {
					hasMoreOffice.current = false;
				}
				if (returnData.response.data.results.data) {
					return returnData.response.data.results.data;
				} else {
					return [];
				}
			} else {
				if (returnData.message == "Unauthenticated.") {
					messageFinallySesion();
					navigation('/');
				}
				return [];
			}
		} catch (error) {
			console.log(error)
			return [];
		} finally {
			setIsLoadingOffice(false);
		}
	}

	/** Buscador de select office, se ejecuta una petición */
	const loadOptionsOffice = async (inputVal, callback) => {
		inputValueOffice.current = inputVal;
		pageCurrentOffice.current = 1;
		const options = await peticionOficce(inputVal, pageCurrentOffice.current);
		callback(options);
	};

	/** Permite cargar los primeros datos de la pagina 1 (datos oficina) */
	useEffect(() => {
		const fetchPeticion = async () => {
			if (StatusModal) {
				const response = await peticionOficce("", 1);
				setDefaultOptionsOffice(response);
			}
		}
		fetchPeticion();
	}, [StatusModal]);

	/** Controla el scroll del select office */
	const handleMenuScrollToBottom = async () => {
		if (hasMoreOffice.current) {
			pageCurrentOffice.current = pageCurrentOffice.current + 1;
			const newOptions = await peticionOficce(inputValueOffice.current, pageCurrentOffice.current);
			try {
				if (newOptions.length != 0) {
					setDefaultOptionsOffice(prev => [...prev, ...newOptions]);
				}
			} catch (error) {

			}
		}
	}

	/** ============================================ Select Roles ========================================*/
	const [isLoadingRoles, setIsLoadingRoles] = useState(false);
	const pageCurrentRoles = useRef(1);
	const inputValueRoles = useRef('');
	const hasMoreRoles = useRef(true);
	const [getSelectRoles, setSelectRoles] = useState(false);
	const [getSelectRolesStatus, setSelectRolesStatus] = useState(false);
	const [defaultOptionsRoles, setDefaultOptionsRoles] = useState([]);

	const peticionRoles = async (search, pageNumber) => {
		try {
			setIsLoadingRoles(true);
			const returnData = await useListRol(pageNumber,/**getCountRows = */ 10, search);
			try {
				/** Se verifica que la pagina actual sea menor a la ultima pagina */
				if (returnData.status) {
					if (returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page) {
						hasMoreRoles.current = true;
					} else {
						hasMoreRoles.current = false;
					}
					return returnData.response.data.results.data;
				} else {
					if (returnData.message == "Unauthenticated.") {
						messageFinallySesion();
						navigation('/');
					}
					return [];
				}
			} catch (error) {
				console.log(error);
				return [];
			}


		} catch (error) {
			console.log(error);
			return [];
		} finally {
			setIsLoadingRoles(false);
		}
	}

	/** Buscador de select roles, se ejecuta una petición */
	const loadOptionsRoles = async (inputVal, callback) => {
		inputValueRoles.current = inputVal;
		pageCurrentRoles.current = 1;
		const options = await peticionRoles(inputVal, pageCurrentRoles.current);
		callback(options);
	};

	/** Controla el scroll del select Roles */
	const handleMenuScrollToBottomRoles = async () => {
		if (hasMoreRoles.current) {
			pageCurrentRoles.current = pageCurrentRoles.current + 1;
			const newOptions = await peticionRoles(inputValueRoles.current, pageCurrentRoles.current);
			try {
				if (newOptions.length != 0) {
					setDefaultOptionsRoles(prev => [...prev, ...newOptions]);
				}
			} catch (error) {

			}

		}
	}

	/** Permite cargar los primeros datos de la pagina 1 (datos roles) */
	useEffect(() => {

		const fetchPeticion = async () => {
			if (StatusModal) {	
				/** when updata data in component modal */		
				if (data.id !== 0 && statusUpdate && idRef.current != data.id) {
					idRef.current = data.id
					setValue('id', data.id);
					setValue('first_name', data.first_name);
					setValue('last_name', data.last_name);
					setValue('phone_number', data.phone_number);
					setValue('username', data.username);
					setValue('email', data.email);
					const ci = separarValorCiComplemento(data.identity_card);
					setValue('identity_card', ci.numCi);
					setValue('complement', ci.ciComplemento);
					setValue('issued_by', (data.issued_by == "") ? "S/E" : data.issued_by);
					unregister("password");
					unregister("password_confirmation");
				}

				/** when load data rol in component select */
				const response = await peticionRoles("", 1);
				setDefaultOptionsRoles(response);
			}
		}
		fetchPeticion();
	}, [StatusModal]);
		
	useEffect(() => {
		if (data.office) {
			setSelectOficce(data.office);
		}
	}, [data.office]);


	useEffect(() => {
		if (Array.isArray(data.roles) && data.roles.length > 0) {
			setSelectRoles(data.roles);
		}
	}, [data.roles]);

	const [showPassword, setShowPassword] = useState(false);
	const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

	const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);
	const togglePasswordVisibilityConfirmar = () => { setShowPasswordConfirmar(!showPasswordConfirmar); };


	const generarUserPassword = () => {
		const nombre = getValues('first_name')
		if (!nombre) return addNotification('info', 'Campo nombre', validacionesFirstName.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (!validacionesFirstName.pattern.value.test(nombre)) return addNotification('info', 'Campo nombre', validacionesFirstName.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (nombre.length > validacionesFirstName.maxLength.value) return addNotification('info', 'Campo nombre', validacionesFirstName.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);

		const last_name = getValues('last_name')
		if (!last_name) return addNotification('info', 'Campo apellido', validacionesFirstName.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (!validacionesFirstName.pattern.value.test(last_name)) return addNotification('info', 'Campo apellido', validacionesFirstName.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (last_name.length > validacionesFirstName.maxLength.value) return addNotification('info', 'Campo apellido', validacionesFirstName.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);

		const ci = getValues('identity_card');
		if (!ci) return addNotification('info', 'Campo C.I.', validacionesCI.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (ci.length < validacionesCI.minLength.value) return addNotification('info', 'Campo C.I.', validacionesCI.minLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (ci.length > validacionesCI.maxLength.value) return addNotification('info', 'Campo C.I.', validacionesCI.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
		if (!validacionesCI.pattern.value.test(ci)) return addNotification('info', 'Campo C.I.', validacionesCI.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);

		const apellido = (last_name.trim()).split(' ');
		const firt_name = (nombre.trim()).split(' ');
		setValue('password_confirmation', ci);
		setValue('password', ci);
		setValue('username', firt_name[0] + "." + apellido[0]);
	}



	return (<>
		<ReactNotifications />
		<Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
				<Modal.Title><h4 className="modal-title"><i className="fas fa-user"></i> {title}</h4></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit(onSubmit)} id="myFormUsers">
					<fieldset>
						<legend className="mb-3"></legend>
						<div className="mb-3">
							<div className="row gx-3">
								<div className="col-md-6 mb-0 mb-md-0">
									<label className="required form-label" htmlFor="first_name">Nombre (s)</label>
									<input className="form-control"
										type="hidden"
										defaultValue={data.id}
										id="id"
										placeholder="nombre"
										{...register("id", {})}
									/>
									<input className="form-control"
										type="text"
										id="first_name"
										placeholder="nombre"
										{...register("first_name", validacionesFirstName)}
									/>
									{errors.first_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
								</div>
								<div className="col-md-6 mb-0 mb-md-0">
									<label className="required form-label" htmlFor="last_name">Apellido (s)</label>
									<input className="form-control"
										type="text"
										id="last_name"
										placeholder="apellidos"
										{...register("last_name", validacionesLastName)}
									/>
									{errors.last_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.last_name.message)}</div>}
								</div>
							</div>
						</div>
						<div className="mb-3">
							<div className="row gx-3">
								<div className="col-md-4 mb-2 mb-md-0">
									<label className="mb-2 required fs-10 fw-bold">C.I.</label>
									<input type="number"
										className="form-control fs-13px"										
										id="identity_card"										
										placeholder="celula de identidad"
										{...register("identity_card", validacionesCI)}
									/>
									{errors.identity_card && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.identity_card.message)}</div>}
								</div>
								<div className="col-md-4 mb-2 mb-md-0">
									<label className="mb-2 fs-10 fw-bold">Complemento</label>
									<input type="text"
										className="form-control fs-13px"
										id="complement"
										placeholder="Complemento"
										{...register("complement", validacionesComplementoCi)}
									/>
									{errors.complement && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.complement.message)}</div>}

								</div>
								<div className="col-md-4">
									<label className="mb-2 required fs-10 fw-bold">Expedido </label>
									<select
										id="issued_by"
										className="form-select fs-13px"
										defaultValue="S/E"
										{...register("issued_by", {
											required: "Campo obligatorio",
										})}>
										<option value="LP">LP</option>
										<option value="CH">CH</option>
										<option value="CB">CB</option>
										<option value="OR">OR</option>
										<option value="PT">PT</option>
										<option value="TJ">TJ</option>
										<option value="SC">SC</option>
										<option value="BE">BE</option>
										<option value="PD">PD</option>
										<option value="S/E">S/E</option>
									</select>
									{errors.issued_by && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.issued_by.message)}</div>}
								</div>
							</div>
						</div>
						{(!(errors.first_name || errors.last_name || errors.identity_card || !(data.id == 0 || data.id == ""))) ?
							(<button type='button' className="btn btn-sm btn-primary p-1 px-2 mb-3 rounded-4" onClick={() => generarUserPassword()}>Generar usuario y contraseña</button>) : null
						}
						<div className="mb-3">
							<label className="required form-label" htmlFor="phone_number"> <i className='fas fa-mobile'></i>&nbsp; Celular</label>
							<input className="form-control"
								type="number"
								id="phone_number"			
								placeholder="número de celular"
								{...register("phone_number", validacionesCelular)}
							/>
						</div>
						{errors.phone_number && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
						<div className="mb-3">
							<label className="required form-label" htmlFor="username"> <i className="fas fa-user"></i> &nbsp; Usuario</label>
							<input className="form-control"
								type="text"
								id="username"
								placeholder="usuario"
								{...register("username", {
									required: "El nombre de usuario es obligatorio",
									maxLength: {
										value: 30,
										message: "El nombre de usuario no puede tener más de 30 caracteres",
									},
								})}
							/>
						</div>
						{errors.username && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.username.message)}</div>}
						{(data.id == 0 || data.id == "") && (
							<>
								<div className="mb-3 position-relative">
									<label className="required form-label" htmlFor="password"><i className="fas fa-key"></i>&nbsp; Contraseña</label>
									<input className="form-control"
										type={showPassword ? "text" : "password"}
										id="password"
										placeholder="contraseña"
										{...register("password", validacionPassword)}
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
									<label className="required form-label" htmlFor="password_confirmation"> <i className='fas fa-key'></i> &nbsp; Confirmar contraseña</label>
									<input className="form-control"
										type={showPasswordConfirmar ? "text" : "password"}
										id="password_confirmation"
										placeholder="confirmar contraseña"
										{...register("password_confirmation", validacionPassword)}
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
							</>)
						}
						<div className="mb-3">
							<label className="required form-label" htmlFor="email"> <i className='fas fa-at'></i> &nbsp; Correo</label>
							<input className="form-control"
								type="text"
								id="email"
								placeholder="correo"
								{...register("email", validacionesEmail)}
							/>
						</div>
						{errors.email && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.email.message)}</div>}
						<div className="form-group row mb-3">
							<label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Oficina</label>
							<div className="col-lg-8">
								<AsyncSelect
									cacheOptions
									loadOptions={loadOptionsOffice}
									defaultOptions={defaultOptionsOffice}
									getOptionLabel={(option) => (<div>
										<div><strong>{option.office?.name}</strong></div>
										<div style={{ fontSize: '12px', color: '#666' }}>{option.place?.description}</div>
									</div>)}
									getOptionValue={(option) => option.id}
									onMenuScrollToBottom={handleMenuScrollToBottom}
									onChange={(elemento) => { setSelectOficce(elemento); setSelectOficceStatus(false) }}
									isLoading={isLoadingOffice}
									placeholder="Seleccione una opción..."
									defaultValue={data.office}
								/>
							</div>
						</div>
						{(getSelectOficceStatus) ? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione alguna oficina</div>) : (null)}
						<div className="form-group row mb-3">
							<label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Rol de usuario</label>
							<div className="col-lg-8">
								<AsyncSelect
									cacheOptions
									loadOptions={loadOptionsRoles}
									defaultOptions={defaultOptionsRoles}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
									isMulti={true}
									onMenuScrollToBottom={handleMenuScrollToBottomRoles}
									onChange={(elemento) => { setSelectRoles(elemento); setSelectRolesStatus(false); }}
									isLoading={isLoadingRoles}
									placeholder="Seleccione opción..."
									defaultValue={data.roles}
								/>
							</div>
						</div>
						{(getSelectRolesStatus) ? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione un rol</div>) : (null)}
					</fieldset>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
				<Button variant="primary" type='submit' form="myFormUsers" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
			</Modal.Footer>
		</Modal>
	</>
	);
}

export default CompModalCreateUpdate