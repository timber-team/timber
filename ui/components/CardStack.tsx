/* eslint-disable max-len */
import React, {useEffect} from 'react';
import {Button, Stack} from 'react-bootstrap';

import {useProjects} from '../api/project';
import {useApplications} from '../api/application';
import ProjectCard from './Card';
import {Project} from '../api/types';

const CardStack = () => {
  const {projects, getRecommendedProjects, loading, error} = useProjects();
  const {applications, createApplication} = useApplications();

  const [projQueue, setProjQueue] = React.useState<Project[]>([]);

  useEffect(() => {
    getRecommendedProjects();
  }, []);

  useEffect(() => {
    let existingIds :Project[] = []; 
    console.log(projects);
    setProjQueue(projects.filter((proj) => {
      for (let elem of existingIds) {
        if (proj.id === elem.id) {
          return false;
        }
      }
      existingIds.push(proj);
      return true;
    }));

    console.log(projQueue)
  }, [projects]);

  if (error) {
    return <div>Error!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (projects && !projQueue.length) {
    return <div>No more projects found</div>;
  }

  if (!projects) {
    return null;
  }

  const handleNext = () => {
    console.log(projQueue)
    createApplication(projQueue[0].id);
    setProjQueue(projQueue.slice(1));
  };

  const handlePrevious = () => {
    console.log(projQueue)
    setProjQueue(projQueue.slice(1));

  };

  console.log("projQ", projQueue)

  return (
    <Stack
      className="card-stack mx-auto justify-content-center w-100"
      gap={4}
      direction="horizontal"
    >
      <Button
        className="card-stack-button"
        variant="primary"
        onClick={handlePrevious}
      >
        Dismiss
      </Button>
      <ProjectCard project={projQueue[0]} />
      <Button
        className="card-stack-button"
        variant="secondary"
        onClick={handleNext}
      >
        Apply
      </Button>
    </Stack>
  );
};

export default CardStack;
