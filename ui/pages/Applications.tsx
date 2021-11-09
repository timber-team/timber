import React, { useEffect, useState } from 'react';
import { useProjects } from '../api/project';
import { useAuth } from '../store/auth';

import { Badge, Card } from 'react-bootstrap';

// Applications functional component
const Applications: React.FC = () => {
  const { projects, loading, error, getAllProjects } = useProjects()
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("Rerender")
    getAllProjects();
  }, []);

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
    <div>
      <h2 style={{textAlign: 'center', marginBottom: '2em'}}>Applications</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}
            style={
              (window.innerWidth > 900) ?
              {
              maxWidth: '80%',
              margin: 'auto',
              listStyleType: 'none',
              }: {
                maxWidth: '100%',
                margin: 'auto',
                listStyleType: 'none',
              }}
          >
            <Card>
              <Card.Body>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <Card.Title style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                    }}>
                      {project.name}
                      {((currentUser) && project.collaborators?.includes(currentUser)) ? <Badge style={{margin: '1em', fontSize: '0.6em'}} bg="success">Accepted</Badge>: <> </>}
                    </Card.Title>
                    <Card.Text>{project.description}</Card.Text>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    > 

                      {project.required_skills?.map((skill) => (
                        <Badge
                          style={{
                            marginRight: '0.4rem',
                          }}
                        bg="info" key={skill.id}>{skill.name}</Badge>
                      ))}
                    </div>
                    {/* <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      {project.preferred_skills.map((skill) => (
                        <Badge bg="warning" key={skill.id}>{skill.name}</Badge>
                      ))}
                    </div> */}

                  </div>
                    <Card.Img
                      style={{
                        maxWidth: '40%'
                      }}
                      src={project.image_url} height="300px" width="100%"
                    />
                 </div>
              </Card.Body>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Applications;
