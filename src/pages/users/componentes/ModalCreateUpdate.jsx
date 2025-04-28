import React, { useState, useEffect, useRef} from 'react';
import { ReactNotifications, Store } from 'react-notifications-component';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import Button from 'react-bootstrap/Button';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 


const CompModalCreateUpdate = ( {StatusModal, title, CloseModal, updateTableData, data, statusUpdate=false }) => {

    const [stateButton, setStateButton] = useState(false);
    const [getData, setData] = useState(data);
	const idRef = useRef(data.id);
    function addNotification(notificationType, notificationTitle, notificationMessage, notificationPosition, duration, icon,notificationContent) {									
        Store.addNotification({
            title: notificationTitle,
            message: (					
                <div>				
                  <i className={icon} style={{ fontSize: '25px', marginRight: '10px' }}></i> {notificationMessage}
                </div>
              ),
            type: notificationType,
            insert: "top",
            container: notificationPosition,
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 8000,			
            },
            content: notificationContent
        });
    }

	const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
	const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
	
    const { register, handleSubmit, unregister, reset, setValue,formState: { errors },getValues} = useForm(); 
   	
    const onSubmit = async (dataTable) =>{ 					
		if (getSelectOficce){
			setSelectOficceStatus(false)	
			/** Se verifica el campo de roles */
			if (getSelectRoles) {
				setSelectRolesStatus(false);														
				if (dataTable.password == dataTable.password_confirmation) {
					setStateButton(true);
					if (dataTable.id == 0 || dataTable.id == "") {
						delete dataTable.id;
						dataTable.office_id = getSelectOficce.id
						axios({
							method: "POST",
							url: process.env.REACT_APP_API_URL+'/api/v1/users',
							data: dataTable,						
							headers: {
								'Content-Type': 'application/json',   
								'Authorization': 'Bearer '+decryptedToken,  
							}						
						}).then( response => {										
							const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));	
							axios({
								method: "PATCH",
								url: process.env.REACT_APP_API_URL+'/api/v1/users/'+response.data.results.id,
								data: {
									roles : arrayIdRoles
								},						
								headers: {
									'Content-Type': 'application/json',   
									'Authorization': 'Bearer '+decryptedToken,  
								}						
							}).then( response => {
								reserForm();
								updateTableData(true);						
								Swal.fire({
									title: "Registro exitoso",
									icon: "success",
									draggable: true,
									timer: 3000,
									confirmButtonColor: "#3085d6",
								});	
							}).catch(error => {
								console.log(error);
								if (error.code == "ERR_BAD_REQUEST") {
									addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
								} else {
									addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
								}               	
							}).finally( () =>{

							});							
						}).catch (error => {
							console.log(error);
							if (error.code == "ERR_BAD_REQUEST") {
								addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
							} else {
								addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
							}               
						}).finally( () =>{
							setStateButton(false);
						}); 
					} else {						
						dataTable.roles = getSelectRoles.map((elemento) => (elemento.id));						
						axios({
							method: "PATCH",
							url: process.env.REACT_APP_API_URL+'/api/v1/users/'+dataTable.id,
							data: dataTable,						
							headers: {
								'Content-Type': 'application/json',   
								'Authorization': 'Bearer '+decryptedToken,  
							}						
						}).then( response => {
								reserForm();
								updateTableData(true);						
								Swal.fire({
									title: "Acualización de datos existoso",
									icon: "success",
									draggable: true,
									timer: 3000,
									confirmButtonColor: "#3085d6",
								});	
						}).catch(error => {
							console.log(error);
							if (error.code == "ERR_BAD_REQUEST") {
								addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
							} else {
								addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
							}               	
						}).finally( () =>{
							setStateButton(false);
						});

					}									
				} else {
					addNotification('warning', 'Verificar las contraseñas', 'Las contraseñas no coincide', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
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
		(data.id === 0)?null:data.office
	);
	const [getSelectOficceStatus, setSelectOficceStatus] = useState(false);
	const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);
	
	const peticionOficce = async (search, pageNumber) =>{
		try{
			setIsLoadingOffice(true);
			const response = await axios.get(process.env.REACT_APP_API_URL+'/api/v1/offices', {
				params: {
				state_id: 1,
				search: search,
				page: pageNumber,
				sort_by: 'id',
				sort_order: 'desc',
				},
				headers: {
				Accept: 'application/json',
				Authorization: 'Bearer '+decryptedToken,
				},
			});
			
		
			/** Se verifica que la pagina actual sea menor a la ultima pagina */
			if ( response.data.results.meta.current_page < response.data.results.meta.last_page ) {
				hasMoreOffice.current = true;
			}	else {
				hasMoreOffice.current = false;
			}	
			
			return response.data.results.data;

		} catch (error) {
			console.log(error)	
			addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
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
			const response = await peticionOficce ("",1);
			setDefaultOptionsOffice(response);
		}
		fetchPeticion();		
	}, []);

	/** Controla el scroll del select office */
	const handleMenuScrollToBottom = async () => {		
		if (hasMoreOffice.current) {		
			pageCurrentOffice.current = pageCurrentOffice.current +  1;
			const newOptions = await peticionOficce(inputValueOffice.current, pageCurrentOffice.current);
			try {
					if (newOptions.length != 0){
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

	const peticionRoles = async (search, pageNumber) =>{
		try{
			setIsLoadingRoles(true);
			const response = await axios.get(process.env.REACT_APP_API_URL+'/api/v1/roles', {
				params: {
				state_id: 1,
				search: search,
				page: pageNumber,
				sort_by: 'id',
				sort_order: 'desc',
				},
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer '+decryptedToken,
				},
			});		
			try {
				/** Se verifica que la pagina actual sea menor a la ultima pagina */
				if ( response.data.results.meta.current_page < response.data.results.meta.last_page ) {
					hasMoreRoles.current = true;
				}	else {
					hasMoreRoles.current = false;
				}	
				return response.data.results.data;
			} catch (error) {	
				hasMoreRoles.current = false;			
				return [];							
			}	
			

		} catch (error) {
			console.log(error)	
			addNotification('info', 'Problema inesperadoOO', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
		} finally {
			setIsLoadingRoles(false);
		}
	}

	/** Buscador de select office, se ejecuta una petición */
	const loadOptionsRoles = async (inputVal, callback) => {	
		inputValueRoles.current = inputVal;
		pageCurrentRoles.current = 1;
		const options = await peticionRoles(inputVal, pageCurrentRoles.current);
		callback(options);
	};

	/** Controla el scroll del select Roles */
	const handleMenuScrollToBottomRoles = async () => {		
		if (hasMoreRoles.current) {		
			pageCurrentRoles.current = pageCurrentRoles.current +  1;
			const newOptions = await peticionRoles(inputValueRoles.current, pageCurrentRoles.current);
			try {
				if (newOptions.length != 0){
					setDefaultOptionsRoles(prev => [...prev, ...newOptions]);
				}	
			} catch (error) {
				
			}
					
		} 
	}

	/** Permite cargar los primeros datos de la pagina 1 (datos roles) */
	useEffect(() => {  
		const fetchPeticion = async () => {
			const response = await peticionRoles ("",1);			
			setDefaultOptionsRoles(response);
		}
		fetchPeticion();		
	}, []);


	function separarValor(valor) {
		let ciComplemento = '';
		let numCi = valor;
	  
		if (valor.includes('-')) {
		  const partes = valor.split('-');
		  numCi = partes[0];
		  ciComplemento = partes[1];		  
		}
	  
		return { ciComplemento, numCi };
	}

	if (data.id !== 0  && statusUpdate && idRef.current != data.id)  {	
		idRef.current = data.id		
		setValue('id',data.id);
		setValue('first_name',data.first_name);
		setValue('last_name',data.last_name);
		setValue('phone_number',data.phone_number);
		setValue('username',data.username);
		setValue('email',data.email);
		const ci = separarValor(data.identity_card);	
		setValue('identity_card', ci.numCi);
		setValue('complement', ci.ciComplemento);
		setValue('issued_by', ( data.issued_by == "") ? "S/E": data.issued_by);	
		unregister("password");
      	unregister("password_confirmation");						
	}
	
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

    return (<>
        <ReactNotifications/>
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
										{...register("id", {	})} 
									/>						
									<input className="form-control" 
										type="text" 															
										id="first_name" 
										placeholder="nombre"
										{...register("first_name", {
												required: "El nombre es obligatorio",
												pattern: {
													value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
													message: "El nombre solo puede contener letras, tildes, espacios, y los caracteres ' y -",
												},
												maxLength: {
												value: 30,
												message: "El nombre no puede tener más de 30 caracteres",
												},
										})} 
									/>
									{errors.first_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
								</div>
								<div className="col-md-6 mb-0 mb-md-0">
								<label className="required form-label" htmlFor="last_name">Apellido (s)</label>
								<input className="form-control" 
									type="text" 							
									id="last_name" 
								//	defaultValue={data.last_name}	
									placeholder="apellidos"
									{...register("last_name", {
											required: "El campo es obligatorio",
											pattern: {
												value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
												message: "El nombre solo puede contener letras, tildes, espacios, y los caracteres ' y -",
											},
											maxLength: {
												value: 30,
												message: "El nombre no puede tener más de 30 caracteres",
											},
									})}  
								/>
								{errors.last_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.last_name.message)}</div>}
								</div>
							</div>
						</div>
						<div className="mb-3">
							<div className="row gx-3">
								<div className="col-md-4 mb-2 mb-md-0">
									<label className="mb-2 required fs-10 fw-bold">C.I.</label>
									<input type="text" 
										className="form-control fs-13px" 
										id="identity_card"
										//defaultValue={ (data.identity_card)? separarValor(data.identity_card): ""}	
										placeholder="celula de identidad"
										{...register("identity_card", {
										required: "Campo obligatoria",
										minLength: {
											value: 6,
											message: "Min. 6 carac.",
										},
										maxLength: {
											value: 8,
											message: "Max. 8 carac.",
										},
										pattern: {
											value: /^[1-9]\d*$/,
											message: "Formato no válido",
										},
										})}
									/>
									{errors.identity_card && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.identity_card.message)}</div>}
								</div>
								<div className="col-md-4 mb-2 mb-md-0">
									<label className="mb-2 fs-10 fw-bold">Complemento</label>
									<input type="text" 
										className="form-control fs-13px" 
										id="complement"
										placeholder="Complemento"
										{...register("complement", {                       
										})}
									/>
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
						<div className="mb-3">
								<label className="required form-label" htmlFor="phone_number"> <i className='fas fa-mobile'></i>&nbsp; Celular</label>
								<input className="form-control"
										type="number" 								
										id="phone_number" 
										//defaultValue={data.phone_number}	
										placeholder="número de celular"
										{...register("phone_number", {
											required: "El número de celular es obligatorio",
												pattern: {
													value: /^(6|7)[0-9]{7}$/,
													message: "El número de teléfono debe comenzar con 6 o 7 y tener 8 dígitos en total",
												},
												maxLength: {
													value: 8,
													message: "El número de teléfono no puede tener más de 8 caracteres",
												},
										})} 
								/>
						</div>	
						{errors.phone_number && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
						<div className="mb-3">
							<label className="required form-label" htmlFor="username"> <i className="fas fa-user"></i> &nbsp; Usuario</label>
							<input className="form-control" 
									type="text"	
									//defaultValue={data.username}								
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
						{  (data.id == 0 || data.id == "") && (
							<>
								<div className="mb-3 position-relative">
										<label className="required form-label" htmlFor="password"><i className="fas fa-key"></i>&nbsp; Contraseña</label>
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
										<label className="required form-label" htmlFor="password_confirmation"> <i className='fas fa-key'></i> &nbsp; Confirmar contraseña</label>
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
							</>)
						}
						<div className="mb-3">
							<label className="required form-label" htmlFor="email"> <i className='fas fa-at'></i> &nbsp; Correo</label>
							<input className="form-control" 
								type="text" 							
								id="email"
							//	defaultValue={data.email} 
								placeholder="correo"
								{...register("email", {
									required: "El correo electrónico es obligatorio",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "El correo electrónico no tiene un formato válido",
									},
								})}
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
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
									onMenuScrollToBottom={handleMenuScrollToBottom}
									onChange={(elemento) => {setSelectOficce(elemento); setSelectOficceStatus(false) } } 
									isLoading={isLoadingOffice}
									placeholder="Seleccione una opción..."									
									defaultValue={data.office}							
								/>
							</div>
						</div>	
						{ (getSelectOficceStatus)? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione alguna oficina</div>): (null) }																																	
						<div className="form-group row mb-3">
							<label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Rol de usuario</label>
							<div className="col-lg-8">
								<AsyncSelect
									cacheOptions
									loadOptions={loadOptionsRoles}
									defaultOptions={defaultOptionsRoles}
									getOptionLabel={(option) => option.name}
									getOptionValue={(option) => option.id}
									isMulti = {true}
									onMenuScrollToBottom={handleMenuScrollToBottomRoles}
									onChange={(elemento) => { setSelectRoles(elemento); setSelectRolesStatus(false); } } 
									isLoading={isLoadingRoles}
									placeholder="Seleccione opción..."	
									defaultValue={data.roles}								
								/>
							</div>
						</div>
						{ (getSelectRolesStatus)? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione un rol</div>): (null) }																																		
					</fieldset>
				</form>		
			</Modal.Body>
			<Modal.Footer>
			<Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
			<Button variant="primary" type='submit' form="myFormUsers"  disabled={stateButton}> {stateButton? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>	
			</Modal.Footer>
		</Modal>
    </>
    );
}

export default CompModalCreateUpdate