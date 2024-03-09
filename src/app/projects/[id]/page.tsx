"use client"
import { env } from '@/env/schema'
import { projectByIdResponseSchema } from '@/validate'
import React, { useEffect } from 'react'
import { z } from 'zod'

type Props = {
    params: {
        id: string
    }
}

const ProjectByID = (props: Props) => {

    const [project, setProject] = React.useState<z.infer<typeof projectByIdResponseSchema> | null>(null)

    async function getProject() {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${props.params.id}`, {
            credentials: "include",
        })

        const data = await res.json()

        console.log(data)
        setProject(data)
    }

    useEffect(() => {
        console.log("project by id")
        getProject()
    }, [])
    return (
        <div className='p-10'>
            <div>
                <h1 className='text-xl font-bold'>{project?.Name}</h1>
                {
                    project ?
                        <div> {project.Versions.length > 0 ? project.Versions.map(version =>
                            <div>
                                <h1>{version.Title}</h1>
                            </div>
                        ) : "No Versions"}
                        </div> : "Loading"
                }</div >
        </div>
    )
}

export default ProjectByID