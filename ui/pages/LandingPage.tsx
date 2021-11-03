import React, {useEffect} from 'react';
import {Col, Container} from 'react-bootstrap';
import {useProjects} from '../api/project';
import {ProjectCard} from '../components/Card';
import Legal from '../components/Legal';
import NavBar from '../components/Nav';

const LandingPage: React.FC = () => {
  const {projects, loading, error, getAllProjects} = useProjects();

  useEffect(() => {
    getAllProjects();
  }, []);

  // if the loading state is true, display a loading message
  if (loading) {
    return (
      <div>
        <NavBar />
        <h1>Loading...</h1>
      </div>
    );
  }

  // if there is an error, display the error message
  if (error) {
    return <h1>{error}</h1>;
  }

  // if there are no projects, display a message
  if (projects.length === 0) {
    return (
      <div>
        <NavBar />
        <h1>No projects to display</h1>
      </div>
    );
  }
  return (
    <div>
      <NavBar />
      <Container fluid="lg">
        {projects.map((project) => (
          <Col md="auto" key={project.id} style={{marginBottom: '1rem'}}>
            <ProjectCard
              project={project}
              onApply={getAllProjects}
              onReject={getAllProjects}
            />
          </Col>
        ))}
      </Container>
      <Legal />
    </div>
  );
};

export default LandingPage;
