import React, { useState} from 'react'
import TableList from './componentes/TableList.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'

const UsersManager = () => {

	const hasAccess = useRouteAccess();       
    if (!hasAccess) {       
        return <div>No tienes acceso a esta página</div>;
    }

	/** Date for update de row  */  
	const [getStatusCRUD,setStatusCRUD] = useState(false);
	/** Date for update de row  */  
	const [getDataSearh,setDataSearh] = useState("");

	const [getParameterSearh,setParameterSearh] = useState("search");

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

return (
	<>
		<HeaderNavbar updateTableData={updateTableData} searchData={searchDataFunction} searchDataParameter={searchDataParameter} />
		<TableList getStatusCRUD = {getStatusCRUD} getDataSearh = {getDataSearh} getParameterSearh={getParameterSearh}/>	
	</>
);
}

export default UsersManager;