import React from 'react';
import {Modal} from 'react-bootstrap';
import EditProfile from './EditProfile';

const EditProfileModal = () => {
  return (
    <Modal style={{position:"absolute", top:"20%"}} show={true}>
      <Modal.Body>
        <EditProfile />
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
