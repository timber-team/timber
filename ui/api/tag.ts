import {useState} from 'react';
import {doRequest} from '.';
import {useAuth} from '../store/auth';
import {Tag} from './types';

export const useTags = () => {
  const {accessToken} = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: '/tags',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setTags(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // get tag by id using the doRequest with AxiosRequestConfig
  const getTagById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/tags/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setTags(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const getTagByProjectId = async (projectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/projects/${projectId}/tags`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setTags(response[0]!.data);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    tags,
    loading,
    error,
    getAllTags,
    getTagById,
    getTagByProjectId,
  };
};
