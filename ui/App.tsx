import React from "react";
// import 'bootstrap/dist/css/bootstrap.css'
import "./style/custom.scss";

import {
  Navbar,
  Nav,
  Container,
  Dropdown,
  Image,
  Row,
  Col,
} from "react-bootstrap";

const App: React.FC = () => {
  return (
    <div>
      <Navbar expand="sm" variant="dark" bg="black">
        <Container
          style={{
            width: "95%",
            margin: "auto",
          }}
          fluid
        >
          <Navbar.Brand>Timber</Navbar.Brand>

          {/* <Navbar.Toggle aria-controls="responsive-navbar-nav">
                    </Navbar.Toggle> */}
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/browse">Browse</Nav.Link>
              <Nav.Link href="/applications">Applications</Nav.Link>
              <Nav.Link href="/projects">Projects</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Dropdown align="end">
            <Dropdown.Toggle
              style={{
                background: "none",
                border: "none",
              }}
            >
              <Image
                roundedCircle
                style={{
                  maxHeight: "42px",
                  width: "auto",
                }}
                src="https://eu.ui-avatars.com/api/?name=John+Doe"
              ></Image>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/user/settings">Settings</Dropdown.Item>
              <Dropdown.Item href="/teams">View teams</Dropdown.Item>
              <Dropdown.Item href="/new/project">
                Create New Project
              </Dropdown.Item>
              <Dropdown.Item href="/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
      <main style={{ minHeight: "100%" }}></main>
      <Navbar
        fixed="bottom"
        variant="dark"
        bg="black"
        style={{ color: "#fff8" }}
      >
        <Container style={{ width: "100%" }}>
          <Row>
            <Col>
              <Nav>
                <Nav.Item>
                  <h1 style={{ color: "#fffc" }}>Timber</h1>
                  <p>Create and join teams to work on projects.</p>
                  <p style={{ color: "#fffc" }}>Create beautiful things.</p>
                </Nav.Item>
              </Nav>
            </Col>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Copyright &copy; Timber Ltd.
            </Col>
          </Row>
        </Container>
      </Navbar>
    </div>
  );
};

export default App;
