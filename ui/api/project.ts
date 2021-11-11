/* eslint-disable max-len */
import {useState} from 'react';
import {doRequest} from '.';
import {useAuth} from '../store/auth';
import {Application, Project} from './types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const {accessToken} = useAuth();

  const getRecommendedProjects = async () => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: '/projects/recommended',
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
      setProjects(response.data as Project[]);
    }
    setLoading(false);
    setError(error);
  };

  const getProjectsByUserId = async (userId: number) => {
    setLoading(true);
    const [response, error] = await doRequest({
      url: `/projects/users/${userId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (error) {
      setError(error);
    } else if (response) {
      setProjects(response.data as Project[]);
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
    if (error) {
      setError(error);
    } else if (response) {
      setProjects([response.data as Project]);
      setLoading(false);
      return response.data as Project;
    }
    setLoading(false);
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
      return response.data as Project;
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
      setProjects([...projects, response.data]);
      return response.data as Project;
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
      setProjects(
          projects.map((p) => (p.id === project.id ? response.data : p)),
      );
      return response.data as Project;
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
      return response.data as Application[];
    }
    if (error) {
      setError(error);
    }
  };

  const getProjectsByPopularity = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await doRequest({
        url: `/projects/popular`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]);
      } else {
        setProjects(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
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
    getProjectsByPopularity,
    getRecommendedProjects,
  };
};
