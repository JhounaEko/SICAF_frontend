import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from '../modelFuentesOrganizaciones.jsx';
import { validacionesCodigoOrganizacion, validacionesDescripcionOrganizacion, validacionesAbreviacionOrganizacion } from '../../../components/validaciones/validacionesModUsers.jsx';
import { messageFinallySesion, messageRegisterDataSuccess, messageUpdateDataSuccess } from './../../../components/alert/alert.jsx';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from '../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => {
        if (yearUpdate != null) {
            const fechaMoment = moment(yearUpdate);
            dataForm.year = fechaMoment.year();
            if (dataForm.id == 0) {
                setStateButton(true);
                const result = await useCreate(dataForm);
                setStateButton(false);
                if (result.status) {
                    reserForm();
                    functionRefreschDataTable(true);
                    messageRegisterDataSuccess();
                } else {
                    if (result.message == "Unauthenticated.") {
                        messageFinallySesion();
                        navigation('/');
                    }
                }
                /** Se utiliza para modificar datos oficina, cuando se pulsa en el boton guardar */
            } else {
                setStateButton(true);
                const result = await useChangeDataRow(dataForm);
                setStateButton(false);
                if (result.status) {
                    reserForm();
                    functionRefreschDataTable();
                    messageUpdateDataSuccess();
                } else {
                    if (result.message == "Unauthenticated.") {
                        messageFinallySesion();
                        navigation('/');
                    }
                }
            }
        } else {
            addNotification('warning', 'Aviso', 'Debe seleccionar el año', 'top-right', 8000, "fas fa-exclamation-circle", null)
        }

    }

    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        setYearUpdate(null)
        CloseModal();
    };

    useEffect(() => {
        if (StatusModal) {
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('code', dataCurrentRow.code);
                setValue('description', dataCurrentRow.description);
                setValue('abbreviation', dataCurrentRow.abbreviation);
                setYearUpdate(moment(dataCurrentRow.year, 'YYYY'));
            }
        }

    }, [StatusModal]);

    const year = useRef(null);
    const [yearUpdate, setYearUpdate] = useState(null);
    const yearChange = (date) => {
        setYearUpdate(date);
    };

    // Validación para limitar el rango de fechas (si lo deseas)
    const minDateRange = (current) => {
        const currentYear = new Date().getFullYear();
        return current.year() >= 1900 && current.year() <= currentYear;
    };

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fa fa-building fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormOficce">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="code">Código</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                defaultValue={dataCurrentRow.id}
                                placeholder=""
                                {...register("id", {})}
                            />
                            <input className="form-control"
                                type="text"
                                id="code"
                                placeholder="Ingrese el codigo"
                                {...register("code", validacionesCodigoOrganizacion)}
                            />
                            {errors.code && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.code.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="description">Descripción</label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la descripción"
                                id="description"
                                {...register("description", validacionesDescripcionOrganizacion)}
                            />
                            {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="abbreviation">Abrevación</label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la descripción"
                                id="abbreviation"
                                {...register("abbreviation", validacionesAbreviacionOrganizacion)}
                            />
                            {errors.abbreviation && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.abbreviation.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="year">Año</label>
                            <DateTime
                                dateFormat="YYYY"
                                timeFormat={false}
                                isValidDate={minDateRange}
                                inputProps={{ placeholder: 'Selecciona el año' }}
                                closeOnSelect={true}
                                onChange={yearChange}
                                viewMode="years"
                                value={moment(yearUpdate, 'YYYY')}                              
                            />
                        </div>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormOficce" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default CompModalCreateUpdate;