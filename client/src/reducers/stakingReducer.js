const stakingReducer = (state = {stakingData: [], isFetchingStakingData: false, stakingTransactionState: 'NOT_STARTED', unStakingTransactionState: 'NOT_STARTED' ,nftClaimTransactionState: 'NOT_STARTED', harvestTransactionState: 'NOT_STARTED'},action) => {
    switch(action.type){
        case 'FETCH_STAKING_DATA':
            return {...state, isFetchingStakingData : true}
        case 'STORE_STAKING_DATA':
            return {
                ...state,
                stakingData: action.payload,
                isFetchingStakingData: false
            }
        case 'STAKING_IN_PROGRESS':
            return {
                ...state,
                stakingTransactionState: 'IN_PROGRESS'
            }
        case 'STAKING_SUCCESS':
            return {
                ...state,
                stakingTransactionState: 'SUCCESS'
            }
        case 'STAKING_FAILED':
            return {
                ...state,
                stakingTransactionState: 'FAILED'
            }
        case 'UNSTAKING_IN_PROGRESS':
            return {
                ...state,
                unStakingTransactionState: 'IN_PROGRESS'
            }
        case 'UNSTAKING_SUCCESS':
            return {
                ...state,
                unStakingTransactionState: 'SUCCESS'
            }
        case 'UNSTAKING_FAILED':
            return {
                ...state,
                unStakingTransactionState: 'FAILED'
            }
        case 'NFTCLAIM_IN_PROGRESS':
            return {
                ...state,
                nftClaimTransactionState: 'IN_PROGRESS'
            }
        case 'NFTCLAIM_SUCCESS':
            return {
                ...state,
                nftClaimTransactionState: 'SUCCESS'
            }
        case 'NFTCLAIM_FAILED':
            return {
                ...state,
                nftClaimTransactionState: 'FAILED'
            }
        case 'HARVESTING_IN_PROGRESS':
            return {
                ...state,
                harvestTransactionState: 'IN_PROGRESS'
            }
        case 'HARVESTING_SUCCESS':
            return {
                ...state,
                harvestTransactionState: 'SUCCESS'
            }
        case 'HARVESTING_FAILED':
            return {
                ...state,
                harvestTransactionState: 'FAILED'
            }
        default:
            return state;
    }
}

export default stakingReducer;