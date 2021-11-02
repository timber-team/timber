import { doRequest, NoData } from ".";
import { useAuth } from "../store/auth";
import { Tag } from "./types";

// Get all tags from the database (GET /api/tags) using doRequest with AxiosRequestConfig
export const GetAllTags = async (): Promise<Tag[]> => {
  const accessToken = useAuth((state) => state.accessToken);
  const [resp, error] = await doRequest({
    method: "GET",
    url: `/api/tags`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (error) {
    throw error;
  }

  return (resp?.data as Tag[]) ?? NoData;
};
