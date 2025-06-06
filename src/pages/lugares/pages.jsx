import HeaderNavbar from "./componentes/HeaderNavbar.jsx";
import TableList from "./componentes/TableList.jsx";
import useRouteAccess from "./../../components/pRoutasCookies.jsx";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import PDFformato from "./../../components/reportes-pdf/reporte-tablas/tablas-pdf.jsx";

const ManagerLugares = () => {
  const hasAccess = useRouteAccess();
  if (!hasAccess) {
    return <div>No tienes acceso a esta página</div>;
  }

  /** Se utiliza para incorporar los datos de busqueda, cuando se tiene datos en el input  */
  const [getDataSearh, setDataSearh] = useState("");
  const searchDataFunction = (data) => {
    setDataSearh(data);
  };

  /** Se utiliza para actualizar la tabla encaso de que se cree un registro nuevo */
  const [getRefreschDataTable, setRefreschDataTable] = useState(false);
  const functionRefreschDataTable = (ref) => {
    setRefreschDataTable(!getRefreschDataTable);
  };

  /** Establece por el parametro a buscar */
  const [getParameterSearh, setParameterSearh] = useState("search");
  const searchDataParameter = (data) => {
    setParameterSearh(data);
  };

  /** Se utiliza para generar el pdf  */
  const [dataTablePdf, setDataTablePdf] = useState([]);

  const functionGeneradorPdf = (dataTableComponent) => {
    setDataTablePdf(dataTableComponent);
  };
  console.log(dataTablePdf);
const funtionActivePdf = async () => {
  // Transformamos los datos antes de enviarlos al componente PDF
  const dataTransformada = dataTablePdf.map((item) => ({
    ...item,
    details: item.details?.trim() ? item.details : "Sin detalle",
  }));

  const blob = await pdf(
    <PDFformato
      data={dataTransformada}
      titulo={"LUGARES"}
      columnas={[
        "Nro.",
        "Codigo",
        "Descripcion",
        "Abreviacion",
        "Fecha de registro",
        "Detalle",
        "Ultima actualizacion",
        "Estado",
      ]}
      styleFontSize={new Array(8).fill({ fontSize: "7px" })}
      styleWightCell={[
        { width: "5%" },
        { width: "10%" },
        { width: "30%" },
        { width: "25%" },
        { width: "15%" },
        { width: "20%" },
        { width: "15%" },
        { width: "25%" },
      ]}
      atributosData={[
        "id",
        "code",
        "description",
        "abbreviation", 
        "created_at",
        "details",
        "updated_at",
        "state.name",
      ]}
      numRowFirtPage={12}
      numRowotherPage={18}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

  return (
    <>
      <div className="card border-0 p-3 table-responsiv rounded-4 container-shadow-card">
        <p
          className="fs-3 fw-bold fst-italic mb-1 text-shadow-sm"
          style={{ textShadow: "2px 2px 5px rgba(0, 0, 0, 0.3)" }}
        >
          Lista de ubicación de oficinas
        </p>

        <HeaderNavbar
          functionRefreschDataTable={functionRefreschDataTable}
          searchData={searchDataFunction}
          searchDataParameter={searchDataParameter}
          funtionActivePdf={funtionActivePdf}
        />
        <TableList
          getRefreschDataTable={getRefreschDataTable}
          getDataSearh={getDataSearh}
          getParameterSearh={getParameterSearh}
          functionGeneradorPdf={functionGeneradorPdf}
        />
      </div>
    </>
  );
};

export default ManagerLugares;
