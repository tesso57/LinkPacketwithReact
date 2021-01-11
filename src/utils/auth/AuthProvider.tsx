import React, { useEffect, useState } from "react";
import { auth } from "../../firebase"

type Context{

}

const AuthContext = React.createContext<Context>('')

const AuthProvider: React.FC = ({children}) => {

    return(
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}