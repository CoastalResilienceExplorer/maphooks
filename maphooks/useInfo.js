import { createContext, useContext, useReducer, useState } from "react";

export const InfoContext = createContext({});

export const useInfoContext = () => useContext(InfoContext);

export function useInfo(initial_state, reducer) {
    const [state, dispatch] = useReducer(reducer, initial_state)

    function useFirst(confirmIf, event, skipIf) {
        if (confirmIf() && (skipIf || !skipIf()) && state[event] === null) {
            dispatch({
                type: event,
                payload: true
            })

            setTimeout(() => dispatch({
                type: event,
                payload: false
            }), 4500)
        }
    }

    return {
        useFirst,
        activeInfo: Object.keys(state).filter(k => state[k])
    }
}
