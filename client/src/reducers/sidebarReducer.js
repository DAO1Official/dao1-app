

const sideBarReducer = (state = false,action) => {
    switch(action.type){
        case 'INANDOUT':
            return action.payload
        default:
            return state;
    }
}

export default sideBarReducer;