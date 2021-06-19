const stakedReducer = (state = false,action) => {
    switch(action.type){
        case 'STAKED':
            return {stake: action.payload}
        case 'UNSTAKED':
            return {unStake: action.value}
        case 'NFT':
            return {nft: action.value}
        default:
            return state;
    }
}

export default stakedReducer;