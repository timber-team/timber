import { useState } from 'react';
import { useAuth } from '../store/auth';
import { doRequest } from '.';
import { Application } from './types';

// useApplications custom hook
export const useApplications = () => {
  const accessToken = useAuth((state) => state.accessToken);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getOwnApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await doRequest({
        url: `/api/applications`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setApplications(response[0].data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

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

  const createApplication = async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/applications/${projectId}`,
        method: 'POST',
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
    // getAllApplicationsByUserId,
    getOwnApplications,
    getApplicationById,
    getAllApplicationsByProjectId,
    createApplication,
  };
};

export const getOwnApplications = async () => {
  return useAuth((state) => state.currentUser?.applications);
}
