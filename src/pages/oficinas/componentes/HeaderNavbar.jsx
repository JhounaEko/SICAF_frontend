import React,{ useState, useEffect} from 'react';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';

const HeaderNavbar = () => {

    /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () =>{            
        setModal(true);    
    }

    const closeModal = () => {
        setModal(false); 
    };  

    return ( <>

        <CompModalCreateUpdate
            StatusModal = {modal}
            title  = "Agregar nueva oficina"
            CloseModal = {closeModal}                             
        />
     <div className="row">
        <div className="col-sm">
            <button className="btn btn-primary btn-flex" onClick={openModal}><i className="fas fa-briefcase fa-1_5x"></i> Agregar nueva oficina</button>
        </div>
        <div className="col-sm">   

        </div>
        <div className="col-sm">
          
        </div>
        <div className="col-sm">        
        </div>
    </div>
    </> );
}
 
export default HeaderNavbar;