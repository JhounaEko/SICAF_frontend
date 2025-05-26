import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ReactNotifications, Store } from 'react-notifications-component';
import { useForm, } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { validacionesFirstName, validacionesLastName, validacionesCI, validacionPassword } from '../../components/validaciones/validacionesModUsers.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import {modelUseListSelectOfficeLocation} from './../oficinas/modelOficina.jsx';
import {modelUseListRol} from './../roles/modelRoles.jsx';

function RegisterPublicUser() {
  const useListSelectOfficeLocation = modelUseListSelectOfficeLocation();
  const useListRol = modelUseListRol();
  const { register, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm(
    {
      defaultValues: {
        first_name: "",
        last_name: "",
        complement: "",
        identity_card: "",
        issued_by: "S/E",
        phone_number: "",
        username: "",
        password: "",
        password_confirmation: "",
        email: "",
      }
    }
  );
  const navigate = useNavigate();

  const [stateButton, setStateButton] = useState(false);
  function addNotification(notificationType, notificationTitle, notificationMessage, notificationPosition, duration, icon, notificationContent) {
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

  const [redirect, setRedirect] = useState(false);
  if (redirect) {
    return <Navigate to="/" />;
  }

  const onSubmit = (dataForm) => {
    if (getSelectOficce){      
      setSelectOficceStatus(false);

      if (getSelectRoles) {
        setSelectRolesStatus(false);
        if (dataForm.password === dataForm.password_confirmation) {
          dataForm.office_location_id = getSelectOficce.id;
          dataForm.state_id = 2;
          const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
          dataForm.roles = arrayIdRoles;       
          setStateButton(true);    
            axios({
              method: "POST",
              url: process.env.REACT_APP_API_URL + '/api/v1/register',
              data: dataForm,
              headers: {
                'Content-Type': 'application/json',
              }
            }).then(response => {
              reset();
              Swal.fire({
                title: "Su registro fue exitoso",
                text: "Estimado " + dataForm.first_name + ", el transcurso del dia se le habilitara el ingreso al sistema.",
                icon: "success",
                draggable: true,
                timer: 10000,
                timerProgressBar: true,
                confirmButtonColor: "#3085d6",
                allowOutsideClick: false,
                allowEscapeKey: false,
                willClose: () => {
                  navigate('/');
                }
              }).then((result) => {
                navigate('/');
              });
            }).catch(error => {
              if (error.code == "ERR_BAD_REQUEST") {
                Swal.fire({
                  title: "Aviso",
                  text: "Estimado " + dataForm.first_name + ", ´" + error.response.data.message + "´",
                  icon: "warning",
                  draggable: true,
                  timer: 10000,
                  timerProgressBar: true,
                  confirmButtonColor: "#3085d6",
                });
              } else {
                addNotification('danger', 'Server', " " + error.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
              }
              console.log(error);
            }).finally(() => {
              setStateButton(false);
            });      
        } else {
          Swal.fire({
            title: "Verifique las contraseñas",
            icon: "warning",
            draggable: true,
            timer: 4000,
            confirmButtonColor: "#3085d6",
          });
        }
      } else {
        setSelectRolesStatus(true);
      }
    } else {
      setSelectOficceStatus(true)
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
  const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);
  const togglePasswordVisibilityConfirmar = () => { setShowPasswordConfirmar(!showPasswordConfirmar); };

  /** ============================================ Select Office ========================================*/
    const pageCurrentOffice = useRef(1);
    const inputValueOffice = useRef('');
    const hasMoreOffice = useRef(true);
    const [isLoadingOffice, setIsLoadingOffice] = useState(false);
    const [getSelectOficce, setSelectOficce] = useState();
    const [getSelectOficceStatus, setSelectOficceStatus] = useState(false);
    const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);

    const peticionOficce = async (search, pageNumber) =>{
        try{
          setIsLoadingOffice(true);
          const returnData = await useListSelectOfficeLocation(search,pageNumber);	
          /** Se verifica que la pagina actual sea menor a la ultima pagina */				
          if (returnData.status){
            if ( returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page ) {
              hasMoreOffice.current = true;
            }	else {
              hasMoreOffice.current = false;
            }	
            if (returnData.response.data.results.data){
              return returnData.response.data.results.data;
            } else {
              return [];
            }	
          } else {				          
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
    const fetchPeticionOffice = async () => {
        const response = await peticionOficce ("",1);
        setDefaultOptionsOffice(response); 
    }

    const fetchPeticionRoles = async () => {	
				const response = await peticionRoles ("",1);			
				setDefaultOptionsRoles(response);		
		}		
		fetchPeticionOffice();
    fetchPeticionRoles();		
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
        const returnData = await useListRol(pageNumber,/**getCountRows = */ 10, search);					
        try {
          /** Se verifica que la pagina actual sea menor a la ultima pagina */
          if (returnData.status) {
            if ( returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page ) {
              hasMoreRoles.current = true;
            }	else {
              hasMoreRoles.current = false;
            }	
            return returnData.response.data.results.data;
          } else{
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

  const generarUserPassword = () =>{	
    
      const nombre = getValues('first_name')     
      if (!nombre) return addNotification('info', 'Campo nombre', validacionesFirstName.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (!validacionesFirstName.pattern.value.test(nombre)) return addNotification('info', 'Campo nombre', validacionesFirstName.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (nombre.length > validacionesFirstName.maxLength.value) return addNotification('info', 'Campo nombre', validacionesFirstName.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
  
      const last_name = getValues('last_name')
      if (!last_name) return addNotification('info', 'Campo apellido', validacionesFirstName.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (!validacionesFirstName.pattern.value.test(last_name)) return addNotification('info', 'Campo apellido', validacionesFirstName.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (last_name.length > validacionesFirstName.maxLength.value) return addNotification('info', 'Campo apellido', validacionesFirstName.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
  
      const ci = getValues('identity_card');
      if (!ci) return addNotification('info','Campo C.I.', validacionesCI.required, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (ci.length < validacionesCI.minLength.value) return addNotification('info', 'Campo C.I.', validacionesCI.minLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (ci.length > validacionesCI.maxLength.value) return addNotification('info', 'Campo C.I.', validacionesCI.maxLength.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
      if (!validacionesCI.pattern.value.test(ci)) return addNotification('info', 'Campo C.I.', validacionesCI.pattern.message, 'top-right', 8000, 'fas fa-exclamation-circle', null);
  
      const apellido = (last_name.trim()).split(' ');
      const firt_name = (nombre.trim()).split(' ');			
      setValue('password_confirmation', ci);
      setValue('password', ci);
      setValue('username',firt_name[0]+"."+apellido[0]);
    }

  return (
    <div className="register register-with-news-feed">
      <ReactNotifications />
      <div className="news-feed">
        <div className="news-image" style={{ backgroundImage: `url(/assets/img/img-03.jpeg` }}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>S.I.C.</b>A.F.</h4>
          <p>
            Sistemas de Información y Control de Activos Fijos
          </p>
        </div>
      </div>
      <div className="register-container">
        <div className="register-header mb-25px h1">
          <div className="mb-1">Crear Cuenta</div>
          {/* <div className="mb-1" style={{fontSize:'18px'}}>Solo para personal administrativo</div> */}
          <small className="d-block fs-15px lh-16">Solo para personal administrativo</small>
        </div>
        <div className="register-content">
          <form onSubmit={handleSubmit(onSubmit)} className="fs-13px" id="myFormUsersPublic">
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold">Nombre(s) Apellido(s) </label>
              <div className="row gx-3">
                <div className="col-md-6 mb-2 mb-md-0">
                  <input type="text"
                    className="form-control fs-13px"
                    id="first_name"
                    placeholder="nombre"
                    {...register("first_name", {
                      required: "El campo es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
                        message: "El nombre solo puede contener letras",
                      },
                      maxLength: {
                        value: 30,
                        message: "máximo 30 caracteres",
                      },
                    })} />
                  {errors.first_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
                </div>
                <div className="col-md-6">
                  <input type="text"
                    className="form-control fs-13px"
                    placeholder="apellidos"
                    id="last_name"
                    {...register("last_name", {
                      required: "El campo es obligatorio",
                      pattern: {
                        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
                        message: "El nombre solo puede contener letras",
                      },
                      maxLength: {
                        value: 30,
                        message: "Máximo 30 caracteres",
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
                  <input type="number"
                    className="form-control fs-13px"
                    id="identity_card"
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
                    })}
                  >
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
            <div className="row gx-2">
              <div className="col-md-6 mb-2 mb-md-0">
                <div className="mb-3">
                  <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-mobile'></i>&nbsp; Celular</label>
                  <input type="number"
                    className="form-control fs-13px"
                    placeholder="número de celular"
                    {...register("phone_number", {
                      required: "El campo es obligatorio",
                      pattern: {
                        value: /^(6|7)[0-9]{7}$/,
                        message: "Debe iniciar con 6 o 7 y tener 8 dígitos.",
                      },
                      maxLength: {
                        value: 8,
                        message: "Máximo 8 dígitos.",
                      },
                    })}
                  />
                  {errors.phone_number && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
                </div>
              </div>
              <div className="col-md-6 mb-2 mb-md-0">
                <div className="mb-3">
                  <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-at'></i> &nbsp;Correo</label>
                  <input type="text"
                    className="form-control fs-13px"
                    placeholder="correo electrónico"
                    id="email"
                    {...register("email", {
                      required: "El campo es obligatorio.",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Correo no válido.",
                      },
                    })}
                  />
                  {errors.email && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.email.message)}</div>}
                </div>
              </div>
            </div>
            <div className="mb-3 position-relative">
              <label className="mb-2 required fs-10 fw-bold"> <i className="fas fa-user"></i> &nbsp;Usuario </label>
              <div className="m-0 p-0 position-relative">
                <input type="text"
                  className="form-control fs-13px"
                  placeholder="usuario"
                  id="username"
                  {...register("username", {
                    required: "El nombre de usuario es obligatorio",
                    maxLength: {
                      value: 30,
                      message: "El nombre de usuario no puede tener más de 30 caracteres",
                    },
                  })} />
                <i         
                  onClick={ () => generarUserPassword()}    
                  title="Generar usuario y contraseña"    
                  className="fas fa-magic fa-1_5x"       
                  style={{
                    color: '#008080',
                    position: 'absolute',
                    right: '10px',
                    top: '60%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                  }}
                />
              </div>
              {errors.username && <div className='mb-0 mt-2 fs-12px my-0' style={{ color: 'red' }}>{String(errors.username.message)}</div>}
            </div>
            <div className={`${errors.password ? 'mb-0' : 'mb-3'} position-relative`}>
              <label className="mb-2 required fs-10 fw-bold"> <i className="fas fa-key"></i>&nbsp;Contraseña </label>
              <input type={showPassword ? "text" : "password"}
                className="form-control fs-13px"
                placeholder="contraseña"
                id="password"
                {...register("password", validacionPassword)} />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
                onClick={togglePasswordVisibility}
                style={{
                  color: '#008080',
                  position: 'absolute',
                  right: '10px',
                  top: '75%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              />
            </div>
            {errors.password && <div className='mt-2 fs-12px mb-2 ' style={{ color: 'red' }}>{String(errors.password.message)}</div>}

            <div className={`${errors.password_confirmation ? 'mb-0' : 'mb-3'} position-relative`}>
              <label className="mb-2 required fs-10 fw-bold"><i className="fas fa-key"></i>&nbsp; Confirmar contraseña</label>
              <input type={showPasswordConfirmar ? "text" : "password"}
                className="form-control fs-13px"
                placeholder="ingrese su contraseña nuevamente"
                id="password_confirmation"
                {...register("password_confirmation", validacionPassword)}
              />
              <i
                className={`fas ${showPasswordConfirmar ? 'fa-eye-slash fa-1_5x' : 'fa-eye fa-1_5x'}`}
                onClick={togglePasswordVisibilityConfirmar}
                style={{
                  color: '#008080',
                  position: 'absolute',
                  right: '10px',
                  top: '75%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              />
            </div>
            {errors.password_confirmation && <div className='mb-3 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.password_confirmation.message)}</div>}
            <div className="form-group row mb-3">
							<label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Oficina</label>
							<div className="col-lg-8">
								<AsyncSelect
									cacheOptions
									loadOptions={loadOptionsOffice}
									defaultOptions={defaultOptionsOffice}
									getOptionLabel={(option) =>(<div>
										<div><strong>{option.office?.name}</strong></div>
										<div style={{ fontSize: '12px', color: '#666' }}>{option.place?.description}</div>
									  </div>)}
									getOptionValue={(option) => option.id}
									onMenuScrollToBottom={handleMenuScrollToBottom}
									onChange={(elemento) => {setSelectOficce(elemento); setSelectOficceStatus(false) } } 
									isLoading={isLoadingOffice}
									placeholder="Seleccione una opción..."																			
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
								/>
							</div>
						</div>
						{ (getSelectRolesStatus)? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione un rol</div>): (null) }

            <div className="mb-4">
              <button type="submit" className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px" form="myFormUsersPublic" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-paper-plane fa-1_5x"></i>)}  &nbsp;  Enviar datos</button>
            </div>
            <div className="mb-4 pb-5">
              Ya tengo una cuenta? Haz <Link to="/">click</Link> para iniciar sesion
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <p className="text-center text-gray-600">
              &copy; Copy Right Reserved 2025
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPublicUser;