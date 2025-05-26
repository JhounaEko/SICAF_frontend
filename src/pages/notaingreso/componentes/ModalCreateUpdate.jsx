import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from '../modelNotaIngreso.jsx';
import { validacionesNota, validacionesReciboPago, validacionesNumeroCantidadDfm, validacionesReciboGastos, validacionesBoicher } from '../../../components/validaciones/validacionesModItems.jsx';
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
        if (dateFechaDMF != null) {
            dataForm.dfm_date = dateFechaDMF
            if (dataForm.id == 0) {
                setStateButton(true);
                const dataReturn = await useCreate(dataForm);
                setStateButton(false);
                if (dataReturn.status) {
                    reserForm();
                    functionRefreschDataTable(true);
                    messageRegisterDataSuccess();
                } else {
                    if (dataReturn.message == "Unauthenticated.") {
                        messageFinallySesion();
                        navigation('/');
                    }
                }
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
            addNotification('warning', 'Aviso', 'Debe seleccionar la fecha DFM', 'top-right', 8000, "fas fa-exclamation-circle", null);
        }
    }

    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        dataFechaDFM.current = null;
        setdateFechaDMF(null)
        CloseModal();
    };

    useEffect(() => {
        if (StatusModal) {
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('note', dataCurrentRow.note);
                setValue('payment_receipt', dataCurrentRow.payment_receipt);
                setValue('expense_receipt', dataCurrentRow.expense_receipt);
                setValue('voucher_number', dataCurrentRow.voucher_number);
                setValue('dfm_amount', dataCurrentRow.dfm_amount);
                setdateFechaDMF(dataCurrentRow.dfm_date);
                dataFechaDFM.current = dataCurrentRow.dfm_date;
            }
        }
    }, [StatusModal]);
    const [dateFechaDMF, setdateFechaDMF] = useState(null);

    /** Date */
    useEffect(() => {
        moment.locale('es');
    }, []);

    const ValidFechaRango = (current) => {
        const rangeFecha = moment('2007-01-01', 'YYYY-MM-DD');
        const today = moment();
        return current.isBetween(rangeFecha, today, 'day');
    };

    const dataFechaDFM = useRef(null);
    const GetDataFechaDFM = (value) => {
        setdateFechaDMF(moment(value).format('YYYY-MM-DD'));
    };

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false} size="lg">
            <Modal.Header closeButton className="position-relative" style={{ width: '100%', textAlign: 'center', zIndex: '1' }}>
                <Modal.Title ><h3 className="modal-title" style={{ textShadow: '2px 2px 3px rgba(0, 0, 0, 0.3)' }}> {title}</h3></Modal.Title>
            </Modal.Header>
            <hr style={{ margin: 0, width: '100%', height: '3px', border: 'none', backgroundColor: '#2e99d6' }} />
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormOficce" className='mb-5 mt-0'>
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="required form-label fs-5" htmlFor="note">Nota:</label>
                                    <input className="form-control"
                                        type="hidden"
                                        id="id"
                                        defaultValue={dataCurrentRow.id}
                                        placeholder=""
                                        {...register("id", {})}
                                    />
                                    <input className="form-control"
                                        type="text"
                                        id="note"
                                        placeholder="Ingrese el codigo"
                                        {...register("note", validacionesNota)}
                                    />
                                    {errors.note && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.note.message)}</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="required form-label fs-5" htmlFor="payment_receipt">Recibo de pago:</label>
                                    <input
                                        type="text"
                                        className="form-control "
                                        placeholder="Ingrese el numero de recibo de pago"
                                        id="payment_receipt"
                                        {...register("payment_receipt", validacionesReciboPago)}
                                    />
                                    {errors.payment_receipt && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.payment_receipt.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="required form-label fs-5" htmlFor="expense_receipt">Recibo de gastos:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese el numero de recibo de gastos"
                                        id="expense_receipt"
                                        {...register("expense_receipt", validacionesReciboGastos)}
                                    />
                                    {errors.expense_receipt && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.expense_receipt.message)}</div>}
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-3">
                                    <label className="required form-label fs-5" htmlFor="voucher_number">Vale de recibos:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese el identificador de vale de recibos"
                                        id="voucher_number"
                                        {...register("voucher_number", validacionesBoicher)}
                                    />
                                    {errors.voucher_number && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.voucher_number.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-6" title="Registro de comprobante de pago">
                                <label className="required form-label fs-5" htmlFor="dfm_amount" >Cantidad de DFM: </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="form-control"
                                    placeholder="....."
                                    id="dfm_amount"
                                    {...register("dfm_amount", validacionesNumeroCantidadDfm)}
                                />
                                {errors.dfm_amount && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.dfm_amount.message)}</div>}
                            </div>
                            <div className="col-lg-6" title="Fecha de registro de comprobante de pago">
                                <div className="mb-3" style={{ zIndex: 1000 }}>
                                    <label className="required form-label fs-5" htmlFor="dfm_amount" >Fecha de DFM: </label>
                                    <DateTime dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={ValidFechaRango} inputProps={{ placeholder: 'Inicio' }} closeOnSelect={true} onChange={GetDataFechaDFM} value={moment(dateFechaDMF, 'YYYY-MM-DD')} />
                                </div>
                            </div>
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