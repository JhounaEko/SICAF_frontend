import React, { useState, useEffect } from 'react';
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'
import { pdf } from "@react-pdf/renderer";
import PDFformato from "./../../components/reportes-pdf/reporte-tablas/tablas-pdf.jsx";

const CargoManager = () => {

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
    const functionGeneradorPdf = (dataTableComponent) =>{
        setDataTablePdf(dataTableComponent);       
     }

    const funtionActivePdf = async () =>{       
        const blob = await pdf(<PDFformato 
            data={dataTablePdf} 
            titulo={"CARGOS"} 
            columnas={['Nro.','Cargo','Descripcion','Fecha de registro','Ultima actualizacion','Estado']}
            styleFontSize = {[{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" },{fontSize: "7px" }]}
            styleWightCell = {[{ width: "10%" }, { width: "30%" }, { width: "40%" }, { width: "25%" }, { width: "25%" }, { width: "20%" }]}
            atributosData = {['id', 'name', 'description', 'created_at', 'updated_at', 'state.name']}
            numRowFirtPage = {12}
            numRowotherPage = {18}
             />).toBlob();   
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    }

    return (<>
        <div className="card border-0 p-3 table-responsive rounded-4 container-shadow-card">
            <p className='fs-3 fw-bold fst-italic mb-1 text-shadow-sm' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>Cargo de empleado</p>
            <HeaderNavbar functionRefreschDataTable={functionRefreschDataTable} searchData={searchDataFunction} searchDataParameter={searchDataParameter} funtionActivePdf={funtionActivePdf} />
            <TableList getRefreschDataTable={getRefreschDataTable} getDataSearh={getDataSearh}  getParameterSearh={getParameterSearh} functionGeneradorPdf={functionGeneradorPdf}/>
        </div>
    </>);
}

export default CargoManager;