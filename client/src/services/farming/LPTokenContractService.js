import TokenContractAbi from '../../abi/farming/LPToken.json'
import { Contract } from '@ethersproject/contracts'
import { utils } from 'ethers'

const abiInterface = new utils.Interface(TokenContractAbi)

export const lpTokenNameContractCall = (contractAddress) => ({
    abi: abiInterface,
    address: contractAddress,
    method: 'name'
})