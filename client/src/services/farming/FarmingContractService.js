import FarmingContractAbi from '../../abi/farming/Farming.json'
import { utils } from 'ethers'

export const farmingAbiInterface = new utils.Interface(FarmingContractAbi)

export const lpTokenEarnedContractCall = (contractAddress, walletAddress) => ({
    abi: farmingAbiInterface,
    address: contractAddress,
    method: 'getEstimatedPendingDivs',
    args: [walletAddress]
})

export const lpTokenStakedContractCall = (contractAddress, walletAddress) => ({
    abi: farmingAbiInterface,
    address: contractAddress,
    method: 'depositedTokens',
    args: [walletAddress]
})

export const stakeFarmingTokenFunction = 'deposit' //while harvesting pass 0 as amount
export const withdrawFarmingTokenFunction = 'withdraw'
export const harvestFarmingTokenFunction = 'claim'