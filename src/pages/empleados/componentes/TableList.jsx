import React, {useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus}  from './../modelEmpleados.jsx';
import { ReactNotifications } from 'react-notifications-component';
import {addNotification} from './../../../components/alert/alert.jsx';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';


const TableList = (getDataRefresch) => {
    
    /** begin modal update */
    const [modal, setModal] = useState(false);
    const closeModal = () => {
        setModal(false);
    }
    const [getDataModalUpdate, setDataModalUpdate] = useState({ id: 0,});
    /** end modal update */

    const useListTable =  modelUseListTable(); 
    const useChangeStatus =  modelChangeStatus();     
    const [getDataTables,setDataTables] = useState([]);
    const [getPag,setPag] = useState(1);
    const [getNumRow,setNumRow] = useState(1);
    const [getRowTotal,setRowTotal] = useState();	
    const [getProgressData,setProgressData] = useState(false)
    const [getCountRows,setCountRows] = useState(10);
    const [getSort,setSort] = useState({column: 'id', order: 'desc' }); 
    
    /** Se utiliza actualizar la tabla, cuando  */
    const [getRefreschDataTable,setRefreschDataTable] = useState(false); 
    const functionRefreschDataTable = (ref) => {
        setRefreschDataTable(!getRefreschDataTable);
    };

    
    const peticionChangeStatus = async (statusRow,idRow) =>{
        const dataReturn = await useChangeStatus(statusRow, idRow);
        if (dataReturn.status) {
            setRefreschDataTable(!getRefreschDataTable);
            Swal.fire({
              title: "Se establecio el cambio de estado correctamente",
              text: "",
              icon: "success",
              draggable: true,
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });
        } else {
            if(dataReturn.error.code === "ERR_NETWORK"){			
                addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            } else {				
                addNotification('danger', 'Server', " "+dataReturn.error.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	      
            }                                                                                                                   
        }
    }

    const onChangeRow = (data) =>{
        setModal(true);
        setDataModalUpdate(data);     
    }

    const changeStatus = (statusRow, idRow)=> {
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
                        peticionChangeStatus(statusRow, idRow);
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
		  width: '210px',
          selectorKey: 'first_name',
		  cell: (row) => <div className="m-0 p-0"> 
		  					<b>{row.first_name+" "+row.last_name}</b>							
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.phone_number}</p>                                              
						</div> ,		 
		},      
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Oficina</p>), 
		  sortable: false,
		  omit: false,
          selectorKey : 'office_name',
		  cell: (row) => <div className="m-0 p-0"> 
							<b style={{fontSize:'12px'}}>{row.office.name}</b>
							<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.office.initials}</p> 							
						</div> ,
		  width: '200px'	 
		},    
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline'}}>Cargo</p>),
			cell: (row) => (<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.position}</p>),	
            selectorKey:'created_at',
            sortable: true, 
            width: '140px',
		},    
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline'}}>Fecha de registro</p>),
			cell: (row) => (<p className="m-0 p-0" style={{fontSize:'12px'}}>{row.created_at}</p>),	
            selectorKey:'created_at',
            sortable: true, 
            width: '140px',
		},       
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Ultima actualización</p>),      
            sortable: true ,
            selectorKey: 'created_at',
            cell: (row) => <p style={{fontSize:'14px'}}> {row.updated_at}</p>,
            width: '140px',
        },
		{ name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Estado</p >), 		
		  sortable: true ,
          selectorKey:'state_id',
		  cell:  (row) =>(
			(row.state.name === "ACTIVO") ? (<div className="btn-flex">
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
                        position: row.position,
                        office: row.office,                                      
					});  }}>
					<i className="fas fa-wrench"></i> Editar
			  	</button>	                 			
			</>
			),	
		},
    ]

    useEffect( ()=>{         
        const peticionList = async () =>{
            setProgressData(true);
            const returnData = await useListTable(getPag, getSort.column, getSort.order, getCountRows, getDataRefresch.getDataSearh);
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
                setRowTotal(0);
                setDataTables([])
                setNumRow(0);
            }
            setProgressData(false);
        }        
        peticionList();
    },[getPag,getSort, getCountRows,getRefreschDataTable, getDataRefresch.getRefreschDataTable, getDataRefresch.getDataSearh]);


    const handleSort = (columnTable, direction) => {  
        setSort({column: columnTable.selectorKey, order: direction });        
     };

    return ( <>
        <ReactNotifications/>

        <CompModalCreateUpdate
            StatusModal = {modal}
            title  = "Editar Cargo"
            CloseModal = {closeModal} 
            dataCurrentRow = {getDataModalUpdate} 
            functionRefreschDataTable = {functionRefreschDataTable}                           
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