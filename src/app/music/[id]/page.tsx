import { env } from '@/env/schema'
import React from 'react'

type Props = {
    params: {
        id: string
    }
}

const MusicPlayer = async ({ params }: Props) => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/stream/${params.id}/token`, {
        credentials: "include",
        method: "POST",
    });
    const audio = (await res.json()) as { token: string }

    return (
        <div className='top-0 left-0 right-0 bottom-0 absolute flex items-center justify-center'>
            <div className='w-fit h-fit'>
                <div className='max-w-[500px] min-w-[300px] max-h-[500px] min-h-[300px] w-[100%] h-[100%] shadow-md rounded-md overflow-hidden bg-cover bg-no-repeat mb-2' style={{
                    backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1vZsKTRox4LLI8KnwPyjgo24WwaKuuSb_ZrsBpFjr1A&s)`,
                }}>
                </div>
                <audio src={`${env.NEXT_PUBLIC_API_URL}/stream/${params.id}?token=${audio.token}`} controlsList='nodownload' controls autoPlay />
            </div>
        </div>
    )
}

export default MusicPlayer