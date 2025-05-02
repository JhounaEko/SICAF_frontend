import React from 'react';
import { Outlet } from 'react-router-dom';
<<<<<<< HEAD
import Cookies from 'js-cookie';
=======

>>>>>>> 6db992017ba0a6f7330d960638668cd8a498ba8d
import App from './../app.jsx';
import ProtectedRoute , {ProtectedRouteLogin} from './ProtectedRoute';
import DashboardV1 from './../pages/dashboard/dashboard-v1.js';
import DashboardV2 from './../pages/dashboard/dashboard-v2.js';
import DashboardV3 from './../pages/dashboard/dashboard-v3.js';
import UIGeneral from './../pages/ui/ui-general.js';
import UITypography from './../pages/ui/ui-typography.js';
import UITabsAccordion from './../pages/ui/ui-tabs-accordion.js';
import UIModalNotification from './../pages/ui/ui-modal-notification.js';
import UIWidgetBoxes from './../pages/ui/ui-widget-boxes.js';
import UIMediaObject from './../pages/ui/ui-media-object.js';
import UIButtons from './../pages/ui/ui-buttons.js';
import UIIconDuotone from './../pages/ui/ui-icon-duotone.js';
import UIIconFontAwesome from './../pages/ui/ui-icon-fontawesome.js';
import UIIconBootstrap from './../pages/ui/ui-icon-bootstrap.js';
import UIIconSimpleLineIcons from './../pages/ui/ui-icon-simple-line-icons.js';
import UILanguageBarIcon from './../pages/ui/ui-language-bar-icon.js';
import UISocialButtons from './../pages/ui/ui-social-buttons.js';
import FormElements from './../pages/form/form-elements.js';
import FormPlugins from './../pages/form/form-plugins.js';
import FormWizards from './../pages/form/form-wizards.js';
import TableElements from './../pages/table/table-elements.js';
import TablePlugins from './../pages/table/table-plugins.js';
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

const AppRoute = [
	{
		path: '', 
		element: <ProtectedRouteLogin> <Login/> </ProtectedRouteLogin> 
	},	
	{
		path: 'user', 
		element: <RegisterPublicUser/>  
	},
	{
		path: 'personal', 
		element: <RegisterPublicPersonal/>  
	},	
    {
    path: '*', 
    element:<ProtectedRoute> <App /> </ProtectedRoute>,
    children: [    	
    	{
				path: 'dashboard/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'v1', element: <DashboardV1 /> },
					{ path: 'v2', element: <DashboardV2 /> },
					{ path: 'v3', element: <DashboardV3 /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{		
				path: 'users/', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <UsersManager /> },									
					{ path: '*', element: <ExtraError /> }
				]
			},	
			{		
				path: 'oficinas/', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <OfficeManager /> },									
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'roles/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <RolesManager /> },						
					{ path: '*', element: <ExtraError /> }
				]
			},	
			{
				path: 'permisos/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <ManagerPermisos /> },						
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'cargo/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <CargoManager /> },						
					{ path: '*', element: <ExtraError /> }
				]
			},	
			{
				path: 'empleados/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'pages', element: <EmpleadoManager /> },						
					{ path: '*', element: <ExtraError /> }
				]
			},			
			{
				path: 'ui/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'general', element: <UIGeneral /> },
					{ path: 'typography', element: <UITypography /> },
					{ path: 'tabs-accordion', element: <UITabsAccordion /> },
					{ path: 'modal-notification', element: <UIModalNotification /> },
					{ path: 'widget-boxes', element: <UIWidgetBoxes /> },
					{ path: 'media-object', element: <UIMediaObject /> },
					{ path: 'buttons', element: <UIButtons /> },
					{ path: 'icon-duotone', element: <UIIconDuotone /> },
					{ path: 'icon-fontawesome', element: <UIIconFontAwesome /> },
					{ path: 'icon-bootstrap', element: <UIIconBootstrap /> },
					{ path: 'icon-simple-line-icons', element: <UIIconSimpleLineIcons /> },
					{ path: 'language-bar-icon', element: <UILanguageBarIcon /> },
					{ path: 'social-buttons', element: <UISocialButtons /> },
					{ path: '*', element: <ExtraError /> }
				]
			},		
			{
				path: 'form/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'elements', element: <FormElements /> },
					{ path: 'plugins', element: <FormPlugins /> },
					{ path: 'wizards', element: <FormWizards /> },
					{ path: '*', element: <ExtraError /> }
				]
			},
			{
				path: 'table/*', 
				element:  <ProtectedRoute><Outlet /></ProtectedRoute>,
				children: [
					{ path: 'elements', element: <TableElements /> },
					{ path: 'plugins', element: <TablePlugins /> },
					{ path: '*', element: <ExtraError /> }
				]
			},														 		 			
    	{ path: '*', element: <ExtraError /> }
		]
  }
];


export default AppRoute;