"use client"

import OrgListItem from "@/components/composite/OrgListItem";
import { LoadingSvg } from "@/components/icons/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { env } from "@/env/schema";
import { useCurrentOrg } from "@/hooks/useOrg";
import { orgResponseSchema } from "@/validate";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
const OrganizationListPage = () => {

    const router = useRouter()

    const [orgs, setOrgs] = useState<z.infer<typeof orgResponseSchema>>([]);
    const { getToken } = useAuth()
    const [deletingOrg, setDeletingOrg] = useState<{ id: string, name: string }>({ id: "", name: "" })
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [loadingOrg, setLoadingOrg] = useState(false)
    const { currentOrg, updateOrg, revalidate } = useCurrentOrg()
    const confirmDeleteSchema = z.object({ name: z.string() })
    const confirmDeleteForm = useForm<z.infer<typeof confirmDeleteSchema>>({
        resolver: zodResolver(confirmDeleteSchema),
        defaultValues: {
            name: "",
        }
    })


    const getOrganizations = async () => {
        setLoadingOrg(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orgs`, {
            headers: {
                'Authorization': 'Bearer ' + await getToken()
            }
        })
        const json = await res.json()
        setOrgs(orgResponseSchema.parse(json))
        setLoadingOrg(false)
    }

    const onCreateOrg = useCallback(() => {
        router.push('/org/create')
    }, [])

    const onDeleteOrg = (orgId: string, orgName: string) => {
        setDeletingOrg({ id: orgId, name: orgName })
    }
    const onConfirmDelete = async (data: z.infer<typeof confirmDeleteSchema>) => {
        setDeleteLoading(true)
        if (data.name !== deletingOrg.name) return
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orgs/${deletingOrg.id}`, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + await getToken()
            }
        })
        if (res.ok) {
            getOrganizations()
            setDeleteLoading(false)
            setDeletingOrg({ id: "", name: "" })
        }
    }

    const switchOrg = async (clerkId: string) => {
        await updateOrg(clerkId)
        await revalidate()
        window.location.reload()
    }
    useEffect(() => {
        getOrganizations()
    }, []);

    return (
        <div>
            {
                deletingOrg.id !== "" && <div onClick={() => {
                    setDeletingOrg({ id: "", name: "" })
                    setDeleteLoading(false)
                }} className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                    <Card onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                    }} className='p-10'>
                        <CardTitle className='mb-2'>
                            Delete Organization
                        </CardTitle>
                        <CardDescription className='mb-5'>
                            Type the name of the Organization to confirm deletion - {deletingOrg.name}
                        </CardDescription>
                        <CardContent>
                            <Form {...confirmDeleteForm}>
                                <form onSubmit={confirmDeleteForm.handleSubmit(onConfirmDelete)}>
                                    <FormField
                                        control={confirmDeleteForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Input placeholder="Organization Name" className='min-w-[200px]' {...field} />
                                        )} />
                                    <Button type="submit" variant='default' className='mt-2 w-full' disabled={confirmDeleteForm.watch("name") !== deletingOrg.name}>
                                        {deleteLoading ? <LoadingSvg /> : "Delete Organization"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            }
            <div className='flex justify-between mb-2'>
                <h1 className='font-bold text-3xl'>Organizations</h1>
                <Button variant='default' onClick={onCreateOrg}>Create Organization</Button>
            </div>
            {loadingOrg ? <p>Loading...</p> : <ul>
                {
                    orgs.map(org => <OrgListItem key={org.ID} org={org} isCurrent={org.OrganizationId === currentOrg?.ID} onDelete={() => onDeleteOrg(org.OrganizationId, org.Organization.Name)} switchOrg={switchOrg} />)
                }
            </ul>}
        </div>
    );
}

export default OrganizationListPage