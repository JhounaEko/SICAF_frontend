import React, {useState, useRef,useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { get, useForm, } from 'react-hook-form';
<<<<<<< HEAD
import AsyncSelect from 'react-select/async';
=======
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 
import { ReactNotifications, Store } from 'react-notifications-component';
<<<<<<< HEAD
import {addNotification} from './../../../components/alert/alert.jsx';
import modelUseListPermition, {modelUseCreateRol, modelUseUpdateRol} from './../modelRoles.jsx';

const CompModalCreateUpdate = ( {StatusModal, title, CloseModal, updateTableData, data, statusUpdate=false }) => {


    const useCreateRol = modelUseCreateRol();
    const useListPermition = modelUseListPermition();
    const useUpdateRol = modelUseUpdateRol();

    const [stateButton, setStateButton] = useState(false);
    const [getData, setData] = useState(data);
    const idRef = useRef(data.id);    


/** begin select 2 */
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [defaultOptionsRoles, setDefaultOptionsRoles] = useState([]);
    const [getSelectRoles, setSelectRoles] = useState(false);
    const [getSelectRolesStatus, setSelectRolesStatus] = useState(false);
    const pageCurrentRoles = useRef(1);
    const inputValueRoles = useRef('');
    const hasMoreRoles = useRef(true);	

    const peticionPermisos = async (search, pageNumber) =>{
        try {
            const dataReturn = await useListPermition(search, pageNumber);          
            try {
				/** Se verifica que la pagina actual sea menor a la ultima pagina */
				if ( dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page ) {
					hasMoreRoles.current = true;
				}	else {
					hasMoreRoles.current = false;
				}	
				return dataReturn.response.data.results.data;
			} catch (error) {	
				console.log(error);						
				return [];							
			}
        } catch (error) {
            console.log(error);						
			return [];	
        }
        
    }

    const handleMenuScrollToBottomRoles = async () => {		
		if (hasMoreRoles.current) {		
			pageCurrentRoles.current = pageCurrentRoles.current +  1;
			const newOptions = await peticionPermisos(inputValueRoles.current, pageCurrentRoles.current);
			try {
				if (newOptions.length != 0){
					setDefaultOptionsRoles(prev => [...prev, ...newOptions]);
				}	
			} catch (error) {
				
			}					
		} 
	}

    useEffect(() => {  
        const fetchPeticion = async () => {
            const dataReturn = await peticionPermisos ("",1);			          
            setDefaultOptionsRoles(dataReturn);
        }
        fetchPeticion();		
    }, []);
    const loadDataSearchOptionsPermisos = async (inputVal, callback) => {	
		inputValueRoles.current = inputVal;
		pageCurrentRoles.current = 1;
		const options = await peticionPermisos(inputVal, pageCurrentRoles.current);
		callback(options);
	};
/** end select2 */

=======

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

>>>>>>> e464a07204caecf46f0420f777c383f669747af4
    const { register, handleSubmit, reset, setValue,formState: { errors },getValues} = useForm(
        {
            defaultValues: {
				id: data.id ? data.id : 0  ,
				name: data.name ? data.name : "" ,						
			}           
        }        
    );       

    if (data.id !== 0 && idRef.current != data.id)  {
<<<<<<< HEAD
        idRef.current = data.id; 
        setSelectRoles(data.permissions);
        setValue('id',data.id);
        setValue('name',data.name);
    }

    const onSubmit = async (dataTable) =>{ 
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	 
        if (getSelectRoles.length != 0){
            if ( data.id === 0 ) {
                delete dataTable.id;            
                setStateButton(true);
                const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
                dataTable.permissions = arrayIdRoles;
                const returnData = await useCreateRol(dataTable);
                if (returnData.status){
                    reserForm();
                    updateTableData(true);
                    Swal.fire({
                        title: "Registro exitoso",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                }
                setStateButton(false);
            } else {   
                const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
                dataTable.permissions = arrayIdRoles;                           
                setStateButton(true);
                const dataReturn = await useUpdateRol(dataTable);
                if(dataReturn.status){
                    Swal.fire({
                        title: "Se actualizo los datos",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                    reserForm();
                    updateTableData(true);
                }                  
                setStateButton(false);         
            }
        } else {
            addNotification('info', 'Aviso', 'Seleccione los permisos para el rol','top-right',8000, "fas fa-exclamation-circle" ,null)  			            
        }  
          
      
    }

    const reserForm = () => {
        setSelectRoles([]);	
=======
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
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
        idRef.current = 0;	
        CloseModal();
		reset();		
	};

    return (<>
        <ReactNotifications/>
<<<<<<< HEAD
        <Modal   show={StatusModal} size="xl" centered={true}  backdrop="static" scrollable={true} onHide={reserForm} >
            <Modal.Header closeButton>
            <Modal.Title ><h4 className="modal-title">{title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '350px' }} >            
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
                        
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Seleccione los permisos:</label>	
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadDataSearchOptionsPermisos}
                                defaultOptions={defaultOptionsRoles}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isMulti = {true}
                                onMenuScrollToBottom={handleMenuScrollToBottomRoles}
                                onChange={(elemento) => { setSelectRoles(elemento); setSelectRolesStatus(true); } } 
                                isLoading={isLoadingRoles}
                                placeholder="Seleccione opción..."	
                                defaultValue={data.permissions}								
                            />
                        </div>
                     
                    </fieldset>
                </form>		
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={reserForm}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormUsers"  disabled={stateButton}> {stateButton? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-save"></i>)} 
                &nbsp; Guardar </Button>	
            </Modal.Footer>
=======
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
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
    </Modal>
    </>
    );
}

export default CompModalCreateUpdate