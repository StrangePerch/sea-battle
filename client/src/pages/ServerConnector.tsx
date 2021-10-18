import io from "socket.io-client";
import {useEffect, useState} from "react";
import Menu from "../components/ui/menu";
import {LinearProgress} from "@mui/material";
import {useSessionContext} from "../contexts/sessionContext";

enum States {
  ConnectingToServer,
  LookingForSecondPlayer,
  GameFound,
  Disconnected
}

type GameState =
  {
    state: States,
    username: string
  }

type Props = {
  connected: any
}

export default function ServerConnector(props: Props) {
  const [session, setSession] = useSessionContext();
  const [gameState, setGameState] = useState<GameState>(
    {
      state: States.ConnectingToServer,
      username: ""
    });
  const connect = () => {
    let socket = io("http://localhost:2999");
    socket.on("player-found", (player: string) => {
      setGameState({
        ...gameState,
        state: States.GameFound,
        username: player
      })
      setTimeout(() => props.connected(player, socket), 1000);
    });
    socket.on("disconnect", () => {
      console.log("Got disconnect!")
      setGameState({
        ...gameState,
        state: States.Disconnected,
        username: ""
      })
    });
    socket.emit("looking-for-game", session.username);
    setGameState({...gameState, state: States.LookingForSecondPlayer})
  }

  useEffect(() => {
    connect();
  }, [])


  if (gameState.state === States.ConnectingToServer) {
    return (
      <Menu>
        <h1>Connecting to server</h1>
        <LinearProgress style={{width: "100%"}}/>
      </Menu>
    )
  } else if (gameState.state === States.LookingForSecondPlayer) {
    return (
      <Menu>
        <h1>Looking for a Second Player</h1>
        <LinearProgress style={{width: "100%"}}/>
      </Menu>
    )
  } else if (gameState.state === States.GameFound) {
    return (
      <Menu>
        <h1>Game found</h1>
        <h1>Player: {gameState.username}</h1>
        <h3>You will be redirected in a moment...</h3>
      </Menu>
    )
  } else if (gameState.state === States.Disconnected) {
    return (
      <Menu>
        <h1>Disconnected :(</h1>
      </Menu>
    )
  }
  return (
    <h1>Something bad happened</h1>
  )
}