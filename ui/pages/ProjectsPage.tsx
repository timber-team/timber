/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {Container} from 'react-bootstrap';
import {useProjects} from '../api/project';
import {useAuth} from '../store/auth';
import {Card, Button} from 'react-bootstrap';
import ProjectForm from '../components/ProjectForms';
import ProjectListCard from '../components/ProjectListCard';
import {Project} from '../api/types';

const ProjectsPage: React.FC = () => {
  const {projects, loading, error, getProjectsByUserId} = useProjects();
  const {currentUser} = useAuth();

  React.useEffect(() => {
    getProjectsByUserId(currentUser!.id);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error! {error}</div>;
  }

  if (projects.length== 0){
    return <Container style={{textAlign: "center"}}><h2 style={{padding: "50px"}}>You haven't created any projects yet.</h2> 
    <ProjectForm btnSize="true"/></Container>;

  }

  const projectListCards = projects.map((project: Project) => (
    <ProjectListCard project={project} key={project.id} />
  ));

  return <Container>{projectListCards}</Container>;
};

export default ProjectsPage;
