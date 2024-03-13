import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'

type Props = {
    id: string
    title: string
    description: string
    content: string
    footer: string
}

const ProjectCard = ({ id, title, description }: Props) => {
    console.log(id)
    return (
        <Link href={`/projects/${id}`}>
            <Card className='w-[200px] h-full md:w-[250px] xl:w-[300px] m-2 hover:bg-gray-100 cursor-pointer'>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default ProjectCard