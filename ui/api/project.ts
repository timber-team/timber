/* eslint-disable max-len */
import {useState} from 'react';
import {doRequest} from '.';
import {useAuth} from '../store/auth';
import {Project} from './types';

// Example of the doRequest function
/*
export const doRequest = async (
    config: AxiosRequestConfig,
): Promise<[GenericResponse | null, Error | null]> => {
  try {
    const response = await axios(config);
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
}
*/

// useProjects custom hook, it uses doRequest with AxiosRequestConfig to make any requests
// it returns an array with the projects, an error state and a loading state
// It has multiple functions, one to get all projects, one to get all projects by user id, one to get a project by id, one to get a project by name, one to create a project, one to update a project, one to delete a project
// any requests made with this hook will be authenticated with the accessToken in the useAuth hook
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const {accessToken} = useAuth();

  const getAllProjects = async () => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: '/projects',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (error) {
      setError(error);
    } else if (response) {
      setProjects(response.data);
    }
    setLoading(false);
  };

  const getProjectsByUserId = async (userId: number) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/users/${userId}/projects`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (error) {
      setError(error);
    } else if (response) {
      setProjects(response.data);
    }
    setLoading(false);
  };

  const getProjectById = async (id: number) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/${id}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects([response.data]);
    }
    if (error) {
      setError(error);
    }
  };

  const getProjectByName = async (name: string) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/name/${name}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects([response.data]);
    }
    if (error) {
      setError(error);
    }
  };

  // Create a project (take in a partial Project object)
  const createProject = async (project: Partial<Project>) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: '/projects',
      method: 'POST',
      data: {
        name: project.name,
        description: project.description,
        image_url: project.image_url,
        owner_id: project.owner_id,
        preferred_skills: project.preferred_skills,
        required_skills: project.required_skills,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects([response.data]);
    }
    if (error) {
      setError(error);
    }
  };

  // Update a project (take in a partial Project object)
  const updateProject = async (project: Partial<Project>) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/${project.id}`,
      method: 'PUT',
      data: {
        name: project.name,
        description: project.description,
        image_url: project.image_url,
        owner_id: project.owner_id,
        preferred_skills: project.preferred_skills,
        required_skills: project.required_skills,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects([response.data]);
    }
    if (error) {
      setError(error);
    }
  };

  // Delete a project by id
  const deleteProject = async (id: number) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects(projects.filter((project) => project.id !== id));
    }
    if (error) {
      setError(error);
    }
  };

  // Get all applications for a project
  const getApplications = async (id: number) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/${id}/applications`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setLoading(false);
    if (response) {
      setProjects([response.data]);
    }
    if (error) {
      setError(error);
    }
  };

  return {
    projects,
    error,
    loading,
    getAllProjects,
    getProjectsByUserId,
    getProjectById,
    getProjectByName,
    createProject,
    updateProject,
    deleteProject,
    getApplications,
  };
};
