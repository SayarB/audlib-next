"use client"
import ProjectCard from '@/components/composite/ProjectCard'
import { LoadingSvg } from '@/components/icons/Loading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { env } from '@/env/schema'
import { createProjectSchema, projectResponseSchema } from '@/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { set, z } from 'zod'

type Props = {}

const confirmDeleteSchema = z.object({ name: z.string() })

const ProjectsPage = (props: Props) => {

    const [projects, setProjects] = useState<z.infer<typeof projectResponseSchema>>([])
    const [createProjectOpen, setCreateProjectOpen] = useState(false)
    const [createProjectLoading, setCreateProjectLoading] = useState(false)
    const [deleteProject, setDeleteProject] = useState({ id: "", name: "" })
    const [deleteProjectLoading, setDeleteProjectLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: ""
        }
    })

    const confirmDeleteForm = useForm<z.infer<typeof confirmDeleteSchema>>({
        resolver: zodResolver(confirmDeleteSchema),
        defaultValues: {
            name: "",
        }
    })

    const getProjects = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
            credentials: "include",
        })

        const data = await res.json()

        console.log(data)
        setProjects(data)
    }


    const onCreateProjectClick = () => {
        setCreateProjectOpen(true)
    }


    const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
        setCreateProjectLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const json = await res.json()
        console.log(json)
        setCreateProjectOpen(false)
        setCreateProjectLoading(false)

        router.push(`/projects/${json.ID}`)
    }

    const onConfirmDelete = async (data: z.infer<typeof confirmDeleteSchema>) => {
        setDeleteProjectLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${deleteProject.id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (res.status !== 200) {
            console.log("Could not delete project")
            return
        }
        setDeleteProjectLoading(false)
        setDeleteProject({ id: "", name: "" })
        confirmDeleteForm.reset()
        getProjects()
    }

    const onDeleteProject = useCallback((projId: string, projName: string) => {
        setDeleteProject({ id: projId, name: projName })
    }, [])

    useEffect(() => {
        console.log("projects page")
        getProjects()
    }, [])


    return (
        <div>
            {
                deleteProject.id !== "" && <div onClick={() => {
                    setDeleteProject({ id: "", name: "" })
                    setDeleteProjectLoading(false)
                }} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                    <Card onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                    }} className='p-10'>
                        <CardTitle className='mb-2'>
                            Delete Project
                        </CardTitle>
                        <CardDescription className='mb-5'>
                            Type the name of the project to confirm deletion - {deleteProject.name}
                        </CardDescription>
                        <CardContent>
                            <Form {...confirmDeleteForm}>
                                <form onSubmit={confirmDeleteForm.handleSubmit(onConfirmDelete)}>
                                    <FormField
                                        control={confirmDeleteForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Input placeholder="Project Name" className='min-w-[300px]' {...field} />
                                        )} />
                                    <Button variant='default' className='mt-2 w-full' disabled={confirmDeleteForm.watch("name") !== deleteProject.name}>
                                        {deleteProjectLoading ? <LoadingSvg /> : "Delete Project"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            }
            {
                createProjectOpen && <div onClick={() => {
                    setCreateProjectOpen(false)
                }} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                    <Card onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                    }} className='p-10'>
                        <CardTitle className='mb-5'>
                            Create Project
                        </CardTitle>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Input placeholder="Project Name" className='w-[300px]' {...field} />
                                        )} />
                                    <Button variant='default' className='mt-2 w-full'>
                                        {createProjectLoading ? <LoadingSvg /> : "Create Project"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            }
            <div className='flex justify-between mb-2'>
                <h1 className='font-bold '>Projects</h1>
                <Button variant='default' onClick={onCreateProjectClick}>Create Project</Button>
            </div>
            <div className='w-full  grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-5 lg:mt-0'>
                {
                    projects?.map(project => {
                        return <ProjectCard
                            key={project.ID}
                            id={project.ID}
                            title={project.Name}
                            description={project.LatestVersion?.Title || "No Published Version"}
                            content={"Content"}
                            footer={"Footer"}
                            onDelete={onDeleteProject} />
                    })
                }
            </div>
        </div>
    )
}

export default ProjectsPage