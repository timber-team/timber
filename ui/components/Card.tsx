import {Project, Tag} from 'api/types';
import React from 'react';
import {Badge, Card} from 'react-bootstrap';

interface Props {
  project: Project;
  onApply: (project: Project) => void;
  onReject: (project: Project) => void;
}

export const ProjectCard: React.FC<Props> = ({
  project,
  onApply,
  onReject,
}) => {
  return (
    <Card style={{width: '100%', margin: '0 auto'}}>
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>
        <Card.Text>{project.description}</Card.Text>
        <Card.Text>
          <b>Required Skills: </b>
          {project.required_skills.map((skill: Tag) => (
            <Badge bg="secondary" key={skill.id} style={{marginRight: '5px'}}>
              {skill.name}
            </Badge>
          ))}
        </Card.Text>
        <Card.Text>
          <b>Preferred Skills: </b>
          {project.preferred_skills.map((skill: Tag) => (
            <Badge bg="secondary" key={skill.id} style={{marginRight: '5px'}}>
              {skill.name}
            </Badge>
          ))}
        </Card.Text>
        {project.owner && (
          <Card.Text>
            <b>Owner: </b>
            {project.owner.username}
          </Card.Text>
        )}
        <Card.Text>
          <b>Collaborators: </b>
          {project.collaborators?.map((collaborator: any) => (
            <Badge
              bg="secondary"
              key={collaborator.id}
              style={{marginRight: '5px'}}
            >
              {collaborator.username}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <button
          className="btn btn-primary"
          onClick={() => onApply(project)}
          disabled={project.user_applied === true}
          style={{marginRight: '5px'}}
        >
          {project.user_applied === true ? 'Applied' : 'Apply'}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => onReject(project)}
          disabled={project.user_applied === true}
          style={{marginRight: '5px'}}
        >
          {'Reject'}
        </button>
      </Card.Footer>
    </Card>
  );
};
