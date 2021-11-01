import { doRequest, NoData } from "./init"
import { TokenResponse } from "./types"

export const GetAccessToken = async <T>(code: string, provider: string) => {
    const [response, err] = await doRequest(`/auth/callback/${provider}?code=${code}`, "GET", null)
    if (err !== null) {
        return err
    }

    if (response.data === null) {
        return NoData
    }

    const tokens = response.data as TokenResponse
    await localStorage.setItem("access_token", tokens.access_token)
    await localStorage.setItem("refresh_token", tokens.refresh_token)

    return true
}