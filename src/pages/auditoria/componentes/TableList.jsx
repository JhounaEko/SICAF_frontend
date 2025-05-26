import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { modelUseListTable } from './../modelAuditoria.jsx';
import { ReactNotifications } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';
import { messageFinallySesion, messageUpdateStatusRowSuccess } from './../../../components/alert/alert.jsx';
import { Panel, PanelHeader, PanelBody } from './../../../components/panel/panel.jsx';
const TableList = (getDataRefresch) => {
    const navigation = useNavigate();
    const useListTable = modelUseListTable();

    const [getDataTables, setDataTables] = useState([]);
    const [getPag, setPag] = useState(1);
    const [getNumRow, setNumRow] = useState(1);
    const [getRowTotal, setRowTotal] = useState();
    const [getProgressData, setProgressData] = useState(false)
    const [getCountRows, setCountRows] = useState(10);
    const [getSort, setSort] = useState({ column: 'id', order: 'desc' });

    const columns = [
        {
            name: "#",
            selector: (row, index) => { return getNumRow + index; },
            selectorKey: 'id',
            sortable: true,
            width: '60px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Evento</p>),
            sortable: true,
            width: '90px',
            selectorKey: 'event',
            cell: (row) => <p>{row.event}</p>
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Entidad auditada</p>),
            sortable: true,
            selectorKey: 'auditable_type',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.auditable_type}</p>,
            width: '120px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', }}>Usuario</p>),
            sortable: false,
            selectorKey: 'auditable_type',
            cell: (row) => <p style={{ fontSize: '14px' }}>
                {row.user ? (
                    <>
                        {row.user.name}{' '}
                        <b>
                            (
                            {row.user.roles && row.user.roles.length !== 0
                                ? row.user.roles.map((item, i) => (
                                    <span key={i}>{item.name}{' '}</span>
                                ))
                                : 'Sin rol'}
                            )
                        </b>
                    </>
                ) : null}
            </p>,
            width: '180px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>IP (Protocolo de Internet)</p>),
            sortable: false,
            selectorKey: '',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.ip_address}</p>,
            width: '120px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Modo de acceso</p>),
            sortable: false,
            selectorKey: '',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.user_agent}</p>,
            width: '200px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Fecha de evento</p>),
            sortable: true,
            selectorKey: 'created_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.created_at}</p>,
            width: '120px',
        }, {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Acciones</p>),
            sortable: false,
            cell: (row) => (
                <button
                    className="btn btn-sm btn-theme"
                    onClick={() => {
                        masInfoUser(
                            row.old_values,
                            row.new_values
                        )
                    }} title="Mas información">
                    <i className="fas fa-eye"></i> Ver datos
                </button>
            )
        }
    ]

    const [modalMasInfo, setModalMasInfo] = useState(false);
    const [dataBefore, setDataBefore] = useState({});
    const [dataAfter, setDataAfter] = useState({});
    const masInfoUser = (dataBeforeRow, dataAfterRow) => {
        setModalMasInfo(true);
        setDataBefore(dataBeforeRow);
        setDataAfter(dataAfterRow);       
    }

    useEffect(() => {
        const peticionList = async () => {
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
        peticionList();
    }, [getPag, getSort, getCountRows, getDataRefresch.getDataSearh]);

    const handleSort = (columnTable, direction) => {
        setSort({ column: columnTable.selectorKey, order: direction });
    };

    return (<>
        <ReactNotifications />
        <ReactNotifications />
        <Modal show={modalMasInfo} size="xl" centered={true} backdrop="static" dialogClassName="custom-modal-width" scrollable={false} onHide={() => { setModalMasInfo(false) }} >
            <Modal.Header closeButton>
                <Modal.Title ><h4 className="modal-title"><i className="fas fa-map"></i>  <span className='fst-italic'> Datos </span> </h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-lg-6">
                        <Panel reload={false}>
                            <PanelHeader noButton={false} showExpand={false} showReload={false} showCollapse={true}> <span className='fs-5 my-0'> <i className='fa fa-list-ol'></i> &nbsp; Datos antes</span></PanelHeader>
                            <PanelBody>
                                {Object.entries(dataBefore).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '5px' }}>
                                        <strong>{key}:</strong> {String(value)}
                                    </div>
                                ))}
                            </PanelBody>
                        </Panel>
                    </div>
                    <div className="col-lg-6">
                        <Panel reload={false}>
                            <PanelHeader noButton={false} showExpand={false} showReload={false} showCollapse={true}> <span className='fs-5 my-0'> <i className='fa fa-list-ol'></i> &nbsp; Datos despues</span></PanelHeader>
                            <PanelBody>
                                {Object.entries(dataAfter).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '5px' }}>
                                        <strong>{key}:</strong> {String(value)}
                                    </div>
                                ))}
                            </PanelBody>
                        </Panel>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={() => { setModalMasInfo(false) }}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
            </Modal.Footer>
        </Modal>
        <DataTable title={<span></span>}
            columns={columns}
            data={getDataTables}
            selectableRows={false}
            pagination
            progressPending={getProgressData}
            progressComponent={<div className='panel panel-loading d-flex align-items-center justify-content-center' style={{
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.36)',
                width: '100%',
            }}><span className="spinner-border spinner-border-xl fs-2" role="status" aria-hidden="true" />cargando...</div>}
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
    </>);
}

export default TableList;