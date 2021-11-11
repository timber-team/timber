import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { Card } from 'react-bootstrap';
// { useEffect, useState } from 'react';
// import { Button, Stack } from 'react-bootstrap';

// import { useProjects } from '../api/project';
// import { useUser} from '../api/user';
// import UserCard from '../components/UserCard';
// import {Application, Project, User} from '../api/types';
// import {useAuth} from '../store/auth'

// interface ApplicationPair{
//   project: Project,
//   application: Application
// }

// import { useAuth } from '../store/auth';
import { useUser } from '../api/user';
import { useProjects } from '../api/project';
import { User, Project, Application } from '../api/types'

const ApplicantReview = () => {

  const { user, getUsersByIds } = useUser();
  const { projects, getProjectById } = useProjects();

  const [ loading, setLoading ] = React.useState(true);
  const [ NewProjects, setNewProjects ] = React.useState<Array<Project>>([]);

  // get id from params
  let { id } = useParams();

  useEffect(() => {
    // get this project by id
    if (id) {
      getProjectById(id);
    }
  }, [])

  useEffect(() => {
    console.log("GIGACHAD")
    // depenent on projects
    // get all applications from this project
    // get all users for each application
    let userIds: Array<number> = []
    // if (projects[0] === undefined) {
    //   console.log(projects)
    //   return
    // }

    console.log({ projects: projects})

    if (projects.length === undefined) {
      projects.applications.forEach((application: Application) => {
      userIds.push(application.user_id)
    })
  }

    console.log("Before")
    getUsersByIds(userIds);
    console.log("After")
  }, [projects])

  useEffect(() => {
    console.log(user)
    if (user !== undefined) {
      setLoading(false)
    }
  }, [user])

  if (!loading) {
    return (
      <div>
        <h1>Applicant Review</h1>
        <div className="row">
          <div className="col-md-6">
            <Card>
              <Card.Header>Project</Card.Header>
              <Card.Body>
                <Card.Title>{projects.name}</Card.Title>
                <Card.Text>
                  {projects.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6">
            <Card>
              <Card.Header>Applicants</Card.Header>
              <Card.Body>
                {user.map((u: User) => {
                  return (
                    <div key={u.id}>
                      <Card.Title>{u.username}</Card.Title>
                      <Card.Text>
                        {u.email}
                      </Card.Text>
                    </div>
                  )
                }
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // let init_user_flag = 0;
  // id is the id of the project, this needs to be hooked up better
  // const {currentUser, getUser} = useAuth();
  // const {getProjectById} = useProjects();

  // const [applications, setApplications] = useState<ApplicationPair[]>([]);
  // const [project, setProject] = useState<Project>();

  // const {user, getUserById, loading, error} = useUser();


  // useEffect(() => {
  //   currentUser?.projects?.map((proj: Project | undefined) => {
  //     if (proj === undefined) {
  //       return
  // }
  // getProjectById(proj.id).then((proj_2) => {
  //   let thing_filtered = proj_2?.applications?.filter((application)=> { return !application.accepted && !application.denied})
  //   let thing_mapped : ApplicationPair[] | undefined = thing_filtered?.map((application) => {return {project: proj_2  , application: application}})
  //   setApplications(applications.concat(thing_mapped? thing_mapped: []))


  //   })})


  // }, []);

  // useEffect(()=> {
  //   if (applications && applications.length > 0) {
  //     getUserById(applications[0]!.application.user_id)
  //   }


  // }, [applications])


  // const handleRejection = () => {
  //   if (applications){
  //     applications[0]!.application.denied = true
  //     //TODO: hooke up to backend to write that into db
  //     setApplications(applications.slice(1))
  //   }
  // };

  // const handleAccept = () => {
  //   if (applications) {
  //     applications[0]!.application.accepted = true
  //     setApplications(applications.slice(1))
  //     }
  // }

  // if (error) {
  //   return <div>Error!</div>;
  // }

  // if (loading  || user === undefined) {
  //   return <div>Loading...</div>;
  // }

  // if (applications.length <= 0) {
  //   return <div>No Applicants Waiting</div>;
  // }

  return (

    <div>
      <p>Bruh</p>
    </div>
    // <ul>
    //     {userProjects.map((project) => (
    //       <li
    //         key={project.id}
    //         style={
    //           window.innerWidth > 900 ?
    //             {
    //               maxWidth: '80%',
    //               margin: 'auto',
    //               listStyleType: 'none',
    //             } :
    //             {
    //               maxWidth: '100%',
    //               margin: 'auto',
    //               listStyleType: 'none',
    //             }
    //         }
    //       >
    //         <Card>
    //           <Card.Body>
    //             <div
    //               style={{
    //                 display: 'flex',
    //                 justifyContent: 'space-between',
    //                 alignItems: 'center',
    //               }}
    //             >
    //               <div>
    //                 <Card.Title
    //                   style={{
    //                     fontSize: '1.5rem',
    //                     fontWeight: 'bold',
    //                   }}
    //                 >
    //                   {project.name}
    //                   {currentUser &&
    //                   project.collaborators?.includes(currentUser) ? (
    //                     <Badge
    //                       style={{margin: '1em', fontSize: '0.6em'}}
    //                       bg="success"
    //                     >
    //                       Accepted
    //                     </Badge>
    //                   ) : (
    //                     <> </>
    //                   )}
    //                 </Card.Title>
    //                 <Card.Text>{project.description}</Card.Text>

    //                 <div
    //                   style={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                   }}
    //                 >
    //                   {project.required_skills?.map((skill) => (
    //                     <Badge
    //                       style={{
    //                         marginRight: '0.4rem',
    //                       }}
    //                       bg="info"
    //                       key={skill.id}
    //                     >
    //                       {skill.name}
    //                     </Badge>
    //                   ))}
    //                 </div>
    //                 <div
    //                   style={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                   }}
    //                 >
    //                   {project.preferred_skills.map((skill) => (
    //                     <Badge
    //                       bg="warning"
    //                       key={skill.id}
    //                       style={{marginRight: '0.4rem', marginTop: '0.4rem'}}
    //                     >
    //                       {skill.name}
    //                     </Badge>
    //                   ))}
    //                 </div>
    //               </div>
    //               <Card.Img
    //                 src={project.image_url}
    //                 style={{
    //                     maxWidth: '40%',
    //                     height: 'auto',
    //                 }}
    //               />
    //             </div>
    //           </Card.Body>
    //         </Card>
    //       </li>
    //     ))}

    // <Stack
    //   className="card-stack mx-auto justify-content-center w-100"
    //   gap={4}
    //   direction="horizontal"
    // >
    //    <Button
    //       className="card-stack-button"
    //     variant="primary"
    //     onClick={handleRejection}
    //   >
    //          Reject
    //   </Button>
    //  <UserCard user={user} project={applications[0].project} />
    // <Button
    //     className="card-stack-button"
    //     variant="secondary"
    //     onClick={handleAccept}
    //   >
    //     Accept
    //   </Button>
    // </Stack>
    // <div>
    //   Umm
    // </div>
  );
};


export default ApplicantReview;
