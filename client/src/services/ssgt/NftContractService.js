import NftContractAbi from '../../abi/ssgt/NFT.json'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'

const abiInterface = new utils.Interface(NftContractAbi)
const contractAddress = process.env.REACT_APP_SSGT_NFT_ADDRESS
export const nftContract = new Contract(contractAddress, abiInterface)

export const nftOwnedContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'balanceOf',
    args: [walletAddress]
})

export const getTokenListContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'getTokenList',
    args: [walletAddress]
})

export const isApprovedForNftContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'isApprovedForAll',
    args: [walletAddress, process.env.REACT_APP_SSGT_CONTRACT_ADDRESS]
})

export const setApproveForNftFunction = 'setApprovalForAll'