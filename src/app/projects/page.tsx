"use client"
import ProjectCard from '@/components/composite/ProjectCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { env } from '@/env/schema'
import { createProjectSchema, projectResponseSchema } from '@/validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {}

const ProjectsPage = (props: Props) => {

    const [projects, setProjects] = useState<z.infer<typeof projectResponseSchema>>([])
    const [createProjectOpen, setCreateProjectOpen] = useState(false)
    const [createProjectLoading, setCreateProjectLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: ""
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


    useEffect(() => {
        console.log("projects page")
        getProjects()
    }, [])

    const loadingSvg = <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    </svg>

    return (
        <div>
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
                                        {createProjectLoading ? loadingSvg : "Create Project"}
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
            <div className='grid grid-cols-3 gap-4'>
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