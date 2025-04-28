import React, {useState, useEffect} from 'react';
import { ReactNotifications, Store } from 'react-notifications-component';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';
import {useForm, } from 'react-hook-form';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
import Modal from 'react-bootstrap/Modal';
const TableList = (getStatusCRUD) => {

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

    /** Modal */
         const [modal, setModal] = useState(false);
         const [getData, setData] = useState({
            id: 0,           
         });
         const closeModal = () => {
             setModal(false); 
         };
     

    /** DataTable */      
    const [getStatusUpdate,setStatusUpdate] = useState(false); 
    const updateTableData = (ref) => {
        setStatusUpdate(!getStatusUpdate);
    };
    const [getDataTables,setDataTables] = useState([]);
    const [getPag,setPag] = useState(1);
    const [getNumRow,setNumRow] = useState(1);
    const [getRowTotal,setRowTotal] = useState();	
    const [getProgressData,setProgressData] = useState(false)
    const [getCountRows,setCountRows] = useState(10);
    const [getSort,setSort] = useState({column: 'id', order: 'desc' });  

	const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
	const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         

	const onChangeRow = (data)=>{  
        setData(data);       
        setModal(true);          
    }

	const changeStatus = (statusRow, idRow) => {
        Swal.fire({
            title: (statusRow === "INACTIVE")? "¿ Esta seguro de cambiar el estado a activo ?":"¿ Esta seguro de cambiar el estado a inactivo ?" ,
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si cambiar"
          }).then((result) => {
            if (result.isConfirmed) {
                axios.patch( `${process.env.REACT_APP_API_URL}/api/v1/users/${idRow}`,
                    {
                       "state_id": (statusRow === "INACTIVE")? 1 : 2 
                    } ,{
                    headers: {
                    'Content-Type': 'application/json',    
                    'Authorization': "Bearer "+decryptedToken,  
                }}).then( response => {	        
                    setStatusUpdate(!getStatusUpdate);                
                    Swal.fire({
                        title: "Se establecio el cambio de estado correctamente",
                        text: "",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                      });
                }).catch(error => {    				 
                    if(error.code === "ERR_NETWORK"){			
                        addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                    } else {				
                        addNotification('danger', 'Server', " "+error.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
                        console.log(error)
                    }
                    console.log(error)                                                                                                                 
                }).finally(() => {                   			
                });
            }
          });
    }

    const columns = [
		{
			name: '#',  
			selector: (row, index) => getNumRow+index, 
            selectorKey: 'id' ,
			sortable: true,  
			width: '40px', 
		},
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Usuarios</p>),      
		  sortable: true ,
		  width: '240px',
          selectorKey: 'first_name',
		  cell: (row) => <div className="m-0 p-0"> 
		  					<b>{row.first_name+" "+row.last_name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.email}</p> 
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.phone_number}</p>                    
                            <p className="m-0 p-0" style={{fontSize:'12px'}}>{row.username}</p>
						</div> ,		 
		},
        { name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>C.I.</p>), 
		  sortable: true,
		  omit: false,
          selectorKey:'identity_card',
		  cell: (row) => <div className="m-0 p-0"> 
							<p style={{fontSize:'14px'}}>{row.identity_card}  {(row.issued_by == "S/E")? "":row.issued_by}</p>
						</div> ,
		  width: '110px'	 
		}, 
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Area</p>), 
		  sortable: true,
		  omit: false,
          selectorKey : 'office_name',
		  cell: (row) => <div className="m-0 p-0"> 
							<b style={{fontSize:'12px'}}>{row.office.name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.office.initials}</p> 							
						</div> ,
		  width: '200px'	 
		}, 
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Roles</p>),
			cell: (row) => {
				if ((row.roles).length == 0){
					return (<p className="m-0 p-0" style={{fontSize:'12px'}}>ROL NO ASIGNADO</p>);
				} else {							
					return  ( <div className="m-0 p-0" >{(row.roles).map((element,index) => (<div key={index} className="m-0 p-0 mx-0" style={{ display: 'flex', alignItems: 'center' }}><i className="fas fa-suitcase-rolling mx-2"></i> <p className="m-0 p-0" style={{fontSize:'12px'}}>{element.name}</p> </div>))}</div>);
				}
			},	
		},
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline'}}>Fecha de registro</p>),
			cell: (row) => (<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.created_at}</p>),	
            selectorKey:'created_at',
            sortable: true, 
            width: '80px',
		},
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Estado</p >), 		
		  sortable: true ,
          selectorKey:'state_id',
		  cell:  (row) =>(
			(row.state.name === "ACTIVE") ? (<div className="btn-flex">
				<i className="fas fa-toggle-on fa-2x" id={`id_check${row.id}`} style = {{color: "#276BAA"}} onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
				<label className="form-check-label mx-1" style={{color: 'green', fontSize: '13px' }} htmlFor={`id_check${row.id}`} >ACTIVO</label>
			</div>):
			(<div className="btn-flex">
				<i className="fas fa-toggle-off fa-2x" id={`id_check${row.id}`} onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
				<label className="form-check-label mx-1" style={{color: 'red', fontSize: '13px' }} htmlFor={`id_check${row.id}`} >INACTIVO</label>
			</div>)
		  ),
		  width: '120px',		
		},	
		{
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Acciones</p>),
			cell: (row) => (
			<>
			  	<button
					className="btn btn-sm btn-info"
					onClick={() => {onChangeRow({
						id: row.id,
						first_name: row.first_name,
                        last_name: row.last_name,
                        phone_number: row.phone_number,
                        username: row.username,
                        phone_number: row.phone_number,
                        office: row.office,
                        roles: row.roles,
                        identity_card: row.identity_card,
                        issued_by: row.issued_by,
                        email: row.email,
					});  }}>
					<i className="fas fa-wrench"></i> Editar
			  	</button>	
                  <div className="navbar-item navbar-user dropdown">                    
                    <a className="navbar-link dropdown-toggle d-flex align-items-center btn btn-sm btn-info m-1" data-bs-toggle="dropdown">                  
                        <span>                            
                            <span className="d-none d-md-inline">mas</span>
                            <b className="caret"></b>
                        </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end me-1">
                        <a className="dropdown-item" onClick={() => enableChangePassword(row.id, row.first_name+" "+row.last_name)}>Habilitar cambio de contraseña</a>
                        <a className="dropdown-item d-flex align-items-center" onClick={() => changePassword(row.id, row.first_name+" "+row.last_name)}>Cambiar contraseña</a>       
                    </div>
                </div>				
			</>
			),	
		},
	];


    const changePassword = (idRow, nombreCompleto) =>{
        setNameUserChangePassword(nombreCompleto);
        setValue('id',idRow);
        setStatusModalChangePassword(true);
    }

    const enableChangePassword = (idRow, nombreCompleto) =>{
        Swal.fire({
            title: "Habilitar el cambio de contraseña de "+nombreCompleto,
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Habilitar"
          }).then((result) => {
            if (result.isConfirmed) {
                axios.patch( `${process.env.REACT_APP_API_URL}/api/v1/users/${idRow}/reset-password-change-limit`,{},
                    {
                        headers: {
                            'Content-Type': 'application/json',    
                            'Authorization': 'Bearer '+decryptedToken,  
                        }
                    }
                ).then( response => {	                                        
                    Swal.fire({
                        title: "Se habilito el cambio de contraseña",
                        text: "",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                      });
                }).catch(error => {    				 
                    if(error.code === "ERR_NETWORK"){			
                        addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                    } else {				
                        addNotification('danger', 'Server', " "+error.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                     
                    }
                    console.log(error)                                                                                                                 
                }).finally(() => {                   			
                });
            }
          });
    }

    const handleSort = (columnTable, direction) => {  
        setSort({column: columnTable.selectorKey, order: direction });        
     };

    useEffect( ()=>{	
        setProgressData(true)	
        axios.get( `${process.env.REACT_APP_API_URL}/api/v1/users?page=${getPag}&sort_by=${getSort.column}&sort_order=${getSort.order}&row_num=${getCountRows}&${getStatusCRUD.getParameterSearh}=${getStatusCRUD.getDataSearh}`,{
            headers: {
            'Content-Type': 'application/json',   
            'Authorization': "Bearer "+decryptedToken,         
        }}).then( response => {	
            if (response.data.results){
                setRowTotal(response.data.results.meta.total);
                setDataTables(response.data.results.data)
                setNumRow(response.data.results.meta.from);	
            }  else    {
                setRowTotal(0);
                setDataTables([])
                setNumRow(0);
            }        			
        }).catch(error => {    				 
         if(error.code === "ERR_NETWORK"){			
            addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
         } else {				
            addNotification('danger', 'Server', " "+error.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
            console.log(error)
        }
                                                                                                                 
        }).finally(() => {
            setProgressData(false);				
        });	
    },[getPag,getCountRows,getSort,getStatusCRUD.getDataSearh,getStatusUpdate]);

    /** Form change password */
    const { register, handleSubmit, unregister, reset, setValue,formState: { errors },getValues} = useForm(); 
    const [StatusModalChangePassword,setStatusModalChangePassword] = useState(false);
    const [stateButtonChangePassword, setStateButtonChangePassword] = useState(false);
    const [nameUserChangePassword, setNameUserChangePassword] = useState("");
    const reserFormChangePasswordForm = () =>{
        reset();
        setNameUserChangePassword("");
        setStatusModalChangePassword(false);
    }

    const [showPassword, setShowPassword] = useState(false); 
    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
    
    const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false); 
    const togglePasswordVisibilityConfirmar = () => { setShowPasswordConfirmar(!showPasswordConfirmar); };
    

    const onSubmitFormChangePassword = (dataFormChangePassword) =>{        
        if (dataFormChangePassword.password == dataFormChangePassword.password_confirmation) {
            setStateButtonChangePassword(true);
            axios({
                method: "PATCH",
                url: process.env.REACT_APP_API_URL+'/api/v1/users/'+dataFormChangePassword.id,
                data: dataFormChangePassword,						
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': 'Bearer '+decryptedToken,  
                }						
            }).then( response => {
                    reserFormChangePasswordForm();                  					
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
                setStateButtonChangePassword(false);
            });
        } else {
            addNotification('warning', 'Verificar las contraseñas', 'Las contraseñas no coincide', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
        }      
    }

    return ( <>
        <ReactNotifications /> 

        {/** Modal Change of password*/}
        <Modal show={StatusModalChangePassword} onHide={reserFormChangePasswordForm} scrollable={true} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
			<Modal.Title><h4 className="modal-title"><i className="fas fa-user"></i> Cambiar contraseña de '{nameUserChangePassword}'</h4></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit(onSubmitFormChangePassword)} id="myFormChangePassword">					
					<fieldset>
						<legend className="mb-3"></legend>					
								<div className="mb-3 position-relative">
										<label className="required form-label" htmlFor="password"><i className="fas fa-key"></i>&nbsp;Nueva contraseña</label>
                                        <input className="form-control" 
											type="hidden" 																								
											id="id" 
											placeholder="id"
                                            {...register("id", {	})} 
                                        />						
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
			<Button variant="primary" type='submit' form="myFormChangePassword"  disabled={stateButtonChangePassword}> {stateButtonChangePassword? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>	
			</Modal.Footer>
        </Modal>

        <ModalCreateUpdate
            StatusModal = {modal}
            title  = "Editar datos Usuario"
            CloseModal = {closeModal}     
            data = {getData}  
            updateTableData = {updateTableData}  
            statusUpdate = {true}                  
        /> 
        <DataTable title={<span></span>} 
            columns={columns} 
            data={getDataTables} 
            selectableRows= {false}		
            pagination
            progressPending = {getProgressData}
            progressComponent={<span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>cargando...</span>}
            onChangePage={(newPage) =>setPag(newPage)}       
            paginationTotalRows={getRowTotal}
            onSort={handleSort} 
            onChangeRowsPerPage={(CountRows) => setCountRows(CountRows)}
            paginationComponentOptions = {{
                rowsPerPageText: "Registros por página:", 
                rangeSeparatorText: "del Total de",			
            }}
            paginationRowsPerPageOptions={[10,25, 50,75,100]}			
            paginationServer
            noDataComponent={<div className="text-center mt-3">No hay registros disponibles.</div>}
        />
    </> );
}
 
export default TableList;