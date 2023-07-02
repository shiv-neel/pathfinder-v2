import { Dispatch, SetStateAction, createContext, useState } from 'react'
import { Algo } from '../models/types'

interface AppState {
    algo: Algo
    setAlgo: Dispatch<SetStateAction<Algo>>
    resetBoard: boolean
    setResetBoard: Dispatch<SetStateAction<boolean>>
    isVisualizing: boolean
    setIsVisualizing: Dispatch<SetStateAction<boolean>>
}

export const AppContext = createContext<AppState>({} as AppState)

export const AppContextProvider = ({ children }: any) => {
    const [algo, setAlgo] = useState<Algo>(Algo.DIJKSTRA)
    const [resetBoard, setResetBoard] = useState<boolean>(false)
    const [isVisualizing, setIsVisualizing] = useState<boolean>(false)

    return <AppContext.Provider value={{ algo, setAlgo, resetBoard, setResetBoard, isVisualizing, setIsVisualizing }}>
        {children}
    </AppContext.Provider>
}