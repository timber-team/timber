import React, { useEffect, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';

import { useProjects } from '../api/project';
import { useUser} from '../api/user';
import UserCard from '../components/UserCard';
import {Application, Project, User} from '../api/types';
import {useAuth} from '../store/auth'

interface ApplicationPair{
  project: Project,
  application: Application
}

const ApplicantReview = () => {

  let init_user_flag = 0;
  // id is the id of the project, this needs to be hooked up better
  const {currentUser, getUser} = useAuth();
  const {getProjectById} = useProjects();

  const [applications, setApplications] = useState<ApplicationPair[]>([]);
  const [project, setProject] = useState<Project>();

  const {user, getUserById, loading, error} = useUser();


  useEffect(() => {
    currentUser?.projects?.map((proj) => {
      getProjectById(proj.id).then((proj_2) => {
        let thing_filtered = proj_2?.applications?.filter((application)=> { return !application.accepted && !application.denied})
        let thing_mapped : ApplicationPair[] | undefined = thing_filtered?.map((application) => {return {project: proj_2  , application: application}})
        setApplications(applications.concat(thing_mapped? thing_mapped: []))
      
      
    })})


  }, []);

  useEffect(()=> {
    if (applications && applications.length > 0) {
      getUserById(applications[0]!.application.user_id)
    }

    
  }, [applications])


  const handleRejection = () => {
    if (applications){
      applications[0]!.application.denied = true
      //TODO: hooke up to backend to write that into db
      setApplications(applications.slice(1))
    }
  };

  const handleAccept = () => {
    if (applications) {
      applications[0]!.application.accepted = true
      setApplications(applications.slice(1))
      }
  }

  if (error) {
    return <div>Error!</div>;
  }

  if (loading  || user === undefined) {
    return <div>Loading...</div>;
  }

  if (applications.length <= 0) {
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
        onClick={handleRejection}
      >
             Reject
      </Button>
     <UserCard user={user} project={applications[0].project} />
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
