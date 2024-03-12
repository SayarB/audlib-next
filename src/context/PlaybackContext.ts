import React, { Dispatch, RefObject, useRef } from "react";
import { createContext } from "react";

export type PlaybackContextType = {
  audioRef: React.MutableRefObject<HTMLAudioElement | null> | null;
  play: () => void;
  pause: () => void;
  setupStream: () => void;
  fetchStreamToken: () => Promise<void>;
  idPlaying: string;
  playbackPlaying: boolean;
  playbackLoading: boolean;
  setStreamId: (id: string) => void;
  startStream: (id: string) => void;
};

export const PlaybackContext = createContext<PlaybackContextType>({
  audioRef: null,
  play: () => {
    throw new Error("not yet initialized");
  },
  pause: () => {
    throw new Error("not yet initialized");
  },
  fetchStreamToken: async () => {
    throw new Error("not yet initialized");
  },
  setupStream: () => {
    throw new Error("not yet initialized");
  },
  setStreamId: (id: string) => {
    throw new Error("not yet initialized");
  },
  startStream: (id) => {
    throw new Error("not yet initialized");
  },
  idPlaying: "",
  playbackLoading: false,
  playbackPlaying: false,
});

export const PlaybackProvider = PlaybackContext.Provider;
