import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalRoles = ({ show, handleClose, handleRetry, handleCancel }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Oops...</Modal.Title>
      </Modal.Header>
      <Modal.Body>¡Algo salió mal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleRetry}>
          Reintentar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRoles;