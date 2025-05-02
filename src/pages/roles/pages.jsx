import React, {useState} from 'react';

import TablaList from './componentes/TableList.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'

const RolesManager = () => {

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