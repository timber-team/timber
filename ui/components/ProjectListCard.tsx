/* eslint-disable max-len */
import React from 'react';
import {Badge, Button, Card, OverlayTrigger, Popover} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import {Link} from 'react-router-dom';

import {Project, Tag, User} from '../api/types';
import ProjectForm from './ProjectForms';

const ProjectListCard = (props: { project: Project }) => {
  const {project} = props;

  if (!project) {
    return <div>Loading...</div>;
  }
  return (
    <Card className="mt-3">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <ProjectForm initialItem={project} />
          <Link to={`/review/${project.id}`}>
            <Button
              variant="outline-secondary"
              size="sm"
              style={{margin: 'auto', height: '100%'}}
            >
              {project.applications ? project.applications.length : 0}{' '}
              {project.applications ?
                project.applications.length === 1 ?
                  'Application' :
                  'Applications' :
                'Applications'}
            </Button>
          </Link>

          <button
            className="btn btn-sm btn-outline-primary"
            // onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </Card.Header>

      <Card.Body>
        <Card.Title>
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        </Card.Title>
        <Card.Text>
          <span style={{fontWeight: 'bold'}}>Description:</span>{' '}
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </Card.Text>
        <Card.Text>
          <span style={{fontWeight: 'bold'}}>Required Skills:</span>{' '}
          {project.required_skills?.map((skill: Tag) => (
            <Badge
              key={skill.id}
              bg="secondary"
              style={{marginRight: '5px', fontSize: '0.8rem'}}
            >
              {skill.name}
            </Badge>
          ))}
        </Card.Text>
        <Card.Text>
          <span style={{fontWeight: 'bold'}}>Preferred Skills:</span>{' '}
          {project.preferred_skills?.map((skill: Tag) => (
            <Badge
              key={skill.id}
              bg="secondary"
              style={{marginRight: '5px', fontSize: '0.8rem'}}
            >
              {skill.name}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex justify-content-between">
          <OverlayTrigger
            trigger={['hover', 'focus']}
            key={project.owner.id}
            placement="top"
            overlay={
              <Popover id={`popover-positioned-${project.owner.id}`}>
                <Popover.Header
                  as="div"
                  className="d-flex flex-column align-items-center justify-content-center"
                >
                  <img
                    src={
                      project.owner.avatar_url ||
                      'https://i.pravatar.cc/600?id=' + (project.owner.id % 50)
                    }
                    alt={project.owner.username}
                    width="80"
                    height="80"
                    className="rounded-circle"
                  />
                  <h3>{project.owner.username}</h3>
                </Popover.Header>
                <Popover.Body>
                  <Popover.Header as="h5">
                    <ReactMarkdown>{project.owner.description}</ReactMarkdown>
                  </Popover.Header>
                  <Popover.Body as="p" className="text-center">
                    {project.owner?.tags?.map((tag) => (
                      <Badge
                        key={tag.id}
                        bg="secondary"
                        style={{margin: '5px', fontSize: '0.8rem'}}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </Popover.Body>
                  <Popover.Body as="p" className="text-center">
                    {project.owner.projects?.slice(0, 5).map((project) => (
                      <Badge
                        key={project.id}
                        bg="info"
                        style={{margin: '5px', fontSize: '0.8rem'}}
                      >
                        {project.name}
                      </Badge>
                    ))}
                  </Popover.Body>
                </Popover.Body>
              </Popover>
            }
          >
            <Card.Img
              variant="top"
              src={
                project.owner.avatar_url ||
                'https://i.pravatar.cc/600?img=' + (project.owner.id % 50)
              }
              className="rounded-circle"
              style={{
                marginRight: '10px',
                height: '50%',
                maxWidth: '50px',
                maxHeight: 'inherit',
                margin: 'auto 5',
              }}
            />
          </OverlayTrigger>
          {project.collaborators?.map((collaborator: User) => {
            if (collaborator.id !== project.owner.id) {
              return (
                <OverlayTrigger
                  trigger={['hover', 'focus']}
                  key={collaborator.id}
                  placement="top"
                  overlay={
                    <Popover id={`popover-positioned-${collaborator.id}`}>
                      <Popover.Header
                        as="div"
                        className="d-flex flex-column align-items-center justify-content-center"
                      >
                        <img
                          src={collaborator.avatar_url}
                          alt={collaborator.username}
                          width="80"
                          height="80"
                          className="rounded-circle"
                        />
                        <h3>{collaborator.username}</h3>
                      </Popover.Header>
                      <Popover.Body>
                        <Popover.Header as="h5">
                          <ReactMarkdown>
                            {collaborator.description}
                          </ReactMarkdown>
                        </Popover.Header>
                        <Popover.Body as="p" className="text-center">
                          {collaborator?.tags?.map((tag: Tag) => (
                            <Badge
                              key={tag.id}
                              bg="secondary"
                              style={{margin: '5px', fontSize: '0.8rem'}}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </Popover.Body>
                        <Popover.Body as="p" className="text-center">
                          {collaborator.projects
                              ?.slice(0, 5)
                              .map((project: Project) => (
                                <Badge
                                  key={project.id}
                                  bg="info"
                                  style={{margin: '5px', fontSize: '0.8rem'}}
                                >
                                  {project.name}
                                </Badge>
                              ))}
                        </Popover.Body>
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <Card.Img
                    variant="top"
                    src={
                      collaborator.avatar_url ||
                      'https://i.pravatar.cc/600?id=' + (collaborator.id % 50)
                    }
                    className="rounded-circle"
                    style={{
                      marginRight: '10px',
                      height: '50%',
                      maxWidth: '50px',
                      maxHeight: 'inherit',
                      margin: 'auto 5',
                    }}
                  />
                </OverlayTrigger>
              );
            } else {
              return <></>;
            }
          })}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProjectListCard;
