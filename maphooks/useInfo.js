import { useEffect, useReducer, useState } from "react";


export function useInfo(initial_state, reducer) {
    const [state, dispatch] = useReducer(reducer, initial_state)
    const [activeInfo, setActiveInfo] = useState([])

    function useFirst(primary, event, skip_if) {
        const [variable, operator, value] = primary

        function checkCondition(condition) {
            let checkValue;

            if (condition === 'NONE') return false

            const [variable, operator, value] = condition

            switch (operator) {
                case '!=':
                    checkValue = variable != value
                    break
                case '==':
                    checkValue = variable === value
                    break
                case '<':
                    checkValue = variable < value
                    break
                case '>':
                    checkValue = variable > value
                    break
                default:
                    break
            }

            return checkValue
        }

        useEffect(() => {
            if (skip_if != undefined) {
                if (checkCondition(primary) && !checkCondition(skip_if) && state[event] === null) {
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
        }, [variable])

        useEffect(() => {
            setActiveInfo(Object.keys(state).filter(k => state[k]))
        }, [state])
    }

    return {
        useFirst,
        activeInfo
    }
}
