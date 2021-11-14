import React, {useEffect, useState} from 'react';
import {Button, Stack} from 'react-bootstrap';
import {useMutation, useQuery} from 'react-query';

import {createApplication} from '../api/application';
import {getRecommendedProjects} from '../api/project';
import {Application, Project} from '../api/types';
import {useAuth} from '../store/auth';
import ProjectCard from './ProjectCard';

const ProjectCardStack = () => {
  const {accessToken} = useAuth();
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const {
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
    data: projects,
    refetch: refetchProjects,
  } = useQuery<Project[], Error>(
      'query-recommended',
      async () => getRecommendedProjects(accessToken || ''),
      {
        onSuccess: (data: Project[]) => {
          setRecommendedProjects(data);
        },
        onError: (error: Error) => {
          console.error(error);
          setError(error.message);
        },
      },
  );

  useEffect(() => {
    refetchProjects();
  }, [accessToken]);

  const {
    isLoading: isLoadingApplication,
    isError: isErrorApplication,
    mutate: createApplicationMutate,
  } = useMutation(
      (projectID: number) => createApplication(projectID, accessToken || ''),
      {
        onSuccess: (application: Application) => {
          console.log('Successfully applied to project', application);
          setRecommendedProjects(recommendedProjects.slice(1));
          setError(undefined);
        },
        onError: (error: Error) => {
          console.error('Error applying to project', error);
          setError(error.message);
        },
      },
  );

  const handleNext = async () => {
    try {
      await createApplicationMutate(recommendedProjects[0].id);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handlePrevious = () => {
    setRecommendedProjects(recommendedProjects.slice(1));
  };

  console.log('ProjectCardStack', {
    isLoadingProjects,
    isErrorProjects,
    projects,
    isLoadingApplication,
    isErrorApplication,
    recommendedProjects,
  });
  return (
    <Stack
      className="card-stack mx-auto justify-content-center w-100"
      gap={4}
      direction="horizontal"
    >
      {isLoadingProjects ? (
        <div>Loading projects...</div>
      ) : isErrorProjects || error ? (
        <div>Error loading projects</div>
      ) : recommendedProjects && recommendedProjects.length > 0 ? (
        <>
          <Button
            className="card-stack-button"
            variant="primary"
            onClick={handlePrevious}
          >
            Dismiss
          </Button>
          <ProjectCard project={recommendedProjects[0]} type="Stack" />
          <Button
            className="card-stack-button"
            variant="secondary"
            onClick={handleNext}
          >
            Apply
          </Button>
        </>
      ) : (
        <div>No projects found</div>
      )}
    </Stack>
  );
};

export default ProjectCardStack;
