import TokenContractAbi from '../../abi/farming/Token.json'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'

export const tokenAbiInterface = new utils.Interface(TokenContractAbi)
export const tokenContract = new Contract("0x2A881131C3F8f825E74757eB5792FA12a162d878", tokenAbiInterface)

export const balanceOfTokenContractCall = (tokenContractAddress, lpTokenAddress) => ({
    abi: tokenAbiInterface,
    address: tokenContractAddress,
    method: 'balanceOf',
    args: [lpTokenAddress]
})

export const allowanceContractCall = (walletAddress) => ({
    abi: tokenAbiInterface,
    address: "0x2A881131C3F8f825E74757eB5792FA12a162d878",
    method: 'allowance',
    args: [walletAddress, process.env.REACT_APP_DAO1_FARMING_ADDRESS]
})

export const approveAllowanceFunction = 'approve'