import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'
import { TrashIcon } from '@radix-ui/react-icons'

type Props = {
    id: string
    title: string
    description: string
    content: string
    footer: string
    onDelete: (projId: string, projName: string) => void
}

const ProjectCard = ({ id, title, description, onDelete }: Props) => {
    console.log(id)
    return (
        <Link href={`/projects/${id}`} className='w-full flex justify-center'>
            <Card className='min-w-[270px] w-[70%] h-full md:w-[270px] xl:w-[300px] m-2 hover:border-gray-300 cursor-pointer'>
                <CardHeader>
                    <CardTitle><div className='flex justify-between items-center'>


                        <p>{title}</p>
                        <Button variant={'outline'} onClick={(e) => {
                            e.preventDefault()
                            onDelete(id, title)
                        }}><TrashIcon color='red' /></Button>
                    </div></CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>

    )
}

export default ProjectCard