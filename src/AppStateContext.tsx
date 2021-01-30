import React, {createContext, useContext, useReducer} from 'react'
import { v4 as uid } from 'uuid';
import {moveItem} from './utils/moveItem'

import {findItemIndexById} from './utils/findItemIndexById'

export interface AppState {
    lists: List[]
}

interface List {
    id: string
    text: string
    tasks: Task[]
}

interface Task {
    id: string
    text: string
}

const appData : AppState = {
    lists: [
        {
            id: '0',
            text: 'To Do',
            tasks: [{id:'c0', text:'Generate app scaffold'}]
        },
        {
            id: '1',
            text: 'In Progress',
            tasks: [{id:'c1', text:'Learn Typescript'}]
        },
        {
            id: '2',
            text: 'Done',
            tasks: [{id:'c2', text:'Begin to use static typing'}]
        }
    ]
}

interface AppStateContextProps {
    state: AppState
    dispatch: React.Dispatch<Action>
}

const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

export const AppStateProvider = ({children}: React.PropsWithChildren<{}>)=>{
    const [state, dispatch] = useReducer(appStateReducer, appData)
    return (
        <AppStateContext.Provider value={{state , dispatch}}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppState = () =>{
    return useContext(AppStateContext)
}

type Action = 
    | {
        type: 'ADD_LIST'
        payload: string
    }
    | {
        type: 'ADD_TASK'
        payload: {text:string, taskId: string}
    }
    |
    {
        type: 'MOVE_LIST'
        payload: {
            dragIndex: number
            hoverIndex: number
        }
    }

const appStateReducer = (state:AppState, action:Action):AppState =>{
    switch(action.type){
        case 'ADD_LIST': {
            return {
                ...state,
                lists: [
                    ...state.lists,
                    {id: uid(), text:action.payload, tasks:[]}
                ]
            }
        }
        case 'ADD_TASK': {
            const targetLaneIndex = findItemIndexById(state.lists, action.payload.taskId)
            state.lists[targetLaneIndex].tasks.push({
                id:uid(),
                text: action.payload.text
            })
            return {
                ...state
            }
        }
        case 'MOVE_LIST': {
            const {dragIndex, hoverIndex} = action.payload
            state.lists = moveItem(state.lists, dragIndex, hoverIndex)
            return {...state}
        }
        default: {
            return state
        }
    }
}