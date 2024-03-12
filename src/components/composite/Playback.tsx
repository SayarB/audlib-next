"use client"
import React from 'react';
import { usePlayback } from '@/hooks/usePlayback';

const Playback: React.FC = () => {
    const { play, pause, playbackPlaying } = usePlayback();

    return (
        <div className='fixed bottom-0 h-[100px] w-[100vw] bg-white z-20'>
            <button onClick={() => {
                if (play) {
                    play()
                }
            }}>Play</button>
            <button onClick={() => {
                if (pause) {
                    pause()
                }
            }}>Pause</button>
            <p>{playbackPlaying ? 'Playing' : 'Paused'}</p>
        </div>
    );
};

export default Playback;