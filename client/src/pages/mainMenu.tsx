import {Button} from "@mui/material";
import {useSessionContext} from "../contexts/sessionContext";
import Auth, {LogOut} from "../utils/auth";
import {Link} from "react-router-dom"
import Menu from "../components/ui/menu";

export default function MainMenu() {
  let [session, setSession] = useSessionContext();

  const handleLogOut = () => {
    LogOut()
      .then(() => Auth()
        .then(() => {
          setSession({username: undefined, isAuthenticated: false});
          console.log("Log out");
        }))
  }

  return (
    <Menu>
      <h1>Hello {session.username}</h1>
      <Link to="/game" style={{width: '100%', textDecoration: "none"}}>
        <Button variant="contained" style={{width: '100%'}}> Start game</Button>
      </Link>
      <Button variant="contained" style={{width: '100%', marginTop: "10px"}} onClick={handleLogOut}>Log out</Button>
    </Menu>
  )
}