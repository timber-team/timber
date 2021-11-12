import React from 'react';
import {Col, Container, Navbar} from 'react-bootstrap';

const Footer = () => {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      className="footer"
      expand="lg"
      style={{
        position: 'relative',
        bottom: 0,
        height: 'var(--bs-footer-height)',
      }}
    >
      <Container className="align-items-center text-light">
        <Col>Copyright © 2021 Timber</Col>
        <Col style={{textAlign: 'right'}}>
          <a href={process.env.PROJECT_GITHUB_URL}>
            <img
              src="https://raw.githubusercontent.com/gilbarbara/logos/f4c8e8b933aa80ce83b6d6d387e016bf4cb4e376/logos/github.svg"
              width="80px"
            />
            <img
              src="https://raw.githubusercontent.com/gilbarbara/logos/f4c8e8b933aa80ce83b6d6d387e016bf4cb4e376/logos/github-octocat.svg"
              width="40px"
            />
          </a>
        </Col>
      </Container>
    </Navbar>
  );
};

export default Footer;
