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
            <Helmet
                title={'Link-Packet'}
                meta={[
                    { name: 'twitter:card', content: 'summary_large_image' },
                    { property: 'og:image', content: `${twitterCardURL}` },
                    { property: 'og:title', content: 'Link-Packet' },
                    { property: 'og:description', content: 'Share Your Book Marks!' },
                    { property: 'og:url', content: `https://link-packet.web.app/` }
                ]}
            />
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
