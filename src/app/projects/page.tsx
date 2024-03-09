"use client"
import ProjectCard from '@/components/composite/ProjectCard'
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
        <div className='p-10'>
            <h1 className='font-bold mb-2'>Projects</h1>
            <div className='flex'>
                {
                    projects.map(project => {
                        return <ProjectCard
                            id={project.ID}
                            title={project.Name}
                            description={project.LatestVersion?.Title || "No Published Version"}
                            content={"Content"}
                            footer={"Footer"} />
                    })
                }
            </div>
        </div>
    )
}

export default ProjectsPage