import React, {useEffect} from 'react';
import {Button, Stack} from 'react-bootstrap';

import {useProjects} from '../api/project';
import {useApplications} from '../api/application';
import ProjectCard from './Card';

const CardStack = () => {
  const {projects, getRecommendedProjects, loading, error} = useProjects();
  const {applications, createApplication} = useApplications();

  const [projQueue, setProjQueue] = React.useState<Project[]>([]);

  useEffect(() => {
    getRecommendedProjects();
  }, []);

  useEffect(() => {
    const existingIds: Project[] = [];
    setProjQueue(
        projects.filter((proj) => {
          for (const elem of existingIds) {
            if (proj.id === elem.id) {
              return false;
            }
          }
          existingIds.push(proj);
          return true;
        }),
    );
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
    createApplication(projQueue[0].id);
    setProjQueue(projQueue.slice(1));
  };

  const handlePrevious = () => {
    setProjQueue(projQueue.slice(1));
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
        // disabled={disablePrev}
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
