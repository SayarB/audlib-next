"use client"
import React from 'react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { loginResponseSchema, userSchema } from '@/validate';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { env } from '@/env/schema';
import { useRouter } from 'next/navigation';
const LoginPage = () => {

    const router = useRouter()
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const getOrgs = (final: z.infer<typeof loginResponseSchema>) => {
        // if (final.Organizations.length === 1) {
        //     console.log("changing state to single ID")
        //     changeState({ orgID: final.Organizations[0].Organization.ID, orgName: final.Organizations[0].Organization.Name })
        //     router.push("/")
        // }
        if (final.Organizations.length > 0) {
            router.push("/org/select")
        }
    }

    const onSubmit = async (data: z.infer<typeof userSchema>) => {
        const result = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        })

        if (result.status !== 200) {
            console.log("Wrong Credentials")
        }
        const json = await result.json()
        const final = loginResponseSchema.parse(json)
        getOrgs(final)
    }

    return (
        <div className='w-[100%] h-[100%] flex items-center justify-center'>
            <div className='w-[80vw] max-w-[500px] p-10 border border-input'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type='password' {...field} />
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

            </div>
        </div>

    );
};

export default LoginPage;