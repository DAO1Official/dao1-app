export const staked = (value) => {
    return {
        type:'STAKED',
        payload: value
    }
}

export const unStaked = (value) => {
    return {
        type: 'UNSTAKED',
        value
    }
}

export const nft = (value) => {
    return {
        type: 'NFT',
        value
    }
}