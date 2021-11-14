/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
import React from 'react';
import {Container} from 'react-bootstrap';
import {useQuery} from 'react-query';

import {getProjectsByUserId} from '../api/project';
import {Project, User} from '../api/types';
import ProjectCard from '../components/ProjectCard';
import ProjectForm from '../components/ProjectForm';
import {useAuth} from '../store/auth';

interface ProjectsPageProps {
  user?: User;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({user}) => {
  const {accessToken} = useAuth();
  const {data: projects, status} = useQuery(
      'projects',
      () => getProjectsByUserId(user?.id || 0, accessToken || ''),
      {
        retry: false,
      },
  );
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error</div>;
  if (
    status === 'success' &&
    (!projects || (projects && projects.length === 0))
  ) {
    return (
      <Container style={{textAlign: 'center'}}>
        <h2 style={{padding: '50px'}}>
          You haven't created any projects yet.
        </h2>
        <ProjectForm btnSize="lg" />
      </Container>
    );
  }
  if (status === 'success' && projects && projects.length > 0) {
    return (
      <Container className="mt-5 mb-5">
        {projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} type="List" />
        ))}
      </Container>
    );
  }
  return null;
};

export default ProjectsPage;
