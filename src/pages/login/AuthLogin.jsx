import React ,{useState, useContext } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import {  useNavigate  } from 'react-router-dom';
import { Store } from 'react-notifications-component';
import Swal from 'sweetalert2'

function addNotification(notificationType, notificationTitle, notificationMessage, notificationPosition, duration, icon,notificationContent) {		                        
    Store.addNotification({
        title: notificationTitle,
        message: (					
            <div>				
              <i className={icon} style={{ fontSize: '25px', marginRight: '10px' }}></i> {notificationMessage}
            </div>
        ),
        type: notificationType,
        insert: "top",
        container: notificationPosition,
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 8000,			
        },
        content: notificationContent
    });
}

export const useCloseSesion = () => {
    const navigate = useNavigate();

    const CloseSesion = () => {     
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);    
        if(sessionTokenSicaf){
            const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				         
            axios({
                method: "POST",
                url: process.env.REACT_APP_API_URL+'/api/v1/logout',					
                headers: {
                    'Content-Type': 'application/json',   
                    'Authorization': 'Bearer '+decryptedToken,  
                }						
            }).then( response => {           
                Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                navigate('/');               
            }).catch( error => {
                console.log(error);
            });			
        }

            
    }  
    return CloseSesion;
};

export const useInitSesion = () => {   
    const navigate = useNavigate();   
    const InitSesion = (data,checked, {changeOptionBoton}) => {            
			axios.post( process.env.REACT_APP_API_URL+'/api/v1/login',{
					"username": data.username,
					"password": data.password
				},{
				headers: {
				'Content-Type': 'application/json',      
			}}).then( response => {  				  					           
				if (response.data.statusCode === 200) {
					if(checked){                               
						Cookies.set(process.env.REACT_APP_COOKIES_NAME_USER, CryptoJS.AES.encrypt(data.username, process.env.REACT_APP_API_KEY).toString() , { expires: parseInt(process.env.REACT_APP_TIME_COOKIES, 10) }); 
						Cookies.set(process.env.REACT_APP_COOKIES_NAME_PASS , CryptoJS.AES.encrypt(data.password, process.env.REACT_APP_API_KEY).toString() , { expires: parseInt(process.env.REACT_APP_TIME_COOKIES, 10) });               
					} else {
						Cookies.remove(process.env.REACT_APP_COOKIES_NAME_USER);
						Cookies.remove(process.env.REACT_APP_COOKIES_NAME_PASS);              
					}						
					const encript =  CryptoJS.AES.encrypt(response.data.results.access_token, process.env.REACT_APP_API_KEY).toString()
                   // Cookies.set("6nZH4g", CryptoJS.AES.encrypt(response.data.results.access_token, "dQqCSn7hYGH9aguJuWW6nZH4gIyMwd8cgwMUrx84a3b844c1").toString() , { expires: 1 });	//day							
				    Cookies.set((process.env.REACT_APP_COOKIES_NAME_TOKEN).toString(), encript , { expires: parseInt(process.env.REACT_APP_TIME_COOKIES, 10) });	//day										
					let timerInterval;
					Swal.fire({
					title: "Credenciales correctas",
					html: "Iniciando sistema S.I.C.A.F.",
					icon: "success",
					timer: 2000,
					timerProgressBar: true,
					allowOutsideClick: false,
					customClass: {
						popup: 'custom-popup',							
					},
					didOpen: () => {
						Swal.showLoading();						
					},
					willClose: () => {
						clearInterval(timerInterval);
					}
					}).then((result) => {				
					if (result.dismiss === Swal.DismissReason.timer) {						
						delete response.data.results.access_token;							
						delete response.data.results.token_type;	                           									
						navigate('/dashboard/v1', { state: response.data.results }); 
						Cookies.set(process.env.REACT_APP_COOKIES_NAME_DATA, JSON.stringify(response.data.results) , { expires: parseInt(process.env.REACT_APP_TIME_COOKIES, 10) });															
					}
					});			
					} else {														
						addNotification('info', 'Problema inesperado', 'Validacion server', 'top-right',8000, "fas fa-exclamation-circle" ,null)
					}   			                     
			}).catch(error => {   
				console.log(error); 				 
				 if(error.code === "ERR_NETWORK"){			
					addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  
				 } else {
				 	if (error.status === 422){		
						addNotification('danger', 'Problema inesperado', 'Validación server', 'top-right',8000, "fas fa-exclamation-circle" ,null)
						console.log(error)
				 	} else if (error.status === 401) {			
						addNotification('info', 'Credenciales', 'Credenciales incorrectas', 'top-right',8000, "fas fa-exclamation-circle" ,null)	
				 	} else if (error.code == "ERR_BAD_REQUEST") {
						Swal.fire({
							title: "Aviso",
							text:""+error.response.data.message,
							icon: "warning",
							draggable: true,
							timer: 8000,
							confirmButtonColor: "#3085d6",
						});	
					} else {
						addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  
					}
				 	//reset();				 	                
				 }                              
			}).finally( () =>{
				changeOptionBoton(false);
			});    
    }    
    return InitSesion;
}

export default useCloseSesion;