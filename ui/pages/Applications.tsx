/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {useProjects} from '../api/project';

import {Badge, Card} from 'react-bootstrap';
import {Application, Project} from '../api/types';
import {useAuth} from '../store/auth';

const Applications: React.FC = () => {
  const {projects, loading, error, getProjectById} = useProjects();
  const {currentUser} = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.applications !== undefined) {
      setApplications(currentUser.applications);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && applications) {
      applications.forEach((application) => {
        getProjectById(application.project_id).then((project) => {
          setUserProjects((prevState) => [...prevState, project!]);
        });
      });
    }
  }, [applications]);

  if (error) {
    return <div>Error!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userProjects && userProjects.length == 0) {
    return <div>No projects found</div>;
  }

  return (
    <div>
      <h2 style={{textAlign: 'center', marginBottom: '2em'}}>Applications</h2>
      <ul>
        {userProjects.map((project) => (
          <li
            key={project.id}
            style={
              window.innerWidth > 900 ?
                {
                  maxWidth: '80%',
                  margin: 'auto',
                  listStyleType: 'none',
                } :
                {
                  maxWidth: '100%',
                  margin: 'auto',
                  listStyleType: 'none',
                }
            }
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
                    <Card.Title
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {project.name}
                      {currentUser &&
                      project.collaborators?.includes(currentUser) ? (
                        <Badge
                          style={{margin: '1em', fontSize: '0.6em'}}
                          bg="success"
                        >
                          Accepted
                        </Badge>
                      ) : (
                        <> </>
                      )}
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
                          bg="info"
                          key={skill.id}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {project.preferred_skills.map((skill) => (
                        <Badge
                          bg="warning"
                          key={skill.id}
                          style={{marginRight: '0.4rem', marginTop: '0.4rem'}}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Card.Img
                    style={{
                      maxWidth: '40%',
                    }}
                    src={project.image_url}
                    height="300px"
                    width="100%"
                  />
                </div>
              </Card.Body>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
