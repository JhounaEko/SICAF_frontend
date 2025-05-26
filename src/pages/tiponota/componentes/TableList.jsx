import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus } from '../modelTipoNota.jsx';
import { ReactNotifications } from 'react-notifications-component';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import { useNavigate } from 'react-router-dom';
import { messageFinallySesion, messageUpdateStatusRowSuccess } from './../../../components/alert/alert.jsx';

const TableList = (getDataRefresch) => {

    const navigation = useNavigate();

    /** begin modal update */
    const [modal, setModal] = useState(false);
    const closeModal = () => {
        setModal(false);
    }
    const [getDataModalUpdate, setDataModalUpdate] = useState({ id: 0, });
    /** end modal update */
  
    const useListTable = modelUseListTable();
    const useChangeStatus = modelChangeStatus();
    const [getDataTables, setDataTables] = useState([]);
    const [getPag, setPag] = useState(1);
    const [getNumRow, setNumRow] = useState(1);
    const [getRowTotal, setRowTotal] = useState();
    const [getProgressData, setProgressData] = useState(false)
    const [getCountRows, setCountRows] = useState(10);
    const [getSort, setSort] = useState({ column: 'id', order: 'desc' });

    /** Se utiliza actualizar la tabla, cuando  */
    const [getRefreschDataTable, setRefreschDataTable] = useState(false);
    const functionRefreschDataTable = (ref) => {
        setRefreschDataTable(!getRefreschDataTable);
    };


    const peticionChangeStatus = async (statusRow, idRow) => {
        const dataReturn = await useChangeStatus(statusRow, idRow);
        if (dataReturn.status) {
            setRefreschDataTable(!getRefreschDataTable);
            messageUpdateStatusRowSuccess();
        } else {
            if (dataReturn.message == "Unauthenticated.") {
                messageFinallySesion();
                navigation('/');
            }
        }
    }

    const onChangeRow = (data) => {
        setModal(true);
        setDataModalUpdate(data);
    }

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
        }).then((result) => {
            if (result.isConfirmed) {
                peticionChangeStatus(statusRow, idRow);
            }
        });
    }
    const columns = [
        {
            name: "#",
            selector: (row, index) => getNumRow + index,
            selectorKey: 'id',
            sortable: true,
            width: '40px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Nombre de nota</p>),
            sortable: true,
            width: '210px',
            selectorKey: 'name',
            cell: (row) => <b>{row.name} </b>,
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Descripción</p>),
            sortable: true,
            selectorKey: 'description',
            cell: (row) => ( <p>{row.description} </p> ) ,
            width: '320px',
        },              
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Fecha de registro</p>),
            sortable: true,
            selectorKey: 'created_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.created_at}</p>,
            width: '130px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Ultima actualización</p>),
            sortable: true,
            selectorKey: 'updated_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.updated_at}</p>,
            width: '130px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Estado</p>),
            sortable: true,
            selectorKey: 'state_id',
            cell: (row) => (
                (row.state.name === "ACTIVO") ? (<div className="btn-flex-my" title="Estado actual del registro activo">
                    <i className="fas fa-toggle-on fa-2x" style={{ color: "#276BAA" }} onClick={() => changeStatus(row.state.name, row.id)} ></i>
                    <span className="badge badge rounded-pill badge-subtle-success">ACTIVO <i className="fas fa-check"></i></span>
                </div>) :
                    (<div className="btn-flex-my" title="Estado actual del registro inactivo">
                        <i className="fas fa-toggle-off fa-2x" onClick={() => changeStatus(row.state.name, row.id)} ></i>
                        <span className="badge bg-danger rounded-pill" >INACTIVO <i className="fas fa-ban"></i></span>
                    </div>)
            ),
            width: '110px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Acciones</p>),
            sortable: false,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-theme"
                        onClick={() => {
                            onChangeRow({
                                id: row.id,
                                name: row.name,
                                description: row.description,                                                                                 
                            })
                        }} title="Permite editar los datos">
                        <i className="fas fa-edit"></i>
                    </button>                  
                </>
            )
        }

    ]

    useEffect(() => {
        const peticionListOffice = async () => {
            setProgressData(true);
            const returnData = await useListTable(getPag, getSort.column, getSort.order, getCountRows, getDataRefresch.getDataSearh, getDataRefresch.getParameterSearh, getDataRefresch.getYear);
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
                if (returnData.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
            }
            setProgressData(false);
        }
        peticionListOffice();
    }, [getPag, getSort, getCountRows, getRefreschDataTable /**Update */, getDataRefresch.getDataSearh, getDataRefresch.getRefreschDataTable /** Create*/, getDataRefresch.getLevel, getDataRefresch.getYear]);


    const handleSort = (columnTable, direction) => {
        setSort({ column: columnTable.selectorKey, order: direction });
    };

    return (<>
        <ReactNotifications />
        <CompModalCreateUpdate
            StatusModal={modal}
            title="Editar datos de tipo de nota"
            CloseModal={closeModal}
            dataCurrentRow={getDataModalUpdate}
            functionRefreschDataTable={functionRefreschDataTable}
        />
    <div className="datatable-container">
        <DataTable title={<span></span>}
            columns={columns}
            data={getDataTables}
            selectableRows={false}
            pagination
            paginationComponentPosition={"top"}
            progressPending={getProgressData}
            progressComponent={<div className='panel panel-loading d-flex align-items-center justify-content-center' style={{
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.36)',
                width: '100%',
            }}><span className="spinner-border spinner-border-xl fs-2" role="status" aria-hidden="true" />cargando...</div>}
            paginationTotalRows={getRowTotal}
            onChangePage={(newPage) => setPag(newPage)}
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
        </div>
    </>);
}

export default TableList;