import { doRequest, NoData } from "./init"
import { TokenResponse } from "./types"

export const GetAccessToken = async <T>(query: string, provider: string) => {
    const [response, err] = await doRequest(`/auth/callback/${provider}${query}`, "GET", null)
    if (err !== null) {
        console.log(err)
        return err
    }
    console.log("Test")

    if (response.data === null) {
        return NoData
    }

    const token_pair = response.data as TokenResponse
    console.log({token_pair})
    await localStorage.setItem("access_token", token_pair.access_token)
    await localStorage.setItem("refresh_token", token_pair.refresh_token)

    return true
}

export const RefreshTokens = async <T>() => {
    const [response, err] = await doRequest(`/auth`, "POST", {
        refresh_token: localStorage.getItem("refresh_token")
    })
    if (err !== null) {
        console.log(err)
        return err
    }
    console.log("Test")

    if (response.data === null) {
        return NoData
    }

    const token_pair = response.data as TokenResponse
    console.log({token_pair})
    await localStorage.setItem("access_token", token_pair.access_token)
    await localStorage.setItem("refresh_token", token_pair.refresh_token)

    return true
}