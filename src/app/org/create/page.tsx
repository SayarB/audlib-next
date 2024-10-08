"use client"
import { LoadingSvg } from "@/components/icons/Loading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createOrgSchema } from "@/validate"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { env } from "@/env/schema"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const CreateOrganizationPage = () => {

    const { getToken } = useAuth()
    const [loading, setLoading] = useState(false)
    const form = useForm<z.infer<typeof createOrgSchema>>({
        resolver: zodResolver(createOrgSchema),
        defaultValues: {
            name: "",
        },
    })


    const onSubmit = async (data: z.infer<typeof createOrgSchema>) => {
        console.log("on submit")
        setLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/orgs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify(data)
        })
        setLoading(false)

    }

    return <div className="flex justify-center items-center">
        <div className='w-[80vw] max-w-[500px] p-10 border border-input'>
            <Form {...form
            } >
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Oganization</FormLabel>
                                <FormControl>
                                    <Input placeholder={`Your Org Name`} {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex'>
                        <Button className='mt-2 mx-auto w-full'>{loading ? <LoadingSvg /> : "Submit"}</Button>
                    </div>

                </form>
            </Form >
        </div>
    </div>
}
export default CreateOrganizationPage