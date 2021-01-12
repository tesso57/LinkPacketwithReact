import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from './utils/auth/AuthProvider';
import Header from "./components/Layout/Header";
import NotFound from './pages/NotFound';
import User from './pages/Users';
import Packet from './pages/Packet';
import Create from './pages/Create';
import View from './pages/View';
import BookmarkCard from './components/BookmarkCard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <BookmarkCard title='test1' description='this is description' url='https://qiita.com/ksyunnnn/items/bfe2b9c568e97bb6b494' />
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
