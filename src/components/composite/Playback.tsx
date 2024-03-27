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
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
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
        console.log("use effect")
        audioRef?.current?.addEventListener('timeupdate', timeUpdate)
        audioRef?.current?.addEventListener('ended', ended)
        audioRef?.current?.addEventListener('canplay', canPlay)

        return () => {
            audioRef?.current?.removeEventListener('timeupdate', timeUpdate)
            audioRef?.current?.removeEventListener('ended', ended)
            audioRef?.current?.removeEventListener('canplay', canPlay)
        }
    }, [idPlaying])

    const onValueChangeWithDebounce = (v: number[]) => {
        setProgressBar(v[0])
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            if (audioRef?.current) {
                audioRef.current.currentTime = v[0] * audioRef.current.duration / 100
            }
        }, 10)
    }

    const timeUpdate = (e: Event) => {
        const time = audioRef?.current?.currentTime
        const duration = audioRef?.current?.duration
        if (time && duration) {
            setProgressBar(time * 100 / duration)
        }
        // console.log("time update", time, duration)

    }

    const canPlay = () => {
        play()
    }

    const ended = (e: Event) => {
        reset()
        play()
        console.log("ended")
    }




    useEffect(() => {
        if (idPlaying) {
            fetchVersion()
        }
    }, [idPlaying])

    return (
        <div className='fixed bottom-0 h-[100px] w-[100vw] md:w-[500px] left-[50vw] bg-white z-20 border border-1  py-2 px-10 transition-all' style={{
            translate: `-50% ${!idPlaying || metadataLoading ? "100%" : "0"}`,
        }}>

            <h1 className='text-lg font-bold text-center mb-2'>{metadata?.Project.Name} - {metadata?.Title}</h1>
            <div className='flex items-center'>
                {
                    !playbackPlaying ? <PlayButton onClick={(e) => {
                        play()
                    }} /> :
                        <PauseButton onClick={(e) => {
                            console.log("pause button clicked")
                            pause()
                        }} />
                }

                {<Slider className='mx-2' max={100} step={0.1} value={[progressBar]} onValueChange={onValueChangeWithDebounce} />}
            </div>
        </div>
    );
};

export default Playback;