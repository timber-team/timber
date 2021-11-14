import React, {useEffect} from 'react';
import {Badge, Card} from 'react-bootstrap';
import {useQuery} from 'react-query';

import {getProjectsByPopularity} from '../api/project';
import {useAuth} from '../store/auth';

const Trending: React.FC = () => {
  const {accessToken} = useAuth();
  const {data: projects, status} = useQuery(
      'projects',
      () => getProjectsByPopularity(accessToken || ''),
      {
        enabled: accessToken !== null,
      },
  );

  useEffect(() => {
    if (status === 'loading') {
      console.log('Loading projects...');
    }
  }, [status]);

  return (
    <div>
      <h2
        style={{textAlign: 'center', marginBottom: '30px', marginTop: '30px'}}
      >
        Trending
      </h2>
      <div className="card-container">
        {projects &&
          projects.map((project) => (
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
                            style={{
                              marginRight: '0.4rem',
                              marginTop: '0.4rem',
                            }}
                          >
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Card.Img
                      style={{
                        height: '300px',
                        width: 'auto',
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
