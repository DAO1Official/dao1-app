

const connectionReducer = (state = false, action) => {
    switch(action.type){
        case 'CONNECTED':
            return action.payload
        default:
            return state;
    }
}

export default connectionReducer;