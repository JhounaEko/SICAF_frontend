import React from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';
import { slideToggle } from './../../composables/slideToggle.js';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useCloseSesion from './../../pages/login/AuthLogin.jsx';
function SidebarProfile() {
	function handleProfileExpand(e) {
		e.preventDefault();
		
		var targetSidebar = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
		var targetMenu = e.target.closest('.menu-profile');
		var targetProfile = document.querySelector('#appSidebarProfileMenu');
		var expandTime = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 250;
	
		if (targetProfile) {
			if (targetProfile.style.display === 'block') {
				targetMenu.classList.remove('active');
			} else {
				targetMenu.classList.add('active');
			}
			slideToggle(targetProfile, expandTime);
			targetProfile.classList.toggle('expand');
		}
	}
  
	const CloseSesion = useCloseSesion();
	const navigation = useNavigate();
	const userProps = JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA))
	if (userProps) { } else {
		navigation('/');
	}

	const handleCloseSesion = () => {
		Swal.fire({
			title: '<strong>¿Esta seguro de cerrar sesion?</strong>',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			cancelButtonText: "Cancelar",
			confirmButtonText: "Cerrar sesión"
		}).then((result) => {
			if (result.isConfirmed) {
				CloseSesion();
			}
		});
	}
	return (
		<AppSettings.Consumer>
			
			{({appSidebarMinify}) => (
				<div className="menu">
					<div className="menu-profile">
						<Link to="/" onClick={handleProfileExpand} className="menu-profile-link">
							<div className="menu-profile-cover with-shadow"></div>
							<div className="menu-profile-image">
								<img src="" alt="" />
							</div>
							<div className="menu-profile-info">
								<div className="d-flex align-items-center">
									<div className="flex-grow-1">
										S.I.C.A.F.
									</div>
									<div className="menu-caret ms-auto"></div>
								</div>
								<small>Sistemas de Información y Control de Activos Fijos</small>
							</div>
						</Link>
					</div>
					<div id="appSidebarProfileMenu" className="collapse">
						<div className="menu-item pt-5px">
							<div className="menu-link">
								<div className="menu-icon"><i className="fa fa-user"></i></div>
								<div className="menu-text">{userProps.first_name} {userProps.last_name}</div>
							</div>
						</div>
						<div className="menu-item">
							<div className="menu-link">
								<div className="menu-icon"><i class="fa fa-caret-right"></i></div>
								<div className="menu-text"> <b>ROL</b> {userProps.roles[0].name}</div>
							</div>
						</div>
						<div className="menu-item pb-5px">
							<a className="menu-link" onClick={handleCloseSesion}>
								<div className="menu-icon"><i className="fas fa-sign-out-alt fa-1_5x" style={{ "color": "#f13d1e" }}></i></div>
								<div className="menu-text"> Cerrar sesión</div>
							</a>
						</div>
						<div className="menu-divider m-0"></div>
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	)
}

export default SidebarProfile;