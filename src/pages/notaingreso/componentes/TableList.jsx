import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus } from '../modelNotaIngreso.jsx';
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
            omit: false,
            width: '60px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '14px' }}>ACCIONES</p>),
            sortable: false,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-theme"
                        onClick={() => {
                            onChangeRow({
                                id: row.id,
                                note: row.note,
                                payment_receipt: row.payment_receipt,
                                expense_receipt: row.expense_receipt,
                                is_depreciated: row.is_depreciated,
                                voucher_number: row.voucher_number,
                                dfm_amount: row.dfm_amount,
                                dfm_date: row.dfm_date,
                            })
                        }} title="Permite editar los datos especificos de la oficina">
                        <i className="fas fa-edit"></i>
                    </button>
                </>
            ),
            width: '90px',
            omit: false
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>NOTA</p>),
            sortable: true,
            width: '90px',
            selectorKey: 'note',
            omit: !getDataRefresch.columnsShow[0],
            cell: (row) => { return (row.note != null) ? (<b>{row.note}</b>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>RECIBO DE PAGO</p>),
            sortable: true,
            selectorKey: 'payment_receipt',
            omit: !getDataRefresch.columnsShow[1],
            cell: (row) => { return (row.note != null) ? (<span className="badge badge rounded-pill badge-subtle-success "> <i className='fa fa-list-alt me-2'></i> {row.payment_receipt} </span>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
            width: '140px',
        },
        {
            name: (<p className="m-0 text-center" style={{ fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>NÚMERO DE VALE</p>),
            sortable: true,
            selectorKey: 'voucher_number',
            cell: (row) => { return (row.voucher_number != null) ? (<span style={{ fontWeight: 'bold' }}> {row.voucher_number} </span>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
            omit: !getDataRefresch.columnsShow[2],
            width: '150px',
        },
        {
            name: (<p className="m-0 text-center" style={{ fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>RECIBO DE GASTOS</p>),
            sortable: true,
            selectorKey: 'expense_receipt',
            cell: (row) => { return (row.expense_receipt != null) ? (<span className="badge badge rounded-pill badge-subtle-success "> <i className='fa fa-list-alt me-2'></i> {row.expense_receipt} </span>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
            omit: !getDataRefresch.columnsShow[3],
            width: '180px',
        },
        {
            name: (<p className="m-0 text-center" style={{ fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>CANTIDAD DFM</p>),
            sortable: true,
            selectorKey: 'dfm_amount',
            cell: (row) => { return (row.dfm_amount != null) ? (<p>{row.dfm_amount}</p>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
            omit: !getDataRefresch.columnsShow[4],
            width: '110px',
        },
        {
            name: (<p className="m-0 text-center" style={{ fontWeight: 'bold', fontSize: '14px', textDecoration: 'underline' }}>FECHA DFM</p>),
            sortable: true,
            selectorKey: 'dfm_date',
            cell: (row) => { return (row.dfm_date != null) ? (<p>{row.dfm_date}</p>) : (<p className='text-center' style={{ fontSize: '14px', color: 'gray', fontStyle: 'italic' }} title="">  Sin asignar </p>) },
            omit: !getDataRefresch.columnsShow[5],
            width: '110px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>FECHA DE REGISTRO</p>),
            sortable: true,
            selectorKey: 'created_at',
            omit: !getDataRefresch.columnsShow[6],
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.created_at}</p>,
            width: '130px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>ULTIMA ACTUALIZACIÓN</p>),
            sortable: true,
            selectorKey: 'updated_at',
            omit: !getDataRefresch.columnsShow[7],
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.updated_at}</p>,
            width: '140px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>ESTADO</p>),
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
    ]

    useEffect(() => {
        const peticionListOffice = async () => {
            setProgressData(true);
            const returnData = await useListTable(getPag, getSort.column, getSort.order, getCountRows, getDataRefresch.getDataSearh, getDataRefresch.getParameterSearh);
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
    }, [getPag, getSort, getCountRows, getRefreschDataTable /**Update */, getDataRefresch.getDataSearh, getDataRefresch.getRefreschDataTable /** Create*/, getDataRefresch.getLevel]);


    const handleSort = (columnTable, direction) => {
        setSort({ column: columnTable.selectorKey, order: direction });
    };

    return (<>
        <ReactNotifications />
        <CompModalCreateUpdate
            StatusModal={modal}
            title="Editar nota de ingreso"
            CloseModal={closeModal}
            dataCurrentRow={getDataModalUpdate}
            functionRefreschDataTable={functionRefreschDataTable}
        />   
        <DataTable title={<span></span>}
            columns={columns}
            data={getDataTables}
            selectableRows={false}
            pagination={true}
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
    </>);
}

export default TableList;