import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { modelUseListTable, modelChangeStatus } from './../modelCargo.jsx';
import { ReactNotifications } from 'react-notifications-component';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import { useNavigate } from 'react-router-dom';
//// mod para inicio de reporte PDF
import { pdf } from "@react-pdf/renderer";
import PDFformato from "../../../../src/assets/components/PDF_tablas.jsx";
////

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
            // name: "#",
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Nro.</p>),
            selector: (row, index) => getNumRow + index,
            selectorKey: 'id',
            sortable: true,
            width: '40px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Nombre permiso</p>),
            sortable: true,
            width: '170px',
            selectorKey: 'name',
            cell: (row) => <p>{row.name}</p>,
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Descripcion</p>),
            sortable: true,
            width: '300px',
            selectorKey: 'description',
            cell: (row) => <p>{row.description}</p>,
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Fecha de registro</p>),
            sortable: true,
            selectorKey: 'created_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.created_at}</p>,
            width: '180px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px', textDecoration: 'underline' }}>Ultima actualización</p>),
            sortable: true,
            selectorKey: 'created_at',
            cell: (row) => <p style={{ fontSize: '14px' }}> {row.updated_at}</p>,
            width: '180px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Estado</p>),
            sortable: true,
            selectorKey: 'state_id',
            cell: (row) => (
                (row.state.name === "ACTIVO") ? (<div className="btn-flex-my" title = "Estado actual del registro activo">
                    <i className="fas fa-toggle-on fa-2x" style={{ color: "#276BAA" }} onClick={() => changeStatus(row.state.name, row.id)} ></i>
                    <span className="badge badge rounded-pill badge-subtle-success">ACTIVO <i className="fas fa-check"></i></span>
                </div>) :
                    (<div className="btn-flex-my" title = "Estado actual del registro inactivo">
                        <i className="fas fa-toggle-off fa-2x" onClick={() => changeStatus(row.state.name, row.id)} ></i>
                        <span className="badge bg-danger rounded-pill" >INACTIVO <i className="fas fa-ban"></i></span>
                    </div>)
            ),
            width: '120px',
        },
        {
            name: (<p className="m-0" style={{ fontWeight: 'bold', fontSize: '15px' }}>Acciones</p>),
            sortable: false,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-info"
                        onClick={() => {
                            onChangeRow({
                                id: row.id,
                                name: row.name,
                                description: row.description,
                            })
                        }}>
                        <i className="fas fa-wrench"></i> Editar
                    </button>
                </>
            )
        }

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
    const titulo = 'CARGOS';
    const childrenTexts = columns.map(col => {
//   return col.name?.props?.children || '';
  return col.name?.props || '';
});
// console.log("Children:", childrenTexts);

    // console.log("COLUMS:",columns);
    console.log("Datos que se están enviando al PDF:",titulo, getDataTables, childrenTexts);

    return (<>
        <ReactNotifications />

        <CompModalCreateUpdate
            StatusModal={modal}
            title="Editar Cargo"
            CloseModal={closeModal}
            dataCurrentRow={getDataModalUpdate}
            functionRefreschDataTable={functionRefreschDataTable}
        />

{/* //// MOD REPORTE PDF //// */}
<div className="mb-3 text-end">
<button
    className="btn btn-sm btn-success"
    onClick={async () => {
    // console.log("Datos que se están enviando al PDF:", getDataTables);
    const blob = await pdf(<PDFformato data={getDataTables} titulo={titulo} columnas={childrenTexts} />).toBlob(); //  `data` así se espera en el componente
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    }}
>
    <i className="fas fa-file-pdf me-1"></i> Ver PDF
</button>
</div>
{/* //// FIN MOD PDF //// */}

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
    </>);
}

export default TableList;