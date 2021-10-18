import {Route, Switch} from 'react-router';
import ProtectedRoute from "./utils/privateRoute";
import Login from "./pages/login";
import Register from "./pages/register";
import MainMenu from './pages/mainMenu';
import GameManager from "./pages/gameManager";

export default function App() {
  return (
    <div>
      <Switch>
        <Route path='/login'><Login/></Route>
        <Route path='/register'><Register/></Route>
        <ProtectedRoute
          redirectPath='/login'>
          <Route path='/game'><GameManager/></Route>
          <Route path='/'><MainMenu/></Route>
        </ProtectedRoute>
      </Switch>
    </div>
  );
};