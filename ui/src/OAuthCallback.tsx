import React, { useEffect } from 'react'
import { Redirect } from 'react-router'
import { tokens } from '../api/init'

const OAuthCallback = () => {
    useEffect( () => {
        ( async () => { 
            await tokens.GetAccessToken(window.location.search, "google")
            window.location.href = "/"
        }
        )()
        }, [])
    return (
        <p>Loading...</p>
    )
}

export default OAuthCallback