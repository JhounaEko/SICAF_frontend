import React, {useState} from 'react';
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'

const OfficeManager = () => {

    const hasAccess = useRouteAccess();       
    if (!hasAccess) {       
        return <div>No tienes acceso a esta página</div>;
    }

    /** Se utiliza para incorporar los datos de busqueda, cuando se tiene datos en el input  */
    const [getDataSearh,setDataSearh] = useState("");
    const searchDataFunction = (data) => {
		setDataSearh(data);
	};

    /** Se utiliza para actualizar la tabla encaso de que se cree un registro nuevo */
    const [getRefreschDataTable,setRefreschDataTable] = useState(false); 
    const functionRefreschDataTable = (ref) => {
		setRefreschDataTable(!getRefreschDataTable);
	};

    return ( <>
        <HeaderNavbar functionRefreschDataTable={functionRefreschDataTable}  searchData={searchDataFunction}  />
        <TableList getRefreschDataTable={getRefreschDataTable}  getDataSearh = {getDataSearh} />
    </> );
}
 
export default OfficeManager;