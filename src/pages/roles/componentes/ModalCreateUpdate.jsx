import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm, } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import { ReactNotifications } from 'react-notifications-component';
import { messageFinallySesion, messageRegisterDataSuccess, messageUpdateDataSuccess } from './../../../components/alert/alert.jsx';
import { addNotification } from './../../../components/alert/alert.jsx';
import modelUseListPermition, { modelUseCreateRol, modelUseUpdateRol } from './../modelRoles.jsx';
import { modelUseListSelectMenus } from './../../menus/modelMenu.jsx';

const CompModalCreateUpdate = ({ StatusModal, title, CloseModal, updateTableData, data, statusUpdate = false }) => {

    /** use method globales  */
    const useCreateRol = modelUseCreateRol();
    const useListPermition = modelUseListPermition();
    const useUpdateRol = modelUseUpdateRol();
    const useListSelectMenus = modelUseListSelectMenus();
    const navigation = useNavigate();

    const [stateButton, setStateButton] = useState(false);
    const idRef = useRef(data.id);


    /** begin select 2  Permisos*/
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [defaultOptionsRoles, setDefaultOptionsRoles] = useState([]);
    const [getSelectRoles, setSelectRoles] = useState(false);   
    const pageCurrentRoles = useRef(1);
    const inputValueRoles = useRef('');
    const hasMoreRoles = useRef(true);

    const peticionPermisos = async (search, pageNumber) => {
        try {
            setIsLoadingRoles(true);
            const dataReturn = await useListPermition(search, pageNumber);
            setIsLoadingRoles(false);
            if (dataReturn.status) {
                try {
                    /** Se verifica que la pagina actual sea menor a la ultima pagina */
                    if (dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page) {
                        hasMoreRoles.current = true;
                    } else {
                        hasMoreRoles.current = false;
                    }

                    return dataReturn.response.data.results.data;
                } catch (error) {
                    return [];
                }
            } else {
                if (dataReturn.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
                return [];
            }

        } catch (error) {
            console.log(error);
            return [];
        }

    }

    const handleMenuScrollToBottomRoles = async () => {
        if (hasMoreRoles.current) {
            pageCurrentRoles.current = pageCurrentRoles.current + 1;
            const newOptions = await peticionPermisos(inputValueRoles.current, pageCurrentRoles.current);
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsRoles(prev => [...prev, ...newOptions]);
                }
            } catch (error) {

            }
        }
    }

    useEffect(() => {
        if (StatusModal) {
            const fetchPeticionPermisos = async () => {
                const dataReturn = await peticionPermisos("", 1);
                setDefaultOptionsRoles(dataReturn);
            }

            const fetchPeticionMenus = async () => {
                const dataReturn = await peticionMenus("", 1);
                setDefaultOptionsMenus(dataReturn);
            }

            if (data.id !== 0 && idRef.current != data.id) {
                idRef.current = data.id;
                setSelectRoles(data.permissions);
                setSelectMenus(data.menus);
                setValue('id', data.id);
                setValue('name', data.name);
            }

            fetchPeticionPermisos();
            fetchPeticionMenus();
        }

    }, [StatusModal]);
    const loadDataSearchOptionsPermisos = async (inputVal, callback) => {
        inputValueRoles.current = inputVal;
        pageCurrentRoles.current = 1;
        const options = await peticionPermisos(inputVal, pageCurrentRoles.current);
        callback(options);
    };
    /** end select2 permisos*/

    /** begin select2 Menus */
    const [isLoadingMenus, setIsLoadingMenus] = useState(false);
    const [defaultOptionsMenus, setDefaultOptionsMenus] = useState([]);
    const [getSelectMenus, setSelectMenus] = useState(false);
    const pageCurrentMenus = useRef(1);
    const inputValueMenus = useRef('');
    const hasMoreMenus = useRef(true);
    const peticionMenus = async (search, pageNumber) => {
        try {
            setIsLoadingMenus(true);
            const dataReturn = await useListSelectMenus(pageNumber, search);      
            setIsLoadingMenus(false);
            if (dataReturn.status) {
                try {
                    /** Se verifica que la pagina actual sea menor a la ultima pagina */
                    if (dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page) {
                        hasMoreMenus.current = true;
                    } else {
                        hasMoreMenus.current = false;
                    }
                    console.log(dataReturn.response.data.results.data);
                    return dataReturn.response.data.results.data;

                } catch (error) {
                    return [];
                }
            } else {
                if (dataReturn.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
                return [];
            }

        } catch (error) {
            console.log(error);
            return [];
        }

    }
    const handleMenuScrollToBottomMenus = async () => {
        if (hasMoreMenus.current) {
            pageCurrentMenus.current = pageCurrentMenus.current + 1;
            const newOptions = await peticionMenus(inputValueMenus.current, pageCurrentMenus.current);
            console.log(newOptions);
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsMenus(prev => [...prev, ...newOptions]);
                }
            } catch (error) { }
        }
    }
    const loadDataSearchOptionsMenus = async (inputVal, callback) => {
        inputValueRoles.current = inputVal;
        pageCurrentRoles.current = 1;
        const options = await peticionMenus(inputVal, pageCurrentRoles.current);
        callback(options);
    };

    /** end select2 Menus */

    const { register, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm(
        {
            defaultValues: {
                id: data.id ? data.id : 0,
                name: data.name ? data.name : "",
            }
        }
    );

    const onSubmit = async (dataTable) => {
        if (getSelectRoles.length != 0) {
            if (getSelectMenus.length != 0) {
                if (data.id === 0) {
                    delete dataTable.id;
                    setStateButton(true);

                    const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
                    const arrayIdMenus = getSelectMenus.map((elemento) => (elemento.id));
                    dataTable.permissions = arrayIdRoles;
                    dataTable.menus = arrayIdMenus;
                    const returnData = await useCreateRol(dataTable);
                    if (returnData.status) {
                        reserForm();
                        updateTableData(true);
                        messageRegisterDataSuccess();
                    } else {
                        if (returnData.message == "Unauthenticated.") {
                            messageFinallySesion();
                            navigation('/');
                        }
                    }
                    setStateButton(false);
                } else {
                    const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
                    dataTable.permissions = arrayIdRoles;
                    const arrayIdMenus = getSelectMenus.map((elemento) => (elemento.id));
                    dataTable.menus = arrayIdMenus;
                    setStateButton(true);
                    const dataReturn = await useUpdateRol(dataTable);
                    if (dataReturn.status) {
                        messageUpdateDataSuccess();
                        reserForm();
                        updateTableData(true);
                    } else {
                        if (returnData.message == "Unauthenticated.") {
                            messageFinallySesion();
                            navigation('/');
                        }
                    }
                    setStateButton(false);
                }
            } else {
                addNotification('info', 'Aviso', 'Seleccione los menus para el rol', 'top-right', 8000, "fas fa-exclamation-circle", null)
            }
        } else {
            addNotification('info', 'Aviso', 'Seleccione los permisos para el rol', 'top-right', 8000, "fas fa-exclamation-circle", null)
        }
    }

    const reserForm = () => {
        setSelectRoles([]);
        idRef.current = 0;
        CloseModal();
        reset();
    };

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} size="xl" centered={true} backdrop="static" scrollable={true} onHide={reserForm} >
            <Modal.Header closeButton>
                <Modal.Title ><h4 className="modal-title">{title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '350px' }} >
                <form onSubmit={handleSubmit(onSubmit)} id="myFormUsers">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Nombre de rol:</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                defaultValue={data.id}
                                placeholder="nombre"
                                {...register("id", {})}
                            />
                            <input className="form-control"
                                type="text"
                                id="name"
                                defaultValue={data.name}
                                placeholder="nombre"
                                {...register("name", {
                                    required: "El nombre es obligatorio",
                                    pattern: {
                                        value: /^[a-zA-Z\s]+$/u,
                                        message: "Solo se permite texto",
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "El nombre debe tener al menos 4 caracteres",
                                    },
                                })}
                            />
                        </div>
                        {errors.name && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>}

                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Seleccione los permisos:</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadDataSearchOptionsPermisos}
                                defaultOptions={defaultOptionsRoles}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isMulti={true}
                                onMenuScrollToBottom={handleMenuScrollToBottomRoles}
                                onChange={(elemento) => { setSelectRoles(elemento);}}
                                isLoading={isLoadingRoles}
                                placeholder="Seleccione opción..."
                                defaultValue={data.permissions}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="name">Seleccione los menus:</label>
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadDataSearchOptionsMenus}
                                defaultOptions={defaultOptionsMenus}
                                getOptionLabel={(option) => <span> <i className={`${option.icon ? option.icon : ''}`} style={{ color: '#3085d6' }}></i> {option.label} </span>}
                                getOptionValue={(option) => option.id}
                                isMulti={true}
                                onMenuScrollToBottom={handleMenuScrollToBottomMenus}
                                onChange={(elemento) => { setSelectMenus(elemento); }}
                                isLoading={isLoadingMenus}
                                placeholder="Seleccione opción..."
                                defaultValue={data.menus}
                            />
                        </div>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={reserForm}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormUsers" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}
                    &nbsp; Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default CompModalCreateUpdate