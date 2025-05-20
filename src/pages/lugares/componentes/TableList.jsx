import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus } from './../modelLugares.jsx';
import { ReactNotifications } from 'react-notifications-component';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import { useNavigate } from 'react-router-dom';
//// mod para inicio de reporte PDF
import { pdf } from "@react-pdf/renderer";
import PDFformato from "../../../../src/assets/components/PDF_tablas.jsx";
////
//// mod para inicio de reporte EXCEL
import ExcelExport from "../../../../src/assets/components/EXCEL_tablas.jsx";
////

const TableList = (getDataRefresch) => {

    /** Method globales */
    const navigation = useNavigate();
    const useListTable = modelUseListTable();
    const useChangeStatus = modelChangeStatus();

    /** begin modal update */
    const [modal, setModal] = useState(false);
    const closeModal = () => {
        setModal(false);
    }
    const [getDataModalUpdate, setDataModalUpdate] = useState({ id: 0, });
    /** end modal update */


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
            Swal.fire({
                title: "Se establecio el cambio de estado correctamente",
                text: "",
                icon: "success",
                draggable: true,
                timer: 3000,
                confirmButtonColor: "#3085d6",
            });
        } else {
            if (dataReturn.message == "Unauthenticated.") {
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
            // name: '#',
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Nro.</p>),
            selector: (row, index) => getNumRow + index,
            selectorKey: 'id',
            sortable: true,
            width: '40px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Codigo</p>),
            sortable: true,
            width: '90px',
            selectorKey: 'code',
            cell: (row) => <div className="m-0 p-0"><b>{row.code}</b> </div>,
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Descripción</p>),
            sortable: true,
            omit: false,
            selectorKey: 'description',
            cell: (row) => <div className="m-0 p-0">
                <p className="m-0 p-0" style={{ fontSize: '12px' }}> {row.description}</p>
            </div>,
            width: '150px'
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline' }}>Abreviación</p>),
            cell: (row) => (<p className="m-0 p-0" style={{ fontSize: '12px' }}>{row.abbreviation}</p>),
            selectorKey: 'abbreviation',
            omit: false,
            sortable: true,
            width: '140px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline' }}>Fecha de registro</p>),
            cell: (row) => (<p className="m-0 p-0" style={{ fontSize: '12px' }}>{row.created_at}</p>),
            selectorKey: 'created_at',
            omit: false,
            sortable: true,
            width: '140px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Detalles</p>),
            sortable: true,
            selectorKey: 'details',
            omit: false,
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.details}</p>,
            width: '140px',
        },         
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Ultima actualización</p>),
            sortable: true,
            selectorKey: 'updated_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.updated_at}</p>,
            width: '140px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Estado</p >),
            sortable: true,
            selectorKey: 'state_id',
            cell: (row) => (
                (row.state.name === "ACTIVO") ? (<div className="btn-flex-my">
                    <i className="fas fa-toggle-on fa-2x" style={{ color: "#276BAA" }} onClick={() => changeStatus(row.state.name, row.id)} ></i>
                    <span className="badge badge rounded-pill badge-subtle-success">ACTIVO <i className="fas fa-check"></i></span>
                </div>) :
                    (<div className="btn-flex-my">
                        <i className="fas fa-toggle-off fa-2x" onClick={() => changeStatus(row.state.name, row.id)} ></i>
                        <span className="badge bg-danger rounded-pill" >INACTIVO <i className="fas fa-ban"></i></span>
                    </div>)
            ),
            width: '110px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Acciones</p>),
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                            onChangeRow({
                                id: row.id,
                                code: row.code,
                                description: row.description,
                                abbreviation: row.abbreviation,
                                details: row.details,                               
                            });
                        }}>
                        <i className="fas fa-wrench"></i> Editar
                    </button>
                </>
            ),
        },
    ]

    useEffect(() => {
        const peticionList = async () => {
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
            setProgressData(false);
        }
        peticionList();
    }, [getPag, getSort, getCountRows, getRefreschDataTable, getDataRefresch.getRefreschDataTable, getDataRefresch.getDataSearh]);


    const handleSort = (columnTable, direction) => {
        setSort({ column: columnTable.selectorKey, order: direction });
    };

    // TITULO DE TABLA
    const titulo = 'LUGARES';
    // COLUMNAS
    const childrenTexts = columns.map(col => {
        return col.name?.props || '';
    });
    console.log("Datos que se están enviando al PDF:",titulo, getDataTables);

    return (<>
        <ReactNotifications />

        <CompModalCreateUpdate
            StatusModal={modal}
            title="Editar Registro"
            CloseModal={closeModal}
            dataCurrentRow={getDataModalUpdate}
            functionRefreschDataTable={functionRefreschDataTable}
        />

<div className="d-flex justify-content-end align-items-center mb-3 gap-2">
  {/* //// MOD REPORTE PDF //// */}
  <button
    className="btn btn-sm btn-success"
    onClick={async () => {
      console.log("Datos en el PDF:", getDataTables);
      const blob = await pdf(
        <PDFformato data={getDataTables} titulo={titulo} columnas={childrenTexts} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }}
  >
    <i className="fas fa-file-pdf me-1"></i> Ver PDF
  </button>
  {/* //// FIN MOD PDF //// */}

  {/* //// MOD REPORTE EXCEL //// */}
  <div>
    {/* <ExcelExport data={getDataTables} titulo={titulo} columnas={childrenTexts} /> */}
    <ExcelExport
        titulo={titulo}
        columnas = {["id", "code", "description", "abbreviation", "created_at", "details", "updated_at", "state.name"]}
        data={getDataTables}
      />
  </div>
  {/* //// FIN MOD EXCEL //// */}
</div>

        <DataTable title={<span></span>}
            columns={columns}
            headRowClassName="rdt_TableHead rdt_TableRow"
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
    </>);
}

export default TableList;