import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from './../modelEmpleados.jsx';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';
import { ReactNotifications } from 'react-notifications-component';
import { validacionesFirstName, validacionesLastName, validacionesCI, validacionesComplementoCi, validacionesCelular, validacionesEmail, separarValorCiComplemento } from './../../../components/validaciones/validaciones.jsx';
import { modelUseListSelect } from './../../oficinas/modelOficina.jsx';
import { modelUseListCargoSelect } from './../../cargo/modelCargo.jsx';
import { useNavigate } from 'react-router-dom';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const useListSelect = modelUseListSelect();
    const useListCargoSelect = modelUseListCargoSelect();
    const navigation = useNavigate();

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => {

        if (getSelectOficce) {
            setSelectOficceStatus(false)
            if (getSelectCargo) {
                setSelectCargoStatus(false)
                setStateButton(true);
                /** Se utiliza para registrar datos */
                if (dataForm.id == 0) {
                    dataForm.office_location_id = getSelectOficce.id
                    dataForm.position_id = getSelectCargo.id
                    const result = await useCreate(dataForm);
                    if (result.status) {
                        reserForm();
                        functionRefreschDataTable();
                        Swal.fire({
                            title: "Registro exitoso",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        if (result.message == "Unauthenticated.") {
                            Swal.fire({
                                title: "Sesion finalizada",
                                icon: "success",
                                draggable: true,
                                timer: 3000,
                                confirmButtonColor: "#3085d6",
                            });
                            navigation('/');
                        }
                    }
                    /** Se utiliza para modificar datos permiso, cuando se pulsa en el boton guardar */
                } else {
                    dataForm.office_location_id = getSelectOficce.id
                    dataForm.position_id = getSelectCargo.id
                    const result = await useChangeDataRow(dataForm);
                    if (result.status) {
                        reserForm();
                        functionRefreschDataTable();
                        Swal.fire({
                            title: "Datos actualizado correctamente",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                    } else {
                        if (result.message == "Unauthenticated.") {
                            Swal.fire({
                                title: "Sesion finalizada",
                                icon: "success",
                                draggable: true,
                                timer: 3000,
                                confirmButtonColor: "#3085d6",
                            });
                            navigation('/');
                        }
                    }
                }
                setStateButton(false);
            } else {
                setSelectCargoStatus(true)
            }
        } else {
            setSelectOficceStatus(true)
        }      
    }


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        setSelectOficce(null);
        CloseModal();
    };

    if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
        idRef.current = dataCurrentRow.id;
        setValue('id', dataCurrentRow.id);
        setValue('first_name', dataCurrentRow.first_name);
        setValue('last_name', dataCurrentRow.last_name);
        setValue('phone_number', dataCurrentRow.phone_number);
        setValue('email', dataCurrentRow.email);
        const ci = separarValorCiComplemento(dataCurrentRow.identity_card);
        setValue('identity_card', ci.numCi);
        setValue('complement', ci.ciComplemento);
        setValue('issued_by', (dataCurrentRow.issued_by == "") ? "S/E" : dataCurrentRow.issued_by);
    }



    /** ============================================ Select Cargo ========================================*/

    const pageCurrentCargo = useRef(1);
    const inputValueCargo = useRef('');
    const hasMoreCargo = useRef(true);
    const [isLoadingCargo, setIsLoadingCargo] = useState(false);
    const [getSelectCargo, setSelectCargo] = useState();
    const [getSelectCargoStatus, setSelectCargoStatus] = useState(false);
    const [defaultOptionsCargo, setDefaultOptionsCargo] = useState([]);

    const peticionCargo = async (search, pageNumber) => {
        try {
            setIsLoadingCargo(true);

            const returnData = await useListCargoSelect(pageNumber, 'id', 'desc', 10, search);

            if (returnData.status) {
                if (returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page) {
                    hasMoreOffice.current = true;
                } else {
                    hasMoreOffice.current = false;
                }
                if (returnData.response.data.results.data) {
                    return returnData.response.data.results.data;
                } else {
                    return [];
                }
            } else {
                if (returnData.message == "Unauthenticated.") {
                    Swal.fire({
                        title: "Sesion finalizada",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                    navigation('/');
                }
                return [];
            }
        } catch (error) {
            console.log(error)
            return [];
        } finally {
            setIsLoadingCargo(false);
        }
    }

    /** Buscador de select office, se ejecuta una petición */
    const loadOptionsCargo = async (inputVal, callback) => {
        inputValueCargo.current = inputVal;
        pageCurrentCargo.current = 1;
        const options = await peticionCargo(inputVal, pageCurrentCargo.current);
        callback(options);
    };

    /** Controla el scroll del select Cargo */
    const handleMenuScrollToBottomCargo = async () => {
        if (hasMoreCargo.current) {
            pageCurrentCargo.current = pageCurrentCargo.current + 1;
            const newOptions = await peticionCargo(inputValueOffice.current, pageCurrentCargo.current);
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsCargo(prev => [...prev, ...newOptions]);
                }
            } catch (error) {

            }
        }
    }


    /** ============================================ Select Office ========================================*/

    const pageCurrentOffice = useRef(1);
    const inputValueOffice = useRef('');
    const hasMoreOffice = useRef(true);
    const [isLoadingOffice, setIsLoadingOffice] = useState(false);
    const [getSelectOficce, setSelectOficce] = useState(
        (dataCurrentRow.id === 0) ? null : dataCurrentRow.office
    );
    const [getSelectOficceStatus, setSelectOficceStatus] = useState(false);
    const [defaultOptionsOffice, setDefaultOptionsOffice] = useState([]);


    const peticionOficce = async (search, pageNumber) => {
        try {
            setIsLoadingOffice(true);

            const returnData = await useListSelect(search, pageNumber);

            if (returnData.status) {
                if (returnData.response.data.results.meta.current_page < returnData.response.data.results.meta.last_page) {
                    hasMoreOffice.current = true;
                } else {
                    hasMoreOffice.current = false;
                }
                if (returnData.response.data.results.data) {
                    return returnData.response.data.results.data;
                } else {
                    return [];
                }
            } else {
                if (returnData.message == "Unauthenticated.") {
                    Swal.fire({
                        title: "Sesion finalizada",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                    navigation('/');
                }
                return [];
            }
        } catch (error) {
            console.log(error)
            return [];
        } finally {
            setIsLoadingOffice(false);
        }
    }

    /** Buscador de select office, se ejecuta una petición */
    const loadOptionsOffice = async (inputVal, callback) => {
        inputValueOffice.current = inputVal;
        pageCurrentOffice.current = 1;
        const options = await peticionOficce(inputVal, pageCurrentOffice.current);
        callback(options);
    };

    /** Permite cargar los primeros datos de la pagina 1 (datos oficina) */
    useEffect(() => {
        const fetchPeticion = async () => {
            if (StatusModal) {
                const response = await peticionOficce("", 1);
                setDefaultOptionsOffice(response);

                const responseCargo = await peticionCargo("", 1);
                setDefaultOptionsCargo(responseCargo);
            }
        }
        fetchPeticion();
    }, [StatusModal]);

    /** Controla el scroll del select office */
    const handleMenuScrollToBottom = async () => {
        if (hasMoreOffice.current) {
            pageCurrentOffice.current = pageCurrentOffice.current + 1;
            const newOptions = await peticionOficce(inputValueOffice.current, pageCurrentOffice.current);
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsOffice(prev => [...prev, ...newOptions]);
                }
            } catch (error) {

            }
        }
    }

    useEffect(() => {
        if (dataCurrentRow.office_location) {
            setSelectOficce(dataCurrentRow.office_location);
        }

        if (dataCurrentRow.position) {
            setSelectCargo(dataCurrentRow.position);
        }

    }, [dataCurrentRow.office_location, dataCurrentRow.position]);

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fas fa-briefcase fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormCargo">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="first_name">Nombre de empleado</label>
                                    <input className="form-control"
                                        type="hidden"
                                        id="id"
                                        defaultValue={dataCurrentRow.id}
                                        placeholder=""
                                        {...register("id", {})}
                                    />
                                    <input className="form-control"
                                        type="text"
                                        id="first_name"
                                        placeholder="nombre del empleado"
                                        {...register("first_name", validacionesFirstName)}
                                    />
                                    {errors.first_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
                                </div>
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="last_name">Apellido (s)</label>
                                    <input className="form-control"
                                        type="text"
                                        id="last_name"
                                        placeholder="apellidos"
                                        {...register("last_name", validacionesLastName)}
                                    />
                                    {errors.last_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.last_name.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="row gx-3">
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <label className="required mb-2 fs-10 fw-bold">C.I.</label>
                                    <input type="text"
                                        className="form-control fs-13px"
                                        id="identity_card"
                                        placeholder="celula de identidad"
                                        {...register("identity_card", validacionesCI)}
                                    />
                                    {errors.identity_card && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.identity_card.message)}</div>}
                                </div>
                                <div className="col-md-4 mb-2 mb-md-0">
                                    <label className="mb-2 fs-10 fw-bold">Complemento</label>
                                    <input type="text"
                                        className="form-control fs-13px"
                                        id="complement"
                                        placeholder="Complemento"
                                        {...register("complement", validacionesComplementoCi)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="mb-2 fs-10 fw-bold">Expedido </label>
                                    <select
                                        id="issued_by"
                                        name="issued_by"
                                        className="form-select fs-13px"
                                        defaultValue="S/E"
                                        {...register("issued_by", {
                                            required: "Campo obligatorio",
                                        })}
                                    >
                                        <option value="LP">LP</option>
                                        <option value="CH">CH</option>
                                        <option value="CB">CB</option>
                                        <option value="OR">OR</option>
                                        <option value="PT">PT</option>
                                        <option value="TJ">TJ</option>
                                        <option value="SC">SC</option>
                                        <option value="BE">BE</option>
                                        <option value="PD">PD</option>
                                        <option value="S/E">S/E</option>
                                    </select>
                                    {errors.issued_by && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.issued_by.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-6 mb-2 mb-md-0">
                                    <label className="required form-label" htmlFor="email"> <i className='fas fa-at'></i>&nbsp; Correo</label>
                                    <input className="form-control"
                                        type="text"
                                        id="email"
                                        placeholder="correo"
                                        {...register("email", validacionesEmail)}
                                    />
                                    {errors.email && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.email.message)}</div>}
                                </div>
                                <div className="col-md-6 mb-2 mb-md-0">
                                    <label className="required form-label" htmlFor="phone_number"> <i className='fas fa-mobile'></i>&nbsp; Celular</label>
                                    <input className="form-control"
                                        type="number"
                                        id="phone_number"
                                        placeholder="número de celular"
                                        {...register("phone_number", validacionesCelular)}
                                    />
                                    {errors.phone_number && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="form-group row mb-3">
                            <label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Cargo</label>
                            <div className="col-lg-8">
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptionsCargo}
                                    defaultOptions={defaultOptionsCargo}
                                    getOptionLabel={(option) => (<div>
                                        <div><strong>{option.name}</strong></div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{option.description}</div>
                                    </div>)}
                                    getOptionValue={(option) => option.id}
                                    onMenuScrollToBottom={handleMenuScrollToBottomCargo}
                                    onChange={(elemento) => { setSelectCargo(elemento); setSelectCargoStatus(false) }}
                                    isLoading={isLoadingCargo}
                                    placeholder="Seleccione una opción..."
                                    defaultValue={dataCurrentRow.position}
                                />
                            </div>
                            {(getSelectCargoStatus) ? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione el cargo</div>) : (null)}
                        </div>
                        <div className="form-group row mb-3">
                            <label className="col-lg-4 col-form-label required"> <i className="fas fa-briefcase"></i> Oficina</label>
                            <div className="col-lg-8">
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptionsOffice}
                                    defaultOptions={defaultOptionsOffice}
                                    getOptionLabel={(option) => (<div>
                                        <div><strong>{option.office?.name}</strong></div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{option.place?.description}</div>
                                    </div>)}
                                    getOptionValue={(option) => option.id}
                                    onMenuScrollToBottom={handleMenuScrollToBottom}
                                    onChange={(elemento) => { setSelectOficce(elemento); setSelectOficceStatus(false) }}
                                    isLoading={isLoadingOffice}
                                    placeholder="Seleccione una opción..."
                                    defaultValue={dataCurrentRow.office_location}
                                />
                            </div>
                            {(getSelectOficceStatus) ? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione alguna oficina</div>) : (null)}
                        </div>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormCargo" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default CompModalCreateUpdate;