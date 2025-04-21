import React,{ useState, useEffect, useRef} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useForm } from 'react-hook-form';
import {modelUseCreate , modelChageDataRow}  from './../modelEmpleados.jsx';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import { ReactNotifications } from 'react-notifications-component';
import {addNotification} from './../../../components/alert/alert.jsx';
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import Cookies from 'js-cookie';

const CompModalCreateUpdate = ({StatusModal,CloseModal,title, dataCurrentRow,functionRefreschDataTable}) => {

    const useCreate = modelUseCreate();
     const useChangeDataRow  = modelChageDataRow (); 
    const idRef = useRef(dataCurrentRow.id);
    const { register,handleSubmit, reset, setValue,formState: { errors }} = useForm(); 
        
    const onSubmit = async (dataForm) =>{ 	
        
        if (getSelectOficce){
			setSelectOficceStatus(false)	
            setStateButton(true);
                /** Se utiliza para crear permiso, cuando se pulsa en boton guardar */
                if ( dataForm.id == 0 ){
                    dataForm.office_id = getSelectOficce.id       
                    const result = await useCreate(dataForm); 
                    if (result.status){
                        reserForm();
                        functionRefreschDataTable();  
                        Swal.fire({
                            title: "Registro exitoso",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        addNotification('info', result.title, result.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                    }  
                /** Se utiliza para modificar datos permiso, cuando se pulsa en el boton guardar */
                } else {                    
                   // dataForm.office_id = getSelectOficce.id                 
                    const result = await useChangeDataRow(dataForm);
                    if (result.status){
                        reserForm();
                        functionRefreschDataTable();
                        Swal.fire({
                            title: "Datos actualizado correctamente",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        addNotification('info', result.title, result.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			     
                    }              
                }
        } else  {
            setSelectOficceStatus(true)	
        }
            setStateButton(false);                     
    }


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;	
        reset();
        setSelectOficce(null);
        CloseModal();         	      
	};

    if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id){       
        idRef.current = dataCurrentRow.id;
        setValue('id',dataCurrentRow.id);
        setValue('first_name',dataCurrentRow.first_name);  
        setValue('last_name',dataCurrentRow.last_name); 
        setValue('phone_number',dataCurrentRow.phone_number); 
        setValue('position',dataCurrentRow.position);           
    }

    useEffect(() => {	
        if (dataCurrentRow.office) {
          setSelectOficce(dataCurrentRow.office);
        }
        console.log(dataCurrentRow.office);
    }, [dataCurrentRow.office]);
    /** ============================================ Select Office ========================================*/

    const pageCurrentOffice = useRef(1);
    const inputValueOffice = useRef('');
    const hasMoreOffice = useRef(true);
    const [isLoadingOffice, setIsLoadingOffice] = useState(false);
    const [getSelectOficce, setSelectOficce] = useState(
        (dataCurrentRow.id === 0)?null:dataCurrentRow.office
    );
    const [getSelectOficceStatus, setSelectOficceStatus] = useState(false);
    const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);
    
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
	const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         

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
			if (response.data.results.data){
				return response.data.results.data;
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

    return ( <>
        <ReactNotifications/>
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fas fa-briefcase fa-1_5x"></i> {title}</h4></Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormCargo">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">	
                            <div className="row gx-2">
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="first_name">Nombre de empleado</label>	
                                    <input className="form-control" 
                                        type="hidden" 																		
                                        id="id" 
                                        defaultValue={dataCurrentRow.id}
                                        placeholder=""
                                        {...register("id", {	})} 
                                    />
                                    <input className="form-control" 
                                        type="text" 															
                                        id="first_name"                                
                                        placeholder="nombre cargo"
                                        {...register("first_name", {
                                            required: "El nombre es obligatorio",
                                            maxLength: {
                                            value: 60,
                                            message: "El nombre no puede tener más de 60 caracteres",
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "El nombre no puede tener menos de 4",
                                            },
                                            pattern: {
                                            value: /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-.,]{0,98}[0-9]{0,2}$/,
                                            message: "Nombre inválido: letras, tildes, guiones, puntos, comas, y hasta 2 números al final",
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
									<label className="mb-2 fs-10 fw-bold">C.I.</label>
									<input type="text" 
										className="form-control fs-13px" 
										id="identity_card"
										placeholder="celula de identidad"
										// {...register("identity_card", {
										// required: "Campo obligatoria",
										// minLength: {
										// 	value: 6,
										// 	message: "Min. 6 carac.",
										// },
										// maxLength: {
										// 	value: 8,
										// 	message: "Max. 8 carac.",
										// },
										// pattern: {
										// 	value: /^[1-9]\d*$/,
										// 	message: "Formato no válido",
										// },
										// })}
									/>
									{/* {errors.identity_card && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.identity_card.message)}</div>} */}
								</div>
								<div className="col-md-4 mb-2 mb-md-0">
									<label className="mb-2 fs-10 fw-bold">Complemento</label>
									<input type="text" 
										className="form-control fs-13px" 
										id="complement"
										placeholder="Complemento"
										// {...register("complement", {                       
										// })}
									/>
								</div>
								<div className="col-md-4">
									<label className="mb-2 fs-10 fw-bold">Expedido </label>
									<select
										id="issued_by"
										className="form-select fs-13px"
										defaultValue="S/E"  
										// {...register("issued_by", {
										// 	required: "Campo obligatorio",                      
										// })}
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
									{/* {errors.issued_by && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.issued_by.message)}</div>} */}
								</div>
							</div>
						</div> 
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-6 mb-2 mb-md-0">  
                                    <label className="required form-label" htmlFor="position"> <i className='fas fa-mobile'></i>&nbsp; Cargo</label>
								    <input className="form-control"
										type="text" 								
										id="position" 									
										placeholder="cargo"
										{...register("position", {
											required: "El número campo es obligatorio",											
										})} 
								    />
                                    {errors.position && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.position.message)}</div>}
                                </div>
                                <div className="col-md-6 mb-2 mb-md-0"> 
                                    <label className="required form-label" htmlFor="phone_number"> <i className='fas fa-mobile'></i>&nbsp; Celular</label>
								    <input className="form-control"
										type="number" 								
										id="phone_number" 								
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
                                    {errors.phone_number && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
                                </div>
                            </div>          
                        </div> 
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
									defaultValue={dataCurrentRow.office}							
								/>
							</div>
                            { (getSelectOficceStatus)? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione alguna oficina</div>): (null) }																																	
						</div>                                        
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormCargo"  disabled={stateButton}> {stateButton? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>	
			</Modal.Footer>
		</Modal>
    </> );
}
 
export default CompModalCreateUpdate;