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


const userLoggedIn = () => {
    return Object.keys(getState('user')).length !== 0;
}


export {
    getState,
    setState,
    SharedContext,
    userLoggedIn,
}
