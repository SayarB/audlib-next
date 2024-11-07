"use client"
import React, { useEffect } from 'react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import AvatarImage from 'boring-avatars'
import Combobox from './Combobox'
import { orgResponseSchema, userInfoSchema } from '@/validate'
import { usePathname } from 'next/navigation'
import { useCurrentOrg } from '@/hooks/useOrg'
import { useWindowSize } from '@/hooks/useWindowSize'
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { env } from '@/env/schema'
import { z } from 'zod'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { usePlayback } from '@/hooks/usePlayback'


const NavList = [
    {
        name: "home",
        label: "Dashboard",
        href: "/",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
            >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
        ),
    },
    {
        name: "projects",
        href: "/projects",
        label: "Projects",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
            >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
        ),
    },
    {
        name: "orgs",
        label: "Organizations",
        href: "/org/manage",
        icon: (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2 h-4 w-4'><path d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        ),
    }
]


const Navbar = () => {
    const { width, height } = useWindowSize()
    const isLargeScreenSize = (width ?? 0) > 1000
    const [orgs, setOrgs] = React.useState<{ ID: string, ClerkId: string, Name: string }[]>([])
    const [open, setOpen] = React.useState(!isLargeScreenSize)
    const { currentOrg, revalidate, loading, updateOrg } = useCurrentOrg()
    const [loadingOrgs, setLoadingOrgs] = React.useState(true)
    const [userInfo, setUserInfo] = React.useState<z.infer<typeof userInfoSchema> | null>(null)
    const pathname = usePathname()
    const { closePlayer } = usePlayback()
    const { getToken, signOut } = useAuth()
    const isCurrent = (prefix: string) => prefix === "home" && pathname === "/" || pathname.startsWith(`/${prefix}`)
    const router = useRouter()

    const createNewOrganization = () => {
        console.log("create new organization")
        router.push("/org/create")
    }
    const changeOrg = async (id: string) => {
        console.log("change org to ", id)
        closePlayer()
        await updateOrg(id)
        window.location.href = "/"

    }

    const getUserInfo = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/info`, {
            headers: {
                'Authorization': 'Bearer ' + await getToken()
            }
        })

        if (!res.ok) return
        const json = await res.json()
        setUserInfo(userInfoSchema.parse(json))

    }


    const getOrgs = async () => {
        setLoadingOrgs(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
            headers: {
                'Authorization': 'Bearer ' + await getToken()
            }
        })
        if (!res.ok) return
        const json = await res.json()
        const orgsArray = orgResponseSchema.parse(json).map((org) => ({ ID: org.Organization.ID, ClerkId: org.Organization.ClerkId, Name: org.Organization.Name }))
        setOrgs(orgsArray)
        console.log(json)
        setLoadingOrgs(false)
    }

    useEffect(() => {
        revalidate()
        if (orgs.length == 0) getOrgs()
        if (!userInfo) getUserInfo()
    }, [pathname])

    return (
        <>
            <Button className={cn(`lg:hidden fixed top-[50%] -translate-y-[50%] h-[100px] p-1 z-30 ${!isLargeScreenSize && (!open ? "left-2" : "right-2")}`)} onClick={() => setOpen(o => !o)}>{!open ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}</Button >
            <div className={cn(`h-[100vh] fixed w-[100vw] md:relative md:w-[300px] z-10 bg-primary text-secondary flex flex-col justify-between ${(!isLargeScreenSize && !open) ? "hidden" : ""}`)}>

                <div className="space-y-4 py-4 " >
                    <div className="px-3 py-2">
                        {loading || loadingOrgs ? "Loading" : <Combobox current={currentOrg?.ID || ""} onSelect={changeOrg} onCreateNew={createNewOrganization} values={orgs} isFetching={false} />}

                        <div className='px-3 py-2 mb-2 flex items-center bg-gray-500 hover:bg-gray-400 cursor-pointer rounded-md'>
                            <div className='mr-2'>
                                <Avatar>
                                    {userInfo && <AvatarImage colors={['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']} name={userInfo.DisplayName} />}
                                </Avatar>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">{userInfo?.DisplayName}</h1>
                                <p className="text-sm">{userInfo?.Name}</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            {NavList.map((item, index) => (
                                <Link key={index} href={item.href} onClick={() => { setOpen(false) }}>
                                    <Button
                                        variant={isCurrent(item.name) ? "secondary" : "ghost"}
                                        className="w-full justify-start my-1"
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>
                <div className='px-3 py-4'>
                    <Button
                        variant={"ghost"}
                        className="w-full justify-start my-1"
                        onClick={() => { signOut() }}
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><path d="M3 1C2.44771 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H10.5C10.7761 14 11 13.7761 11 13.5C11 13.2239 10.7761 13 10.5 13H3V2L10.5 2C10.7761 2 11 1.77614 11 1.5C11 1.22386 10.7761 1 10.5 1H3ZM12.6036 4.89645C12.4083 4.70118 12.0917 4.70118 11.8964 4.89645C11.7012 5.09171 11.7012 5.40829 11.8964 5.60355L13.2929 7H6.5C6.22386 7 6 7.22386 6 7.5C6 7.77614 6.22386 8 6.5 8H13.2929L11.8964 9.39645C11.7012 9.59171 11.7012 9.90829 11.8964 10.1036C12.0917 10.2988 12.4083 10.2988 12.6036 10.1036L14.8536 7.85355C15.0488 7.65829 15.0488 7.34171 14.8536 7.14645L12.6036 4.89645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        Sign out
                    </Button>

                </div>
            </div >
        </>
    )
}



export default Navbar