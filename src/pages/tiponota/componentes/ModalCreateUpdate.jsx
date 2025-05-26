import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from '../modelTipoNota.jsx';
import { validacionesTipoNotaName, validacionesDescripcion } from '../../../components/validaciones/validacionesModUsers.jsx';
import { ReactNotifications } from 'react-notifications-component';
import { messageFinallySesion, messageRegisterDataSuccess, messageUpdateDataSuccess  } from '../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => { 
        
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
    }

    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();    
        CloseModal();
    };

    useEffect(() => {
        if (StatusModal) {
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('name', dataCurrentRow.name);
                setValue('description', dataCurrentRow.description);   
            }
        }

    }, [StatusModal]);

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fa fa-list-alt fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormOficce">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="name">Nombre de nota:</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                defaultValue={dataCurrentRow.id}
                                placeholder=""
                                {...register("id", {})}
                            />
                            <input className="form-control"
                                type="text"
                                id="name"
                                placeholder="Ingrese el nombre de la nota"
                                {...register("name", validacionesTipoNotaName)}
                            />
                            {errors.name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="description">Descripción:</label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la descripción"
                                id="description"
                                {...register("description", validacionesDescripcion)}
                            />
                            {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
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