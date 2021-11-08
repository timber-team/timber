import React from 'react';
import {Col, Container, Navbar, Row} from 'react-bootstrap';

const Legal = () => {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      fixed="bottom"
      className="footer"
      expand="lg"
      style={{
        position: 'sticky',
        bottom: 0,
        height: 'var(--bs-footer-height)',
      }}
    >
      <Container>
        <Row className="justify-content-center align-items-center text-light">
          <Col>
            <p className="text-center" style={{margin: 'auto'}}>
              Copyright © 2021 - {new Date().getFullYear()}
            </p>
          </Col>
          <Col>
            <p className="text-center" style={{margin: 'auto'}}>
              {process.env.FOOTER_TEXT}
            </p>

            <a href={process.env.PROJECT_GITHUB_URL}>
              <p className="text-center text-dark" style={{margin: 'auto'}}>
                Github Repo
              </p>
            </a>
          </Col>
          <Col>
            <p className="text-center" style={{margin: 'auto'}}>
              {process.env.PROJECT_MOTTO}
            </p>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Legal;
