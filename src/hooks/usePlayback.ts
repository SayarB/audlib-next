import { PlaybackContext } from "@/context/PlaybackContext";
import { useContext } from "react";

export const usePlayback = () => {
  return useContext(PlaybackContext);
};
