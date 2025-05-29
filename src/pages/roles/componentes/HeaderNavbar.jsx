import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
import DateTime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from './../../../components/alert/alert.jsx';
const HeaderNavbar = ({ updateTableData, searchData, searchDataParameter, funtionActivePdf, }) => {
    /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }
    const closeModal = () => {
        setModal(false);
    };


    const ActionSearchData = (data) => {
        searchData(data);
    }

    const [placeHolderInputSearch, setPlaceHolderInputSearch] = useState("nombre de rol");
    const [searchValue, setSearchValue] = useState(''); 
    const FuntionSearchParameter = (valueSelect, textSelect) => {    
        setPlaceHolderInputSearch(textSelect);
        searchDataParameter(valueSelect);
        minDate.current = null;
        maxDate.current = null;
        setSearchValue('');
        ActionSearchData('');
    }

    /*** BUSCAR POR FECHAS  */
    const [parameterSearchDataCreate, setParameterSearchDataCreate] = useState('search');
    useEffect(() => {
        moment.locale('es');
    }, []);

    const minDateRange = (current) => {
        const minDate = moment('2007-01-01', 'YYYY-MM-DD');
        const today = moment();
        return current.isBetween(minDate, today, 'day');
    };


    const minDate = useRef(null);
    const maxDate = useRef(null);

    const maxDateRange = (current) => {
        const today = moment();
        const minDate = moment('2007-01-01', 'YYYY-MM-DD');
        return current.isBetween(minDate, today, 'day');
    };

    const minDateChange = (value) => {
        minDate.current = value;
    };
    const maxDateChange = (value) => {
        maxDate.current = value;
    };

    const submitDateSearch = () => {
        if (!minDate.current || !maxDate.current) {
            addNotification('warning', 'Aviso', 'Debe seleccionar ambas fechas para continuar.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            console.log('Por favor selecciona ambas fechas.');
            return;
        }

        const fechaInicio = moment(minDate.current);
        const fechaFin = moment(maxDate.current);

        if (!fechaInicio.isValid() || !fechaFin.isValid()) {
            addNotification('warning', 'Error de formato', 'Las fechas ingresadas no son válidas. Por favor, seleccione una fecha desde el calendario.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            return;
        }


        if (fechaInicio.isAfter(fechaFin, 'day')) {
            addNotification('warning', 'Aviso', 'La fecha de inicio no puede ser mayor que la fecha de fin.', 'top-right', 8000, "fas fa-exclamation-circle", null)
        } else {  
           ActionSearchData(moment(minDate.current).format('YYYY-MM-DD') + ',' + moment(maxDate.current).format('YYYY-MM-DD'));
        }
    }


    return (<>
        <ReactNotifications/>
        <ModalCreateUpdate
            StatusModal={modal}
            title="Registrar datos de rol"
            CloseModal={closeModal}
            data={{
                id: 0,
                name: ""
            }}
            updateTableData={updateTableData}
        />
        <div className="d-flex flex-wrap align-items-center gap-3">
  {/* Botón Nuevo Rol */}
  <div>
    <button className="btn btn-theme btn-rounded px-4 rounded-pill" onClick={openModal}>
      <i className="fas fa-plus fa-1_5x"></i> Nuevo rol
    </button>
  </div>

  {/* Selector de búsqueda */}
  <div>
    <select
      id="issued_by"
      className="form-select"
      style={{ minWidth: "180px" }}
      defaultValue="search"
      onChange={(e) => {
        FuntionSearchParameter(e.target.value, e.target.options[e.target.selectedIndex].text);
        setParameterSearchDataCreate(e.target.value);
      }}
    >
      <option value="search">nombre de rol</option>
      <option value="data_create">fecha de registro</option>
    </select>
  </div>

  {/* Filtro por fechas o input */}
  <div style={{ flex: 1 }}>
    {parameterSearchDataCreate === "data_create" ? (
      <div className="d-flex align-items-center gap-2">
        <label className="form-label mb-0">Fechas:</label>
        <DateTime
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          isValidDate={minDateRange}
          inputProps={{ placeholder: 'Inicio' }}
          closeOnSelect={true}
          onChange={minDateChange}
        />
        <DateTime
          dateFormat="YYYY-MM-DD"
          timeFormat={false}
          isValidDate={maxDateRange}
          inputProps={{ placeholder: 'Fin' }}
          closeOnSelect={true}
          onChange={maxDateChange}
        />
        <button
          type="button"
          onClick={submitDateSearch}
          className="btn btn-sm btn-theme btn-rounded rounded-pill"
        >
          <i className="fa fa-search fa-lg"></i> Buscar
        </button>
      </div>
    ) : (
      <div className="position-relative">
        <input
          type="text"
          className="form-control ps-35px rounded-3"
          placeholder={placeHolderInputSearch}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            ActionSearchData(e.target.value);
          }}
        />
        <button className="btn position-absolute start-0 top-0 shadow-none">
          <i className="fa fa-search fa-lg"></i>
        </button>
      </div>
    )}
  </div>

  {/* Botones PDF / Excel */}
  <div className="d-flex gap-2">
    <button className="btn btn-danger btn-rounded rounded-pill" onClick={funtionActivePdf}>
      <i className="fa fa-file-pdf me-1"></i> PDF
    </button>
    {/* <button className="btn btn-success btn-rounded rounded-pill" onClick={funtionActivePdf}>
      <i className="fa fa-file-pdf me-1"></i> EXCEL
    </button> */}
  </div>
</div>

    </>);
}

export default HeaderNavbar;