import React from 'react';
import {Container, Nav, Navbar, NavDropdown, Button} from 'react-bootstrap';

import {useAuth} from '../store/auth';
import {deleteTokens} from '../utils';

import {CreateProjectForm} from './ProjectForms';

const NavBar = () => {
  const currentUser = useAuth((state) => state.currentUser);
  const [showForm, setShowForm] = React.useState(false);

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
          {currentUser ? (
            <>
              <Nav>
                <ProjectForm />
                <NavDropdown
                  align={'end'}
                  title={
                    <img
                      style={{
                        maxWidth: '2.5rem',
                        maxHeight: '2.5rem',
                      }}
                      src={currentUser?.avatar_url}
                      alt="avatar"
                      className="avatar-img"
                    />
                  }
                  id="collasible-nav-dropdown"
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
            </>
          ) : (
            <></>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
