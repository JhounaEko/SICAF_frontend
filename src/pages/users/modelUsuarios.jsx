import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import {addNotification} from './../../components/alert/alert.jsx';

export const modelUseCreate = () => {

    const useCreate = async (dataForm) => {
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        let decryptedToken;
        if(sessionTokenSicaf){
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        } else {
            decryptedToken = "not session" 
        }    
        let returnResponse = {
            status: false,
            title:"",
            message:""
        }
    
        try{
            const response = await axios.post(
                process.env.REACT_APP_API_URL+'/api/v1/users',                
                    dataForm
                ,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.message = response.data.results.id;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            try {
                if(error.response.status === 403){                    
                    addNotification('info', 'Aviso', "No tiene permisos para registrar cargos", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                              
                } else{
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated."){                                                                          
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                            returnResponse.message = "Unauthenticated.";                              
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                            
                        }     
                    } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                      
                    }
                }
                return returnResponse; 
            } catch(error){
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                return returnResponse;    
            }               
        }  
    }
    return useCreate;
}

export const modelChangeStatus = () =>{
    const useChangeStatus = async (statusRow, idRow) =>{
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        let decryptedToken;
        if(sessionTokenSicaf){
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        } else {
            decryptedToken = "not session" 
        }
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:"",
            error:{}
        }
       try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/users/${idRow}` ,
                {
                    "state_id": (statusRow === "INACTIVO")? 1 : 2 
                }, {
                    headers: {
                        'Content-Type': 'application/json',    
                        'Authorization': "Bearer "+decryptedToken,  
                    }  
                }
            );
            returnResponse.status=true;
            return returnResponse;
       } catch (error) {
            console.log(error);
            returnResponse.status=false;
            try {
                if(error.response.status === 403){                    
                    addNotification('info', 'Aviso', "No tiene permisos para cambiar estados", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                            
                } else{
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated."){                                                                          
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                            returnResponse.message = "Unauthenticated.";                              
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                            
                        }
                } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                  
                    }
                }
                return returnResponse;
            } catch(error){
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                return returnResponse;    
            }      
       }        
    }
    return useChangeStatus;
}

export const modelUseListTable = () =>{
    const useListTable = async (getPag = 1, getSortColumn = 'id', getOrder ="desc", getCountRows = 10 ,getParameterSearh ="search" , getSearh = "") => {

        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        let decryptedToken;
        if(sessionTokenSicaf){
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        } else {
            decryptedToken = "not session" 
        }
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:""
        }
        try {
            const respose = await axios.get(
                process.env.REACT_APP_API_URL+'/api/v1/users', 
                {
                    params: {
                        state_id: 1,                       
                        page: getPag,
                        sort_by: getSortColumn,
                        sort_order: getOrder,                      
                        row_num: getCountRows,
                        [getParameterSearh]:getSearh
                    },
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    },
                }
            );
            returnResponse.status =true;
            returnResponse.response =respose;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status =false;
            try {
                if(error.response.status === 403){                    
                    addNotification('info', 'Aviso', "No tiene permisos para ver los usuarios", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                    return returnResponse;
                } else{
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated."){                          
                            console.log("sesion close");                         
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                            returnResponse.message = "Unauthenticated.";
                            return returnResponse;  
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                            return returnResponse;        
                        }                    
                    } else {
                        if (getSearh == ""){
                            addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          

                        }
                        return returnResponse;
                    }
                }
            } catch(error){
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                return returnResponse;    
            }  
        }      
    }
    return useListTable;
}

export const modelChageDataRow = () =>{
    const useChangeDataRow = async (dataForm) =>{
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:"",
            error:{}
        }
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        let decryptedToken;
        if(sessionTokenSicaf){
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        } else {
            decryptedToken = "not session" 
        }

        try {
            const respose = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/users/${dataForm.id}`  ,
                  dataForm,
                  {
                      headers: {
                          'Content-Type': 'application/json',    
                          'Authorization': "Bearer "+decryptedToken,  
                      }  
                  }
              );
            returnResponse.status = true; 
            return returnResponse;          
        } catch (error) {
            console.log(error);
            returnResponse.status = false; 
            try {
                if(error.response.status === 403){                    
                    addNotification('info', 'Aviso', "No tiene permisos para cambiar datos", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                              
                } else{
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated."){                                                                                   
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                            returnResponse.message = "Unauthenticated.";                         
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                         
                        }  
                    } else {                        
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                                        
                    }
                }
                return returnResponse;
            } catch(error){
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                return returnResponse;    
            } 
        }            
    }
    return useChangeDataRow;  
}

export const modelEnableChangePassword = () =>{
    const useEnableChangePassword = async (idUser) =>{
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:"",
            error:{}
        }
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        let decryptedToken;
        if(sessionTokenSicaf){
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     
        } else {
            decryptedToken = "not session" 
        }

        try {
            const respose = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/users/${idUser}/reset-password-change-limit`,
                {},
                {
                  headers: {
                      'Content-Type': 'application/json',    
                      'Authorization': "Bearer "+decryptedToken,  
                  }  
                }
            );
            returnResponse.status = true; 
            return returnResponse;          
        } catch (error) {
            console.log(error);
            returnResponse.status = false; 
            try {
                if(error.response.status === 403){                    
                    addNotification('info', 'Aviso', "No tiene permisos", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                              
                } else{
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated."){                          
                            console.log("sesion close");                         
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                            returnResponse.message = "Unauthenticated.";                         
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                         
                        }                    
                    } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                                                  
                    }
                }
                return returnResponse;
            } catch(error){
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right',8000, "fas fa-exclamation-circle" ,null)	                          
                return returnResponse;    
            } 
        }    
    }
    return useEnableChangePassword;
}