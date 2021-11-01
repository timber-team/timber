import { doRequest, NoData } from "./init"
import { Project } from "./types"

// Finds project by id
const GetProject = async <T>(projId: Number) => {
    const [response, err] = await doRequest(`/projects/${projId}`, "GET", null)
    if (err !== null) {
        return err
    }
    if (response.data === null) {
        return NoData
    }
    return response.data as Project
}

// // to be implemented
// const GetRecommendedProjects = async <T>() => {
//     const [response, err] = await doRequest(`/projects/recommended`, "GET", null)
//     if (err !== null) {
//         return err
//     }
//     if (response.data === null) {
//         return NoData
//     }
//     return response.data as Project[]
// }

// // to be implemented
// const DeleteProject = async <T>(projId: Number) => {
//     const [response, err] = await doRequest(`/projects/${projId}`, "DELETE", null)
//     if (err !== null) {
//         return err
//     }
//     if (response.data === null) {
//         return NoData
//     }
//     return response.detail === "success"
// }