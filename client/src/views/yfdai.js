import React, { useState, useEffect } from 'react'
import StakeCard from '../components/stakecards'
import StakeLogo1 from '../assets/stakelogo1.png'
import {errorModalAction, modalAction, unStakeModalAction} from '../actions/modalAction'
import {useDispatch,useSelector} from 'react-redux'
import { BigNumber } from '@ethersproject/bignumber'
import { useContractCalls, useEthers, useTokenBalance, useContractFunction } from '@usedapp/core'
import {rewardRateContractCall, totalStakersContractCall, ssgtStakedContractCall, ssgtTotalEarnedContractCall} from '../services/yfdai/StakingContractService'
import {totalStakedContractCall} from '../services/yfdai/TokenContractService'
import { utils } from 'ethers'
import {stakingContract, depositSSGTFunction, withdrawSSGTFunction, harvestFunction} from '../services/yfdai/StakingContractService'
import {tokenContract, allowanceContractCall, approveAllowanceFunction} from '../services/yfdai/TokenContractService'
import {harvestingFailed, harvestingInProgress, harvestingSuccess, stakingFailed, stakingInProgress, stakingSucess, unStakingFailed, unStakingInProgress, unStakingSucess} from '../actions/stakingAction'

const Yfdai = () => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.modalReducer.title)
    const { account } = useEthers()
    const [rewardRate, setRewardRate] = useState(0)
    const [totalStakers, setTotalStakers] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [ssgtStaked, setSsgtStaked] = useState(0)
    const [ssgtEarned, setSsgtEarned] = useState(0)
    const [allowance, setAllowance] = useState(0)
    const [walletBalance, setWalletBalance] = useState(0)
    const [walletAmount, setWalletAmount] = useState('')
    const [usdRate, setUsdRate] = useState(0)
    
    const formatToPercentage = (rewardRateValue) => {
        return (rewardRateValue / 100).toFixed(2).replace(/[.,]00$/, "")
    }

    const userBalance = useTokenBalance(process.env.REACT_APP_YFDAI_TOKEN_ADDRESS, account)
    
    useEffect(() => {
        console.log("userBalance", userBalance)
        setWalletBalance(!!userBalance ? Math.round(utils.formatEther(userBalance)) : 0)
    },[userBalance])

    useEffect(async () => {
        const usdrate = await getUSDRate()
        setUsdRate(usdrate)
    },[])

    const getUSDRateUrl = () =>{
        return "https://api.coingecko.com/api/v3/simple/price?ids=yfdai-finance&vs_currencies=USD"
    }

    const getUSDRate = async () =>{
        const url = getUSDRateUrl();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["yfdai-finance"].usd
    }

    const [
        rewardRateCall, 
        totalStakersCall,
        totalStakedCall,
        ssgtStakedCall,
        ssgtEarnedCall,
        allowanceCall
    ] = useContractCalls([                                                                
        rewardRateContractCall,                                                                
        totalStakersContractCall,                                                                                                                                
        totalStakedContractCall,
        ssgtStakedContractCall(account),
        ssgtTotalEarnedContractCall(account),
        allowanceContractCall(account)                                                         
    ])
    
    useEffect(() => {
        setRewardRate(rewardRateCall ? formatToPercentage(parseInt(rewardRateCall)) : 0)
        setTotalStakers(totalStakersCall ? parseInt(totalStakersCall) : 0)
        setTotalStaked(totalStakedCall ? utils.formatUnits(totalStakedCall[0]._hex, 18): 0)
        setSsgtStaked(ssgtStakedCall ? utils.formatUnits(ssgtStakedCall[0]._hex, 18) : 0)
        setSsgtEarned(ssgtEarnedCall ? utils.formatUnits(ssgtEarnedCall[0]._hex, 18): 0)
        setAllowance(allowanceCall? utils.formatUnits(allowanceCall[0]._hex, 'ether'): 0)
    }, [rewardRateCall,totalStakersCall,totalStakedCall,ssgtEarnedCall, ssgtStakedCall,allowanceCall])

    const { state:depositSSGTFunctionState, send:depositSSGT } = useContractFunction(stakingContract, depositSSGTFunction)
    const { state:approveAllowanceFunctionState, send:sendApproveAllowance } = useContractFunction(tokenContract, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState, send:withdrawSSGT } = useContractFunction(stakingContract, withdrawSSGTFunction)
    const { state:harvestFunctionState, send:harvest} = useContractFunction(stakingContract, harvestFunction)


    const updateWalletAmount = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount(inputAmount)
    }

    const checkAndUnStakeSSGT = () => {
        if(walletAmount>0){
            dispatch(unStakeModalAction(false, selector))
            dispatch(unStakingInProgress())
            withdrawSSGT(utils.parseUnits(walletAmount, 18))
        }
    }

    useEffect(() => {
        console.log(withdrawSSGTFunctionState)
        if(withdrawSSGTFunctionState && withdrawSSGTFunctionState.status == "Success"){
            setWalletAmount('')
            dispatch(unStakingSucess())
        }else if(withdrawSSGTFunctionState && withdrawSSGTFunctionState.status == "Exception"){
            setWalletAmount('')
            dispatch(unStakingFailed())
            dispatch(errorModalAction(true, withdrawSSGTFunctionState.errorMessage))
        }
    },[withdrawSSGTFunctionState])

    const checkAndStakeSSGT = () => {
        // Check allowance, if allowance > 0 && < entered amount then proceed
        if(walletAmount <= walletBalance){
            if (parseFloat(allowance) > 0 && parseFloat(allowance) > walletAmount){
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                stakeSSGT()
            }
            else{
                // Else call approve allowance
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                sendApproveAllowance(process.env.REACT_APP_YFDAI_CONTRACT_ADDRESS, BigNumber.from(2).pow(256).sub(1))
            }
        }
        else{
            // Show error to user
        }
    }

    const stakeSSGT = () => {
        depositSSGT(utils.parseUnits(walletAmount, 18))
    }

    useEffect(() => {
        // handle state
        console.log(approveAllowanceFunctionState)
        if(approveAllowanceFunctionState && approveAllowanceFunctionState.status == "Success"){
            stakeSSGT()
        }else if(approveAllowanceFunctionState && approveAllowanceFunctionState.status == "Exception"){
            setWalletAmount('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, approveAllowanceFunctionState.errorMessage))
        }
    },[approveAllowanceFunctionState])

    useEffect(() => {
        // handle state
        console.log(depositSSGTFunctionState)
        if(depositSSGTFunctionState && depositSSGTFunctionState.status == "Success"){
            setWalletAmount('')
            dispatch(stakingSucess())
        }else if(depositSSGTFunctionState && depositSSGTFunctionState.status == "Exception"){
            setWalletAmount('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, depositSSGTFunctionState.errorMessage))
        }
    },[depositSSGTFunctionState])

    const checkAndHarvest = () => {
        console.log("checkAndHarvest")
        dispatch(harvestingInProgress())
        harvest()
    }

    useEffect(() => {
        // handle state
        console.log(harvestFunctionState)
        if(harvestFunctionState && harvestFunctionState.status == "Success"){
            dispatch(harvestingSuccess())
        }else if(harvestFunctionState && harvestFunctionState.status == "Exception"){
            setWalletAmount('')
            dispatch(harvestingFailed())
            dispatch(errorModalAction(true, harvestFunctionState.errorMessage))
        }
    },[harvestFunctionState])

    return( 
        <StakeCard 
            title="YFDAI" 
            percent={rewardRate} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            ssgtStaked={parseFloat(ssgtStaked)} 
            ssgtEarned={parseFloat(ssgtEarned)} 
            logo={StakeLogo1}
            isNFTEnabled={false} 
            allowance = {allowance}
            walletBalance = {walletBalance}
            walletAmount = {walletAmount}
            updateWalletAmount = {updateWalletAmount}
            checkAndStakeSSGT = {checkAndStakeSSGT}
            checkAndUnStakeSSGT = {checkAndUnStakeSSGT}
            checkAndHarvest = {checkAndHarvest}
            usdRate = {usdRate}
            >
        </StakeCard>
    )
}

export default Yfdai;