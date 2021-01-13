import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './utils/auth/AuthProvider';
import Header from "./components/Layout/Header";
import NotFound from './pages/NotFound';
import User from './pages/Users';
import PacketDetails from './pages/PacketDetails';
import Create from './pages/Create';

import Packet from './pages/Packet';

import View from './pages/View';
import Edit from './pages/Edit';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path={'/users/:userId'} component={User} />
          <Route path={'/packet/:packetId'} component={Packet} />
          <Route path={'/edit/:packetId'} component={Edit} />
          <Route path={'/'} component={View} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App;
