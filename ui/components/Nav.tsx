import React from 'react';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';

import {useAuth} from '../store/auth';
import {deleteTokens} from '../utils';

const NavBar = () => {
  const currentUser = useAuth((state) => state.currentUser);

  return (
    <Navbar
      bg="primary"
      variant="dark"
      sticky="top"
      expand="lg"
      style={{height: 'var(--bs-navbar-height)'}}
    >
      <Container fluid className="navbar-container" style={{width: '95%'}}>
        <Navbar.Brand href="/">Timber</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/browse">Browse</Nav.Link>
            <Nav.Link href="/trending">Trending</Nav.Link>
            <Nav.Link href="/applications">Applications</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown
              align={'end'}
              title={
                <img
                  src={
                    currentUser?.avatar_url ||
                    'https://www.gravatar.com/avatar/' +
                      Math.floor(Math.random() * 100000) +
                      '?d=identicon&s=50'
                  }
                  alt="avatar"
                  className="rounded-circle"
                />
              }
              id="responsive-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
              <NavDropdown.Item
                href="/auth/logout"
                onClick={() => {
                  deleteTokens();
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
