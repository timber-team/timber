import React from 'react';
import {Container} from 'react-bootstrap';

import ProjectCardStack from '../components/ProjectCardStack';

const Browse = () => {
  return (
    <Container
      className="browse-page d-flex align-items-center justify-content-center"
      style={{height: 'var(--bs-content-height)'}}
    >
      <ProjectCardStack />
    </Container>
  );
};

export default Browse;
