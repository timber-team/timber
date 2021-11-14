/* eslint-disable max-len */
import React, {useEffect} from 'react';
import {Button, Card, Container} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import {useQuery} from 'react-query';
import {useParams} from 'react-router-dom';

import {
  getApplicationsByProjectId,
  updateApplication,
} from '../api/application';
import {getProjectById} from '../api/project';
import {getUserById} from '../api/user';
import {useAuth} from '../store/auth';

const ApplicantReview: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const projectId = parseInt(id);
  const {accessToken} = useAuth();

  const {
    data: project,
    isLoading: projectIsLoading,
    isError: projectIsError,
  } = useQuery(
      ['project', projectId],
      () => getProjectById(projectId, accessToken || ''),
      {
        enabled: !!accessToken,
      },
  );

  const {
    data: applications,
    isLoading: applicationsIsLoading,
    isError: applicationsIsError,
    refetch: refetchApplications,
  } = useQuery(
      ['applications', projectId],
      () => getApplicationsByProjectId(projectId, accessToken || ''),
      {
        enabled: !!accessToken,
      },
  );

  const {
    data: users,
    isLoading: usersIsLoading,
    isError: usersIsError,
  } = useQuery(
      ['users', applications],
      () =>
        Promise.all(
        applications!.map((application) =>
          getUserById(application.user_id, accessToken || ''),
        ),
        ),
      {
        enabled: !!accessToken,
      },
  );

  // handle loading
  if (projectIsLoading || applicationsIsLoading) {
    return <div>Loading...</div>;
  }

  // handle error
  if (projectIsError || applicationsIsError) {
    return <div>Error</div>;
  }

  // handle loading
  if (usersIsLoading) {
    return <div>Loading...</div>;
  }

  // handle error
  if (usersIsError) {
    return <div>Error</div>;
  }

  if (!project || !applications || !users) {
    return <div>Error</div>;
  }

  const cards = applications.map((application, index) => {
    const user = users[index];
    return (
      <Card key={application.id}>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {user.email}
          </Card.Subtitle>
          <Card.Text as={ReactMarkdown}>{user.description}</Card.Text>
          <div className="d-flex justify-content-evenly">
            <Button
              disabled={application.accepted}
              onClick={() => {
                updateApplication(
                    {
                      id: application.id,
                      user_id: application.user_id,
                      project_id: application.project_id,
                      accepted: true,
                      denied: false,
                    },
                    accessToken || '',
                ).then(() => {
                  console.log('success');
                  refetchApplications();
                });
              }}
            >
              Accept
            </Button>
            <Button
              disabled={application.denied}
              onClick={() => {
                updateApplication(
                    {
                      id: application.id,
                      user_id: application.user_id,
                      project_id: application.project_id,
                      accepted: false,
                      denied: true,
                    },
                    accessToken || '',
                ).then(() => {
                  console.log('success');
                  refetchApplications();
                });
              }}
            >
              Deny
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  });

  return (
    <Container>
      <h1>Applicant Review</h1>
      <div className="row">
        <div className="col-md-6">
          <Card>
            <Card.Header>Project</Card.Header>
            <Card.Body>
              <Card.Title>{project?.name}</Card.Title>
              <Card.Text
                as="div"
                className="desc"
                style={{maxHeight: 'unset'}}
              >
                <ReactMarkdown>{project?.description || ''}</ReactMarkdown>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">{cards}</div>
      </div>
    </Container>
  );
};

export default ApplicantReview;
