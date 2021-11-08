import {useState} from 'react';
import {doRequest} from '.';
import {useAuth} from '../store/auth';
import {Project} from './types';

// useProjects custom hook
export const useProjects = () => {
  const accessToken = useAuth((state) => state.accessToken);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: '/api/projects',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setProjects(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getAllProjectsByUserId = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/users/${userId}/projects`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setProjects(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getProjectById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/projects/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setProjects(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getProjectByName = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/projects/name/${name}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
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
    loading,
    error,
    getAllProjects,
    getAllProjectsByUserId,
    getProjectById,
    getProjectByName,
  };
};
