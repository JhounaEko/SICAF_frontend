import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ReactNotifications, Store } from "react-notifications-component";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import axios from "axios";
import ModalCreateUpdate from "./ModalCreateUpdate.jsx";
// import PDF from "../../../../src/assets/PDF_tablas_2.jsx";
import PDF from "../../../../src/assets/components/PDF_tablas.jsx";
import { PDFViewer, pdf } from "@react-pdf/renderer";

const TablaList = ({ getStatusCRUD, getDataSearh }) => {
  const [loading, setLoading] = useState(false);
  const [mostrarPDF, setMostrarPDF] = useState(false);
  const [estados, setEstados] = useState([]);

  const addNotification = (
    notificationType,
    notificationTitle,
    notificationMessage,
    notificationPosition,
    duration,
    icon,
    notificationContent
  ) => {
    Store.addNotification({
      title: notificationTitle,
      message: (
        <div>
          <i className={icon} style={{ fontSize: "25px", marginRight: "10px" }}></i>
          {notificationMessage}
        </div>
      ),
      type: notificationType,
      insert: "top",
      container: notificationPosition,
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: duration || 8000 },
      content: notificationContent,
    });
  };

  const handleVerPDF = async () => {
    try {
      setLoading(true);
      const blob = await pdf(<PDF estados={estados} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const [getStatusUpdate, setStatusUpdate] = useState(false);
  const updateTableData = () => setStatusUpdate(!getStatusUpdate);

  const [modal, setModal] = useState(false);
  const [getData, setData] = useState({ id: 0, name: "" });
  const closeModal = () => setModal(false);

  const [getDataTables, setDataTables] = useState([]);
  const [getPag, setPag] = useState(1);
  const [getNumRow, setNum] = useState(1);
  const [getRowTotal, setRowTotal] = useState();
  const [getProgressData, setProgressData] = useState(false);
  const [getCountRows, setCountRows] = useState(10);
  const [getSort, setSort] = useState({ column: "id", order: "desc" });

  const columnRef = [{ Nombre: "name" }];

  const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
  const decryptedToken = sessionTokenSicaf
    ? CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8)
    : "";

  useEffect(() => {
    setProgressData(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/v1/roles?sort_by=${getSort.column}&sort_order=${getSort.order}&page=${getPag}&row_num=${getCountRows}&search=${getDataSearh}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + decryptedToken,
          },
        }
      )
      .then((response) => {
        if (response.data.results) {
          const { data, meta } = response.data.results;
          setRowTotal(meta.total);
          setDataTables(data);
          setNum(meta.from);
          setEstados(data); // <- aquí puedes adaptar si 'estados' viene de otro lado
          console.log(response.data.results.data);
        } else {
          setRowTotal(0);
          setDataTables([]);
          setNum(0);
        }
      })
      .catch((error) => {
        if (error.code === "ERR_NETWORK") {
          addNotification("info", "Problema inesperado", "Revice su conexion", "top-right", 8000, "fas fa-exclamation-circle", null);
        } else if (error.code === "ERR_BAD_REQUEST") {
          addNotification("warning", "Problema inesperado", "El campo de búsqueda sólo permite caracteres.", "top-right", 8000, "fas fa-exclamation-circle", null);
        } else {
          addNotification("danger", "Server", error.response, "top-right", 8000, "fas fa-exclamation-circle", null);
          console.log(error);
        }
      })
      .finally(() => setProgressData(false));
  }, [getPag, getCountRows, getStatusCRUD, getStatusUpdate, getSort, getDataSearh]);

  const columns = [
    {
      name: "#",
      selector: (row, index) => getNumRow + index,
      sortable: false,
      width: "40px",
    },
    { name: "Nombre", sortable: true, cell: (row) => row.name },
    {
      name: "Permisos",
      sortable: false,
      cell: (row) => {
        if (!row.permissions || row.permissions.length === 0) return "Sin permisos";
        return (
          <button className="btn btn-primary">
            <i className="fas fa-eye"></i> Ver permisos
          </button>
        );
      },
    },
    {
      name: "Estado",
      cell: (row) => {
        const estado = row.state?.name || "INACTIVE";
        const isActive = estado === "ACTIVE";
        return (
          <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center p-2">
            <i className={`fas ${isActive ? "fa-check text-success" : "fa-ban text-danger"}`} style={{ fontSize: "20px" }}></i>
            <p>{isActive ? "Activo" : "Inactivo"}</p>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => changeStatus(estado, row.id)}
            >
              Cambiar estado
            </button>
          </div>
        );
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <button
          className="btn btn-sm btn-info"
          onClick={() => onChangeRow({ id: row.id, name: row.name })}
        >
          <i className="fas fa-wrench"></i> Editar
        </button>
      ),
    },
  ];

  const changeStatus = (statusRow, idRow) => {
    Swal.fire({
      title: statusRow === "INACTIVE" ? "¿Está seguro de cambiar el estado a activo?" : "¿Está seguro de cambiar el estado a inactivo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(
            `${process.env.REACT_APP_API_URL}/api/v1/roles/${idRow}`,
            { state_id: statusRow === "INACTIVE" ? 1 : 2 },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + decryptedToken,
              },
            }
          )
          .then(() => {
            setStatusUpdate(!getStatusUpdate);
            Swal.fire({
              title: "Se realizó el cambio correctamente",
              icon: "success",
              timer: 3000,
              confirmButtonColor: "#3085d6",
            });
          })
          .catch((error) => {
            addNotification("danger", "Error al cambiar estado", error.message || "Error desconocido", "top-right", 8000, "fas fa-exclamation-circle", null);
            console.error(error);
          });
      }
    });
  };

  const onChangeRow = (data) => {
    setData(data);
    setModal(true);
  };

  const handleSort = (columnTable, direction) => {
    const key = columnRef.find(col => col[columnTable.name]);
    setSort({ column: key ? key[columnTable.name] : "id", order: direction });
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
{/* REPORTES */}
<div className="d-flex gap-3 mb-3">
  {/* PDF */}
  <button
    className="btn btn-sm btn-danger d-flex align-items-center gap-2"
    onClick={handleVerPDF}
    disabled={loading}
  >
    <i className="fas fa-file-pdf"></i>
    {loading ? "Generando PDF ..." : "PDF"}
  </button>

  {/* EXCEL */}
  <button
    className="btn btn-sm btn-success d-flex align-items-center gap-2"
    // onClick={handleVerExcel}
    onClick={handleVerPDF}
    disabled={loading}
  >
    <i className="fas fa-file-excel"></i>
    {loading ? "Generando Excel ..." : "EXCEL"}
  </button>
</div>

      {mostrarPDF && !loading && (
        <div style={{ height: "600px", border: "1px solid #ddd", marginBottom: "20px" }}>
          <PDFViewer width="100%" height="100%">
            <PDF estados={estados} />
          </PDFViewer>
        </div>
      )}

      <DataTable
        columns={columns}
        data={getDataTables}
        pagination
        progressPending={getProgressData}
        paginationTotalRows={getRowTotal}
        onChangePage={(newPage) => setPag(newPage)}
        onChangeRowsPerPage={(rows) => setCountRows(rows)}
        paginationRowsPerPageOptions={[10, 15, 20]}
        paginationComponentOptions={{
          rowsPerPageText: "Registros por página:",
          rangeSeparatorText: "del Total de",
        }}
        onSort={handleSort}
        paginationServer
        progressComponent={<span><span className="spinner-border spinner-border-sm" /> cargando...</span>}
        noDataComponent={<div className="text-center mt-3">No hay registros disponibles.</div>}
      />
    </>
  );
};

export default TablaList;
