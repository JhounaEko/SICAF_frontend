import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ReactNotifications, Store } from 'react-notifications-component';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
import { modelUseListRol, modelChangeStatus } from './../modelRoles.jsx';
import { addNotification } from './../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';


const TablaList = (getStatusCRUD) => {

    const useListRol = modelUseListRol();
    const useChangeStatus = modelChangeStatus();
    const navigation = useNavigate();

    /** estado update */
    const [getStatusUpdate, setStatusUpdate] = useState(false);
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
    const [getDataTables, setDataTables] = useState([]);
    const [getPag, setPag] = useState(1);
    const [getNumRow, setNum] = useState(1);
    const [getRowTotal, setRowTotal] = useState();
    const [getProgressData, setProgressData] = useState(false)
    const [getCountRows, setCountRows] = useState(10);
    const [getSort, setSort] = useState({ column: 'id', order: 'desc' });


    useEffect(() => {
        setProgressData(true);
        const peticionListRoles = async () => {
            const returnData = await useListRol(getPag, getCountRows, getStatusCRUD.getDataSearh, getSort.column, getSort.order);                                               
            if (returnData.status) {
                if (returnData.response.data.results) {
                    setRowTotal(returnData.response.data.results.meta.total);
                    setDataTables(returnData.response.data.results.data)
                    setNum(returnData.response.data.results.meta.from);
                } else {
                    setRowTotal(0);
                    setDataTables([])
                    setNum(0);
                }
            } else {
                setRowTotal(0);
                setDataTables([])
                setNum(0);
                if (returnData.message == "Unauthenticated.") {
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
            setProgressData(false)
        }
        peticionListRoles();
    }, [getPag, getSort, getCountRows, getStatusCRUD, getStatusUpdate]);

    const columns = [
        {
            name: '#',
            sortable: true,
            selectorKey: 'id',
            selector: (row, index) => getNumRow + index,
            width: '40px',
        },
        {
            name: (<p className="m-0 text-header-filter">Nombre de rol</p>),
            sortable: true,
            cell: (row) => row.name,
            selectorKey: 'name',
            width: '250px',
        },
        {
            name: (<p className="m-0 text-header-filter" >Fecha de registro</p>),
            sortable: true,
            selectorKey: 'created_at',
            cell: (row) => row.created_at,
            width: '150px',
        },
        {
            name: (<p className="m-0 text-header-filter" >Ultima actualización</p>),
            sortable: true,
            selectorKey: 'updated_at',
            cell: (row) => row.updated_at,
            width: '150px',
        },
        {
            name: (<p className="m-0 text-header-not-filter" >Cantidad de permisos</p>),
            sortable: false,
            cell: (row) => <div className="m-0 text-center text-border-color" onClick={() => {
                onChangeRow({
                    id: row.id,
                    name: row.name,
                    permissions: row.permissions
                });
            }}>{(row.permissions).length}</div>,
            width: '130px',
        },
        {
            name: (<p className="m-0 text-header-filter" >Estado</p>),
            sortable: true,
            selectorKey: 'state_id',
            cell: (row) => (
                (row.state.name === "ACTIVO") ? (<div className="btn-flex">
                    <i className="fas fa-toggle-on fa-2x" style={{ color: "#276BAA" }} onClick={() => changeStatus(row.state.name, row.id)} ></i>
                    <p className="mb-2 ms-1" style={{ color: 'green', fontSize: '13px' }}>ACTIVO</p>
                </div>) :
                    (<div className="btn-flex">
                        <i className="fas fa-toggle-off fa-2x" onClick={() => changeStatus(row.state.name, row.id)} ></i>
                        <p className="mb-2 ms-1" style={{ color: 'red', fontSize: '13px' }}>INACTIVO</p>
                    </div>)
            ),
        },
        {
            name: (<p className="m-0 text-header-not-filter" >Acciones</p>),
            sortable: false,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info" title={"Editar registro"}
                        onClick={() => {
                            onChangeRow({
                                id: row.id,
                                name: row.name,
                                permissions: row.permissions
                            });
                        }}> <i className="fas fa-wrench" ></i>
                    </button>

                </>
            ),
        },
    ];

    const changeStatus = (statusRow, idRow) => {
        Swal.fire({
            title: (statusRow === "INACTIVO") ? "¿ Esta seguro de cambiar el estado a activo ?" : "¿ Esta seguro de cambiar el estado a inactivo ?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si cambiar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const returnData = await useChangeStatus(statusRow, idRow);
                if (returnData.status) {
                    setStatusUpdate(!getStatusUpdate);
                    Swal.fire({
                        title: "Se establecio el cambio de estado correctamente",
                        text: "",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                } else {
                    if (returnData.message == "Unauthenticated.") {
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
                // axios.patch( `${process.env.REACT_APP_API_URL}/api/v1/roles/${idRow}`,
                //     {
                //        "state_id": (statusRow === "INACTIVO")? 1 : 2 
                //     } ,{
                //     headers: {
                //     'Content-Type': 'application/json',    
                //     'Authorization': "Bearer "+decryptedToken,  
                // }}).then( response => {	        
                //     setStatusUpdate(!getStatusUpdate);                
                //     Swal.fire({
                //         title: "Se establecio el cambio de estado correctamente",
                //         text: "",
                //         icon: "success",
                //         draggable: true,
                //         timer: 3000,
                //         confirmButtonColor: "#3085d6",
                //       });
                // }).catch(error => {    				 
                //     if(error.code === "ERR_NETWORK"){			
                //         addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
                //     } else {				
                //         addNotification('danger', 'Server', error.response, 'top-right',8000, "fas fa-exclamation-circle" ,null)	
                //         console.log(error)
                //     }
                //     console.log(error)                                                                                                                 
                // }).finally(() => {
                //     setProgressData(false)				
                // });
            }
        });
    }

    const onChangeRow = (data) => {
        setData(data);
        setModal(true);
    }

    const handleSort = (columnTable, direction) => {
        setSort({ column: columnTable.selectorKey, order: direction });
    };

    return (
        <>
            <ReactNotifications />
            <ModalCreateUpdate
                StatusModal={modal}
                title="Editar datos de rol"
                CloseModal={closeModal}
                data={getData}
                updateTableData={updateTableData}
                statusUpdate={true}
            />

            <DataTable title={<span></span>}
                columns={columns}
                data={getDataTables}
                selectableRows={false}
                pagination
                progressPending={getProgressData}
                progressComponent={<span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />cargando...</span>}
                onChangePage={(newPage) => setPag(newPage)}
                paginationTotalRows={getRowTotal}
                onSort={handleSort}
                onChangeRowsPerPage={(CountRows) => setCountRows(CountRows)}
                paginationComponentOptions={{
                    rowsPerPageText: "Registros por página:",
                    rangeSeparatorText: "del Total de",
                }}
                paginationRowsPerPageOptions={[10, 25, 50, 75, 100]}
                paginationServer
                noDataComponent={<div className="text-center mt-3">No hay registros disponibles.</div>}
            />
        </>
    );
}

export default TablaList;