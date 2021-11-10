import React, { useEffect, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';

import { useProjects } from '../api/project';
import { useUser} from '../api/user';
import { useApplications } from '../api/application';
import UserCard from '../components/UserCard';
import { useParams } from 'react-router';
import {Application, Project} from '../api/types';

const ApplicantReview = () => {
//   const {id} = useParams();
  const id = 1;
  const {getProjectById} = useProjects();
  const [applications, setApplications] = useState<Application[]>();
  const [project, setProject] = useState<Project>();

  const {user, getUserById, loading, error} = useUser();

  const [index, setIndex] = React.useState(0);

//   const disableNext = projects.length === 0 || projects.length === index + 1;
//   const disablePrev = index === 0;

  useEffect(() => {
    // console.log("Rerender")
    getProjectById(id).then((p) => {setProject(p);
        // p?.applications?.map(()=> {

        // })
    });
  }, []);

  useEffect(() => {
    setApplications(project?.applications);
  }, [project])

  useEffect(()=> {
    if (applications){
      console.log(applications)
        getUserById(applications[index].user_id)
    }
    
  }, [index, applications])

  const handleNext = () => {
    if (applications && index < applications.length - 1) {
      setIndex(index + 1);
    }else{
        setIndex(0);
    }
  };

  const handleRejection = () => {
    console.log("yes")
  };

  const handleAccept = () => {
    console.log("no")
  }

  if (!error) {
    console.log(error)
    return <div>Error!</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!applications?.length) {
    return <div>Project not found</div>;
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
    
     <UserCard user={user || {id: 1,
                      created_at: 10,
                      modified_at: 10,
                      username: "epic",
                      email: "email@email.com",
                      verified: false,
                      description: `yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data
                      yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data
                      yo this is really long just make it long its cool that way idk wth im meant to do except dummy long data`,
                      avatar_url: "yo",
                            }} />
    <Button
        className="card-stack-button"
        variant="secondary"
        // disabled={disableNext}
        onClick={handleAccept}
      >
        Accept
      </Button>
    </Stack>
  );
}

export default ApplicantReview;