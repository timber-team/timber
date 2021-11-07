/* eslint-disable max-len */
import {faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

import {useAuth} from '../store/auth';

export const LoginModal = () => {
  const currentUser = useAuth((state) => state.currentUser);

  return (
    <>
      {!currentUser && (
        <Modal show={true} centered>
          <Modal.Header
            closeButton
            onClick={() => (window.location.href = '/')}
          >
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-evenly">
            <Button variant="outline-primary" href="/api/auth/signin/google">
              <FontAwesomeIcon icon={faGoogle} />
              Sign In with Google
            </Button>
            <Button variant="outline-secondary" href="/api/auth/signin/github">
              <FontAwesomeIcon icon={faGithub} />
              Sign In with Github
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};
