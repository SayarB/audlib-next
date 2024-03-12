"use client"
import React, { useEffect, useState } from 'react';
import { usePlayback } from '@/hooks/usePlayback';
import { Button } from '../ui/button';
import { LoadingSvg } from '../icons/Loading';
import { PlaySvg } from '../icons/Play';
import { PauseSvg } from '../icons/Pause';
import { Loader2 } from 'lucide-react';
import { Slider } from '../ui/slider';
import { env } from '@/env/schema';
import { versionResponseSchema } from '@/validate';
import { z } from 'zod';
import { PauseButton, PlayButton } from './Controls';




const Playback: React.FC = () => {
    const { play, pause, reset, playbackPlaying, audioRef, idPlaying } = usePlayback();
    const [progressBar, setProgressBar] = useState(0)
    const [metadata, setMetadata] = useState<z.infer<typeof versionResponseSchema> | null>(null)
    const [metadataLoading, setMetadataLoading] = useState(false)
    const fetchVersion = async () => {
        setMetadataLoading(true)
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/version/${idPlaying}`, {
            credentials: "include",
        })
        const data = await res.json()
        setMetadata(versionResponseSchema.parse(data))
        setMetadataLoading(false)
        console.log(data)
    }

    useEffect(() => {
        if (idPlaying) {
            fetchVersion()
        }
    }, [idPlaying])


    const timeUpdate = (e: Event) => {
        const time = audioRef?.current?.currentTime
        const duration = audioRef?.current?.duration
        if (time && duration) {
            setProgressBar(time * 100 / duration)
        }

    }

    const ended = (e: Event) => {
        reset()
        play()
        console.log("ended")
    }

    useEffect(() => {
        console.log("use effect")
        audioRef?.current?.addEventListener('timeupdate', timeUpdate)
        audioRef?.current?.addEventListener('ended', ended)

        return () => {
            audioRef?.current?.removeEventListener('timeupdate', timeUpdate)
            audioRef?.current?.removeEventListener('ended', ended)
        }
    }, [])


    useEffect(() => {
        if (idPlaying) {
            fetchVersion()
        }
    }, [idPlaying])

    return (
        <div className='fixed bottom-0 h-[100px] w-[100vw] md:w-[500px] md:left-[50vw] bg-white z-20 border border-1  py-2 px-10 transition-all' style={{
            translate: `-50% ${!idPlaying || metadataLoading ? "100%" : "0"}`,
        }}>

            <h1 className='text-lg font-bold text-center mb-2'>{metadata?.Project.Name} - {metadata?.Title}</h1>
            <div className='flex justify-center items-center'>
                {
                    !playbackPlaying ? <PlayButton onClick={(e) => {
                        play()
                    }} /> :
                        <PauseButton onClick={(e) => {
                            console.log("pause button clicked")
                            pause()
                        }} />
                }

                {<Slider className='mx-2' max={100} step={1} value={[progressBar]} onValueChange={(v) => {
                    if (audioRef?.current) {
                        audioRef.current.currentTime = v[0] * audioRef.current.duration / 100
                    }
                }} />}
            </div>
        </div>
    );
};

export default Playback;