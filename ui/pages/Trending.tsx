import React, {useEffect} from 'react';
import {useProjects} from '../api/project';
import {Card, Badge} from 'react-bootstrap';

const Trending = () => {
  const {projects, loading, error, getProjectsByPopularity} = useProjects();

  useEffect(() => {
    getProjectsByPopularity();
  }, []);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    // react-bootstrap cards displaying each project
    <div>
      <h2 style={{textAlign: 'center', marginBottom: '2em'}}>Trending</h2>
      <div className="card-container">
        {projects.map((project) => (
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
            <Card
              style={{
                boxSizing: 'content-box',
              }}
            >
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
                      height: 'auto',
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
      </div>
    </div>
  );
};

export default Trending;
