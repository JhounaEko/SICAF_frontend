import React,{ useState, useEffect} from 'react';
//import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'
import useRouteAccess from './../../components/pRoutasCookies.jsx'

const ManagerMenu = () => {
    const hasAccess = useRouteAccess();       
    if (!hasAccess) {       
        return <div>No tienes acceso a esta página</div>;
    }

    return ( <> 
        <h1 className="page-header" >Gestion de Menus</h1>
        <div className="card border-0 p-3 rounded-4 container-shadow-card">
            <TableList  />
        </div>
    </> );
    
}
 
export default ManagerMenu;