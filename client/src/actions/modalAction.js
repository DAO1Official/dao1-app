export const modalAction = (value,title) =>{
    return{
        type:'MODAL',
        payload:{value,title}
    }
}

export const unStakeModalAction = (value,title) => {
    return {
        type: 'UNSTAKE_MODAL',
        value,
        title
    }
}

export const nftModalAction = (value,title) => {
    return {
        type: 'NFT_MODAL',
        value,
        title
    }
}

export const errorModalAction = (value, title) => {
    return {
        type: 'ERROR_MODAL',
        value,
        title
    }
}