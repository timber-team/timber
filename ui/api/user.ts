import {doRequest} from '.';

export const getUserById = async (id: number) => {
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
    }
  } catch (error) {
    setError(error.message);
  }
  setLoading(false);
};
