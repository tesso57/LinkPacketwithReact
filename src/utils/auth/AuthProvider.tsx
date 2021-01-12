import React, { useEffect, useState } from "react";
import { auth, firebase } from "../../firebase"

type Context = {

    login : () => void
    logout : () => void
    currentUser : firebase.User | null

}

const AuthContext = React.createContext<Context>({
    login: async () => {},
    logout: async () => {},
    currentUser: null

})

const AuthProvider: React.FC = ({children}) => {
    const [currentUser, setCurrentUser] = useState<null | firebase.User>(null)

    useEffect(() => {
        auth.onAuthStateChanged(user => {
                setCurrentUser(user)            
            }
        );
    },[])

    const login = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().languageCode = 'ja'
        auth.signInWithRedirect(provider);
    }

    const logout = () => {
        auth.signOut();
    }

    return(
        <AuthContext.Provider value={{ logout, login, currentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}