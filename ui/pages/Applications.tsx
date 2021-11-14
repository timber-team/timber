import React, {useEffect, useState} from 'react';
import {Badge, Card} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import {useQuery} from 'react-query';

import {getOwnApplications} from '../api/application';
import {getProjectById} from '../api/project';
import {Application, Project} from '../api/types';
import {useAuth} from '../store/auth';

const Applications: React.FC = () => {
  const {accessToken} = useAuth();
  const [projectsLoading, setProjectsLoading] = useState(false);
  const {data: applications, status} = useQuery(
      'applications',
      () => getOwnApplications(accessToken || ''),
      {
        enabled: accessToken !== null,
      },
  );

  interface ZippedElem {
    application: Application;
    project: Project;
  }
  const [zippedList, setZippedList] = useState<ZippedElem[]>([]);

  console.log(zippedList);

  useEffect(() => {
    setProjectsLoading(true);
    if (applications) {
      applications.forEach((application) => {
        getProjectById(application.project_id, accessToken || '').then(
            (project) => {
              if (project) {
                setZippedList((zippedList) =>
                  zippedList.concat({
                    application,
                    project,
                  }),
                );
              }
            },
        );
      });
      setProjectsLoading(false);
    }
  }, [accessToken, applications]);

  if (status === 'loading' || projectsLoading) {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error</div>;
  }

  console.log(zippedList);
  if (
    (zippedList === undefined || zippedList.length === 0) &&
    !projectsLoading &&
    status === 'success'
  ) {
    return (
      <div>
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            marginTop: '30px',
          }}
        >
          You have no applications yet.
        </h2>
      </div>
    );
  }

  zippedList.sort((a, b) => {
    if (a.application.accepted && !b.application.accepted) {
      return -1;
    } else if (!a.application.accepted && b.application.accepted) {
      return 1;
    } else if (a.application.accepted && b.application.accepted) {
      return 0;
    } else {
      return 0;
    }
  });

  return (
    <div>
      <h2
        style={{textAlign: 'center', marginBottom: '30px', marginTop: '30px'}}
      >
        Applications
      </h2>
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
                      {pair.application.accepted ? (
                        <Badge
                          style={{margin: '1em', fontSize: '0.6em'}}
                          bg="success"
                        >
                          Accepted
                        </Badge>
                      ) : pair.application.denied ? (
                        <Badge
                          style={{margin: '1em', fontSize: '0.6em'}}
                          bg="danger"
                        >
                          Rejected
                        </Badge>
                      ) : (
                        <Badge
                          style={{margin: '1em', fontSize: '0.6em'}}
                          bg="warning"
                        >
                          In Progress
                        </Badge>
                      )}
                    </Card.Title>
                    <Card.Text
                      as="div"
                      className="desc"
                      style={{
                        maxHeight: '30vh',
                      }}
                    >
                      <ReactMarkdown>{pair.project.description}</ReactMarkdown>
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
