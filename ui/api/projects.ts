import { doRequest, NoData } from "./init";
import { Project } from "./types";

// Finds project by id
export const GetProject = async <T>(projId: Number) => {
  const [response, err] = await doRequest({
    url: `/projects/${projId}`,
    method: "GET",
  });
  if (err !== null) {
    return err;
  }
  if (response === null) {
    return NoData;
  }
  return response.data as Project;
};
