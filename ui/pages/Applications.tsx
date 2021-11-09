import React, { useEffect, useState } from 'react';
import { useProjects } from '../api/project';

import { Badge, Card } from 'react-bootstrap';

// Applications functional component
const Applications: React.FC = () => {
  const { projects, loading, error, getAllProjects } = useProjects()

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
    <div
      style={{
        padding: '2rem',
      }}
    >
      <h2>Applications</h2>
      <ul>
        {projects.map(project => (
          <li key={project.id}
            style={{
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
                    <Card.Title>{project.name}</Card.Title>
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
                    src={project.image_url} height="300px" width="auto"
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
