import React,{ useState, useEffect, useRef} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {useForm } from 'react-hook-form';
import {modelUseCreate , modelUseListSelect, modelChageDataRow}  from './../modelOficina.jsx';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import { ReactNotifications } from 'react-notifications-component';
import {addNotification} from './../../../components/alert/alert.jsx';
const CompModalCreateUpdate = ({StatusModal,CloseModal,title, dataCurrentRow,functionRefreschDataTable}) => {

    const useCreate = modelUseCreate();
    const useListSelect = modelUseListSelect();
     const useChangeDataRow  = modelChageDataRow (); 
    const idRef = useRef(dataCurrentRow.id);
    const { register,handleSubmit, unregister, reset, setValue,formState: { errors }} = useForm(); 

    
    
    const onSubmit = async (dataForm) =>{ 	         
        let refPeticion = false;
        if (dataForm.level != 1 ){
            if (getSelectOficce.id != 0){
                dataForm.parent = getSelectOficce.id;     
                refPeticion = true;
            } else {
                addNotification('info', "Aviso","Seleccione la dependencia", 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                refPeticion = false;
            }
        } else {
            dataForm.parent = null;
            refPeticion = true;
        }

        if (refPeticion){
            setStateButton(true);
            /** Se utiliza para crear oficina, cuando se pulsa en boton guardar */
            if ( dataForm.id == 0 ){
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
            /** Se utiliza para modificar datos oficina, cuando se pulsa en el boton guardar */
            } else {
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
            setStateButton(false);             
        }
    }


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;	
        reset();
        CloseModal();
        setSelectOficce({id:0});        	
        setSelectLevels("");
	};

    const [selecLevels, setSelectLevels] =  useState("");

    /** Select 2 oficinas */
    const peticionOfficeSelect = async (search, pageNumber) =>{
        setIsLoadingOffice(true);
        const dataReturn = await useListSelect(search, pageNumber);
        if (dataReturn.status){
            /** Se verifica que la pagina actual sea menor a la ultima pagina */
			if ( dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page ) {
				hasMoreOffice.current = true;
			}	else {
				hasMoreOffice.current = false;
			}
            setIsLoadingOffice(false);
            return dataReturn.response.data.results.data;            
        } else {
			addNotification('info', dataReturn.title, dataReturn.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            setIsLoadingOffice(false);
            return [];
        }        
    }
    const hasMoreOffice = useRef(true);
    const inputValueOffice = useRef('');
    const pageCurrentOffice = useRef(1);
    const [isLoadingOffice, setIsLoadingOffice] = useState(false);
    const [getSelectOficce, setSelectOficce] = useState({id: 0});
    const [getSelectOficceDependencia, setSelectOficceDependencia] = useState(false);
    const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);
    const handleMenuScrollToBottom = async () => {		
		if (hasMoreOffice.current) {		
			pageCurrentOffice.current = pageCurrentOffice.current +  1;
			const newOptions = await peticionOfficeSelect(inputValueOffice.current, pageCurrentOffice.current);
			try {
					if (newOptions.length != 0){
					setDefaultOptionsOffice(prev => [...prev, ...newOptions]);
					}			
			} catch (error) {
                    addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
			}	
		}
	}

    const loadOptionsOfficeSearch = async (inputVal, callback) =>{
        inputValueOffice.current = inputVal;
        pageCurrentOffice.current = 1;
        const options = await peticionOfficeSelect(inputVal, pageCurrentOffice.current);
        callback(options);
    }    

    useEffect(() => {  
        const fetchPeticion = async () => {
            const response = await peticionOfficeSelect ("",1);
            setDefaultOptionsOffice(response);
        }
        fetchPeticion();		
    }, []);

    if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id){
        idRef.current = dataCurrentRow.id;
        setValue('id',dataCurrentRow.id);
        setValue('name',dataCurrentRow.name);
        setValue('level',dataCurrentRow.level);   
        setValue('initials',dataCurrentRow.initials);  
        if (dataCurrentRow.level != 0 || dataCurrentRow.level !=1){
            setSelectLevels(dataCurrentRow.level);
            setSelectOficce(dataCurrentRow.parent);       
        }
    }

    return ( <>
        <ReactNotifications/>
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fas fa-briefcase fa-1_5x"></i> {title}</h4></Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormOficce">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">	
                            <label className="required form-label" htmlFor="name_office">Nombre de la oficina</label>	
                            <input className="form-control" 
								type="hidden" 																		
								id="id" 
                                defaultValue={dataCurrentRow.id}
								placeholder=""
								{...register("id", {	})} 
							/>
                            <input className="form-control" 
								type="text" 															
								id="name_office"                                
								placeholder="nombre de la oficina"
								{...register("name", {
                                    required: "El nombre es obligatorio",
                                    maxLength: {
                                      value: 100,
                                      message: "El nombre no puede tener más de 100 caracteres",
                                    },
                                    pattern: {
                                      value: /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-.,]{0,98}[0-9]{0,2}$/,
                                      message: "Nombre inválido: letras, tildes, guiones, puntos, comas, y hasta 2 números al final",
                                    },
                                })} 
							/>
                            {errors.name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="initials">Iniciales</label>	
                            <input
                                type="text"
                                className="form-control"                              
                                placeholder="Iniciales"
                                id="initials"
                                {...register("initials", {
                                    required: "Las iniciales son obligatorias",
                                    maxLength: {
                                    value: 12,
                                    message: "Las iniciales no pueden tener más de 12 caracteres",
                                    },
                                    pattern: {
                                    value: /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\-]{0,10}[0-9]{0,2}$/,
                                    message: "Iniciales inválidas: letras, guiones, y hasta 2 números al final",
                                    },
                                })}
                            />
                            {errors.initials && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.initials.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="levels">Nivel</label>	
                            <select
                                id="levels"
                                className="form-select fs-13px"                              
                                {...register("level", { required: "El nivel es obligatorio" })} 
                                onChange={(element) => { setSelectLevels(element.target.value);}}                             
                                >
                                <option value="">Seleccione un nivel</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            {errors.level && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.level.message)}</div>}
                        </div> 
                        { (selecLevels !="" && selecLevels != 1)? 
                        (
                            <div className="mb-3">
                            <label className="required form-label" htmlFor="office">Dependencia</label>	
                            <AsyncSelect 
                                id="office"
                                cacheOptions                              
                                loadOptions={loadOptionsOfficeSearch}
                                defaultOptions={defaultOptionsOffice}
                                getOptionLabel={(option) => option.name}
								getOptionValue={(option) => option.id}
                                onMenuScrollToBottom={handleMenuScrollToBottom}
                                onChange={(elemento) => { setSelectOficce(elemento);}}
                                isLoading={isLoadingOffice}
                                placeholder="Seleccione una opción..."
                                defaultValue= {getSelectOficce}	
                                />                          
                            </div>  
                        ):null 
                        }                                                   
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormOficce"  disabled={stateButton}> {stateButton? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>	
			</Modal.Footer>
		</Modal>
    </> );
}
 
export default CompModalCreateUpdate;