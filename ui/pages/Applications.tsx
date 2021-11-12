/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {useProjects} from '../api/project';

import {Badge, Card} from 'react-bootstrap';
import {Application, Project} from '../api/types';
import { useApplications } from '../api/application';
import ReactMarkdown from 'react-markdown';

const Applications: React.FC = () => {
  const {loading: projLoading, error: projError, returnProjectById} = useProjects();
  const {error: appError, applications, getOwnApplications} = useApplications(); 

  const [zippedList, setZippedList] = useState<ZippedElem[]>([]);

  interface ZippedElem{
    application: Application,
    project: Project,
  }

  useEffect(() => {
    getOwnApplications();
  }, []);

  useEffect(() => {
    applications.forEach( (application) => {
      returnProjectById(application.project_id).then((proj) => {
        if (proj) {
          setZippedList((prevState) => prevState.concat({application: application, project: proj}));
        }
      });
    });
  }, [applications]);

  if (projError || appError) {
    return <div>Error!</div>;
  }

  if (projLoading) {
    return <div>Loading...</div>;
  }

  if (zippedList === undefined || zippedList.length === 0) {
    return <div><h2 style={{textAlign: 'center', marginBottom: '30px', marginTop: '30px'}}>You have no applications yet.</h2></div>;
  }
  return (
    <div>
      <h2 style={{textAlign: 'center', marginBottom: '30px', marginTop: '30px'}}>Applications</h2>
      <ul>
        {zippedList.map((pair) => (
          <li
            key={pair.application.id}
            style={
              window.innerWidth > 900 ?
                {
                  maxWidth: '80%',
                  margin: 'auto',
                  marginBottom: '1.4em',
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
                      {pair.project.name}
                      {pair.application.accepted? (
                        <Badge
                          style={{margin: '1em', fontSize: '0.6em'}}
                          bg="success"
                        >
                          Accepted
                        </Badge>
                        ) : 
                        pair.application.denied? (
                          <Badge
                            style={{margin: '1em', fontSize: '0.6em'}}
                            bg="danger"
                          >
                          Rejected
                          </Badge>
                        ) :(
                          <Badge
                            style={{margin: '1em', fontSize: '0.6em'}}
                            bg="warning"
                          >
                              In Progress
                          </Badge>
                        )

                      }
                    </Card.Title>
                    <Card.Text as="div" className="desc"
                      style={{
                        maxHeight: '30vh',
                      }}
                    >
                      <ReactMarkdown>
                        {pair.project.description}
                      </ReactMarkdown>
                    </Card.Text>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {pair.project.required_skills?.map((skill) => (
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
                      {pair.project.preferred_skills?.map((skill) => (
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
                    src={pair.project.image_url}
                    style={{
                      height: '300px',
                      width: 'auto',
                    }}
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
