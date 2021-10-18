import axios from "axios";

interface ServerData {
  username: string
}

export default function Auth() {
  return axios.request<ServerData>({
    withCredentials: true,
    url: "http://localhost:3001/user"
  }).then((response) => {
    const {data} = response;
    return data.username;
  })
}

export function LogOut() {
  return axios.request({
    withCredentials: true,
    url: "http://localhost:3001/logout"
  })
}