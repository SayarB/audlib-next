"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { env } from '@/env/schema'
import { projectByIdResponseSchema } from '@/validate'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { usePlayback } from '@/hooks/usePlayback'
import { PauseButton, PlayButton } from '@/components/composite/Controls'

type Props = {
    params: {
        id: string
    }
}



const ProjectByID = (props: Props) => {

    const [project, setProject] = React.useState<z.infer<typeof projectByIdResponseSchema> | null>(null)
    const { playbackLoading, startStream, idPlaying, pause, playbackPlaying } = usePlayback()
    const isLoading = !project
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
        <div>
            <h1 className='text-xl font-bold mb-2'>{project?.Name}</h1>
            {

                isLoading ? "Loading" : project.Versions.length > 0 ?
                    <>
                        <h1 className='font-bold'>Audio Versions</h1>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>State</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {project.Versions.map((version, i) =>
                                    <TableRow key={version.ID}>
                                        <TableCell>
                                            {!playbackPlaying || idPlaying !== version.ID ? <PlayButton loading={playbackLoading} onClick={(e) => {
                                                startStream(version.ID)
                                            }} /> : <PauseButton loading={playbackLoading} onClick={(e) => {
                                                pause()
                                            }} />}
                                        </TableCell>
                                        <TableCell>{version.Title}</TableCell>
                                        <TableCell>{version.Author.Name}</TableCell>
                                        <TableCell>{version.IsPublished ? "Published" : "Not Published"}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </> : "No Versions"
            }</div >
    )
}

export default ProjectByID