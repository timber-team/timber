import React, {useEffect} from 'react';
import {Button, Stack} from 'react-bootstrap';

import {useProjects} from '../api/project';
import ProjectCard from './Card';

const CardStack = () => {
  const {projects, getAllProjects, loading, error} = useProjects();
  
  const [index, setIndex] = React.useState(0);

  const disableNext = projects.length === 0 || projects.length === index + 1;
  const disablePrev = index === 0;

  useEffect(() => {
    getAllProjects();
  }, []);

  const handleNext = () => {
    if (index < projects.length - 1) {
      setIndex(index + 1);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  if (error) {
    return <div>Error!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projects.length) {
    return <div>No projects found</div>;
  }

  return (
    <Stack
      className="card-stack mx-auto justify-content-center w-100"
      gap={4}
      direction="horizontal"
    >
      <Button
        className="card-stack-button"
        variant="primary"
        disabled={disablePrev}
        onClick={handlePrevious}
      >
        Previous
      </Button>
      <ProjectCard project={projects[index]} />
      <Button
        className="card-stack-button"
        variant="primary"
        disabled={disableNext}
        onClick={handleNext}
      >
        Next
      </Button>
    </Stack>
  );
};

export default CardStack;
