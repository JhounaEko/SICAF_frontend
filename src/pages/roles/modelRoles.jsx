import React from 'react';
import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import {addNotification} from './../../components/alert/alert.jsx';

export const modelUseCreateRol = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
    const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     

    let returnResponse = {
        status: false,
        response: {},
        title:"",
        message:""
    }
    
    const useCreateRol = async (dataForm) =>{
        try {
            const response = await axios.post(
                process.env.REACT_APP_API_URL+'/api/v1/roles',
                dataForm,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
             if (error.code === "ERR_BAD_REQUEST") {
                addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            } else {
                addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            }
            console.log(error);
            return returnResponse;
        }        
    }

    return useCreateRol;
}


export const modelUseUpdateRol = () => {

    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
    const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     

    let returnResponse = {
        status: false,
        response: {},
        title:"",
        message:""
    }

    const useUpdateRol = async (dataForm) =>{
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/roles/${dataForm.id}`,
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
            returnResponse.status = false;
            if (error.code === "ERR_BAD_REQUEST") {
                addNotification('info', 'Aviso', error.response.data.message, 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            } else {
                addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            }
            console.log(error);
            return returnResponse;
        }       
    }
    return useUpdateRol;
}

export const modelUseListRol = () => {

    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
    const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     

    let returnResponse = {
        status: false,
        response: {},
        title:"",
        message:""
    }


    const useListRol = async (getPag, getCountRows, getSearh, getSortColumn = 'id', getOrder ="desc",) =>{

        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL+'/api/v1/roles',
                /** sort_by=id&sort_order=desc&page=${getPag}&row_num=${getCountRows}&search=${getStatusCRUD.getDataSearh */
                {
                    params: {
                        state_id: 1,
                        search: getSearh,
                        page: getPag,
                        sort_by: getSortColumn,
                        sort_order: getOrder,
                        row_num: getCountRows
                    },
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    },
                }
            ); 
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;          
            if(error.code === "ERR_NETWORK"){			
                addNotification('info', 'Problema inesperado', 'Revice su conexion', 'top-right',8000, "fas fa-exclamation-circle" ,null)  			
            } 
            console.log(error)
            return returnResponse;
        }                                                                                                                                        
    }
    return useListRol;
}

const modelUseListPermition = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
    const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 	     

    let returnResponse = {
        status: false,
        response: {},
        title:"",
        message:""
    }

    const useListPermition = async (search, pageNumber) =>{
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL+'/api/v1/permissions',
                {
                    params: {
                        state_id: 1,
                        search: search,
                        page: pageNumber,
                        sort_by: 'id',
                        sort_order: 'desc',
                        },
                    headers:{
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
            returnResponse.response = [];
            return returnResponse;
        }
       
    }
    return useListPermition;
}
 
export default modelUseListPermition;