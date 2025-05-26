import React, { useState } from 'react';
import HeaderDataCard from './componentes/headerDataCard.jsx'
import GraficosItem from './componentes/graficosItem.jsx'
import useRouteAccess from './../../../components/pRoutasCookies.jsx'

const ManagerInicioAdministrador = () => {

	const hasAccess = useRouteAccess();
	if (!hasAccess) {
		return <div>No tienes acceso a esta página</div>;
	}

	return (<>
		<HeaderDataCard/>
		<GraficosItem/>
	</>);
}

export default ManagerInicioAdministrador;