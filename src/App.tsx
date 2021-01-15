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
import twitterCardURL from './assets/twitter-card.png';

const App: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>{'Link-Packet'}</title>
                <meta name="description" content={'Share Your Packet!!'}/>
                <meta property="og:url" content='https://link-packet.web.app/'/>
                <meta property="og:type" content="website"/>
                <meta property="og:title" content={'Link-Packet'}/>
                <meta property="og:description" content={'Share Your Packet!!'}/>
                <meta property="og:image" content={twitterCardURL}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <meta name="twitter:site" content="@"/>
                <meta name="twitter:creator" content="@"/>
                <meta name="twitter:title" content={'Link-Packet'}/>
                <meta name="twitter:description" content={'Share Your Packet!!'}/>
                <meta name="twitter:image" content={twitterCardURL}/>
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
