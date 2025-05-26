import React, { useState } from 'react';

import TablaList from './componentes/TableList.jsx'
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'

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

  return (<>
    <div className="card border-0 p-3 table-responsive rounded-4 container-shadow-card">
      <p className='fs-3 fw-bold fst-italic mb-1 text-shadow-sm' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>Roles de usuario</p>
      <HeaderNavbar updateTableData={updateTableData} searchData={searchDataFunction} searchDataParameter={searchDataParameter} />
      <TablaList getStatusCRUD={getStatusCRUD} getDataSearh={getDataSearh} getParameterSearh={getParameterSearh}/>
    </div>
  </>);
}

export default RolesManager;