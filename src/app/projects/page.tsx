"use client"
import { env } from '@/env/schema'
import { projectResponseSchema } from '@/validate'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'

type Props = {}

const ProjectsPage = (props: Props) => {

    const [projects, setProjects] = useState<z.infer<typeof projectResponseSchema>>([])

    const getProjects = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
            credentials: "include",
        })

        const data = await res.json()

        console.log(data)
        setProjects(data)
    }


    useEffect(() => {
        console.log("projects page")
        getProjects()
    }, [])

    return (
        <div>
            <ul>
                {
                    projects.map(project => {
                        return <li key={project.ID}>
                            {project.Name}
                        </li>
                    })
                }
            </ul>
        </div>
    )
}

export default ProjectsPage