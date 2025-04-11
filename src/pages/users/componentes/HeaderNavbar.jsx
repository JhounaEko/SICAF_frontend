import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { useState, useEffect } from 'react';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'

const HeaderNavbar = ({updateTableData, searchData, searchDataParameter}) => {

     /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () =>{            
        setModal(true);    
    }

    const closeModal = () => {
        setModal(false); 
    };    

    const [parameterSearchDataCreate, setParameterSearchDataCreate] = useState('search');
    const [fechaCreacion, setFechaCreacion] = useState({start_date:'',end_date:''});

    const FuntionSearchData = (data) =>{
        searchData(data);
     }

     const FuntionSearchParameter = (data) =>{
        searchDataParameter(data);
     }

    return ( <>
        <ModalCreateUpdate
            StatusModal = {modal}
            title  = "Agregar nuevo usuario"
            CloseModal = {closeModal}   
            data={{
                id: 0, 
                first_name:"",
                last_name:"",
                phone_number:"",
                identity_card:"",
                issued_by:"",
                username:"",
                email:""                
            }}    
            updateTableData = {updateTableData}
        />
     <div className="row">
        <div className="col-sm">
            <button className="btn btn-primary btn-flex" onClick={openModal}><i className="fas fa-user fa-1_5x"></i> Agregar nuevo usuario</button>
        </div>
        <div className="col-sm">
            <Form.Group as={Row} className="" controlId="">
                {(parameterSearchDataCreate == "data_crate")? (
                    <>
                    <Form.Label column sm="4">Fecha inicio:</Form.Label>
                        <Col sm="8">
                            <Form.Control 
                                className='form-control m-1 p-1'
                                plaintext
                                type='date'
                                placeholder="....."
                                style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                                onChange={(event) =>{
                                    setFechaCreacion({
                                        ...fechaCreacion, 
                                        start_date: event,
                                    });
                                }}
                                    //setFechaCreacion('start_date',event); }}
                            />
                        </Col> 
                    </>
                 ): (<>
                    <Form.Label column sm="2">Buscar:</Form.Label>
                    <Col sm="8">
                        <Form.Control 
                            className='form-control m-1 p-1'
                            plaintext
                            placeholder="....."
                            style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                            onChange={(event) =>{ FuntionSearchData(event.target.value);}} 
                        />
                    </Col> 
                    </> )
                 }		 	                                     
		    </Form.Group>
            { (parameterSearchDataCreate == "data_crate")?(
                <Form.Group as={Row} className="" controlId="">
		 	    <Form.Label column sm="4">Fecha fin:</Form.Label>
                <Col sm="8">
                    <Form.Control 
                        className='form-control m-1 p-1'
                        type='date'
                        plaintext
                        placeholder="....."
                        style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                        onChange={(event) =>{ 
                            setFechaCreacion({
                                ...fechaCreacion, 
                                start_date: event,
                            });
                        }}                    
                    />
                </Col>                   
		    </Form.Group>
            ):null
            }
            
        </div>
        <div className="col-sm">
            <select
                    id="issued_by"
                    className="form-select fs-13px"
                    defaultValue="search"  
                    onChange={(element)=> { FuntionSearchParameter(element.target.value); setParameterSearchDataCreate(element.target.value);  }}  
                    >
                <option value="search">Nombre</option>               
                <option value="username">usuario</option>
                <option value="email">Correo</option>
                <option value="identity_card">Celula de identidad</option>             
                <option value="data_crate">Fecha de registro</option>          
            </select>
            { (parameterSearchDataCreate == "data_crate")? ( <button type="button" onClick={()=> (console.log(fechaCreacion))   } className='btn btn-primary m-1'>  Buscar </button>):null}           
        </div>
        <div className="col-sm">        
        </div>
    </div>
    </> );
}

export default HeaderNavbar;