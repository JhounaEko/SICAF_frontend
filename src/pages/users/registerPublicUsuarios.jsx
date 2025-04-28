import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ReactNotifications, Store } from 'react-notifications-component';
import { get, useForm, } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
function RegisterPublicUser() {
  
    const { register, handleSubmit, reset, setValue, formState: { errors },getValues} = useForm(
            {
                defaultValues: {                  
                    first_name: "" ,
                    last_name: "" ,
                    complement: "",
                    identity_card:"",
                    issued_by : "S/E",
                    phone_number: "" ,
                    username: "" ,	
                    password: "" ,	
                    password_confirmation: "" ,	
                    email: "",						
                }           
            }        
        ); 
    const navigate = useNavigate();
 
  const [stateButton, setStateButton] = useState(false);
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

          const [redirect, setRedirect] = useState(false);
          if (redirect) {          
            return <Navigate to="/" />;
          }

  const onSubmit = (dataForm) => {
    if (dataForm.password === dataForm.password_confirmation) {
        dataForm.office_id = 126;
        dataForm.state_id = 2;
        setStateButton(true);     
        axios({
            method: "POST",
            url: process.env.REACT_APP_API_URL+'/api/v1/register',
            data: dataForm,						
            headers: {
              'Content-Type': 'application/json',   
            }						
        }).then( response => { 
            reset();
            Swal.fire({
              title: "Su registro fue exitoso",
              text: "Estimado "+dataForm.first_name+", el transcurso del dia se le habilitara el ingreso al sistema.",
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
        }).catch( error => {
          if (error.code == "ERR_BAD_REQUEST") {   
            Swal.fire({
              title: "Aviso",
              text: "Estimado "+dataForm.first_name+", ´"+error.response.data.message+"´",
              icon: "warning",
              draggable: true,
              timer: 10000,
              timerProgressBar: true,
              confirmButtonColor: "#3085d6",             
            });
          } else {            
            addNotification('danger', 'Server', " "+error.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
          }
          console.log(error);          
        }).finally(() =>{
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
  };

 

    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
    const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false); 
    const togglePasswordVisibilityConfirmar = () => { setShowPasswordConfirmar(!showPasswordConfirmar); };

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
                            required: "El nombre es obligatorio",
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
                    <input type="text" 
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
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-mobile'></i>&nbsp; Celular</label>
              <input type="number" 
                    className="form-control fs-13px" 
                    placeholder="número de celular"
                    {...register("phone_number", {
                        required: "El número de celular es obligatorio",
                        pattern: {
                            value: /^(6|7)[0-9]{7}$/,
                            message: "El teléfono debe comenzar con 6 o 7 y tener 8 dígitos.",
                        },
                        maxLength: {
                            value: 8,
                            message: "El número de teléfono no puede tener más de 8 caracteres",
                        },
                    })}
                />
                {errors.phone_number && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
            </div>
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-at'></i> &nbsp;Correo</label>
              <input type="text" 
                     className="form-control fs-13px" 
                     placeholder="correo electrónico"
                     id = "email"
                     {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "El correo electrónico no tiene un formato válido",
                        },  
                     })} 
                />
                {errors.email && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.email.message)}</div>}	
            </div>
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold"> <i className="fas fa-user"></i> &nbsp;Usuario </label>
              <input type="text" 
                    className="form-control fs-13px" 
                    placeholder="usuario"
                    id="username"
                    {...register("username", {
                        required: "El nombre de usuario es obligatorio",
                        maxLength: {
                        value: 30,
                        message: "El nombre de usuario no puede tener más de 30 caracteres",
                        },})}	 />
                    {errors.username && <div className='mb-0 mt-2 fs-12px my-0' style={{ color: 'red' }}>{String(errors.username.message)}</div>}	
            </div>
            <div className = {`${errors.password ? 'mb-0' : 'mb-3' } position-relative`}>
              <label className="mb-2 required fs-10 fw-bold"> <i className="fas fa-key"></i>&nbsp;Contraseña </label>
              <input type={showPassword ? "text" : "password"} 
                    className="form-control fs-13px" 
                    placeholder="contraseña"
                    id="password"
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
                    })}   />
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

            <div className = {`${errors.password_confirmation ? 'mb-0' : 'mb-3' } position-relative`}>
              <label className="mb-2 required fs-10 fw-bold"><i className="fas fa-key"></i>&nbsp; Confirmar contraseña</label>
              <input type={showPasswordConfirmar ? "text" : "password"}  
                     className="form-control fs-13px" 
                     placeholder="ingrese su contraseña nuevamente"
                     id="password_confirmation" 
                     {...register("password_confirmation", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres",
                        },																				
                    })} 	
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
         
            <div className="mb-4">
              <button type="submit" className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px"  form="myFormUsersPublic"  disabled={stateButton}> {stateButton? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-paper-plane fa-1_5x"></i>)}  &nbsp;  Enviar datos</button>
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