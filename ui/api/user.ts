import { doRequest, NoData } from ".";
import { User } from "./types";

// Finds logged-in user's profile
export const GetProfile = async <T>() => {
  const [response, err] = await doRequest({ url: "/profile", method: "GET" });
  if (err !== null) {
    return err;
  }
  if (response === null) {
    return NoData;
  }
  return response.data as User;
};

// Finds user by id
export const GetUser = async <T>(userId: Number) => {
  const [response, err] = await doRequest({
    url: `/profile/${userId}`,
    method: "GET",
  });
  if (err !== null) {
    return err;
  }
  if (response === null) {
    return NoData;
  }
  return response.data as User;
};
