import React, {useState} from 'react';

import TablaList from './componentes/TableList.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'

const RolesManager = () => {

  const hasAccess = useRouteAccess();       
  if (!hasAccess) {       
      return <div>No tienes acceso a esta página</div>;
  }

  /** Date for update de row  */  
  const [getStatusCRUD,setStatusCRUD] = useState(false);
   /** Date for update de row  */  
  const [getDataSearh,setDataSearh] = useState("");

  const updateTableData = (ref) => {
    setStatusCRUD(!getStatusCRUD);
  };

  const searchDataFunction = (data) => {
    setDataSearh(data);
  };

    return ( <>       
        <HeaderNavbar updateTableData={updateTableData} searchData={searchDataFunction}  />
        <TablaList getStatusCRUD = {getStatusCRUD} getDataSearh = {getDataSearh}  />
    </>);
}
 
export default RolesManager;