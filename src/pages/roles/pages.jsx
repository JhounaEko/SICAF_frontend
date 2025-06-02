import React, { useState } from 'react';
import TablaList from './componentes/TableList.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'
import { pdf } from "@react-pdf/renderer";
import PDFformato from "./../../components/reportes-pdf/reporte-tablas/tablas-pdf.jsx";

const RolesManager = () => {

  const hasAccess = useRouteAccess();
  if (!hasAccess) {
    return <div>No tienes acceso a esta página</div>;
  }

  /** Date for update de row  */
  const [getStatusCRUD, setStatusCRUD] = useState(false);
  /** Date for update de row  */
  const [getDataSearh, setDataSearh] = useState("");

  const updateTableData = (ref) => {
    setStatusCRUD(!getStatusCRUD);
  };

  const searchDataFunction = (data) => {
    setDataSearh(data);
  };

  /** Establece por el parametro a buscar */
  const [getParameterSearh, setParameterSearh] = useState("search");
	const searchDataParameter = (data) => {
		setParameterSearh(data);
	};
/** Se utiliza para generar el pdf  */
    const [dataTablePdf, setDataTablePdf] = useState([]);
    const functionGeneradorPdf = (dataTableComponent) =>{
        setDataTablePdf(dataTableComponent);       
     }
console.log(dataTablePdf);
    const funtionActivePdf = async () =>{       
        const blob = await pdf(<PDFformato 
            data={dataTablePdf} 
            titulo={"ROLES"} 
            columnas={['Nro.', 'Rol', 'Fecha de registro', 'Ultima actualizacion', 'Cantidad de Permisos', 'Estado']}
            styleFontSize = {[{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" }]}
            styleWightCell = {[{ width: "10%" }, { width: "30%" }, { width: "40%" }, { width: "25%" }, { width: "25%" }, { width: "20%" }]}
            atributosData = {['id', 'name', 'created_at', 'updated_at', 'permissions.length', 'state.name']}
            numRowFirtPage = {12}
            numRowotherPage = {18}
             />).toBlob();   
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }
  return (<>
    <div className="card border-0 p-3 table-responsive rounded-4 container-shadow-card">
      <p className='fs-3 fw-bold fst-italic mb-1 text-shadow-sm' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>Roles de usuario</p>
      <HeaderNavbar updateTableData={updateTableData} searchData={searchDataFunction} searchDataParameter={searchDataParameter} funtionActivePdf={funtionActivePdf} />
      <TablaList getStatusCRUD={getStatusCRUD} getDataSearh={getDataSearh} getParameterSearh={getParameterSearh} functionGeneradorPdf={functionGeneradorPdf} />
    </div>
  </>);
}

export default RolesManager;