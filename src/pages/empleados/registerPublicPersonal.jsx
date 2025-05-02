import React, { useEffect, useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ReactNotifications, Store } from 'react-notifications-component';
import { validacionesFirstName, validacionesLastName, validacionesCI, validacionesComplementoCi, validacionesCelular, validacionesEmail } from './../../components/validaciones/validaciones.jsx';
import { get, useForm, } from 'react-hook-form';
import { modelCreatePersonalPublic } from './modelEmpleados.jsx';
import { modelUseListSelect } from '../oficinas/modelOficina.jsx';
import { modelUseListCargoSelect } from '../cargo/modelCargo.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';

function RegisterPublicPersonal() {

  const navigate = useNavigate();
  const useCreatePersonalPublic = modelCreatePersonalPublic();
  const useListSelect = modelUseListSelect();  //oficce location
  const useListCargoSelect = modelUseListCargoSelect();

  const { register, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm(
    {
      defaultValues: {
        first_name: "",
        last_name: "",
        complement: "",
        identity_card: "",
        issued_by: "S/E",
        phone_number: "",
        email: "",
      }
    }
  );

  const [stateButton, setStateButton] = useState(false);

  const [redirect, setRedirect] = useState(false);
  if (redirect) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (dataForm) => {
    if (getSelectOficce) {
      setSelectOficceStatus(false);
      if (getSelectCargo) {
        setSelectCargoStatus(false)
        setStateButton(true);
        dataForm.office_location_id = getSelectOficce.id;
        dataForm.position_id = getSelectCargo.id;
        dataForm.state_id = 2;
        const dataReturn = await useCreatePersonalPublic(dataForm);
        if (dataReturn.status) {
          Swal.fire({
            title: "Registro exitoso",
            icon: "success",
            draggable: true,
            timer: 3000,
            confirmButtonColor: "#3085d6",
          });
        }
        setStateButton(false);
        // setStateButton(true);
        // axios({
        //   method: "POST",
        //   url: process.env.REACT_APP_API_URL + '/api/v1/register',
        //   data: dataForm,
        //   headers: {
        //     'Content-Type': 'application/json',
        //   }
        // }).then(response => {
        //   reset();
        //   Swal.fire({
        //     title: "Su registro fue exitoso",
        //     text: "Estimado " + dataForm.first_name + ", el transcurso del dia se le habilitara el ingreso al sistema.",
        //     icon: "success",
        //     draggable: true,
        //     timer: 10000,
        //     timerProgressBar: true,
        //     confirmButtonColor: "#3085d6",
        //     allowOutsideClick: false,
        //     allowEscapeKey: false,
        //     willClose: () => {
        //       navigate('/');
        //     }
        //   }).then((result) => {
        //     navigate('/');
        //   });
        // }).catch(error => {
        //   if (error.code == "ERR_BAD_REQUEST") {
        //     Swal.fire({
        //       title: "Aviso",
        //       text: "Estimado " + dataForm.first_name + ", ´" + error.response.data.message + "´",
        //       icon: "warning",
        //       draggable: true,
        //       timer: 10000,
        //       timerProgressBar: true,
        //       confirmButtonColor: "#3085d6",
        //     });
        //   } else {
        //     addNotification('danger', 'Server', " " + error.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
        //   }
        //   console.log(error);
        // }).finally(() => {

        // });  
        // setStateButton(false); 
      } else {
        setSelectCargoStatus(true);
      }
    } else {
      setSelectOficceStatus(true);
    }
  };

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
  const [getSelectOficce, setSelectOficce] = useState();
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
      const response = await peticionOficce("", 1);
      setDefaultOptionsOffice(response);
      const responseCargo = await peticionCargo("", 1);
      setDefaultOptionsCargo(responseCargo);
    }
    fetchPeticion();
  }, []);

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

  return (
    <div className="register register-with-news-feed">
      <ReactNotifications />
      <div className="news-feed">
        <div className="news-image" style={{ backgroundImage: `url(/assets/img/img-03.jpeg` }}></div>
        <div className="news-caption">
          <h4 className="caption-title"><b>S.I.C.</b>A.F.</h4>
          <p>
            Sistemas de Información y Control de Activos Fijos
          </p>
        </div>
      </div>
      <div className="register-container">
        <div className="register-header mb-25px h1">
          <div className="mb-1">Registrarme como personal</div>
          <div className="mb-1" style={{ fontSize: '18px' }}></div>
          {/* <small className="d-block fs-15px lh-16">Ingrese sus datos para acceder a un cuenta</small> */}
        </div>
        <div className="register-content">
          <form onSubmit={handleSubmit(onSubmit)} className="fs-13px" id="myFormUsersPublic">
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold">Nombre(s) Apellido(s) </label>
              <div className="row gx-3">
                <div className="col-md-6 mb-2 mb-md-0">
                  <input type="text"
                    className="form-control fs-13px"
                    id="first_name"
                    placeholder="nombre"
                    {...register("first_name", validacionesFirstName)} />
                  {errors.first_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.first_name.message)}</div>}
                </div>
                <div className="col-md-6">
                  <input type="text"
                    className="form-control fs-13px"
                    placeholder="apellidos"
                    id="last_name"
                    {...register("last_name", validacionesLastName)}
                  />
                  {errors.last_name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.last_name.message)}</div>}
                </div>
              </div>
            </div>
            <div className="mb-3">

              <div className="row gx-3">
                <div className="col-md-4 mb-2 mb-md-0">
                  <label className="mb-2 required fs-10 fw-bold">C.I.</label>
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
                  <label className="mb-2 required fs-10 fw-bold">Expedido </label>
                  <select
                    id="issued_by"
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
              <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-mobile'></i>&nbsp; Celular</label>
              <input type="number"
                className="form-control fs-13px"
                placeholder="número de celular"
                {...register("phone_number", validacionesCelular)}
              />
              {errors.phone_number && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.phone_number.message)}</div>}
            </div>
            <div className="mb-3">
              <label className="mb-2 required fs-10 fw-bold"><i className='fas fa-at'></i> &nbsp;Correo</label>
              <input type="text"
                className="form-control fs-13px"
                placeholder="correo electrónico"
                id="email"
                {...register("email", validacionesEmail)}
              />
              {errors.email && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.email.message)}</div>}
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
                />
              </div>
              {(getSelectOficceStatus) ? (<div className='mb-3 fs-12px' style={{ color: 'red' }}>Seleccione alguna oficina</div>) : (null)}
            </div>
            <div className="mb-4">
              <button type="submit" className="btn btn-theme d-block w-100 btn-lg h-45px fs-13px" form="myFormUsersPublic" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-paper-plane fa-1_5x"></i>)}  &nbsp;  Enviar datos</button>
            </div>
            <div className="mb-4 pb-5">
              Ya tengo una cuenta? Haz <Link to="/">click</Link> para iniciar sesion
            </div>
            <hr className="bg-gray-600 opacity-2" />
            <p className="text-center text-gray-600">
              &copy; Copy Right Reserved 2025
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPublicPersonal;