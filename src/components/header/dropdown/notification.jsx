import React from 'react';
import Swal from 'sweetalert2';

function DropdownNotification({items}) {

	const viewNotification = ({id, message,created_at}) =>{
  		Swal.fire({
			title: '<strong>¡Tienes una notificación!</strong>',
			html: `
			  <div style="font-size: 60px;">
				<i class="fas fa-bell"></i>
			  </div>
			  <p>${message} - ${created_at}</p>
			`,		
			draggable: true,
			timer: 10000,
			confirmButtonColor: "#3085d6",
			confirmButtonText: "ok"
		}).then ((result) =>{
			if (result.isConfirmed){
				alert("cambiar ver notificacion"+id);
			}
		});	
	}

	return (
		<div className="navbar-item dropdown">
			<a href="#/" data-bs-toggle="dropdown" className="navbar-link dropdown-toggle icon">
				<i className="fa fa-bell"></i>
				<span className="badge">{items.length}</span>
			</a>
			<div className="dropdown-menu media-list dropdown-menu-end">
				<div className="dropdown-header">NOTIFICATIONS ({items.length})</div>
				{items.map((item,i)=>(
					<a onClick={() => viewNotification(item)} key={i} className="dropdown-item media">
					<div className="media-left">
						<i className="fa fa-envelope media-object bg-gray-500"></i>
						<i className="fab fa-google text-warning media-object-icon fs-14px"></i>
					</div>
					<div className="media-body">
						<h6 className="media-heading"> {item.message}</h6>
						<div className="text-muted fs-10px">{item.created_at}</div>
					</div>
				</a>
				))
				}			
				
			</div>
		</div>
	);
};

export default DropdownNotification;
