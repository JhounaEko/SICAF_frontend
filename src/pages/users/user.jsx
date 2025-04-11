import React, {useState, useRef, useEffect} from 'react';
import { get, useForm, } from 'react-hook-form';
import AsyncPaginate  from 'react-select/async';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import { ReactNotifications, Store } from 'react-notifications-component';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 

const UsersManager = () => {
	const { register, handleSubmit, reset, setValue,formState: { errors },getValues  } = useForm(
		{
			defaultValues: {
				id:"",
				first_name: "",
				last_name: "",
				phone_number:"",
				username:"",
				password:"",
				email:"",				
			  }
		}
	);
	const [getDataOffice, setDataOffice] = useState([]);
	const [getSelectOffice, setSelectOffice] = useState(null);
	const [getIsLoadingOffice, setIsLoadingOffice] = useState(false);

	const [getLoadingSaveData, setLoadingSaveData] = useState(false);
	const [getLoadingNewData, setLoadingNewData] = useState(false);
	
	const [getStatusCreate, setStatusCreate] = useState(true);

	const onSubmit = (data) =>{
		if(getSelectOffice){												
			data['office_id'] = getSelectOffice['id'];
			data['password_confirmation'] = data['password'];	
			console.log(data);
			console.log("-------");
			console.log(process.env.REACT_APP_API_URL+'/api/v1/users'+(getStatusCreate? "" : "/"+data['id']));													
			Swal.fire({
				title: getStatusCreate? "¿Esta seguro de registrar?":" ¿Esta seguro de modificar el registro? ",
				text: "¿Verifico los datos?",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				cancelButtonText: "Cancelar",
				confirmButtonText: "Guardar datos"
			}).then((result) => {				
				if (result.isConfirmed) {						
					setLoadingSaveData(true);	
					console.log("----");						
					const { password, ...newData } = data;
   					console.log('Datos sin contraseña:', newData);	

					const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
					const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
									   
					axios({
						method:  getStatusCreate? "POST" : "PATCH",
						url: process.env.REACT_APP_API_URL+'/api/v1/users'+(getStatusCreate? "" : "/"+data['id']),
						data: newData,						
						headers: {
							'Content-Type': 'application/json',   
							'Authorization': 'Bearer '+decryptedToken,  
						}						
					}).then( response => {		
						if (getStatusCreate) {
							setStatusCRUD(getStatusCRUD + 1);
							Swal.fire({
								title: getStatusCreate? "Registro existoso":" Actualización exitosa",
								icon: "success",
								draggable: true,
								timer: 3000,
								confirmButtonText: 'Aceptar', 
								confirmButtonColor: '#007bff',
							});
						} 												
						reserForm();	
						CloseDialog();						
					}).catch(error => {    				 
						if(error.code === "ERR_NETWORK"){			
						addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  
						reserForm();	
						CloseDialog();
						} else if (error.status === 422){	
						if (error.response.data.message == "The email has already been taken.") {
								addNotification('info', 'Aviso', "El correo electronico ya existe", 'top-right',8000, "fas fa-exclamation-circle" ,null)						
						} else {
								addNotification('danger', 'Validación server', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)						
						}
						} else if ((error.response.data.errorDetails).slice(0, 15) == "SQLSTATE[23505]"){
								addNotification('info', 'Aviso', "Existe un usuario con ese nombre" , 'top-right',8000, "fas fa-exclamation-circle" ,null)		
						} else{
									addNotification('danger', 'Server', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
									reserForm();	
									CloseDialog();
						}
						console.log(error)				 				 	                				                               
						
					}).finally(() => {						
							setLoadingSaveData(false);											
					});	
				}
			});																			                       						
		} else {			
			addNotification('info', 'Aviso', 'Seleccione la oficina correspondiente', 'top-right',8000, "fas fa-exclamation-circle" ,null) 
		}
		
	}

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

	const ShowDialog = async ( id = 0) =>{
		 if (id == 0 ) {
			setLoadingNewData(true);
		 }
		 const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
		 const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
			setIsLoadingOffice(true);
			try {
				const responseOffice = await axios.get(process.env.REACT_APP_API_URL+"/api/v1/offices", {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer '+decryptedToken
					}
				});
				if (responseOffice.data.statusCode === 200) {                              							
					const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
					const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
		   
					if (id != 0){

	

						axios.get( process.env.REACT_APP_API_URL+'/api/v1/users/'+id,{
							headers: {
							'Content-Type': 'application/json',   
							'Authorization': 'Bearer '+decryptedToken,  
						}}).then( response => {											
							console.log(response.data.results); 
							const dataResult = response.data.results;
							setValue("first_name",response.data.results.first_name);
							setValue("last_name",response.data.results.last_name);
							setValue("phone_number",response.data.results.phone_number);
							setValue("username",response.data.results.username);
							setValue("email",response.data.results.email);
							setValue("id",response.data.results.id);
							setSelectOffice(response.data.results.office);													
						}).catch(error => {    				 					
							console.log(error)				 				 	                				                               
						}).finally(() => {
							setDataOffice(responseOffice.data.results.data);	
							setShow(true);	
							setIsLoadingOffice(false);		
						});		
					} else {
						setDataOffice(responseOffice.data.results.data);
						setShow(true);	
						setLoadingNewData(false);
						setIsLoadingOffice(false);	
					}

				} else {
					console.log('Error en la respuesta', responseOffice.data);
				}
			} catch (error) {
				if(error.code === "ERR_NETWORK"){			
					addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  								
				} 	
				setLoadingNewData(false);
				setIsLoadingOffice(false);
			}
		// } else if (operacion == "UPDATE") {
		// 	console.log(id);
		// 	setShow(true);	
			
		// }	
	}

	const reserForm = () => {	
		reset();	
		setSelectOffice(null);
	  };
	const [show, setShow] = useState(false);

	const CloseDialog = () => { 
		setShow(false)
		reserForm();
	};

	  /**** Datatables */
	  const [getCountRows,setCountRows] = useState(10);
	  const [getPag,setPag] = useState(1);	
	  const [getProgressData,setProgressData] = useState(false)
	  const [getRowTotal,setRowTotal] = useState();	
	  const [getSort,setSort] = useState({col:"id", dir:"desc"});
	  const [getSearch,setSearch] = useState("");
	  const [getStatusCRUD,setStatusCRUD] = useState(0);
	  const [getDataTables,setDataTables] = useState([]);
	  useEffect( ()=>{	
			setProgressData(true)	
			const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
			const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         

			axios.get( `${process.env.REACT_APP_API_URL}/api/v1/users?page=${getPag}&sort_by=${getSort.col}&sort_order=${getSort.dir}&rows_per_page=${getCountRows}`,{
				headers: {
				'Content-Type': 'application/json',   
				'Authorization': "Bearer "+decryptedToken,  
			}}).then( response => {	
				console.log(response);
				setRowTotal(response.data.results.meta.total);
				setDataTables(response.data.results.data)
				setNum(response.data.results.meta.from);					
			}).catch(error => {    				 
			 if(error.code === "ERR_NETWORK"){			
				addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
			 } else {				
				addNotification('danger', 'Server', error.response, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
				console.log(error)
			}
								 				 	                				                               
			}).finally(() => {
				setProgressData(false);				
			});	
	  },[getPag,getCountRows,getSort,getStatusCRUD]);

	  const handleButtonClick = (rowId) => {		
		alert(`Button clicked for row with ID: ${rowId}`);
	  };

	const [getNum,setNum] = useState(1);

	const columnsSort = {
	   "Usuario"	: "first_name",
	}

	const columns = [
		{
			name: '#',  
			selector: (row, index) => getNum+index,  
			sortable: false,  
			width: '40px', 
		},
		{ name: 'Usuario',
		  sortable: true ,
		  cell: (row) => <div className="m-0 p-0"> 
		  					<b>{row.first_name+" "+row.last_name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.email}</p> 
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.phone_number}</p>
						</div> 
		},
		{ name: 'Area', 
		  sortable: false,
		  omit: false,
		  cell: (row) => <div className="m-0 p-0"> 
							<b style={{fontSize:'12px'}}>{row.office.name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.office.initials}</p> 							
						</div> ,
		  width: '330px',	 
		}, 
		{ name: 'Estado', 		
		  sortable: true ,
		  cell:  (row) => <div className="m-0 p-0 d-flex flex-column justify-content-center align-items-center"> 
		  						<span className={`badge rounded-pill text-white bg-${row.state.color} p-1 fs-7`}>{row.state.name} </span>																														
							  </div> ,
		  width: '100px',		
		},
		{
			name: 'Acciones',
			cell: (row) => (
			<>
			  <button
					className="btn btn-sm btn-info "
					onClick={() => {setStatusCreate(false); ShowDialog(row.id )}}>
					Editar
			  </button>
			  <button
					className="btn btn-sm btn-success mx-1"
					onClick={() => handleButtonClick(row.id)}>
					Cambiar estado
			  </button>
			  <button
					className="btn btn-sm btn-info"
					onClick={() => handleButtonClick(row.id)}>
					ver
			  </button>
			</>
			),	
		  },
	];
	 
	const handleCountRows = (CountRows) => {		
		setCountRows(CountRows);
	};

	const handleSearch = (event) => {	
		console.log(event.target.value);
	}

	const handlePageChange = (newPage) => {
		setPag(newPage);	
	};

	const handleSort = (column, sortDirection) => {

		setSort({
			col:columnsSort[column.name],
			dir:sortDirection
		});
		console.log("Columna ordenada:", column.name);
		console.log("Dirección:", sortDirection);
		console.log(columnsSort[column.name]);		
	}

    return (<>
		
		<DataTable title={<span>Titulo</span>} 
			columns={columns} 
			data={getDataTables} 
			selectableRows			
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
			paginationRowsPerPageOptions={[10,15, 20]}			
			paginationServer
		/>
		<ReactNotifications />
		<Button variant="primary" onClick={() => {setStatusCreate(true); ShowDialog(0);}} disabled ={getLoadingNewData}>  {getLoadingNewData ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> :<i className="fas fa-plus"></i>}
        	Agregar
      	</Button>		
		<Modal show={show} onHide={CloseDialog} scrollable={true} backdrop="static" keyboard={false}>
			<Modal.Header closeButton>
			<Modal.Title><h4 className="modal-title">Agregar nuevo registro</h4></Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form onSubmit={handleSubmit(onSubmit)} id="myFormUsers">					
					<fieldset>
						<legend className="mb-3"></legend>
						<div className="mb-3">
							<label className="form-label" htmlFor="first_name">Nombre:</label>	
							<input className="form-control" 
									type="hidden" 															
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
						</div>
						{errors.first_name && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
						<div className="mb-3">
							<label className="form-label" htmlFor="last_name">Apellidos:</label>
							<input className="form-control" 
									type="text" 							
									id="last_name" 
									placeholder="apellidos"
									{...register("last_name", {
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
						</div>	
						{errors.last_name && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.last_name.message)}</div>}
						<div className="mb-3">
							<label className="form-label" htmlFor="phone_number">Celular:</label>
							<input className="form-control"
									type="number" 								
									id="phone_number" 
									placeholder="numero de celular"
									{...register("phone_number", {
										required: "El número de teléfono es obligatorio",
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
							<label className="form-label" htmlFor="username">Usuario:</label>
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
						<div className="mb-3">
							<label className="form-label" htmlFor="password">Contraseña:</label>
							<input className="form-control" 
									type="text" 								
									id="password" 
									
									placeholder="contraseña"
									{...register("password", {
										required: getStatusCreate ? "La contraseña es obligatoria": false,
										minLength: {
										value: 8,
										message: "La contraseña debe tener al menos 8 caracteres",
										},
										pattern: {
										value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
										message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial",
										},
										
									})} 
									disabled
							/>
						</div>	
						{errors.password && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.password.message)}</div>}	
						<div className="mb-3">
							<label className="form-label" htmlFor="email">Correo:</label>
							<input className="form-control" 
								type="text" 							
								id="email" 
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
							<label className="col-lg-4 col-form-label">Oficina:</label>
							<div className="col-lg-8">
								<Select options={getDataOffice} 
										placeholder="Seleccionar oficina"	
										classNamePrefix="react-select"
										isLoading={getIsLoadingOffice}													
										getOptionLabel={(option) => option.name} 
										getOptionValue={(option) => option.id}		
										noOptionsMessage={() => "No hay opciones disponibles"}																				
										onChange = {(selectOption)=>( setSelectOffice(selectOption) )}
										value={getSelectOffice}		
										// {...register("office", {
										// 	required: "Seleccione la oficina correspondiente",
										//   })}																							
								/>
							</div>
						</div>	
						{/* {errors.office && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.office.message)}</div>}																																	 */}
					</fieldset>
				</form>		
			</Modal.Body>
			<Modal.Footer>
			<Button className='btn btn-secondary' onClick={CloseDialog} disabled ={getLoadingSaveData}>Close</Button>
			<Button variant="primary" type='submit' form="myFormUsers"  disabled ={getLoadingSaveData}>  {getLoadingSaveData && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>}															
			&nbsp;Guardar </Button>	
			</Modal.Footer>
		</Modal>       
    </>);
}

export default UsersManager;