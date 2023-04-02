import { createContext } from 'react';


const state = {
    user: {},
}


const getState = ( key = null ) => {
    if (!key || !(key in state)) {
        return state;
    }
    
    return state[key];
}


const setState = (updatedStatePortion) => {
    Object.assign(state, updatedStatePortion);
}


const SharedContext = createContext();


export {
    getState,
    setState,
    SharedContext
}
