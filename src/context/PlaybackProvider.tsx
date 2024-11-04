import { useCallback, useEffect, useRef, useState } from "react";
import { PlaybackContext } from "./PlaybackContext"
import { env } from "@/env/schema";

type Props = {
    children: React.ReactNode
}
const PlaybackProvider: React.FC<Props> = ({ children }) => {
    const ref = useRef<HTMLAudioElement | null>(null)
    const [idPlaying, setIdPlaying] = useState<string>("");
    const [streamToken, setStreamToken] = useState<string>("");
    const [playbackLoading, setPlaybackLoading] = useState(false);
    const [playbackPlaying, setPlaybackPlaying] = useState(false);
    useEffect(() => {
        if (window && !ref.current) {
            ref.current = new Audio()
        }
    }, [])

    useEffect(() => {
        if (idPlaying !== "") {
            fetchStreamToken()
        }
    }, [idPlaying])

    useEffect(() => {
        if (streamToken !== "") {
            setupStream()
        }
    }, [streamToken])

    const setStreamId = useCallback((id: string) => {
        setIdPlaying(id)
    }, [])

    const fetchStreamToken = useCallback(async () => {
        setPlaybackLoading(true);
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/stream/${idPlaying}/token`, {
            method: "POST",
        });

        const data = await res.json();
        const token = data.token;
        setStreamToken(token);
        setPlaybackLoading(false);
    }, [idPlaying]);

    const play = useCallback(() => {
        if (!ref.current) return
        if (ref.current.duration === 0) return
        ref.current?.play()
        setPlaybackPlaying(true)
    }, [])

    const pause = useCallback(() => {
        console.log("pausing")
        ref.current?.pause()
        setPlaybackPlaying(false)
    }, [])

    const reset = useCallback(() => {
        if (!ref.current) return
        ref.current.currentTime = 0
    }, [])

    const setupStream = useCallback(() => {
        if (!ref.current) {
            return
        }
        ref.current.src = `${env.NEXT_PUBLIC_API_URL}/stream/${idPlaying}?token=${streamToken}`
    }, [idPlaying, streamToken])

    const startStream = useCallback((id: string) => {
        reset()
        if (idPlaying === id && streamToken !== "") {
            play()
            return
        }
        setIdPlaying(id)
    }, [idPlaying, streamToken])

    const closePlayer = useCallback(() => {
        setIdPlaying("")
        if (!ref.current) return
        ref.current.src = ""
        ref.current.pause()
        setStreamToken("")
        reset()
    }, [])

    const state = {
        audioRef: ref, play, pause, reset, setupStream, fetchStreamToken, idPlaying, setStreamId, playbackLoading, playbackPlaying, startStream, closePlayer
    }
    return <PlaybackContext.Provider value={state}>{children}</PlaybackContext.Provider>
}
export default PlaybackProvider