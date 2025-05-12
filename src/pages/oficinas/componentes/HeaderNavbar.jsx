import React,{ useState, useEffect} from 'react';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const HeaderNavbar = ({functionRefreschDataTable, searchData}) => {

    /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () =>{            
        setModal(true);    
    }

    const closeModal = () => {
        setModal(false); 
    };    

    const FuntionSearchData = (data) =>{
        searchData(data);
     }

    return ( <>

        <CompModalCreateUpdate
            StatusModal = {modal}
            title  = "Agregar nueva oficina"
            CloseModal = {closeModal} 
            dataCurrentRow = {{id:0}}
            functionRefreschDataTable = {functionRefreschDataTable}                             
        />
     <div className="row">
        <div className="col-sm">
            <button className="btn btn-info btn-rounded px-4 rounded-pill" onClick={openModal}><i className="fas fa-briefcase fa-1_5x"></i> Agregar nueva oficina</button>
        </div>
        <div className="col-sm">   
            <Form.Group as={Row} className="" controlId="searchOffice">
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
            </Form.Group>
        </div>
        <div className="col-sm">
          
        </div>
        <div className="col-sm">        
        </div>
    </div>
    </> );
}
 
export default HeaderNavbar;