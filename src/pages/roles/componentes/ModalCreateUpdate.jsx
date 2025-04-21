import React, {useState, useRef,useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { get, useForm, } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 
import { ReactNotifications, Store } from 'react-notifications-component';

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

    const { register, handleSubmit, reset, setValue,formState: { errors },getValues} = useForm(
        {
            defaultValues: {
				id: data.id ? data.id : 0  ,
				name: data.name ? data.name : "" ,						
			}           
        }        
    );       

    if (data.id !== 0 && idRef.current != data.id)  {
        idRef.current = data.id;
        setValue('id',data.id);
        setValue('name',data.name);
     }

    const onSubmit = (dataTable) =>{ 
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        if ( data.id === 0 ) {
            delete dataTable.id;
            setStateButton(true);
            axios({
                method: "POST",
                url: process.env.REACT_APP_API_URL+'/api/v1/roles',
                data: dataTable,						
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

            }).catch (error => {
                if (error.code === "ERR_BAD_RESPONSE" && error.response.data.message === "An error occurred while registering the role.") {
                    addNotification('info', 'Aviso', 'El rol ya esta registrado', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                } else {
                    addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                }               
            }).finally( () =>{
                setStateButton(false);
            }); 
        } else {                      
            setStateButton(true);
            axios({
                method: "PATCH",
                url: process.env.REACT_APP_API_URL+'/api/v1/roles/'+dataTable.id,
                data: {
                    'name':dataTable.name
                },						
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': 'Bearer '+decryptedToken,  
                }						
            }).then( response => {
                reserForm();
                updateTableData(true);
                setData({
                    id: data.id,
                    name: dataTable.name
                })    
                Swal.fire({
                    title: "Edición de exitoso",
                    icon: "success",
                    draggable: true,
                    timer: 3000,
                    confirmButtonColor: "#3085d6",
                });
            }).catch (error => {
                if (error.code === "ERR_BAD_RESPONSE" && error.response.data.message === "An error occurred while registering the role.") {
                    addNotification('info', 'Aviso', 'El rol ya esta registrado', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                } else {
                    addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                } 
                console.log(error);              
            }).finally( () =>{
                setStateButton(false);
            }); 
        }
      
    }

    const reserForm = () => {	
        idRef.current = 0;	
        CloseModal();
		reset();		
	};

    return (<>
        <ReactNotifications/>
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
        <Modal.Title><h4 className="modal-title">{title}</h4></Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)} id="myFormUsers">					
                <fieldset>
                    <legend className="mb-3"></legend>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="name">Nombre de rol:</label>	
                        <input className="form-control" 
                            type="hidden" 															
                            id="id" 
                            defaultValue={data.id}
                            placeholder="nombre"
                            {...register("id", {	})} 
                        />						
                        <input className="form-control" 
                            type="text" 															
                            id="name"  
                            defaultValue={data.name}                          
                            placeholder="nombre"
                            {...register("name", {
                                    required: "El nombre es obligatorio",
                                    pattern: {
                                    value: /^[a-zA-Z\s]+$/u,
                                    message: "Solo se permite texto",
                                    },
                                    minLength: {
                                    value: 4,
                                    message: "El nombre debe tener al menos 4 caracteres",
                                    },
                            })} 
                        />
                    </div>
                    {errors.name && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>}                
                </fieldset>
            </form>		
        </Modal.Body>
        <Modal.Footer>
        <Button className='btn btn-danger' onClick={reserForm}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
        <Button variant="primary" type='submit' form="myFormUsers"  disabled={stateButton}><i className="fas fa-save"></i>  
        &nbsp; Guardar </Button>	
        </Modal.Footer>
    </Modal>
    </>
    );
}

export default CompModalCreateUpdate