import React, { useEffect, useState } from "react";
import { auth, firebase } from "../../firebase"
import { User } from '../types'

type Context = {

    login : () => void
    logout : () => void
    currentUser : User | null

}

const AuthContext = React.createContext<Context>({
    login: async () => {},
    logout: async () => {},
    currentUser: null

})

const AuthProvider: React.FC = ({children}) => {
    const [currentUser, setCurrentUser] = useState<null | User>(null)

    useEffect(() => {
        auth.onAuthStateChanged(
            (user : firebase.User | null) => {
                if(user !== null){
                    const tmpUser : User = {
                        id : user.uid,
                        displayName : user.displayName,
                        photoUrl : user.photoURL
                    }
                    setCurrentUser(user)            
                }
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