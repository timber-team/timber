import { doRequest, NoData } from "."
import { User } from "./types"

// Finds logged-in user's profile
export const GetProfile = async <T>() => {
    const [response, err] = await doRequest("/profile", "GET", null)
    if (err !== null) {
        return err
    }
    if (response.data === null) {
        return NoData
    }
    return response.data as User
}

// Finds user by id
export const GetUser = async <T>(userId: Number) => {
    const [response, err] = await doRequest(`/profile/${userId}`, "GET", null)
    if (err !== null) {
        return err
    }
    if (response.data === null) {
        return NoData
    }
    return response.data as User
}