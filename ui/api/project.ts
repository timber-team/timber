/* eslint-disable max-len */
import { useState } from 'react';
import { doRequest } from '.';
import { useAuth } from '../store/auth';
import { Project } from './types';

// useProjects custom hook
export const useProjects = () => {
  const { accessToken } = useAuth();
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
        setLoading(false);
        return response[0]!.data as Project;
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

  const createProject = async (project: Partial<Project>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: '/api/projects',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: project,
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

  const getProjectsByPopularity = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await doRequest({
        url: `/api/projects/popular`,
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
      setError(error.message)
    }
    setLoading(false)
  }

  return {
    projects,
    loading,
    error,
    getAllProjects,
    getAllProjectsByUserId,
    getProjectById,
    getProjectByName,
    createProject,
    getProjectsByPopularity,
  };
};
