import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './utils/auth/AuthProvider';
import Header from "./components/Layout/Header";
import NotFound from './pages/NotFound';
import User from './pages/Users';
import Packet from './pages/Packet';
import Create from './pages/Create';
import View from './pages/View';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path={'/users/:userId'} component={User} />
          <Route path={'/packet/:packetId'} component={Packet} />
          <Route path={'/create'} component={Create} />
          <Route path={'view'} component={View} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App;
