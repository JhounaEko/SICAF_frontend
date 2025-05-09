import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from './../modelLugares.jsx';
import Swal from 'sweetalert2';
import { ReactNotifications } from 'react-notifications-component';
import { validacionesDescripcion, validacionesCodigo, validacionesAbreviacion } from './../../../components/validaciones/validaciones.jsx';
// import { modelUseListSelectOfficeLocation } from './../../oficinas/modelOficina.jsx';
// import { modelUseListCargoSelect } from './../../cargo/modelCargo.jsx';
import { useNavigate } from 'react-router-dom';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => {
        setStateButton(true);
        /** Se utiliza para registrar datos */
        if (dataForm.id == 0) {
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
    }

    useEffect(() => {
        if (StatusModal) {           
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('code', dataCurrentRow.code);
                setValue('abbreviation', dataCurrentRow.abbreviation);
                setValue('description', dataCurrentRow.description); 
                setValue('details', dataCurrentRow.details);              
            }
        }

    }, [StatusModal]);


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        CloseModal();
    };

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
                                    <label className="required form-label" htmlFor="first_name">Descripción</label>
                                    <input className="form-control"
                                        type="hidden"
                                        id="id"
                                        defaultValue={dataCurrentRow.id}
                                        placeholder=""
                                        {...register("id", {})}
                                    />
                                    <textarea className="form-control"
                                        type="text"
                                        id="description"
                                        rows={2}
                                        placeholder="Ingrese la descrpción del lugar"
                                        {...register("description", validacionesDescripcion)}
                                    />
                                    {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
                                </div>
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="last_name">Codigo</label>
                                    <input className="form-control"
                                        type="text"
                                        id="code"
                                        placeholder="Ingrese el código"
                                        {...register("code", validacionesCodigo)}
                                    />
                                    {errors.code && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.code.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-5 mb-2 mb-md-0">
                                    <label className="required mb-2 fs-10 fw-bold">Abreviación</label>
                                    <input type="text"
                                        className="form-control fs-13px"
                                        id="abbreviation"
                                        placeholder="Ej: CI, DNI, PAS"
                                        {...register("abbreviation", validacionesAbreviacion)}
                                    />
                                    {errors.abbreviation && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.abbreviation.message)}</div>}
                                </div>
                                <div className="col-md-7 mb-2 mb-md-0">
                                    <label className="mb-2 fs-10 fw-bold">Detalle (opcional)</label>
                                    <textarea type="text"
                                        className="form-control fs-13px"
                                        id="details"
                                        placeholder="Escribe una descripción..."
                                        rows={2}
                                        {...register("details", {})}
                                    />
                                </div>
                            </div>
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