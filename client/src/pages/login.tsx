import {useState} from "react";
import axios from "axios";
import {useSessionContext} from "../contexts/sessionContext";
import Auth from "../utils/auth";
import {Redirect} from "react-router-dom";
import {Button, Grid, Input, Paper} from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [session, setSession] = useSessionContext();

  const handleLogIn = () => {
    axios({
      method: "post",
      data:
        {
          username: username,
          password: password
        },
      withCredentials: true,
      url: "http://localhost:3001/login"
    }).then((res) => {
      console.log("Login: ", res);
      Auth().then(username => {
        console.log("Login: ", username)
        setSession({username: username, isAuthenticated: username !== undefined});
      })
    })
  }

  return (
    <>
      {session.isAuthenticated ? (
          <Redirect to={"/"}/>) :
        (<Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{minHeight: '100vh', backgroundColor: "#b4d3ff"}}
        >
          <Paper style={{padding: '50px', backgroundColor: "#d2ffb4"}}>
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{minHeight: '100%'}}
            >
              <h1>Login</h1>
              <Input onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
              <Input onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
              <Button variant="contained" onClick={handleLogIn} style={{marginTop: "20px"}}>Submit</Button>
            </Grid>
          </Paper>
        </Grid>)
      }
    </>
  )
}