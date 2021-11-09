import React, { useEffect } from 'react'
import { useProjects } from '../api/project'

const Trending = () => {
    const {projects, loading, error, getProjectsByPopularity} = useProjects()

    useEffect(() => {
        getProjectsByPopularity
    }, [])

    useEffect(() => {
        console.log(projects)
    }, [projects])



    return (
        <div>{projects}</div>
    )
}

export default Trending