import React, {useState, useEffect} from 'react';
import { ReactNotifications } from 'react-notifications-component';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import {useForm, } from 'react-hook-form';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
import Modal from 'react-bootstrap/Modal';
import {addNotification} from './../../../components/alert/alert.jsx';
import { modelUseListTable, modelChangeStatus, modelEnableChangePassword, modelChageDataRow}  from './../modelUsuarios.jsx';
import {  useNavigate  } from 'react-router-dom';
//// mod para inicio de reporte PDF
import { pdf } from "@react-pdf/renderer";
import PDFformato from "../../../../src/assets/components/PDF_tablas.jsx";
////

const TableList = (getStatusCRUD) => {
    
    const useListTable =  modelUseListTable(); 
    const useChangeStatus =  modelChangeStatus(); 
    const useEnableChangePassword = modelEnableChangePassword();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate ();
    
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
    const [getRefreschDataTable,setRefreschDataTable] = useState(false);     

	const onChangeRow = (data)=>{  
        setData(data);       
        setModal(true);          
    }

	const changeStatus = (statusRow, idRow) => {
        Swal.fire({
            title: (statusRow === "INACTIVO")? "¿ Esta seguro de cambiar el estado a activo ?":"¿ Esta seguro de cambiar el estado a inactivo ?" ,
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si cambiar"
          }).then( async (result) => {
            if (result.isConfirmed) {
                const dataReturn = await useChangeStatus(statusRow, idRow);
                updateTableData();
                if (dataReturn.status) {                    
                    Swal.fire({
                      title: "Se establecio el cambio de estado correctamente",
                      text: "",
                      icon: "success",
                      draggable: true,
                      timer: 3000,
                      confirmButtonColor: "#3085d6",
                    });
                } else {
                    if (dataReturn.message == "Unauthenticated."){
                        Swal.fire({
                            title: "Sesion finalizada",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });                  
                        navigation('/');
                    }
                }                          
            }
          });
    }

    const columns = [
		{
			// name: '#',
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Nro.</p>),  
			selector: (row, index) => getNumRow+index, 
            selectorKey: 'id' ,
			sortable: true,  
			width: '40px', 
		},
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Datos de usuario</p>),      
		  sortable: true ,
		  width: '200px',
          selectorKey: 'first_name',
		  cell: (row) => <div className="m-0 p-0"> 
		  					<b>{row.first_name+" "+row.last_name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.email}</p> 
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.phone_number}</p>  
                            <p style={{fontSize:'14px'}}>CI: {row.identity_card}  {(row.issued_by == "S/E")? "":row.issued_by}</p>                                              
						</div> ,		 
		},
        { name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Usuario</p>), 
		  sortable: true,
		  omit: false,
          selectorKey:'username',
		  cell: (row) => <div className="m-0 p-0"> 
							<p className="m-0 p-0" style={{fontSize:'12px'}}> {row.username}</p>
						</div> ,
		  width: '110px'	 
		}, 
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Oficina</p>), 
		  sortable: true,
		  omit: false,
          selectorKey : 'office_name',
		  cell: (row) => <div className="m-0 p-0"> 
							<b style={{fontSize:'12px'}}>{row.office.name } ({row.office.initials})</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.place.name}</p> 							
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
            width: '100px',
		},
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline'}}>Ultima actualización</p>),
			cell: (row) => (<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.updated_at}</p>),	
            selectorKey:'updated_at',
            sortable: true, 
            width: '100px',
		},
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Estado</p >), 		
		  sortable: true ,
          selectorKey:'state_id',
		  cell:  (row) =>(
			(row.state.name === "ACTIVO") ? (<div className="btn-flex" title = "Desactivar registro">
				<i className="fas fa-toggle-on fa-2x" id={`id_check${row.id}`} style = {{color: "#276BAA"}} onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
				<p className="mx-1" style={{color: 'green', fontSize: '13px' }} htmlFor={`id_check${row.id}`} >ACTIVO</p>
			</div>):
			(<div className="btn-flex" title = "Activar registro">
				<i className="fas fa-toggle-off fa-2x" id={`id_check${row.id}`} onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
				<p className="mx-1" style={{color: 'red', fontSize: '13px' }} htmlFor={`id_check${row.id}`} >INACTIVO</p>
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
                    title = "Editar datos"
					onClick={() => {onChangeRow({
						id: row.id,
						first_name: row.first_name,
                        last_name: row.last_name,
                        phone_number: row.phone_number,
                        username: row.username,
                        phone_number: row.phone_number,
                        office: {
                            id: row.office_location_id,
                            office: {
                                id: row.office.id,
                                name: row.office.name,},
                            place:{
                                description: row.place.name,                                
                            }

                        },
                        roles: row.roles,
                        identity_card: row.identity_card,
                        issued_by: row.issued_by,
                        email: row.email,
					});  }}>
					<i className="fas fa-wrench"></i>
			  	</button>	
                  <div className="navbar-item navbar-user dropdown" title = "Opciones para contraseña">                    
                    <a className="navbar-link dropdown-toggle d-flex align-items-center btn btn-sm btn-info m-1" data-bs-toggle="dropdown">                  
                        <span>                            
                            <span className="d-none d-md-inline">mas</span>
                            <b className="caret"></b>
                        </span>
                    </a>
                    <div className="dropdown-menu dropdown-menu-end me-1">
                        <a className="dropdown-item" onClick={() => enableChangePassword(row.id, row.first_name+" "+row.last_name)}> <i className="fas fa-unlock-alt"></i>&nbsp; Habilitar cambio de contraseña</a>
                        <a className="dropdown-item d-flex align-items-center" onClick={() => changePassword(row.id, row.first_name+" "+row.last_name)}> <i className="fas fa-cash-register"></i> &nbsp; Cambiar contraseña</a>       
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
          }).then( async (result) => {
            if (result.isConfirmed) {
                const returnData = await useEnableChangePassword(idRow);
                if (returnData.status) {
                    Swal.fire({
                        title: "Se habilito el cambio de contraseña",
                        text: "",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                } else {
                    if (returnData.message == "Unauthenticated."){
                        Swal.fire({
                            title: "Sesion finalizada",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });                  
                        navigation('/'); 
                    }
                }          
            }
          });
    }

    const handleSort = (columnTable, direction) => {  
        setSort({column: columnTable.selectorKey, order: direction });        
     };

   

    useEffect( ()=>{	
        const peticionList = async () =>{
            setProgressData(true);
            const returnData = await useListTable(getPag, getSort.column, getSort.order, getCountRows, getStatusCRUD.getParameterSearh, getStatusCRUD.getDataSearh);
            if (returnData.status) {
                    try {
                        setDataTables(returnData.response.data.results.data);
                        setRowTotal(returnData.response.data.results.meta.total);
                        setNumRow(returnData.response.data.results.meta.from);	
                    } catch (error) {
                        setRowTotal(0);
                        setDataTables([])
                        setNumRow(0);
                    }                 
            } else {
                
                if (returnData.message=="Unauthenticated."){  
                    Swal.fire({
                        title: "Sesion finalizada",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });                  
                    navigation('/');                    
                }

                setRowTotal(0);
                setDataTables([])
                setNumRow(0);
            }
            setProgressData(false);	
        }
        peticionList();
    },[getPag,getCountRows,getRefreschDataTable,getSort,getStatusCRUD.getStatusCRUD,getStatusCRUD.getDataSearh,getStatusUpdate]);

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
    

    const onSubmitFormChangePassword = async (dataFormChangePassword) =>{        
        if (dataFormChangePassword.password == dataFormChangePassword.password_confirmation) {
            setStateButtonChangePassword(true);
            const returnData = await useChangeDataRow(dataFormChangePassword);
            if(returnData.status){
                Swal.fire({
                    title: "Acualización de datos existoso",
                    icon: "success",
                    draggable: true,
                    timer: 3000,
                    confirmButtonColor: "#3085d6",
                });
            } else {
                if(returnData.message == "Unauthenticated."){
                    Swal.fire({
                        title: "Sesion finalizada",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                    navigation('/');
                }
            }
            setStateButtonChangePassword(false);         
        } else {
            addNotification('warning', 'Verificar las contraseñas', 'Las contraseñas no coincide', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
        }      
    }

    // TITULO DE TABLA
    const titulo = 'USUARIOS';
    // COLUMNAS
    const childrenTexts = columns.map(col => {
        return col.name?.props || '';
    });
    console.log("Datos que se están enviando al PDF:",titulo, getDataTables);

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

{/* //// MOD REPORTE PDF //// */}
<div className="mb-3 text-end">
    <button
    className="btn btn-sm btn-success"
    onClick={async () => {
        console.log("Datos que se están enviando al PDF:", getDataTables);
        const blob = await pdf(<PDFformato data={getDataTables} titulo={titulo} columnas={childrenTexts} />).toBlob(); //  `data` así se espera en el componente
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }}
    >
    <i className="fas fa-file-pdf me-1"></i> Ver PDF
    </button>
</div>
{/* //// FIN MOD PDF //// */}

        <DataTable       
            title={<span className="mb-1 text-primary fs-4 fw-bold">📋 Lista de usuarios</span>}           
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