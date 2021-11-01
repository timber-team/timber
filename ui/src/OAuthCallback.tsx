import React, { useEffect } from 'react'
import { Redirect } from 'react-router'
import { tokens } from '../api/init'

const OAuthCallback = () => {

    useEffect( () => {
        (async() => {
            const query = new URLSearchParams(window.location.search)
            const code = query.get("code")
            const redirect_url = query.get("state")
            if (code === null || code === "") {
                // invalid oauth
                return 
            }
            if (await tokens.GetAccessToken(code, "google")) {
                if (redirect_url) {
                    return <Redirect to={redirect_url} />
                } else {
                    return <Redirect to="/" />
                }
            }
            return
        })
    })
}

export default OAuthCallback