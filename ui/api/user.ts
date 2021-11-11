import {useAuth} from '../store/auth';
import {doRequest} from '.';
import {useState} from 'react';
import {User} from './types';

// useUser custom hook
export const useUser = () => {
  const accessToken = useAuth((state) => state.accessToken);
  const [user, setUser] = useState<User | User[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // get user by id using doRequest with AxiosRequestConfig
  const getUserById = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/users/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setUser(response[0]!.data);
        console.log(response[0]!.data)
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };
  const getUsersByIds = async (userIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await doRequest({
        url: `/api/user?q=${userIds.join(',')}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response[0] === null) {
        setError(response[1]!.message);
      } else {
        setUser(response[0]!.data);
        console.log(response[0]!.data)
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    user,
    loading,
    error,
    getUserById,
    getUsersByIds
  };
};
