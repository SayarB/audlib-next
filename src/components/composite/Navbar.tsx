import React from 'react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import Combobox from './Combobox'
import { orgResponseSchema } from '@/validate'
import { usePathname } from 'next/navigation'


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
    const [orgs, setOrgs] = React.useState<{ ID: string, Name: string }[]>([])
    const [currentOrg, setCurrentOrg] = React.useState("")

    const pathname = usePathname()
    const isCurrent = (prefix: string) => prefix === "home" && pathname === "/" || pathname.startsWith(`/${prefix}`)

    const getOrgs = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
            credentials: "include",
        })
        const json = await res.json()
        const orgsArray = orgResponseSchema.parse(json).map((org) => ({ ID: org.Organization.ID, Name: org.Organization.Name }))
        setOrgs(orgsArray)
        console.log(json)
    }

    const getCurrentOrg = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/current`, {
            credentials: "include",
        })
        const json = await res.json()
        console.log("current org = ", json)
        setCurrentOrg(json.ID)
    }

    React.useEffect(() => {
        getOrgs()
        getCurrentOrg()
    }, [])

    return (
        <div className={cn("h-[100vh] fixed w-[100vw] md:relative md:w-[300px] z-10 bg-primary text-secondary")}>
            <div className="space-y-4 py-4" >
                <div className="px-3 py-2">

                    <Combobox current={currentOrg} values={orgs} isFetching={false} />

                    <div className='px-3 py-2 mb-2 flex items-center bg-gray-500 rounded-md'>
                        <div className='mr-2'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
                            </Avatar>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Shad</h1>
                            <p className="text-sm">AGASGA</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {NavList.map((item, index) => (
                            <Link key={index} href={item.href}>
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
    )
}



export default Navbar