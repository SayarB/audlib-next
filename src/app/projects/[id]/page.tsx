"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { env } from '@/env/schema'
import { createVersionSchema, projectByIdResponseSchema } from '@/validate'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { usePlayback } from '@/hooks/usePlayback'
import { PauseButton, PlayButton } from '@/components/composite/Controls'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Form, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { LoadingSvg } from '@/components/icons/Loading'
import FileUpload from '@/components/composite/FileUpload'
import { ClipboardCopyIcon, DotsHorizontalIcon, DownloadIcon, ExternalLinkIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'
import { useWindowSize } from '@/hooks/useWindowSize'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'

type Props = {
    params: {
        id: string
    }
}

const confirmDeleteSchema = z.object({ name: z.string() })

const ProjectByID = (props: Props) => {

    const router = useRouter()
    const [project, setProject] = useState<z.infer<typeof projectByIdResponseSchema> | null>(null)
    const { playbackLoading, startStream, idPlaying, pause, playbackPlaying } = usePlayback()
    const [createVersionOpen, setCreateVersionOpen] = useState(false)
    const [createVersionLoading, setCreateVersionLoading] = useState(false)
    const [publishingId, setPublishingId] = useState("")
    const [deleteVersion, setDeleteVersion] = useState({ id: "", name: "" })
    const [deleteVersionLoading, setDeleteVersionLoading] = useState(false)
    const { width, height } = useWindowSize()
    const { toast } = useToast()
    const isLargeScreenSize = width && width > 650
    const isLoading = !project

    const form = useForm<z.infer<typeof createVersionSchema>>({
        resolver: zodResolver(createVersionSchema),
        defaultValues: {
            title: "",
            audioFileId: ""
        }
    })

    const confirmDeleteForm = useForm<z.infer<typeof confirmDeleteSchema>>({
        resolver: zodResolver(confirmDeleteSchema),
        defaultValues: {
            name: "",
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

    const onDeleteVersion = useCallback((vId: string, vName: string) => {
        setDeleteVersion({ id: vId, name: vName })
    }, [])

    const onConfirmDelete = async () => {
        setDeleteVersionLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/version/${deleteVersion.id}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (res.status !== 200) {
            console.log("Could not delete project")
            return
        }
        setDeleteVersionLoading(false)
        setDeleteVersion({ id: "", name: "" })
        confirmDeleteForm.reset()
        getProject()
    }

    const publishVersion = async (id: string) => {
        setPublishingId(id)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${props.params.id}/versions/${id}/publish`, {
            method: "POST",
            credentials: "include",
        })

        const data = await res.json()
        console.log(data)
        setPublishingId("")
        getProject()
    }

    const getDownloadLink = async (vid: string) => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/version/${vid}/download`, {
            credentials: 'include',
            method: 'GET'
        })
        if (!res.ok) {
            console.error("CAN NOT GENERATE DOWNLOAD LINK")
        }
        const data: { url: string } = await res.json()
        console.log(data)
        return data.url
    }

    const handleClickCopy = async (id: string) => {
        await navigator.clipboard.writeText(`${env.NEXT_PUBLIC_URL}/music/${id}`)
        toast({
            title: "Link Copied to Clipboard",
        })
    }

    useEffect(() => {
        if (!createVersionLoading)
            getProject()
    }, [createVersionLoading])


    return (
        <>
            {
                deleteVersion.id !== "" && <div onClick={() => {
                    setDeleteVersion({ id: "", name: "" })
                    setDeleteVersionLoading(false)
                }} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30'>
                    <Card onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                    }} className='p-10'>
                        <CardTitle className='mb-2'>
                            Delete Version
                        </CardTitle>
                        <CardDescription className='mb-5'>
                            Type the name of the Version to confirm deletion - {deleteVersion.name}
                        </CardDescription>
                        <CardContent>
                            <Form {...confirmDeleteForm}>
                                <form onSubmit={confirmDeleteForm.handleSubmit(onConfirmDelete)}>
                                    <FormField
                                        control={confirmDeleteForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Input placeholder="Version Name" className='min-w-[300px]' {...field} />
                                        )} />
                                    <Button variant='default' className='mt-2 w-full' disabled={confirmDeleteForm.watch("name") !== deleteVersion.name}>
                                        {deleteVersionLoading ? <LoadingSvg /> : "Delete Project"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            }
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
                                        <Input placeholder="Version Title" className='w-[300px] mb-2' {...field} />
                                    )} />

                                <FileUpload keyString='1' onError={(e) => {
                                    form.setError("root", { message: e })
                                }} onFileUploadEnd={(data) => {
                                    form.setValue("audioFileId", data.ID)
                                }} />
                                <Button variant='default' className='mt-2 w-full' type='submit' disabled={form.watch('audioFileId') === ""}>
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

                    isLoading ? <div className='w-full h-[90vh] flex items-center justify-center'><LoadingSvg /></div> : project.Versions.length > 0 ?
                        <>
                            <h1 className='font-bold'>Audio Versions</h1>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead></TableHead>
                                        <TableHead>Version</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead><p className='ml-6'>State</p></TableHead>
                                        <TableHead align='center'>Actions</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.Versions.sort((a, b) => a.ID.localeCompare(b.ID)).map((version, i) =>
                                        <TableRow key={version.ID} className='border border-1 hover:bg-white' >
                                            <TableCell>
                                                {!playbackPlaying || idPlaying !== version.ID ? <PlayButton loading={playbackLoading && idPlaying === version.ID} onClick={(e) => {
                                                    e.stopPropagation()
                                                    startStream(version.ID)
                                                }} /> : <PauseButton loading={playbackLoading && idPlaying === version.ID} onClick={(e) => {
                                                    e.stopPropagation()
                                                    pause()
                                                }} />}
                                            </TableCell>
                                            <TableCell><Link className='flex items-center' href={`/projects/${props.params.id}/version/${version.ID}`}>{version.Title} <ExternalLinkIcon className='ml-2' /></Link></TableCell>
                                            <TableCell>{version.Author.Name}</TableCell>
                                            <TableCell>{new Date(version.CreatedAt).toLocaleDateString()}</TableCell>
                                            <TableCell >{!version.IsPublished ? <Button onClick={(e) => {
                                                e.stopPropagation()
                                                publishVersion(version.ID)
                                            }} variant={'secondary'} className='w-[100px]'>{publishingId === version.ID ? <LoadingSvg /> : "Publish"}</Button> : <div className='flex items-center'><Button className='ml-5 p-0' variant={'link'} onClick={() => handleClickCopy(version.ID)}>Published <ClipboardCopyIcon className='ml-2' /></Button></div>}</TableCell>
                                            {isLargeScreenSize && <TableCell>
                                                <Button variant={'ghost'} onClick={async (e) => {
                                                    e.stopPropagation()
                                                    const downloadUrl = await getDownloadLink(version.ID)
                                                    var link = document.createElement("a");
                                                    link.href = downloadUrl;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}><DownloadIcon /></Button></TableCell>}
                                            <TableCell>
                                                {isLargeScreenSize ? <Button variant={"ghost"} onClick={() => {
                                                    onDeleteVersion(version.ID, version.Title)
                                                }} ><TrashIcon color='red' /></Button> :
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button variant={'ghost'}>
                                                                <DotsHorizontalIcon />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem className='ml-2 cursor-pointer' onClick={() => {
                                                                onDeleteVersion(version.ID, version.Title)
                                                            }}>Delete</DropdownMenuItem>
                                                            <DropdownMenuItem className='ml-2 cursor-pointer' onClick={() => {
                                                                router.push(`/projects/${props.params.id}/version/${version.ID}`)
                                                            }}>Visit</DropdownMenuItem>

                                                        </DropdownMenuContent>
                                                    </DropdownMenu>}
                                            </TableCell>
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