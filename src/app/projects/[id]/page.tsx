"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { env } from '@/env/schema'
import { createVersionSchema, postAudioFileSchema, projectByIdResponseSchema } from '@/validate'
import React, { ChangeEvent, useEffect } from 'react'
import { z } from 'zod'
import { usePlayback } from '@/hooks/usePlayback'
import { PauseButton, PlayButton } from '@/components/composite/Controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { LoadingSvg } from '@/components/icons/Loading'
import FileUpload from '@/components/composite/FileUpload'
import { CounterClockwiseClockIcon, DownloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'

type Props = {
    params: {
        id: string
    }
}



const ProjectByID = (props: Props) => {

    const router = useRouter()
    const [project, setProject] = React.useState<z.infer<typeof projectByIdResponseSchema> | null>(null)
    const { playbackLoading, startStream, idPlaying, pause, playbackPlaying } = usePlayback()
    const [createVersionOpen, setCreateVersionOpen] = React.useState(false)
    const [createVersionLoading, setCreateVersionLoading] = React.useState(false)
    const isLoading = !project

    const form = useForm<z.infer<typeof createVersionSchema>>({
        resolver: zodResolver(createVersionSchema),
        defaultValues: {
            title: "",
            audioFileId: ""
        }
    })

    async function getProject() {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${props.params.id}`, {
            credentials: "include",
        })

        const data = await res.json()

        console.log(data)
        setProject(data)
    }

    const onSubmit = async (data: z.infer<typeof createVersionSchema>) => {
        console.log(data)
        setCreateVersionLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${props.params.id}/version`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const json = await res.json()
        setCreateVersionLoading(false)
        setCreateVersionOpen(false)
        console.log(json)
    }

    useEffect(() => {
        if (!createVersionLoading)
            getProject()
    }, [createVersionLoading])


    return (
        <>
            {createVersionOpen && <div onClick={() => {
                setCreateVersionOpen(false)
            }} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30'>
                <Card onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                }} className='p-10'>
                    <CardTitle className='mb-5'>
                        Create Version
                    </CardTitle>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <Input placeholder="Project Name" className='w-[300px] mb-2' {...field} />
                                    )} />

                                <FileUpload key='1' onError={(e) => {
                                    form.setError("root", { message: e })
                                }} onFileUploadEnd={(data) => {
                                    form.setValue("audioFileId", data.ID)
                                }} />
                                <Button variant='default' className='mt-2 w-full' type='submit'>
                                    {createVersionLoading ? <LoadingSvg /> : "Create Version"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>}
            <div>
                <div className='flex justify-between'>
                    <h1 className='text-xl font-bold mb-2'>{project?.Name}</h1>
                    <Button onClick={() => setCreateVersionOpen(true)}>Create Version</Button>
                </div>
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
                                        <TableHead align='center'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.Versions.map((version, i) =>
                                        <TableRow key={version.ID} className='border border-1 cursor-pointer' onClick={() => {
                                            router.push(`/projects/${props.params.id}/version/${version.ID}`)
                                        }}>
                                            <TableCell>
                                                {!playbackPlaying || idPlaying !== version.ID ? <PlayButton loading={playbackLoading} onClick={(e) => {
                                                    e.stopPropagation()
                                                    startStream(version.ID)
                                                }} /> : <PauseButton loading={playbackLoading} onClick={(e) => {
                                                    e.stopPropagation()
                                                    pause()
                                                }} />}
                                            </TableCell>
                                            <TableCell>{version.Title}</TableCell>
                                            <TableCell>{version.Author.Name}</TableCell>
                                            <TableCell>{version.IsPublished ? "Published" : "Not Published"}</TableCell>
                                            <TableCell>
                                                <Button variant={'outline'} onClick={() => {
                                                    router.push(`/projects/${props.params.id}/version/${version.ID}/download`)
                                                }}><DownloadIcon /></Button></TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </> : "No Versions"
                }</div >
        </>
    )
}

export default ProjectByID