"use client"
import { env } from '@/env/schema'
import { versionByIdResponseSchema } from '@/validate'
import React, { useEffect } from 'react'
import { z } from 'zod'

type Props = {
    params: {
        vid: string
    }
}

const VersionPage = (props: Props) => {

    const [version, setVersion] = React.useState<z.infer<typeof versionByIdResponseSchema> | null>(null)

    const getVersion = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/version/${props.params.vid}`, {
            credentials: "include",
        })

        const data = await res.json()

        console.log(data)
        setVersion(data)
    }

    useEffect(() => {
        getVersion()
    }, [])

    return (
        <div>
            <p>Version Title: {version?.Title}</p>
            <p>Author: {version?.Author?.Name}</p>
        </div>
    )
}

export default VersionPage