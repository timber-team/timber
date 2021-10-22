export * as users from "./users"


const API_DOMAIN = "localhost:1234"


// stolen generic api respone i guess


export interface APIResponse {
    status_code:    number,
    status_text:    string,
    body:           any,
    err:            boolean
}

interface GenericResponse{
    body: string
}

export function simple_api_request(endpoint: string, method: string, body: any, authenticated = true) : APIResponse{





    return {
        status_code: null,
        status_text: "yes",
        body: "string",
        err: false
    }
}
