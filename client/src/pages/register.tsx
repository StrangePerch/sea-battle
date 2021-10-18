import {useState} from "react";
import axios from "axios"

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister = () => {
    axios({
      method: "post",
      data:
        {
          username: username,
          password: password
        },
      withCredentials: true,
      url: "http://localhost:3001/register"
    }).then((res) => console.log("Register: ", res))
  }
  return (
    <div>
      <h1>Register</h1>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
      <input onChange={(e) => setPassword(e.target.value)} placeholder="password"/>
      <button onClick={handleRegister}>Submit</button>
    </div>
  )
}