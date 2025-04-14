import React, {useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import { ReactNotifications, Store } from 'react-notifications-component';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
const TablaList  = (getStatusCRUD)=>{
    
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

    /** estado update */
    const [getStatusUpdate,setStatusUpdate] = useState(false);    
    const updateTableData = (ref) => {
        setStatusUpdate(!getStatusUpdate);
    };

    /** Modal */
     const [modal, setModal] = useState(false);
     const [getData, setData] = useState({
        id: 0,
        name: ""
     });
     const closeModal = () => {
         setModal(false); 
     };
 

    /** DataTable */
    const [getDataTables,setDataTables] = useState([]);
    const [getPag,setPag] = useState(1);
    const [getNumRow,setNum] = useState(1);
    const [getRowTotal,setRowTotal] = useState();	
    const [getProgressData,setProgressData] = useState(false)
    const [getCountRows,setCountRows] = useState(10);
    const [getSort,setSort] = useState({column: 'id', order: 'desc' });
    const columnRef = [{Nombre: 'name'}];
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
    const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
    
    useEffect( ()=>{	          
        setProgressData(true);       
        axios.get( `${process.env.REACT_APP_API_URL}/api/v1/roles?sort_by=id&sort_order=desc&page=${getPag}&row_num=${getCountRows}&search=${getStatusCRUD.getDataSearh}`,{
            headers: {
            'Content-Type': 'application/json',    
            'Authorization': "Bearer "+decryptedToken,  
        }}).then( response => {	  
            if (response.data.results){
                setRowTotal(response.data.results.meta.total);
                setDataTables(response.data.results.data)
                setNum(response.data.results.meta.from);	
            }  else    {
                setRowTotal(0);
                setDataTables([])
                setNum(0);
            }
        }).catch(error => {    				 
            if(error.code === "ERR_NETWORK"){			
                addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            } else if (error.code === "ERR_BAD_REQUEST") {	
                addNotification('warning', 'Problema inesperado', "El campo de búsqueda sólo permite caracteres.", 'top-right',8000, "fas fa-exclamation-circle" ,null)	
            } else {
                addNotification('danger', 'Server', error.response, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
                console.log(error)
            }                                                                                                             
        }).finally(() => {
        	setProgressData(false)				
        });	
    },[getPag, getCountRows, getStatusCRUD, getStatusUpdate]);

    const columns = [
		{
			name: '#',  
			selector: (row, index) => getNumRow+index,  
			sortable: false,  
			width: '40px', 
		},
		{ name: 'Nombre',
		  sortable: true ,
		  cell: (row) => row.name
		},	
        { name: 'Permisos',
            sortable: false ,
            cell: (row) => { if( row.permissions.length === 0 )
                             {  return ("Sin permisos"); }
                             else { return (<button className='btn btn-primary'> <i className="fas fa-eye"></i> Ver permisos</button>); } }
          },
          {
			name: 'Estado',
			cell: (row) => (  
                (row.state.name === "ACTIVO") ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', boxSizing: 'border-box', }}>           
                        <i className='fas fa-check' style={{color: 'green', fontSize: '20px' }}></i> 
                        <p >Activo</p>
                        <button className="btn btn-sm btn-primary" onClick={ ()=> changeStatus(row.state.name, row.id)}>cambiar estado</button>
                    </div>  
                ) :   (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', boxSizing: 'border-box',  }}>           
                        <i className='fas fa-ban' style={{color: 'red', fontSize: '20px' }}></i> 
                        <p >Inactivo</p>
                        <button className="btn btn-sm btn-primary" onClick={ ()=> changeStatus(row.state.name, row.id)} >cambiar estado</button>
                    </div> 
                )          			          
			),	
		  },	
          {
			name: 'Acciones',
			cell: (row) => (
			<>
			  <button
					className="btn btn-sm btn-info" 
                    onClick={ () => { 
                        onChangeRow({
                            id: row.id,
                            name: row.name
                        }); 
                    } }> <i className= "fas fa-wrench" ></i>Editar
			  </button>			 		
			</>
			),	
		  },	
	];

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
          }).then((result) => {
            if (result.isConfirmed) {
                axios.patch( `${process.env.REACT_APP_API_URL}/api/v1/roles/${idRow}`,
                    {
                       "state_id": (statusRow === "INACTIVO")? 1 : 2 
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
                        addNotification('danger', 'Server', error.response, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
                        console.log(error)
                    }
                    console.log(error)                                                                                                                 
                }).finally(() => {
                    setProgressData(false)				
                });
            }
          });
    }

    const onChangeRow = (data)=>{  
        setData(data);       
        setModal(true);          
    }
    
    const handleSort = (columnTable, direction) => {  
    console.log(columnTable);
       setSort({column: columnRef[0][columnTable.name], order: direction });  
    };

    return (
        <>        
            <ReactNotifications />                        
                <ModalCreateUpdate
                    StatusModal = {modal}
                    title  = "Editar datos de rol"
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
                paginationRowsPerPageOptions={[10,15, 20]}			
                paginationServer
                noDataComponent={<div className="text-center mt-3">No hay registros disponibles.</div>}
            />
        </>
    );
}

export default TablaList;