import {useSessionContext} from "../contexts/sessionContext";
import {Redirect} from "react-router-dom";
import {Switch} from "react-router";


type Props = {
  children: any,
  redirectPath: string
}

// export default function ProtectedRoute({children, protectedPath, redirectPath}: Props) {
//   let [session, setSession] = useSessionContext();
//
//   return session.isAuthenticated ?
//     <Route path={protectedPath}>{children}</Route> :
//     <Redirect to={{pathname: redirectPath}}/>;
// }

export default function ProtectedRoute({children, redirectPath}: Props) {
  let [session, setSession] = useSessionContext();

  return session.isAuthenticated ?
    <Switch>{children}</Switch> :
    <Redirect to={{pathname: redirectPath}}/>;
}