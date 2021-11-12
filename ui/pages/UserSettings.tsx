import EditProfile from '../components/EditProfile';
import React from 'react';
import {Container} from 'react-bootstrap';

const UserSettings = () => {
  return (
    <>
      <Container>
        <h2 style={{padding: '50px 50px 30px 50px', textAlign: 'center'}}>Settings</h2>
        <EditProfile disabled={true} />
      </Container>
    </>
  );
};

export default UserSettings;
