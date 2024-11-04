"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import { PauseButton, PlayButton } from './Controls';




type Props = {
    src: string
    className?: string
}
const MusicPlayer: React.FC<Props> = ({ src, className }) => {
    const [progressBar, setProgressBar] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (window && !audioRef.current) {
            audioRef.current = new Audio()
            audioRef.current.src = `${src}`
        }
    }, [])
    useEffect(() => {
        console.log("use effect")
        audioRef?.current?.addEventListener('timeupdate', timeUpdate)
        audioRef?.current?.addEventListener('ended', ended)

        return () => {
            audioRef?.current?.removeEventListener('timeupdate', timeUpdate)
            audioRef?.current?.removeEventListener('ended', ended)
        }
    }, [src])

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

    const play = () => {
        console.log("play")
        if (!audioRef.current) return
        setIsPlaying(true)
        audioRef.current.play()
    }

    const pause = () => {
        if (!audioRef.current) return
        setIsPlaying(false)
        audioRef.current.pause()
    }

    const ended = (e: Event) => {
        if (!audioRef.current) return
        audioRef.current.currentTime = 0
        audioRef.current.play()
        console.log("ended")
    }

    return (
        <div className={className}>
            {<div className='flex items-center'>
                {
                    !isPlaying ? <PlayButton onClick={(e) => {
                        play()
                    }} /> :
                        <PauseButton onClick={(e) => {
                            console.log("pause button clicked")
                            pause()
                        }} />
                }

                {<Slider className='mx-2' max={100} step={0.1} value={[progressBar]} onValueChange={onValueChangeWithDebounce} />}
            </div>}
        </div>
    );
};

export default MusicPlayer;