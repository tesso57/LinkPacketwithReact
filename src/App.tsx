import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { AuthProvider } from './utils/auth/AuthProvider';
import Header from "./components/Layout/Header";
import User from './pages/Users';
import PacketDetails from './pages/PacketDetails';
import Create from './pages/Create';
import View from './pages/View';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path={'/users/:userId'} component={User} />
          <Route exact path={'/packet/:packetId'} component={PacketDetails} />
          <Route exact path={'/create'} component={Create} />
          <Route exact path={'/'} component={View} />
          <Redirect to={''}/>
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App;
