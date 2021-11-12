/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import React from 'react';
import {Button, Col, Container, Row} from 'react-bootstrap';

import ProjectForm from '../components/ProjectForms';

const LandingPage = () => {
  return (
    <Container
      className="d-flex flex-column text-center"
      style={{
        minHeight: 'var(--bs-content-height)',
        padding: '50px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <h2 className="text-center" style={{fontSize: '2.7em'}}>
        Welcome to <span style={{color: 'var(--primary-color)'}}>Timber</span>
      </h2>
      <p
        className="text-center"
        style={{
          fontSize: '1.2em',
          lineHeight: '1.5em',
          marginBottom: '2em',
          marginTop: '1em',
        }}
      >
        Timber is a social networking platform which aims to build teams to work
        on projects together. Users with project ideas that want to find others
        to collaborate can share their project ideas. Users who want to find
        projects to work on to build their portfolio, CV and skills can then
        apply for the projects.
      </p>
      <Row style={{marginTop: '30px'}}>
        <Col style={{padding: '20px'}}>
          <h2 className="text-center" style={{fontSize: '1.7em'}}>
            Have an idea?{' '}
            <span style={{color: 'var(--primary-color)'}}>Build a Team!</span>
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: '1.2em',
              lineHeight: '1.5em',
              marginBottom: '2em',
              marginTop: '1em',
            }}
          >
            If you've a project idea, wether it's just an idea or you've already
            started build your team by creating a project and allow other Users
            to apply to work on your project with you! We will try to match the
            most suitable candidates to your project based on the applicable
            skills.
          </p>
          <ProjectForm btnSize="lg" />
        </Col>
        <Col style={{padding: '20px'}}>
          <h2 className="text-center" style={{fontSize: '1.7em'}}>
            Want Experience?{' '}
            <span style={{color: 'var(--primary-color)'}}>
              Find a Project!
            </span>
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: '1.2em',
              lineHeight: '1.5em',
              marginBottom: '2em',
              marginTop: '1em',
            }}
          >
            Are you looking for experience? something to add to your CV /
            Portfolio? Or just want to learn and improve some of your skills? We
            will recommend projects to you that suit your current skillset the
            best! You can also browse other projects and apply to any you're
            interested in working on!
          </p>
          <Button variant="primary" size="lg" href="/browse">
            Find a Project
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;
