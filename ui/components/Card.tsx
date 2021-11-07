import React from 'react';
import {Badge, Card, OverlayTrigger, Popover} from 'react-bootstrap';

import {Project, Tag} from '../api/types';

interface ProjectCardProps {
  project: Project;
}
const ProjectCard: React.FC<ProjectCardProps> = ({project}) => {
  return (
    <Card
      style={{
        width: '65vh',
        boxShadow:
          '0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        height: '75vh',
      }}
    >
      <Card.Img
        variant="top"
        src={project.image_url || 'https://via.placeholder.com/900x600'}
      />
      <Card.Body>
        <Card.Title>
          <a href={`/projects/${project.id}`}>{project.name}</a>
        </Card.Title>
        <Card.Text>{project.description}</Card.Text>
        <Card.Text>
          <span style={{fontWeight: 'bold'}}>Required Skills:</span>{' '}
          {project.required_skills.map((skill: Tag) => (
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
          {project.preferred_skills.map((skill: Tag) => (
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
                  className="d-flex flex-column
                  align-items-center justify-content-center"
                >
                  <img
                    src={
                      project.owner.avatar_url ||
                      'https://i.pravatar.cc/600?id=' + project.owner.id
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
                    {project.owner.description}
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
                'https://i.pravatar.cc/600?id=' + project.owner.id
              }
              className="rounded-circle me-auto"
              style={{width: '50px', height: '50px', marginLeft: '10px'}}
            />
          </OverlayTrigger>
          {project.collaborators &&
            project.collaborators.map((collaborator) => (
              <OverlayTrigger
                trigger={['hover', 'focus']}
                key={collaborator.id}
                placement="top"
                overlay={
                  <Popover id={`popover-positioned-${collaborator.id}`}>
                    <Popover.Header
                      as="div"
                      className="d-flex flex-column
                      align-items-center justify-content-center"
                    >
                      <img
                        src={
                          collaborator.avatar_url ||
                          'https://i.pravatar.cc/600?id=' + collaborator.id
                        }
                        alt={collaborator.username}
                        width="80"
                        height="80"
                        className="rounded-circle"
                      />
                      <h3>{collaborator.username}</h3>
                    </Popover.Header>
                    <Popover.Body>
                      <Popover.Header as="h5">
                        {collaborator.description}
                      </Popover.Header>
                      <Popover.Body as="p" className="text-center">
                        {collaborator.tags?.map((tag) => (
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
                        {collaborator.projects?.slice(0, 5).map((project) => (
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
                    'https://i.pravatar.cc/600?img=' + collaborator.id
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
            ))}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProjectCard;
