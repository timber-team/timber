import React, { useEffect, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';

import { useProjects } from '../api/project';
import { useUser} from '../api/user';
import UserCard from '../components/UserCard';
import {Application, Project} from '../api/types';

const ApplicantReview = (props) => {


  // id is the id of the project, this needs to be hooked up better
  const id = 1;
  const {getProjectById} = useProjects();

  const [applications, setApplications] = useState<Application[]>();
  const [project, setProject] = useState<Project>();

  const {user, getUserById, loading, error} = useUser();


  useEffect(() => {
    getProjectById(id).then((p) => {setProject(p);
      setApplications(p?.applications?.filter( (application)=> !application.accepted && !application.denied));
    });
  }, []);

  useEffect(()=> {
    if (applications){
      console.log(applications)
        getUserById(applications[0].user_id)
    }
    
  }, [applications])


  const handleRejection = () => {
    if (applications){
      applications[0].denied = true
      //TODO: hooke up to backend to write that into db
      setApplications(project?.applications?.filter( (application)=> !application.accepted && !application.denied))
    }
  };

  const handleAccept = () => {
    if (applications) {
      applications[0].accepted = true
      //TODO: hooke up to backend to write that into db
      setApplications(project?.applications?.filter( (application)=> !application.accepted && !application.denied))
      }
  }

  if (error) {
    console.log(error)
    return <div>Error!</div>;
  }

  if (loading || user === undefined) {
    return <div>Loading...</div>;
  }

  if (applications?.length) {
    return <div>No Applicants Waiting</div>;
  }

  return (
    <Stack
      className="card-stack mx-auto justify-content-center w-100"
      gap={4}
      direction="horizontal"
    >
       <Button
          className="card-stack-button"
        variant="primary"
        // disabled={disablePrev}
        onClick={handleRejection}
      >
             Reject
      </Button>
    
     <UserCard user={user } />
    <Button
        className="card-stack-button"
        variant="secondary"
        onClick={handleAccept}
      >
        Accept
      </Button>
    </Stack>
  );
}

export default ApplicantReview;

//dummy the data if you want it

// || {id: 1,
//   created_at: 10,
//   modified_at: 10,
//   username: "epic",
//   email: "email@email.com",
//   verified: false,
//   description: `yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data
//   yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data
//   yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data`,
//   avatar_url: "yo",
//         }