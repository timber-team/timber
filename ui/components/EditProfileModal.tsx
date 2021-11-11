import React from 'react';
import {Modal} from 'react-bootstrap';
import EditProfile from './EditProfile';

const EditProfileModal = () => {
  return (
    <Modal show={true}>
      <Modal.Body>
        <EditProfile />
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
