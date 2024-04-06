"use client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { registerSchema } from '@/validate'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { env } from '@/env/schema'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {}

const Register = (props: Props) => {

    const queryToken = useSearchParams().get("token")
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    const verifyToken = async () => {
        const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/verify?token=${encodeURIComponent(queryToken ?? "")}`, {
            credentials: 'include'
        })

        if (result.status === 200) {
            router.replace("/")
        } else if (result.status !== 201) {
            router.replace("/login")
        } else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!queryToken) {
            router.replace("/login")
        }
        verifyToken()
    }, [queryToken])

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            displayName: "",
            orgName: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.status === 200) {
            router.push("/")
        }
    }

    return (
        <div className='w-[100%] h-[100%] flex items-center justify-center'>
            {loading ? <div>Loading...</div> : <div className='w-[80vw] max-w-[500px] p-10 border border-input'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="displayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Display Name`} {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="orgName"
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
                            <Button className='mt-2 mx-auto w-full'>Submit</Button>
                        </div>

                    </form>
                </Form>
                {/* <p>Form</p> */}
            </div>}
        </div>
    )
}

export default Register