import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { addNotification } from '../../components/alert/alert.jsx';

export const modelUseListTable = () => {
    const useListTable = async (getPag = 1, getSortColumn = 'level', getOrder = "asc", getCountRows = 10, getSearh = "") => {

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
        try {
            const respose = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/menus',
                {
                    params: {
                        search: getSearh,
                        page: getPag,
                        include_hierarchy: 1,
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
            returnResponse.response = respose;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            try {
                if (error.response.status === 403) {
                    addNotification('info', 'Aviso', "No tiene permisos para ver los registros", 'top-right', 15000, "fas fa-exclamation-circle", null)
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
    return useListTable;
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
                `${process.env.REACT_APP_API_URL}/api/v1/menus/${idRow}`,
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
                console.log(error);
                returnResponse.status = false;
                try {
                    if (error.response.status === 403) {
                        addNotification('info', 'Aviso', "No tiene permisos para modificar el estado", 'top-right', 15000, "fas fa-exclamation-circle", null)
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
            } catch (error) {
                console.log(error);
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                return returnResponse;
            }
        }
    }
    return useChangeStatus;
}

export const modelUseListSelectMenus = () => {

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


    const useListSelectMenus = async (getPag = 1, getSearh = "", getCountRows = 10, getSortColumn = 'order', getOrder = "asc",) => {

        try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/menus',
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
    return useListSelectMenus;
}