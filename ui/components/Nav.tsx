import React from 'react'
import { useEffect, useState } from 'react'
import { Navbar, Nav, Container, Dropdown, Image } from 'react-bootstrap'
import * as API from '../api'
import { useAuth } from "../store/auth";

const Navcustom: React.FC = () => {
    const currentUser = useAuth((state) => state.currentUser);
    return (
        <div>
            <Navbar expand="sm" bg="primary">
            <Container style={{
                width: "95%",
                margin: "auto"
            }} fluid>
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
                src={
                    currentUser?.avatar_url
                      ? currentUser.avatar_url
                      : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
                  }
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
    </div>
  );
};

export default Navcustom;
