import React from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { addNotification } from './../../components/alert/alert.jsx';

export const modelUseCreateRol = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }

    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }

    const useCreateRol = async (dataForm) => {
        try {
            const response = await axios.post(
                process.env.REACT_APP_API_URL + '/api/v1/roles',
                dataForm,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            if (error.response.status === 403) {
                addNotification('info', 'Aviso', "No tiene permisos para registrar cargos", 'top-right', 8000, "fas fa-exclamation-circle", null)
            } else {
                if (error.code == "ERR_BAD_REQUEST") {
                    if (error.response.data.message === "Unauthenticated.") {
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                        returnResponse.message = "Unauthenticated.";
                    } else {
                        addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                    }
                } else {
                    addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                }
            }
            return returnResponse;
        }
    }

    return useCreateRol;
}


export const modelUseUpdateRol = () => {

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
        title: "",
        message: ""
    }

    const useUpdateRol = async (dataForm) => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/roles/${dataForm.id}`,
                dataForm,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + decryptedToken,
                    }
                }
            );

            returnResponse.status = true;
            return returnResponse;

        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            try {
                if (error.response.status === 403) {
                    addNotification('info', 'Aviso', "No tiene permisos para cambiar datos", 'top-right', 8000, "fas fa-exclamation-circle", null)
                } else {
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated.") {
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                            returnResponse.message = "Unauthenticated.";
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                        }
                    } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                    }
                }
                return returnResponse;
            } catch (error) {
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                return returnResponse;
            }
        }
    }
    return useUpdateRol;
}

export const modelUseListRol = () => {

    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }

    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }


    const useListRol = async (getPag, getCountRows, getSearh, getSortColumn = 'id', getOrder = "desc",) => {

        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/roles',
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
                        Authorization: 'Bearer ' + decryptedToken,
                    },
                }
            );
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
            console.log(error)
            if (error.response.status === 403) {
                addNotification('info', 'Aviso', "No tiene permisos para ver lo roles", 'top-right', 8000, "fas fa-exclamation-circle", null)
            } else {
                if (error.code == "ERR_BAD_REQUEST") {
                    if (error.response.data.message === "Unauthenticated.") {                      
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                        returnResponse.message = "Unauthenticated.";
                    } else {
                        addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                    }
                } else {
                    addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                }
            }
            return returnResponse;
        }
    }
    return useListRol;
}

export const modelChangeStatus = () => {
    const useChangeStatus = async (statusRow, idRow) => {
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
        let decryptedToken;
        if (sessionTokenSicaf) {
            decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
        } else {
            decryptedToken = "not session"
        }
        let returnResponse = {
            status: false,
            response: {},
            title: "",
            message: "",
            error: {}
        }
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/roles/${idRow}`,
                {
                    "state_id": (statusRow === "INACTIVO") ? 1 : 2
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + decryptedToken,
                }
            }
            );
            returnResponse.status = true;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            try {
                if (error.response.status === 403) {
                    addNotification('info', 'Aviso', "No tiene permisos para cambiar estados", 'top-right', 8000, "fas fa-exclamation-circle", null)
                } else {
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated.") {
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                            returnResponse.message = "Unauthenticated.";
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                        }
                    } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                    }
                }
                return returnResponse;
            } catch (error) {
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                return returnResponse;
            }
        }
    }
    return useChangeStatus;
}

export const modelGetRol = () =>{
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }
    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }
    const useGetRol = async (idRol) =>{
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/roles/'+idRol,
                {                  
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    },
                }
            );
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
            console.log(error)
            if (error.response.status === 403) {
                addNotification('info', 'Aviso', "No tiene permisos para ver lo roles", 'top-right', 8000, "fas fa-exclamation-circle", null)
            } else {
                if (error.code == "ERR_BAD_REQUEST") {
                    if (error.response.data.message === "Unauthenticated.") {                      
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                        returnResponse.message = "Unauthenticated.";
                    } else {
                        addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                    }
                } else {
                    addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                }
            }
            return returnResponse;
        }
    }

    return useGetRol;
}

const modelUseListPermition = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }
    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }

    const useListPermition = async (search, pageNumber) => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/permissions',
                {
                    params: {
                        state_id: 1,
                        search: search,
                        page: pageNumber,
                        sort_by: 'id',
                        sort_order: 'desc',
                    },
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            returnResponse.response = [];           

            try {
                if (error.response.status === 403) {
                    addNotification('info', 'Aviso', "No tiene permisos para cambiar estados", 'top-right', 8000, "fas fa-exclamation-circle", null)
                } else {
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated.") {
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                            returnResponse.message = "Unauthenticated.";
                        } 
                    }
                }
                return returnResponse;
            } catch (error) {
                return returnResponse;
            }
        }

    }
    return useListPermition;
}

export default modelUseListPermition;