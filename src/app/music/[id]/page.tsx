import AvatarImage from 'boring-avatars'
import { env } from '@/env/schema'
import React from 'react'
import Player from '@/components/composite/MusicPlayer'
import Link from 'next/link'
import { ExternalLinkIcon } from '@radix-ui/react-icons'
type Props = {
    params: {
        id: string
    }
}

const MusicPlayerPage = async ({ params }: Props) => {
    const resVersionInfo = await fetch(`${env.NEXT_PUBLIC_API_URL}/public/version/${params.id}/info`, {
        cache: "no-cache",
        credentials: "include",
        method: "GET",
    })
    const info = (await resVersionInfo.json()) as { VersionName: string, ProjectName: string, AuthorName: string }
    console.log(info)
    const resStream = await fetch(`${env.NEXT_PUBLIC_API_URL}/stream/${params.id}/token`, {
        cache: "no-cache",
        credentials: "include",
        method: "POST",
    });
    const audio = (await resStream.json()) as { token: string }
    console.log(audio.token)

    return (<>
        <div className='top-0 left-0 right-0 bottom-0 absolute flex items-center justify-center' >
            <div className=' flex flex-col m-5 w-full md:w-[500px]'>
                <Player className='mb-2 w-full' src={`${env.NEXT_PUBLIC_API_URL}/stream/${params.id}?token=${audio.token}`} />
                <div className='metadata ml-12'>
                    <div>
                        <h1 className='text-xl font-bold'>{info.ProjectName} - {info.VersionName}</h1>
                    </div>
                    <div className='flex items-center'>
                        <div className='w-[40px] h-[40px] mr-2'>
                            <AvatarImage colors={['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51']} name={info.AuthorName} />
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold'>{info.AuthorName}</h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div className='fixed bottom-20 left-0 right-0 flex justify-center'><Link href={'/'}><div className='flex items-center'>Checkout Audlib <ExternalLinkIcon className='ml-2' /> </div></Link></div>
    </>
    )
}

export default MusicPlayerPage