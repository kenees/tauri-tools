

import { createContext, ReactNode, useContext, useReducer } from "react";


interface IProps {
    count: number
}

const defaultStore: IProps = {
    count: 1,
}

const StoreContext = createContext<any>({})

const reducer = (state: IProps, action: { type: string, data?: any}) => {
    switch (action.type) {
        case "add": {
            return {
                ...state,
                count: state.count+1
            }
        }
        case "reduce": {
            return {
                ...state,
                count: state.count - 1
            }
        }
        default: {
            return state
        }
    }
}

export default ({ children }: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(reducer, defaultStore)

    return (
        <StoreContext.Provider value={{state, dispatch}}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStores = () => {
    const { state , dispatch} = useContext(StoreContext);
    return {
        state,
        dispatch
    }
}