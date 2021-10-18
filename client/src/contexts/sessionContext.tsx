import React, {createContext, useContext, useEffect, useState} from "react";
import {initialSession, Session} from "../models/session";
import Auth from "../utils/auth";

export const SessionContext =
  createContext<[Session, (session: Session) => void]>([initialSession, () => {
  }]);

export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider: React.FC = (props) => {
  const auth = useProvideAuth();
  return (
    <SessionContext.Provider value={auth}>
      {props.children}
    </SessionContext.Provider>
  );
}

function useProvideAuth() {
  const [sessionState, setSessionState] = useState(initialSession);
  const defaultSessionContext: [Session, typeof setSessionState] = [sessionState, setSessionState];

  const checkSessionState = () => {
    Auth().then(username => {
      setSessionState({username: username, isAuthenticated: !!username})
    })
  }

  useEffect(() => {
    checkSessionState();
    const interval = setInterval(() => checkSessionState(), 30000);
    return () => clearInterval(interval);
  }, []);

  return defaultSessionContext;
}