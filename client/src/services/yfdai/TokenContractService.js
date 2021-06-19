import TokenContractAbi from '../../abi/ssgt/Token.json'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'

const abiInterface = new utils.Interface(TokenContractAbi)
const contractAddress = process.env.REACT_APP_YFDAI_TOKEN_ADDRESS
export const tokenContract = new Contract(contractAddress, abiInterface)

export const totalStakedContractCall = {
    abi: abiInterface,
    address: contractAddress,
    method: 'balanceOf',
    args: [process.env.REACT_APP_YFDAI_CONTRACT_ADDRESS]
}

export const allowanceContractCall = (walletAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'allowance',
    args: [walletAddress, process.env.REACT_APP_YFDAI_CONTRACT_ADDRESS]
})

export const approveAllowanceFunction = 'approve'