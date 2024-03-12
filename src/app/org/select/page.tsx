"use client"
import { Button } from '@/components/ui/button'
import { env } from '@/env/schema'
import { orgResponseSchema } from '@/validate'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'

type Props = {}

const OrgSelectPage = (props: Props) => {

    const router = useRouter()
    const [orgs, setOrgs] = useState<z.infer<typeof orgResponseSchema>>([])

    const getOrganizations = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orgs`, {
            credentials: 'include',
        })
        const json = await res.json()
        setOrgs(orgResponseSchema.parse(json))
    }

    useEffect(() => {
        getOrganizations()
    }, [])

    const handleOrgSelect = async (org: z.infer<typeof orgResponseSchema>[0]) => {
        await fetch(`${env.NEXT_PUBLIC_API_URL}/orgs/select`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ organizationId: org.Organization.ID })
        })
        router.push('/')
    }

    return (
        <div className='min-h-[100vh] w-[100vw] flex items-center justify-center'>
            <ul className=' w-[100%] max-w-[500px] p-5 border border-input'>
                <h1 className='text-xl text-center mb-2'>Your Organizations</h1>
                {
                    orgs.map(org => {
                        return <li key={org.ID}>
                            <Button onClick={() => handleOrgSelect(org)} className='text-base h-14 w-full' variant={'outline'}>{org.Organization.Name}</Button>
                        </li>
                    })
                }
            </ul>

        </div>
    )
}

export default OrgSelectPage