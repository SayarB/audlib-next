import React, { useEffect } from 'react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import Combobox from './Combobox'
import { orgResponseSchema, userInfoSchema } from '@/validate'
import { usePathname } from 'next/navigation'
import { useCurrentOrg } from '@/hooks/useOrg'
import { useWindowSize } from '@/hooks/useWindowSize'
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { env } from '@/env/schema'
import { z } from 'zod'


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
]


const Navbar = () => {
    const { width, height } = useWindowSize()
    const isLargeScreenSize = (width ?? 0) > 1000
    const [orgs, setOrgs] = React.useState<{ ID: string, Name: string }[]>([])
    const [open, setOpen] = React.useState(!isLargeScreenSize)
    const { currentOrg, revalidate, loading } = useCurrentOrg()
    const [loadingOrgs, setLoadingOrgs] = React.useState(true)
    const [userInfo, setUserInfo] = React.useState<z.infer<typeof userInfoSchema> | null>(null)
    const pathname = usePathname()
    const isCurrent = (prefix: string) => prefix === "home" && pathname === "/" || pathname.startsWith(`/${prefix}`)

    const getUserInfo = async () => {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/info`, {
            credentials: "include",
        })

        if (!res.ok) return
        const json = await res.json()
        setUserInfo(userInfoSchema.parse(json))

    }


    const getOrgs = async () => {
        setLoadingOrgs(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
            credentials: "include",
        })
        if (!res.ok) return
        const json = await res.json()
        const orgsArray = orgResponseSchema.parse(json).map((org) => ({ ID: org.Organization.ID, Name: org.Organization.Name }))
        setOrgs(orgsArray)
        console.log(json)
        setLoadingOrgs(false)
    }

    useEffect(() => {
        getOrgs()
        revalidate()
        getUserInfo()
    }, [revalidate])

    return (
        <>
            <Button className={cn(`lg:hidden fixed top-[50%] -translate-y-[50%] h-[100px] p-1 z-30 ${!isLargeScreenSize && (!open ? "left-2" : "right-2")}`)} onClick={() => setOpen(o => !o)}>{!open ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}</Button >
            <div className={cn(`h-[100vh] fixed w-[100vw] md:relative md:w-[300px] z-10 bg-primary text-secondary ${!isLargeScreenSize && !open ? "hidden" : ""}`)}>

                <div className="space-y-4 py-4" >
                    <div className="px-3 py-2">
                        {loading || loadingOrgs ? "Loading" : <Combobox current={currentOrg?.ID || ""} values={orgs} isFetching={false} />}

                        <div className='px-3 py-2 mb-2 flex items-center bg-gray-500 hover:bg-gray-400 cursor-pointer rounded-md'>
                            <div className='mr-2'>
                                <Avatar>
                                    <AvatarImage src={userInfo ? `https://source.boringavatars.com/marble/120/${userInfo?.DisplayName}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51` : ""} alt="avatar" />
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
            </div>
        </>
    )
}



export default Navbar