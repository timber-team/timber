/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Badge, Button, Card, Container } from 'react-bootstrap';

import { useUser } from '../api/user';
import { useProjects } from '../api/project';
import { useApplications } from '../api/application';
import { User, Project, Application, Tag } from '../api/types';
import { useAuth } from '../store/auth';

import ReactMarkdown from 'react-markdown';

const ApplicantReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id);
  const { currentUser } = useAuth();

  const { updateApplication } = useApplications();
  const { getProjectById, getApplications } = useProjects();
  const { getUserById } = useUser();

  const [applications, setApplications] = React.useState<Application[]>([]);
  const [project, setProject] = React.useState<Project>();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    getProjectById(projectId).then((project: Project) => {
      setProject(project);
    });
  }, [projectId]);

  useEffect(() => {
    getApplications(projectId).then((applications: Application[]) => {
      setApplications(applications);
    });
  }, [project]);

  useEffect(() => {
    // Get all users in the projects applications
    const userIds = applications.map((application: Application) => {
      return application.user_id;
    });

    // getUserById for each user id in userIds, and append to users array using setUsers
    userIds.forEach((userId: number) => {
      getUserById(userId).then((user: User) => {
        setUsers([...users, user]);
      });
      setLoading(false);
    });
  }, [applications]);

  // return an array of cards for each application, with the user's name and description, and a button to accept or deny
  const renderApplications = () => {
    return applications.map((application: Application) => {
      const user = users.find((user: User) => {
        return user.id === application.user_id;
      });
      if (!user) {
        return null;
      }
      return (
        <Card key={application.id}>
          <Card.Body>
            <Card.Title>{user?.username}</Card.Title>
            <Card.Text className="desc">
              <ReactMarkdown>
                {user?.description}
              </ReactMarkdown>
            </Card.Text>
            <Card.Text>
              <span style={{ fontWeight: 'bold' }}>User Skills:</span>{' '}
              {user?.tags?.map((skill: Tag) => (
                <Badge
                  key={skill.id}
                  bg="warning"
                  style={{ marginRight: '5px', fontSize: '0.8rem' }}
                >
                  {skill.name}
                </Badge>
              ))}
            </Card.Text>

            <Button
              disabled={!currentUser || application.accepted}
              onClick={() => {
                updateApplication({
                  id: application.id,
                  user_id: application.user_id,
                  project_id: application.project_id,
                  accepted: true,
                  denied: false,
                });
              }}
            >
              Accept
            </Button>
            <Button
              disabled={!currentUser || application.denied}
              onClick={() => {
                updateApplication({
                  id: application.id,
                  user_id: application.user_id,
                  project_id: application.project_id,
                  accepted: false,
                  denied: true,
                });
              }}
            >
              Deny
            </Button>
            {application.accepted && (
              <p>
                <span style={{ fontWeight: 'bold' }}>Status:</span> Accepted
              </p>
            )}
            {application.denied && (
              <p>
                <span style={{ fontWeight: 'bold' }}>Status:</span> Denied
              </p>
            )}
          </Card.Body>
        </Card>
      );
    });
  };

  if (loading || !users) {
    return <div>Loading...</div>;
  }

  // return <div>{project && renderApplications()}</div>;
  return (
    <Container>
      <h1>Applicant Review</h1>
      <div className="row">
        <div className="col-md-6">
          <Card>
            <Card.Header>Project</Card.Header>
            <Card.Body>
              <Card.Title>{project?.name}</Card.Title>
              <Card.Text as="div" className="desc" style={{ maxHeight: 'unset' }}>
                <ReactMarkdown>
                  {/* it just works */}
                  {project?.description!}
                </ReactMarkdown>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">{renderApplications()}</div>
      </div>
    </Container>
  );
};

export default ApplicantReview;
