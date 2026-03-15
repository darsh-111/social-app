import { createContext, useEffect, useState } from "react";
export const TokenContext = createContext();
export default function TokenContextProvider({ children }) {

    const [Token, setToken] = useState(null)
    useEffect(() => {
        if (localStorage.getItem("usertoken"))
            setToken(localStorage.getItem("usertoken"));
    }, []);

    return <TokenContext.Provider value={{ Token, setToken }}>
        {children}
    </TokenContext.Provider>
}