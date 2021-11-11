/* eslint-disable max-len */
import React from 'react';
import {Badge, Card} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

import {User, Tag, Project} from '../api/types';

interface UserCardProps {
  user: User;
  project: Project;
}

const UserCard: React.FC<UserCardProps> = ({user, project}) => {
  return (
    <Card
      style={{
        width: '65vh',
        boxShadow:
          '0 0px 0px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        minHeight: '75vh',
      }}
    >
      <Card.Img
        variant="top"
        src={project.image_url|| 'https://via.placeholder.com/900x600'}
        style={{height: "30vh"}}
      />
      <Card.Body>
        <Card.Title>
          {user.username} is applying to {project.name}!
        </Card.Title>
        <Card.Text as="div">
          <ReactMarkdown>{user.description}</ReactMarkdown>
        </Card.Text>
        <Card.Text>
          {user.tags?.map((skill: Tag) => (
            <Badge
              key={skill.id}
              bg="info"
              style={{marginRight: '5px', fontSize: '0.8rem'}}
            >
              {skill.name}
            </Badge>
          ))}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
          <img
                    src={
                      user.avatar_url ||
                      'https://i.pravatar.cc/600?id=' + user.id
                    }
                    alt={user.username}
                    width="80"
                    height="80"
                    className="rounded-circle"
                  />
      </Card.Footer>
    </Card>
  );
};

export default UserCard;