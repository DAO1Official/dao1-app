

const modalReducer = (state = {value:false, title:'', unStakeModal: false, nftModal: false, errorModal: false},action) => {
    switch(action.type){
        case 'MODAL':
            return {value:action.payload.value,title:action.payload.title}
        case 'UNSTAKE_MODAL':
            return {unStakeModal: action.value, title: action.title }
        case 'NFT_MODAL':
            return {nftModal: action.value, title: action.title }
        case 'ERROR_MODAL':
            return {errorModal: action.value, title: action.title}
        default:
            return state;
    }
}

export default modalReducer;