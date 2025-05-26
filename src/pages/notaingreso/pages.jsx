import { useState } from 'react';
import HeaderNavbar from './componentes/HeaderNavbar.jsx'
import TableList from './componentes/TableList.jsx'
import useRouteAccess from '../../components/pRoutasCookies.jsx'

const ManagerNotaIngreso = () => {

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

    /**  nota, recibo de pago,  numero de pago, recibo de gastos, cantidad DFM, fecha DFM, Fecha DFM, Fecha de registro, ultima actulizacion*/
    const [columnsShow, setColumnsShow] = useState([true, true, true, true, true, true, true, true]);
    const filterColumn = (newValue, index) => {      
        setColumnsShow((prev) => {
    const updated = [...prev];     
    updated[index] = newValue;     
    return updated;               
  });
    }

    return (<>
        <div className="card border-0 rounded-4 p-3 table-responsive container-shadow-card">
            <p className='fs-3 fw-bold fst-italic mb-1 text-shadow-sm' style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' }}>Notas de ingreso</p>
            <HeaderNavbar functionRefreschDataTable={functionRefreschDataTable} searchData={searchDataFunction} searchDataParameter={searchDataParameter} filterColumn={filterColumn} />
            <TableList getRefreschDataTable={getRefreschDataTable} getDataSearh={getDataSearh} getParameterSearh={getParameterSearh} columnsShow={columnsShow} />
        </div>
    </>);
}

export default ManagerNotaIngreso;