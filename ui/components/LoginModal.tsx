import {faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

export const LoginModal = () => {
  return (
    <Modal show={true} centered>
      <Modal.Header>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex align-items-center justify-content-evenly">
        <Button variant="outline-primary" href="/api/auth/signin/google">
          <FontAwesomeIcon icon={faGoogle} /> Sign In with Google
        </Button>
        <Button variant="outline-secondary" href="/api/auth/signin/github">
          <FontAwesomeIcon icon={faGithub} /> Sign In with Github
        </Button>
      </Modal.Body>
    </Modal>
  );
};
