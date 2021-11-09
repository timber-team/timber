/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {Container} from 'react-bootstrap';
import {useProjects} from '../api/project';
import {useAuth} from '../store/auth';
import {Card, Button} from 'react-bootstrap';
import ProjectListCard from '../components/ProjectListCard';
import {Project} from '../api/types';

// ProjectPage, a functional component that renders the ProjectsPage page
const ProjectsPage: React.FC = () => {
  const {projects, loading, error, getProjectsByUserId} = useProjects();
  const {currentUser} = useAuth();
  const [userProjects, setUserProjects] = React.useState<Project[]>([]);

  // // update the projects using the getProjectsByUserId function from the useProjects hook
  React.useEffect(() => {
    if (currentUser) {
      getProjectsByUserId(currentUser.id);
    }
  }, [currentUser]);

  // update the userProjects state when the projects state changes
  React.useEffect(() => {
    if (projects) {
      setUserProjects(projects);
    }
  }, [projects]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return (
    <Container>
      {userProjects.map((project: Project) => {
        return (
          <ProjectListCard
            key={project.id}
            project={project}
            onEdit={undefined}
            onDelete={undefined}
            onCollaborators={undefined}
            onTags={undefined}
            onView={undefined}
          />
        );
      })}
    </Container>
  );
};

export default ProjectsPage;
