import React from 'react';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import App from './../app.jsx';
import ProtectedRoute, { ProtectedRouteLogin } from './ProtectedRoute';
import ExtraError from './../pages/extra/extra-error.js';
import UsersManager from '../pages/users/pages.jsx';
import RolesManager from '../pages/roles/pages.jsx';
import OfficeManager from '../pages/oficinas/pages.jsx';
import Login from './../pages/login/pages.jsx';
import RegisterPublicUser from './../pages/users/registerPublicUsuarios.jsx';
import RegisterPublicPersonal from './../pages/empleados/registerPublicPersonal.jsx';
import ManagerPermisos from './../pages/permisos/pages.jsx';
import CargoManager from './../pages/cargo/pages.jsx';
import EmpleadoManager from './../pages/empleados/pages.jsx';
import ManagerMenu from './../pages/menus/pages.jsx';
import ManagerLugares from './../pages/lugares/pages.jsx';
import ManagerAuditoria from './../pages/auditoria/pages.jsx';
import ManagerInicioAdministrador from './../pages/inicio/administrador/pages.jsx';
import ManagerFuentesFinanciamiento from '../pages/fuentesfinanciamiento/pages.jsx';
import ManagerOrganizacionesFinanciamiento from '../pages/organizaciones/pages.jsx';
import ManagerPresupuestaria from '../pages/presupuestaria/pages.jsx';
import ManagerGroupItem from '../pages/groupitem/pages.jsx';
import ManagerTipoNota from '../pages/tiponota/pages.jsx';
import ManagerNotaIngreso from '../pages/notaingreso/pages.jsx';

const AppRoute = [
	{
		path: '',
		element: <ProtectedRouteLogin> <Login /> </ProtectedRouteLogin>
	},
	{
		path: 'user',
		element: <RegisterPublicUser />
	},
	{
		path: 'personal',
		element: <RegisterPublicPersonal />
	},
	{
		path: '*',
		element: <ProtectedRoute> <App /> </ProtectedRoute>,
		children: [
			{
				path: 'users/',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <UsersManager /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'oficinas/',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <OfficeManager /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'roles/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <RolesManager /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'permisos/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerPermisos /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'cargo/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <CargoManager /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'empleados/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <EmpleadoManager /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'menus/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerMenu /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'auditoria/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerAuditoria /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'lugar/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerLugares /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'inicio/administrador/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerInicioAdministrador /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'fuentesfinanciamiento/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerFuentesFinanciamiento /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'organizaciones/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerOrganizacionesFinanciamiento /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'presupuestaria/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerPresupuestaria /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'groupitem/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerGroupItem /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'tiponota/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerTipoNota /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'notaingreso/*',
				element: <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerNotaIngreso /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{ path: '*', element: <ExtraError /> }
		]
	}
];


export default AppRoute;