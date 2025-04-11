import React from 'react';
import useCloseSesion  from './../../../pages/login/AuthLogin.jsx';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

function DropdownProfile({props}) {
	const CloseSesion = useCloseSesion();
	const handleCloseSesion  = () =>{
		Swal.fire({
			title: "¿Esta seguro de cerrar la sesión?",
			icon: "warning",
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

	const userProps = props || JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA))	

	return (
		<div className="navbar-item navbar-user dropdown">
			<a href="#/" className="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
				<img src="/assets/img/user/user8-128x128.jpg" alt="" />
				<span>
					<span className="d-none d-md-inline">{userProps.first_name} {userProps.last_name}</span>
					<b className="caret"></b>
				</span>
			</a>
			<div className="dropdown-menu dropdown-menu-end me-1">
				<span href="#/" className="dropdown-item">{userProps.roles[0].name}</span>
				<a className="dropdown-item" onClick = {handleCloseSesion}>Cerrar sesión</a>
			</div>
		</div>
	);
};

export default DropdownProfile;
