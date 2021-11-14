import React, {useState} from 'react';
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap';

import {User} from '../api/types';
import {useAuth} from '../store/auth';
import ProjectForm from './ProjectForm';

type NavBarProps = {
  currentUser?: User;
};

const NavBar: React.FC<NavBarProps> = ({currentUser}) => {
  const {logout} = useAuth();

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
                      src={
                        currentUser?.avatar_url ||
                        'https://gravatar.com/avatar/' +
                          currentUser?.id +
                          '?d=identicon'
                      }
                      alt="avatar"
                      className="avatar-img rounded-circle"
                      style={{width: '50px', height: '50px'}}
                    />
                  }
                  id="responsive-nav-dropdown"
                >
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Item href="/projects">
                    Your projects
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      logout();
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
