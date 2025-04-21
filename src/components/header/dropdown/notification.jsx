<<<<<<< HEAD
import React,{ useEffect, useState, useRef} from 'react';
import Swal from 'sweetalert2';
import {modelReadNotificaciones} from './../modelNotificacion.jsx';
import { use } from 'react';
function DropdownNotification({items, functionRefreshNotificaciones}) {

	const uselReadNotificaciones = modelReadNotificaciones();
	

	// const handleRemoveNotification = (idToRemove) => {
	// 	const updatedNotifications = notifications.filter(item => item.id !== idToRemove);
	
	// };
	
	const viewNotification = ({id, message,created_at}) =>{			
=======
import React from 'react';
import Swal from 'sweetalert2';

function DropdownNotification({items}) {

	const viewNotification = ({id, message,created_at}) =>{
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
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
<<<<<<< HEAD
		}).then ( async  (result) =>{	
			if (result.isConfirmed){				
				const dataReturn = await uselReadNotificaciones(id);
				if (!dataReturn.status) {	
					alert("ocurrio un error");			
				} else {
					functionRefreshNotificaciones("Data");
				}
=======
		}).then ((result) =>{
			if (result.isConfirmed){
				alert("cambiar ver notificacion"+id);
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
			}
		});	
	}

	return (
		<div className="navbar-item dropdown">
			<a href="#/" data-bs-toggle="dropdown" className="navbar-link dropdown-toggle icon">
				<i className="fa fa-bell"></i>
				<span className="badge">{items.length}</span>
			</a>
<<<<<<< HEAD
			<div className="dropdown-menu media-list dropdown-menu-end" style={{ maxHeight: '500px', overflowY: 'auto' }}>
				<div className="dropdown-header" style={{ position: 'sticky', top: '0', left: '0', right: '0', zIndex: '0' }} >NOTIFICACIONES ({items.length})</div>
					{ 
					items.map((item,i)=>(
						<a onClick={() => viewNotification(item)} key={i} className="dropdown-item media">
							<div className="media-left">
								<i className="fa fa-envelope media-object bg-gray-500"></i>
								<i className="fab fa-google text-warning media-object-icon fs-14px"></i>
							</div>
							<div className="media-body"> 
							<h6 className="media-heading" style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								maxWidth: '210px' 
								}}> {item.message}</h6>
								<div className="text-muted fs-10px">{item.created_at}</div>
							</div>
						</a>
					))	
					}						
=======
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
				
>>>>>>> e464a07204caecf46f0420f777c383f669747af4
			</div>
		</div>
	);
};

export default DropdownNotification;
