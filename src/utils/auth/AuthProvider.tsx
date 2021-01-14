import React, { useEffect, useState } from "react";
import { auth, db, firebase } from "../../firebase"
import { User } from '../types'

type Context = {

    login : () => void
    logout : () => void
    currentUser : User | null
    currentUserRef :  firebase.firestore.DocumentReference<firebase.firestore.DocumentData> | undefined
    setCurrentUser : React.Dispatch<React.SetStateAction<User | null>> | undefined
}

const AuthContext = React.createContext<Context>({
    login: async () => {},
    logout: async () => {},
    currentUser : null,
    currentUserRef : undefined,
    setCurrentUser : undefined
})

const AuthProvider: React.FC = ({children}) => {
    const [currentUser, setCurrentUser] = useState<null | User>(null)
    const [currentUserRef, setCurrentUserRef] = useState<undefined | firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>(undefined)

    useEffect(() => {
        auth.onAuthStateChanged(
            (user : firebase.User | null) => {
                if(user === null) return
                const docRef = db.collection('users').doc(user.uid);
                setCurrentUserRef(docRef);
                docRef.get().then((doc) => {
                    if(doc.exists){
                        setCurrentUser(doc.data() as User)
                    }else{
                        const initUser : User = {
                            id : user.uid,
                            packetRefs : [],
                            displayName : user.displayName,
                            photoUrl : user.photoURL,
                            subscribePacketRefs: []
                        }
                        setCurrentUser(initUser)

                        //初期UserをDBにUPLOAD
                        db.collection('users')
                            .doc(initUser.id)
                            .set(initUser)
                            .catch((err) => alert(err))
                    }
                }).catch((err) => {
                    alert(err);
                })                
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
        setCurrentUser(null);
    }

    return(
        <AuthContext.Provider value={{ logout, login, currentUser, currentUserRef,setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}
