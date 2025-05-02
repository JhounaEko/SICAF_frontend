import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DropdownNotification from './dropdown/notification.jsx';
import DropdownLanguage from './dropdown/language.jsx';
import DropdownProfile from './dropdown/profile.jsx';
import DropdownMegaMenu from './dropdown/mega.jsx';
import Swal from 'sweetalert2';
import { AppSettings } from './../../config/app-settings.js';
import modelUseNotificaciones, { modelReadNotificaciones } from './modelNotificacion.jsx'

import {  useNavigate  } from 'react-router-dom';

function Header() {
	const location = useLocation();
	const navigation = useNavigate ();

	const useNotificaciones = modelUseNotificaciones();
	const uselReadNotificaciones = modelReadNotificaciones();
	const [getListNotificaciones, setListNotificiones] = useState([]);

	const [refreshNotificaciones, setRefreshNotificaciones] = useState(false);

	const functionRefreshNotificaciones = (data) => {
		console.log(data);
		setRefreshNotificaciones(!refreshNotificaciones);
	}

	useEffect(() => {
		const peticionNotificaciones = async () => {
			try {
				setListNotificiones([]);
				const returnResponse = await useNotificaciones()
				if (returnResponse.status) {
					const listNotificacion = returnResponse.response
					listNotificacion.map((item, i) => {

						if (item.data.message == "Se recomienda que actualice su contraseña por razones de seguridad.") {
							Swal.fire({
								title: '<strong>¡Tienes una notificación!</strong>',
								html: `
								<div style="font-size: 60px;">
									<i class="fas fa-bell"></i>
								</div>
								<p>Se recomienda que actualice su contraseña por razones de seguridad.</p>
								`,
								draggable: true,
								confirmButtonColor: "#3085d6",
								confirmButtonText: "ok",
								allowOutsideClick: false,
							}).then(async (result) => {
								if (result.isConfirmed) {
									const returnResponse = await uselReadNotificaciones(item.id);
									console.log(returnResponse);
									if (!returnResponse.status) { console.log(returnResponse.response) }
								}
							});
						} else {
							setListNotificiones(prev => [...prev, {
								id: item.id,
								created_at: item.created_at,
								message: item.data.message
							}]);
						}
					});
				} else {
					if (returnData.message == "Unauthenticated.") {
						Swal.fire({
							title: "Sesion finalizada",
							icon: "success",
							draggable: true,
							timer: 3000,
							confirmButtonColor: "#3085d6",
						});
						navigation('/');
					}
				}
			} catch (error) {

			}
			;
		}

		peticionNotificaciones();

	}, [refreshNotificaciones]);

	return (
		<AppSettings.Consumer>			
			{({ toggleAppSidebarMobile, toggleAppSidebarEnd, toggleAppSidebarEndMobile, toggleAppTopMenuMobile, appHeaderLanguageBar, appHeaderMegaMenu, appHeaderInverse, appSidebarTwo, appTopMenu, appSidebarNone }) => (
				<div id="header" className="app-header" data-bs-theme={appHeaderInverse ? 'dark' : ''}>
					<div className="navbar-header">
						{appSidebarTwo && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarEndMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
						<Link to="/" className="navbar-brand"><span className="navbar-logo"></span> <b>S.I.</b> C.A.F.</Link>

						{appHeaderMegaMenu && (
							<button type="button" className="navbar-mobile-toggler" data-bs-toggle="collapse" data-bs-target="#top-navbar">
								<span className="fa-stack fa-lg text-inverse">
									<i className="far fa-square fa-stack-2x"></i>
									<i className="fa fa-cog fa-stack-1x"></i>
								</span>
							</button>
						)}
						{appTopMenu && !appSidebarNone && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
								<span className="fa-stack fa-lg text-inverse">
									<i className="far fa-square fa-stack-2x"></i>
									<i className="fa fa-cog fa-stack-1x"></i>
								</span>
							</button>
						)}
						{appSidebarNone && appTopMenu && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppTopMenuMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
						{!appSidebarNone && (
							<button type="button" className="navbar-mobile-toggler" onClick={toggleAppSidebarMobile}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
						)}
					</div>

					{appHeaderMegaMenu && (
						<DropdownMegaMenu />
					)}

					<div className="navbar-nav">
						<DropdownNotification items={getListNotificaciones} functionRefreshNotificaciones={functionRefreshNotificaciones} />

						{appHeaderLanguageBar && (
							<DropdownLanguage />
						)}

						<DropdownProfile props={location.state} />

						{appSidebarTwo && (
							<div className="navbar-divider d-none d-md-block"></div>
						)}

						{appSidebarTwo && (
							<div className="navbar-item d-none d-md-block">
								<Link to="/" onClick={toggleAppSidebarEnd} className="navbar-link icon">
									<i className="fa fa-th"></i>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	)
}

export default Header;
