import { createContext, useState } from "react";



export const CounterContext = createContext();
export default function CounterContextProvider(props) {

    const [counter, setcounter] = useState(15)

    return <CounterContext.Provider value={{ counter, setcounter }}>
        {props.children}
    </CounterContext.Provider>
}