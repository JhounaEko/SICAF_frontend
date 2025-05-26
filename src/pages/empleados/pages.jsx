import Cookies from 'js-cookie';
import React, { useState, useRef } from 'react';
import useRouteAccess from './../../components/pRoutasCookies.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'



const EmpleadoManager = () => {

    const hasAccess = useRouteAccess();
    if (!hasAccess) {
        return <div> No tienes acceso a esta página</div>;
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

    return (<>
        <div className="card border-0 p-3 table-responsive rounded-4 container-shadow-card">
            <p className='fs-3 fw-bold fst-italic mb-1 text-shadow-sm' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>Empleados G.A.M.E.A.</p>
            <HeaderNavbar functionRefreschDataTable={functionRefreschDataTable} searchData={searchDataFunction} searchDataParameter={searchDataParameter}  />
            <TableList getRefreschDataTable={getRefreschDataTable} getDataSearh={getDataSearh} getParameterSearh={getParameterSearh} />
        </div>
    </>);
}

export default EmpleadoManager;