import CardStack from '../components/CardStack';
import React from 'react';
import {Container} from 'react-bootstrap';

const Browse = () => {
  return (
    <Container
      className="browse-page d-flex align-items-center justify-content-center"
      style={{height: 'var(--bs-content-height)'}}
    >
      <CardStack />
    </Container>
  );
};

export default Browse;
