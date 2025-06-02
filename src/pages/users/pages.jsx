import React, { useState } from "react";
import TableList from "./componentes/TableList.jsx";
import HeaderNavbar from "./componentes/HeaderNavbar.jsx";
import useRouteAccess from "./../../components/pRoutasCookies.jsx";
import { pdf } from "@react-pdf/renderer";
import PDFformato from "./../../components/reportes-pdf/reporte-tablas/tablas-pdf.jsx";

const UsersManager = () => {
  const hasAccess = useRouteAccess();
  if (!hasAccess) {
    return <div>No tienes acceso a esta página</div>;
  }

  /** Date for update de row  */
  const [getStatusCRUD, setStatusCRUD] = useState(false);
  /** Date for update de row  */
  const [getDataSearh, setDataSearh] = useState("");

  const [getParameterSearh, setParameterSearh] = useState("search");

  const updateTableData = (ref) => {
    setStatusCRUD(!getStatusCRUD);
  };

  /** Captura el parametro del input search */
  const searchDataFunction = (data) => {
    setDataSearh(data);
  };

  /** Establece por el parametro a buscar */
  const searchDataParameter = (data) => {
    setParameterSearh(data);
  };
  /** Se utiliza para generar el pdf  */
  const [dataTablePdf, setDataTablePdf] = useState([]);

  const functionGeneradorPdf = (dataTableComponent) => {
    setDataTablePdf(dataTableComponent);
  };

  const funtionActivePdf = async () => {
    // Combinar first_name y last_name en una sola propiedad
    const dataTransformada = dataTablePdf.map((item) => ({
      ...item,
      full_name: `${item.first_name} ${item.last_name}`,
    }));

    const blob = await pdf(
      <PDFformato
        data={dataTransformada}
        titulo="USUARIOS"
        columnas={[
          "Nro.",
          "Nombre", // full_name
          "Usuario",
          "Oficina",
          "Roles",
          "Fecha de registro",
          "Última actualización",
          "Estado",
        ]}
        styleFontSize={[
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
          { fontSize: "7px" },
        ]}
        styleWightCell={[
          { width: "5%" },
          { width: "20%" },
          { width: "15%" },
          { width: "20%" },
          { width: "15%" },
          { width: "10%" },
          { width: "10%" },
          { width: "5%" },
        ]}
        atributosData={[
          "id",
          "full_name", // usamos el nuevo campo combinado
          "username",
          "place.name",
          "roles.name",
          "created_at",
          "updated_at",
          "state.name",
        ]}
        numRowFirtPage={9}
        numRowotherPage={18}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };
//   console.log(atributosData);

  return (
    <>
      <div className="card border-0 p-3 table-responsive rounded-4 container-shadow-card">
        <p
          className="fs-3 fw-bold fst-italic mb-1 text-shadow-sm"
          style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }}
        >
          Gestion de usuarios
        </p>
        <HeaderNavbar
          updateTableData={updateTableData}
          searchData={searchDataFunction}
          searchDataParameter={searchDataParameter}
          funtionActivePdf={funtionActivePdf}
        />
        <TableList
          getStatusCRUD={getStatusCRUD}
          getDataSearh={getDataSearh}
          getParameterSearh={getParameterSearh}
          functionGeneradorPdf={functionGeneradorPdf}
        />
      </div>
    </>
  );
};

export default UsersManager;
