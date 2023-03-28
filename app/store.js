const state = {
    user: {},
}


const getState = () => {
    return state;
}


const setState = (updatedStatePortion) => {
    Object.assign(state, updatedStatePortion);
}


export {
    getState,
    setState,
}
