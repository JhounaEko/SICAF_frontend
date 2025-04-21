import React,{ useState, useEffect} from 'react';
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'

const ManagerPermisos = () => {

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

    return (  <>
        <HeaderNavbar functionRefreschDataTable={functionRefreschDataTable}  searchData={searchDataFunction}  />
        <TableList getRefreschDataTable={getRefreschDataTable}  getDataSearh = {getDataSearh} />
    </>);
}
 
export default ManagerPermisos;