import React, { useEffect } from 'react';
import { useAuth } from '../store/auth';
import { Application } from '../api/types';
import { Col, Row } from 'react-bootstrap';
import { useApplications } from '../api/application';

/* // useApplications custom hook
export const useApplications = () => {
  const accessToken = useAuth((state) => state.accessToken);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllApplicationsByUserId = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/users/${userId}/applications`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setApplications(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getApplicationById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/applications/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setApplications(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // get application by project id
  const getAllApplicationsByProjectId = async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/projects/${projectId}/applications`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setApplications(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    applications,
    loading,
    error,
    getAllApplicationsByUserId,
    getApplicationById,
    getAllApplicationsByProjectId,
  };
}; */


// Applications functional component
const Applications: React.FC = () => {
  // display a list of applications for a user using the custom hook
  const { applications, loading, error, getAllApplications, getAllApplicationsByProjectId } = useApplications();


  //get all applications
  useEffect(() => {
    getAllApplicationsByProjectId(13);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!applications?.length) {
    return <div>No applications found</div>;
  }

  return (
    // display a list of applications and their contents, with labels for a user
    <div>
      <Row>
        <Col>
          <h1>Applications</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul>
            {applications.map((application) => (
              <li key={application.id}>
                <p>Application: {application.id}</p>
                <p>Created at: {new Date(application.created_at).toLocaleString()}</p>
                <p>Modified at: {new Date(application.modified_at).toLocaleString()}</p>
                <p>User id: {application.user_id}</p>
                <p>Project id: {application.project_id}</p>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default Applications;
