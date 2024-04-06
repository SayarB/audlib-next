import React, { Dispatch, RefObject, useRef } from "react";
import { createContext } from "react";

export type AuthContextType = {
  isAuthed: boolean;
  isOrgSelected: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthed: false,
  isOrgSelected: false,
});

export const AuthProvider = AuthContext.Provider;
