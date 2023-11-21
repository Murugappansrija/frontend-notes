import React, { createContext, useContext, useState } from "react";;

export const AppContext = createContext(null)

export default function AppProvider({children}){
    const [user,setUser] = useState(null)
    const [note,setNote] = useState(null)
    return(
        <AppContext.Provider
        value={{
            user,
            setUser,
            note,
            setNote
        }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const AppState = ()=>{
    return useContext(AppContext)
}