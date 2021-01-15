import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {AuthProvider} from './utils/auth/AuthProvider';
import Header from "./components/Layout/Header";
import Footer from './components/Layout/Footer';
import User from './pages/Users';
import EditPacket from './pages/EditPacket';
import PacketDetails from './pages/PacketDetails';
import View from './pages/View';
import {Helmet} from 'react-helmet';

const App: React.FC = () => {
    return (
        <>
            <Helmet>

            </Helmet>
            <AuthProvider>
                <Router>
                    <Header/>
                    <Switch>
                        <Route exact path={'/edit/:packetId'} component={EditPacket}/>
                        <Route exact path={'/users/:userId'} component={User}/>
                        <Route exact path={'/packet/:packetId'} component={PacketDetails}/>
                        <Route exact path={'/'} component={View}/>
                        <Redirect to={''}/>
                    </Switch>
                    <Footer/>
                </Router>
            </AuthProvider>
        </>
    )
};

export default App;
