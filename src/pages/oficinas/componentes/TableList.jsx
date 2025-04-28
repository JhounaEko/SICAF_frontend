import React, {useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus}  from './../modelOficina.jsx';
import { ReactNotifications } from 'react-notifications-component';
import {addNotification} from './../../../components/alert/alert.jsx';

const TableList = () => {
    
    const useListTable =  modelUseListTable(); 
    const useChangeStatus =  modelChangeStatus();   
    const [getDataTables,setDataTables] = useState([]);
    const [getPag,setPag] = useState(1);
    const [getNumRow,setNumRow] = useState(1);
    const [getRowTotal,setRowTotal] = useState();	
    const [getProgressData,setProgressData] = useState(false)
    const [getCountRows,setCountRows] = useState(10);
    const [getSort,setSort] = useState({column: 'id', order: 'desc' }); 
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

    const changeStatus = (statusRow, idRow)=> {
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
                        peticionChangeStatus(statusRow, idRow);
                    }
                  });
    }
    const columns = [
        {
            name:"#",
            selector: (row, index) => getNumRow+index, 
            selectorKey: 'id' ,
			sortable: true,  
			width: '40px', 
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Oficina</p>),      
            sortable: true ,
            width: '240px',
            selectorKey: 'name',
            cell: (row) => <p>{row.name}</p>,
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Acrónimos</p>),      
            sortable: true ,
            width: '100px',
            selectorKey: 'initials',
            cell: (row) => <p style={{fontSize:'14px'}}> {row.initials}</p>
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', }}>Dependencia</p>),                  
            sortable: false,
            selectorKey: 'Nivel jerárquico',
            cell: (row) => <p style={{fontSize:'14px'}}> {
                (row.parent.id != 0)? row.parent.name : "SIN DEPENDENCIA"
            }</p>,
            width: '200px',
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Nivel jerárquico</p>),      
            sortable: true ,
            selectorKey: 'level',
            cell: (row) => <p style={{fontSize:'14px'}}> {row.level}</p>,
            width: '100px',
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline'}}>Fecha de registro</p>),      
            sortable: true ,
            selectorKey: 'created_at',
            cell: (row) => <p style={{fontSize:'14px'}}> {row.created_at}</p>,
            width: '100px',
        },
        {
            name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Estado</p>),      
            sortable: false ,
            selectorKey:'state_id',
            cell:  (row) =>(
                (row.state.name === "ACTIVE") ? (<div className="btn-flex">
                    <i className="fas fa-toggle-on fa-2x" style = {{color: "#276BAA"}} onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
                    <p className="form-check-label mb-2 ms-1" style={{color: 'green', fontSize: '13px' }}>ACTIVO</p>
                </div>):
                (<div className="btn-flex">
                    <i className="fas fa-toggle-off fa-2x" onClick={ ()=> changeStatus(row.state.name, row.id)} ></i>
                    <p className="form-check-label mb-2 ms-1" style={{color: 'red', fontSize: '13px' }}>INACTIVO</p>
                </div>)
            ),
            width: '120px',
        },
        {
			name: (<p className="m-0" style = {{fontWeight: 'bold', fontSize: '15px'}}>Acciones</p>),
            sortable: false,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info"
                        onClick={() => {onChangeRow({})}}>
                        <i className="fas fa-wrench"></i> Editar
                    </button>
                </>
            )
        }

    ]

    
    useEffect( ()=>{        
        const peticionListOffice = async () =>{
            setProgressData(true);
            const returnData = await useListTable(getPag, getSort.column, getSort.order, getCountRows, "");
            if (returnData.status) {
                setDataTables(returnData.response.data.results.data);
                setRowTotal(returnData.response.data.results.meta.total);
                setNumRow(returnData.response.data.results.meta.from);	
            } else {
                setRowTotal(0);
                setDataTables([])
                setNumRow(0);
                addNotification('info', returnData.title, returnData.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            }
            setProgressData(false);
        }        
        peticionListOffice();
    },[getPag,getSort, getCountRows, getRefreschDataTable]);


    const handleSort = (columnTable, direction) => {  
        setSort({column: columnTable.selectorKey, order: direction });        
     };

    return ( <>
        <ReactNotifications/>
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