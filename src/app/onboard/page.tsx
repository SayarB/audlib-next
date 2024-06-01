"use client"
import { LoadingSvg } from '@/components/icons/Loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import loading from '../music/[id]/loading';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { registerSchema } from '@/validate';
import { zodResolver } from '@hookform/resolvers/zod';
import { env } from '@/env/schema';
import { useAuth, useOrganizationList } from '@clerk/nextjs';

const OnboardPage = () => {

    const router = useRouter()
    const { setActive } = useOrganizationList()
    const [loading, setLoading] = useState(false)
    const { getToken } = useAuth()
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            displayName: "",
            orgName: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/onboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify(data)
        })
        if (res.status === 200) {
            const json = await res.json()
            if (!setActive) {
                console.log('setActive not found')
                return
            }
            console.log("setting org to ", json.org_id)
            await setActive({ organization: json.org_id })
            return router.push('/')
        }
    }
    return (
        <div>
            <div className='w-[80vw] max-w-[500px] p-10 border border-input'>
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
                            <Button className='mt-2 mx-auto w-full'>{loading ? <LoadingSvg /> : "Submit"}</Button>
                        </div>

                    </form>
                </Form>
                {/* <p>Form</p> */}
            </div>
        </div>
    );
};

export default OnboardPage;