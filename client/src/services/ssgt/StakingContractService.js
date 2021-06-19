import StakingContractAbi from '../../abi/ssgt/Staking.json'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'

const abiInterface = new utils.Interface(StakingContractAbi)
const contractAddress = process.env.REACT_APP_SSGT_CONTRACT_ADDRESS
export const contract = new Contract(contractAddress, abiInterface)

export const rewardRateContractCall = {
    abi: abiInterface,
    address: contractAddress,
    method: 'returnsewardRate'
}

export const totalStakedTokenContractCall = {
    abi: abiInterface,
    address: contractAddress,
    method: 'totalStakedToken'
}

export const totalStakersContractCall = {
    abi: abiInterface,
    address: contractAddress,
    method: 'getNumberOfHolders'
}

export const ssgtStakedContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'depositedTokens',
    args: [walletAddress]
})

export const ssgtTotalEarnedContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'totalEarnedTokens',
    args: [walletAddress]
})

export const depositedTokensOfUserContractCall = {
    abi: abiInterface,
    address: contractAddress,
    method: 'depositedTokensOfUser'
}

export const totalNftTokensOfUserContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'totalNFTTokens',
    args: [walletAddress]
})

export const depositSSGTFunction = 'deposit'
export const withdrawSSGTFunction = 'withdraw'
export const withdrawWithNFTFunction = 'withdrawWithNFT'
export const harvestFunction = 'claimDivs'