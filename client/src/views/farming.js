import React, { useState, useEffect } from 'react'
import StakeLogo1 from '../assets/Logo.png'
import {errorModalAction, modalAction, unStakeModalAction} from '../actions/modalAction'
import {useDispatch,useSelector} from 'react-redux'
import { BigNumber } from '@ethersproject/bignumber'
import { useContractCall, useContractCalls, useEthers, useTokenBalance, useContractFunction } from '@usedapp/core'
import {farmingAbiInterface, lpTokenEarnedContractCall, lpTokenStakedContractCall, stakeFarmingTokenFunction, withdrawFarmingTokenFunction, harvestFarmingTokenFunction} from '../services/farming/FarmingContractService'
import { utils } from 'ethers'
import {harvestingFailed, harvestingInProgress, harvestingSuccess, stakingFailed, stakingInProgress, stakingSucess, unStakingFailed, unStakingInProgress, unStakingSucess} from '../actions/stakingAction'
import FarmingCard from '../components/farmingcard'
import {lpTokenNameContractCall} from '../services/farming/LPTokenContractService'
import {tokenAbiInterface, tokenContract, balanceOfTokenContractCall, allowanceContractCall, approveAllowanceFunction} from '../services/farming/TokenContractService'
import StakeAdder from '../components/stakeadder'
import StakeWithdraw from '../components/stakeWithdraw'
import Errorbox from '../components/errorbox'
import { Contract } from '@ethersproject/contracts'

const Farming = () => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.modalReducer.title)

    const [usdDAO1Rate, setUsdDAO1Rate] = useState(0)
    const [usdUSDTRate, setUsdUSDTRate] = useState(0)
    const [usdYFDAIRate, setUsdYFDAIRate] = useState(0)
    const [usdWETHRate, setUsdWETHRate] = useState(0)
    const [usdDAIRate, setUsdDAIRate] = useState(0)

    /* Elements for Pool 1 */
    const [tokenStaked1, setTokenStaked1] = useState(0)
    const [tokenEarned1, setTokenEarned1] = useState(0)
    const [tokenDao1, setTokenDao1] = useState(0)
    const [tokenUSDT1, setTokenUSDT1] = useState(0)
    const [walletAmount, setWalletAmount] = useState('')
    const [walletBalance, setWalletBalance] = useState(0)
    const [allowance, setAllowance] = useState(0)

    const [tokenStaked2, setTokenStaked2] = useState(0)
    const [tokenEarned2, setTokenEarned2] = useState(0)
    const [tokenDao2, setTokenDao2] = useState(0)
    const [tokenUSDT2, setTokenUSDT2] = useState(0)
    const [walletAmount2, setWalletAmount2] = useState('')
    const [walletBalance2, setWalletBalance2] = useState(0)
    const [allowance2, setAllowance2] = useState(0)

    const [tokenStaked3, setTokenStaked3] = useState(0)
    const [tokenEarned3, setTokenEarned3] = useState(0)
    const [tokenDao3, setTokenDao3] = useState(0)
    const [tokenUSDT3, setTokenUSDT3] = useState(0)
    const [walletAmount3, setWalletAmount3] = useState('')
    const [walletBalance3, setWalletBalance3] = useState(0)
    const [allowance3, setAllowance3] = useState(0)

    const [tokenStaked4, setTokenStaked4] = useState(0)
    const [tokenEarned4, setTokenEarned4] = useState(0)
    const [tokenDao4, setTokenDao4] = useState(0)
    const [tokenUSDT4, setTokenUSDT4] = useState(0)
    const [walletAmount4, setWalletAmount4] = useState('')
    const [walletBalance4, setWalletBalance4] = useState(0)
    const [allowance4, setAllowance4] = useState(0)

    const { account } = useEthers()
    const [poolCount, setPoolCount] = useState(0)
    const [aprRate, setAprRate] = useState(0)
    const [totalStakers, setTotalStakers] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [ssgtStaked, setSsgtStaked] = useState(0)
    const [ssgtEarned, setSsgtEarned] = useState(0)
    
    const [usdRate, setUsdRate] = useState(0)
    const [poolInfoContractAbis, setPoolInfoContractAbis] = useState([])
    const [lpTokenEarnedContractAbis, setLpTokenEarnedContractAbis] = useState([])
    const [lpTokenStakedContractAbis, setLpTokenStakedContractAbis] = useState([])
    const [tokenNameContractAbis, setTokenNameContractAbis] = useState([])
    const [poolInfo, setPoolInfo] = useState([])
    const [tokenName, setTokenName] = useState('')
    const [userBalanceAbis, setUserBalanceAbis] = useState([])
    const modalStatus = useSelector((state) => state.modalReducer.value);
    const unStakeModalStatus = useSelector((state) => state.modalReducer.unStakeModal);
    const errorModalStatus = useSelector((state) => state.modalReducer.errorModal);
    const errorModalMessage = useSelector((state) => state.modalReducer.title);
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const formatToPercentage = (rewardRateValue) => {
        return (rewardRateValue / 100).toFixed(2).replace(/[.,]00$/, "")
    }

    const stake = (id) =>{
        setSelectedIndex(id)
        dispatch(modalAction(true, "DAO1"))
    }
    const unStake = () => {
        setSelectedIndex(-1)
        dispatch(unStakeModalAction(true,"DAO1"))
    }

    useEffect(async () => {   
        const usddao1rate = await getDAO1USDRate()
        const usdusdtrate = await getUSDTUSDRate()
        const usdyfdairate = await getYFDAIUSDRate()
        const usdwethrate = await getWETHUSDRate()
        const usddairate = await getDAIUSDRate()
        setUsdDAO1Rate(usddao1rate)
        setUsdUSDTRate(usdusdtrate)
        setUsdYFDAIRate(usdyfdairate)
        setUsdWETHRate(usdwethrate)
        setUsdDAIRate(usddairate)
    },[])

    const getYFDAIUSDRateUrl = () =>{
        return "https://api.coingecko.com/api/v3/simple/price?ids=yfdai-finance&vs_currencies=USD"
    }

    const getWETHUSDRateUrl = () =>{
        return "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=USD"
    } 
    
    const getDAO1USDRateURL = () => {
        return "https://api.coingecko.com/api/v3/simple/price?ids=DAO1&vs_currencies=USD"
    }

    const getUSDTUSDRateURL = () => {
        return "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=USD"
    }

    const getDAIUSDRateURL = () => {
        return "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=USD"
    }

    const getDAIUSDRate = async () =>{
        const url = getDAIUSDRateURL();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["dai"].usd
    }

    const getDAO1USDRate = async () =>{
        const url = getDAO1USDRateURL();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["dao1"].usd
    }

    const getUSDTUSDRate = async () =>{
        const url = getUSDTUSDRateURL();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["tether"].usd
    }

    const getYFDAIUSDRate = async () =>{
        const url = getYFDAIUSDRateUrl();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["yfdai-finance"].usd
    }

    const getWETHUSDRate = async () =>{
        const url = getWETHUSDRateUrl();
        const response = await fetch(url);
        const jsonData = await response.json();
        return jsonData["weth"].usd
    }

    const userBalance = useTokenBalance(process.env.REACT_APP_DAO1_USDT_SAFESWAP_LP_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance)
        setWalletBalance(!!userBalance ? utils.formatEther(userBalance) : 0)
    },[userBalance])

    
    const userBalance2 = useTokenBalance(process.env.REACT_APP_DAO1_USDT_UNISWAP_LP_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance2)
        setWalletBalance2(!!userBalance2 ? utils.formatEther(userBalance2) : 0)
    },[userBalance2])

    const userBalance3 = useTokenBalance(process.env.REACT_APP_YFDAI_USDT_UNISWAP_LP_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance3)
        setWalletBalance3(!!userBalance3 ? utils.formatEther(userBalance3) : 0)
    },[userBalance3])

    const userBalance4 = useTokenBalance(process.env.REACT_APP_DA01_DAI_ETHEREUM_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance4)
        setWalletBalance4(!!userBalance4 ? utils.formatEther(userBalance4) : 0)
    },[userBalance4])

    useEffect(()=>{
        let lpTokenEarnedArray = []
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_DAO1_USDT_SAFESWAP_FARMING_ADDRESS,account))
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_DAO1_USDT_UNISWAP_FARMING_ADDRESS,account))
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_YFDAI_USDT_UNISWAP_FARMING_ADDRESS,account))
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_DAO1_DAI_VAULT_ADDRESS,account))
        
        setLpTokenEarnedContractAbis(lpTokenEarnedArray)

        let lpTokenStakedArray = []
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_DAO1_USDT_SAFESWAP_FARMING_ADDRESS,account))
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_DAO1_USDT_UNISWAP_FARMING_ADDRESS,account))
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_YFDAI_USDT_UNISWAP_FARMING_ADDRESS,account))
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_DAO1_DAI_VAULT_ADDRESS,account))
        
        setLpTokenStakedContractAbis(lpTokenStakedArray)

    },[])
    
    const lpTokenEarnedCall = useContractCalls(lpTokenEarnedContractAbis)
    const lpTokenStakedCall = useContractCalls(lpTokenStakedContractAbis)

    const balanceOfLPDAO1TokenCall = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_DAO1_ETHEREUM_ADDRESS, process.env.REACT_APP_DAO1_USDT_SAFESWAP_LP_ADDRESS))
    const balanceOfLPUSDTTokenCall = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_USDT_ETHEREUM_ADDRESS, process.env.REACT_APP_DAO1_USDT_SAFESWAP_LP_ADDRESS))
    const balanceOfLPDAO1TokenCall2 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_DAO1_ETHEREUM_ADDRESS, process.env.REACT_APP_DAO1_USDT_UNISWAP_LP_ADDRESS))
    const balanceOfLPUSDTTokenCall2 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_USDT_ETHEREUM_ADDRESS, process.env.REACT_APP_DAO1_USDT_UNISWAP_LP_ADDRESS))
    const balanceOfLPDAO1TokenCall3 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_YFDAI_ETHEREUM_ADDRESS, process.env.REACT_APP_YFDAI_USDT_UNISWAP_LP_ADDRESS))
    const balanceOfLPUSDTTokenCall3 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_WETH_ETHEREUM_ADDRESS, process.env.REACT_APP_YFDAI_USDT_UNISWAP_LP_ADDRESS))
    
    console.log("lpTokenEarnedCall", lpTokenEarnedCall)
    console.log("lpTokenStakedCall", lpTokenStakedCall)

    const lpTokenNameCall = useContractCall(lpTokenNameContractCall(process.env.REACT_APP_DAO1_USDT_SAFESWAP_LP_ADDRESS))

    useEffect(() => {
        setTokenEarned1(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[0] ? utils.formatUnits(lpTokenEarnedCall[0][0]._hex, 18) : 0) : 0)
        setTokenStaked1(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[0] ? utils.formatUnits(lpTokenStakedCall[0][0]._hex, 18) : 0) : 0)
        setTokenEarned2(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[1] ? utils.formatUnits(lpTokenEarnedCall[1][0]._hex, 18) : 0) : 0)
        setTokenStaked2(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[1] ? utils.formatUnits(lpTokenStakedCall[1][0]._hex, 18) : 0) : 0)
        setTokenEarned3(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[2] ? utils.formatUnits(lpTokenEarnedCall[2][0]._hex, 18) : 0) : 0)
        setTokenStaked3(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[2] ? utils.formatUnits(lpTokenStakedCall[2][0]._hex, 18) : 0) : 0)
        setTokenEarned4(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[3] ? utils.formatUnits(lpTokenEarnedCall[3][0]._hex, 18) : 0) : 0)
        setTokenStaked4(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[3] ? utils.formatUnits(lpTokenStakedCall[3][0]._hex, 18) : 0) : 0)
        

        setTokenDao1(balanceOfLPDAO1TokenCall ? utils.formatUnits(balanceOfLPDAO1TokenCall[0]._hex, 18) : 0)
        setTokenUSDT1(balanceOfLPUSDTTokenCall ? utils.formatUnits(balanceOfLPUSDTTokenCall[0]._hex, 18) : 0)
        setTokenDao2(balanceOfLPDAO1TokenCall2 ? utils.formatUnits(balanceOfLPDAO1TokenCall2[0]._hex, 18) : 0)
        setTokenUSDT2(balanceOfLPUSDTTokenCall2 ? utils.formatUnits(balanceOfLPUSDTTokenCall2[0]._hex, 18) : 0)
        setTokenDao3(balanceOfLPDAO1TokenCall3 ? utils.formatUnits(balanceOfLPDAO1TokenCall3[0]._hex, 18) : 0)
        setTokenUSDT3(balanceOfLPUSDTTokenCall3 ? utils.formatUnits(balanceOfLPUSDTTokenCall3[0]._hex, 18) : 0)
        

        //setTokenName(lpTokenNameCall?)
    }, [lpTokenEarnedCall,lpTokenStakedCall, lpTokenNameCall,
        balanceOfLPDAO1TokenCall, balanceOfLPUSDTTokenCall,
        balanceOfLPDAO1TokenCall2, balanceOfLPUSDTTokenCall2,
        balanceOfLPDAO1TokenCall3, balanceOfLPUSDTTokenCall3
        ])


    const farmingContract1 = new Contract(process.env.REACT_APP_DAO1_USDT_SAFESWAP_FARMING_ADDRESS, farmingAbiInterface)
    const farmingContract2 = new Contract(process.env.REACT_APP_DAO1_USDT_UNISWAP_FARMING_ADDRESS, farmingAbiInterface)
    const farmingContract3 = new Contract(process.env.REACT_APP_YFDAI_USDT_UNISWAP_FARMING_ADDRESS, farmingAbiInterface)
    const farmingContract4 = new Contract(process.env.REACT_APP_DAO1_DAI_VAULT_ADDRESS, farmingAbiInterface)

    const tokenContract1 = new Contract(process.env.REACT_APP_DAO1_USDT_SAFESWAP_LP_ADDRESS, tokenAbiInterface)
    const tokenContract2 = new Contract(process.env.REACT_APP_DAO1_USDT_UNISWAP_LP_ADDRESS, tokenAbiInterface)
    const tokenContract3 = new Contract(process.env.REACT_APP_YFDAI_USDT_UNISWAP_LP_ADDRESS, tokenAbiInterface)
    const tokenContract4 = new Contract(process.env.REACT_APP_DA01_DAI_ETHEREUM_ADDRESS, tokenAbiInterface)
    

    const { state:depositSSGTFunctionState, send:depositSSGT } = useContractFunction(farmingContract1, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState, send:sendApproveAllowance } = useContractFunction(tokenContract1, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState, send:withdrawSSGT } = useContractFunction(farmingContract1, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState, send:harvest} = useContractFunction(farmingContract1, harvestFarmingTokenFunction)
    
    const { state:depositSSGTFunctionState2, send:depositSSGT2 } = useContractFunction(farmingContract2, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState2, send:sendApproveAllowance2 } = useContractFunction(tokenContract2, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState2, send:withdrawSSGT2 } = useContractFunction(farmingContract2, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState2, send:harvest2} = useContractFunction(farmingContract2, harvestFarmingTokenFunction)
    
    const { state:depositSSGTFunctionState3, send:depositSSGT3 } = useContractFunction(farmingContract3, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState3, send:sendApproveAllowance3 } = useContractFunction(tokenContract3, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState3, send:withdrawSSGT3 } = useContractFunction(farmingContract3, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState3, send:harvest3} = useContractFunction(farmingContract3, harvestFarmingTokenFunction)
    
    const { state:depositSSGTFunctionState4, send:depositSSGT4 } = useContractFunction(farmingContract4, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState4, send:sendApproveAllowance4 } = useContractFunction(tokenContract4, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState4, send:withdrawSSGT4 } = useContractFunction(farmingContract4, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState4, send:harvest4} = useContractFunction(farmingContract4, harvestFarmingTokenFunction)
    

    const updateWalletAmount = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount(inputAmount)
    }

    const updateWalletAmount2 = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount2(inputAmount)
    }

    const updateWalletAmount3 = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount3(inputAmount)
    }

    const updateWalletAmount4 = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount4(inputAmount)
    }

    /*********** FOR POOL 1 ***********/
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
        console.log("checkAndStakeSSGT")
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
                sendApproveAllowance(process.env.REACT_APP_DAO1_USDT_SAFESWAP_FARMING_ADDRESS, BigNumber.from(2).pow(256).sub(1))
            }
        }
        else{
            // Show error to user
            setWalletAmount('')
            dispatch(errorModalAction(true, "Not enough balance to Deposit!"))
        }
    }

    const stakeSSGT = () => {
        console.log(utils.parseUnits(walletAmount, 18))
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

    /*********** FOR POOL 2 ***********/
    const checkAndUnStakeSSGT2 = () => {
        if(walletAmount2>0){
            dispatch(unStakeModalAction(false, selector))
            dispatch(unStakingInProgress())
            withdrawSSGT2(utils.parseUnits(walletAmount2, 18))
        }
    }

    useEffect(() => {
        console.log(withdrawSSGTFunctionState2)
        if(withdrawSSGTFunctionState2 && withdrawSSGTFunctionState2.status == "Success"){
            setWalletAmount2('')
            dispatch(unStakingSucess())
        }else if(withdrawSSGTFunctionState2 && withdrawSSGTFunctionState2.status == "Exception"){
            setWalletAmount2('')
            dispatch(unStakingFailed())
            dispatch(errorModalAction(true, withdrawSSGTFunctionState2.errorMessage))
        }
    },[withdrawSSGTFunctionState2])

    const checkAndStakeSSGT2 = () => {
        // Check allowance, if allowance > 0 && < entered amount then proceed
        console.log("checkAndStakeSSGT2")
        if(walletAmount2 <= walletBalance2){
            if (parseFloat(allowance2) > 0 && parseFloat(allowance2) > walletAmount2){
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                stakeSSGT2()
            }
            else{
                // Else call approve allowance
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                sendApproveAllowance2(process.env.REACT_APP_DAO1_USDT_UNISWAP_FARMING_ADDRESS, BigNumber.from(2).pow(256).sub(1))
            }
        }
        else{
            // Show error to user
            setWalletAmount2('')
            dispatch(errorModalAction(true, "Not enough balance to Deposit!"))
        }
    }

    const stakeSSGT2 = () => {
        console.log(utils.parseUnits(walletAmount2, 18))
        depositSSGT2(utils.parseUnits(walletAmount2, 18))
    }

    useEffect(() => {
        // handle state
        console.log(approveAllowanceFunctionState2)
        if(approveAllowanceFunctionState2 && approveAllowanceFunctionState2.status == "Success"){
            stakeSSGT2()
        }else if(approveAllowanceFunctionState2 && approveAllowanceFunctionState2.status == "Exception"){
            setWalletAmount2('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, approveAllowanceFunctionState2.errorMessage))
        }
    },[approveAllowanceFunctionState2])

    useEffect(() => {
        // handle state
        console.log(depositSSGTFunctionState2)
        if(depositSSGTFunctionState2 && depositSSGTFunctionState2.status == "Success"){
            setWalletAmount2('')
            dispatch(stakingSucess())
        }else if(depositSSGTFunctionState2 && depositSSGTFunctionState2.status == "Exception"){
            setWalletAmount2('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, depositSSGTFunctionState2.errorMessage))
        }
    },[depositSSGTFunctionState2])

    const checkAndHarvest2 = () => {
        console.log("checkAndHarvest")
        dispatch(harvestingInProgress())
        harvest2()
    }

    useEffect(() => {
        // handle state
        console.log(harvestFunctionState2)
        if(harvestFunctionState2 && harvestFunctionState2.status == "Success"){
            dispatch(harvestingSuccess())
        }else if(harvestFunctionState2 && harvestFunctionState2.status == "Exception"){
            setWalletAmount2('')
            dispatch(harvestingFailed())
            dispatch(errorModalAction(true, harvestFunctionState2.errorMessage))
        }
    },[harvestFunctionState2])

    /*********** FOR POOL 3 ***********/
    const checkAndUnStakeSSGT3 = () => {
        if(walletAmount3>0){
            dispatch(unStakeModalAction(false, selector))
            dispatch(unStakingInProgress())
            withdrawSSGT3(utils.parseUnits(walletAmount3, 18))
        }
    }

    useEffect(() => {
        console.log(withdrawSSGTFunctionState3)
        if(withdrawSSGTFunctionState3 && withdrawSSGTFunctionState3.status == "Success"){
            setWalletAmount3('')
            dispatch(unStakingSucess())
        }else if(withdrawSSGTFunctionState3 && withdrawSSGTFunctionState3.status == "Exception"){
            setWalletAmount3('')
            dispatch(unStakingFailed())
            dispatch(errorModalAction(true, withdrawSSGTFunctionState3.errorMessage))
        }
    },[withdrawSSGTFunctionState3])

    const checkAndStakeSSGT3 = () => {
        // Check allowance, if allowance > 0 && < entered amount then proceed
        console.log("checkAndStakeSSGT3")
        if(walletAmount3 <= walletBalance3){
            if (parseFloat(allowance3) > 0 && parseFloat(allowance3) > walletAmount3){
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                stakeSSGT3()
            }
            else{
                // Else call approve allowance
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                sendApproveAllowance3(process.env.REACT_APP_YFDAI_USDT_UNISWAP_FARMING_ADDRESS, BigNumber.from(2).pow(256).sub(1))
            }
        }
        else{
            // Show error to user
            setWalletAmount3('')
            dispatch(errorModalAction(true, "Not enough balance to Deposit!"))
        }
    }

    const stakeSSGT3 = () => {
        console.log(utils.parseUnits(walletAmount3, 18))
        depositSSGT3(utils.parseUnits(walletAmount3, 18))
    }

    useEffect(() => {
        // handle state
        console.log(approveAllowanceFunctionState3)
        if(approveAllowanceFunctionState3 && approveAllowanceFunctionState3.status == "Success"){
            stakeSSGT3()
        }else if(approveAllowanceFunctionState3 && approveAllowanceFunctionState3.status == "Exception"){
            setWalletAmount3('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, approveAllowanceFunctionState3.errorMessage))
        }
    },[approveAllowanceFunctionState3])

    useEffect(() => {
        // handle state
        console.log(depositSSGTFunctionState3)
        if(depositSSGTFunctionState3 && depositSSGTFunctionState3.status == "Success"){
            setWalletAmount3('')
            dispatch(stakingSucess())
        }else if(depositSSGTFunctionState3 && depositSSGTFunctionState3.status == "Exception"){
            setWalletAmount('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, depositSSGTFunctionState3.errorMessage))
        }
    },[depositSSGTFunctionState3])

    const checkAndHarvest3 = () => {
        console.log("checkAndHarvest")
        dispatch(harvestingInProgress())
        harvest3()
    }

    useEffect(() => {
        // handle state
        console.log(harvestFunctionState3)
        if(harvestFunctionState3 && harvestFunctionState3.status == "Success"){
            dispatch(harvestingSuccess())
        }else if(harvestFunctionState3 && harvestFunctionState3.status == "Exception"){
            setWalletAmount3('')
            dispatch(harvestingFailed())
            dispatch(errorModalAction(true, harvestFunctionState3.errorMessage))
        }
    },[harvestFunctionState3])

    /*********** FOR POOL 4 ***********/
    const checkAndUnStakeSSGT4 = () => {
        if(walletAmount4>0){
            dispatch(unStakeModalAction(false, selector))
            dispatch(unStakingInProgress())
            withdrawSSGT4(utils.parseUnits(walletAmount4, 18))
        }
    }

    useEffect(() => {
        console.log(withdrawSSGTFunctionState4)
        if(withdrawSSGTFunctionState4 && withdrawSSGTFunctionState4.status == "Success"){
            setWalletAmount4('')
            dispatch(unStakingSucess())
        }else if(withdrawSSGTFunctionState4 && withdrawSSGTFunctionState4.status == "Exception"){
            setWalletAmount4('')
            dispatch(unStakingFailed())
            dispatch(errorModalAction(true, withdrawSSGTFunctionState4.errorMessage))
        }
    },[withdrawSSGTFunctionState4])

    const checkAndStakeSSGT4 = () => {
        // Check allowance, if allowance > 0 && < entered amount then proceed
        console.log("checkAndStakeSSGT3")
        if(walletAmount4 <= walletBalance4){
            if (parseFloat(allowance4) > 0 && parseFloat(allowance4) > walletAmount4){
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                stakeSSGT4()
            }
            else{
                // Else call approve allowance
                dispatch(stakingInProgress())
                dispatch(modalAction(false, selector))
                sendApproveAllowance4(process.env.REACT_APP_DAO1_DAI_VAULT_ADDRESS, BigNumber.from(2).pow(256).sub(1))
            }
        }
        else{
            // Show error to user
            setWalletAmount4('')
            dispatch(errorModalAction(true, "Not enough balance to Deposit!"))
        }
    }

    const stakeSSGT4 = () => {
        console.log(utils.parseUnits(walletAmount4, 18))
        depositSSGT4(utils.parseUnits(walletAmount4, 18))
    }

    useEffect(() => {
        // handle state
        console.log(approveAllowanceFunctionState4)
        if(approveAllowanceFunctionState4 && approveAllowanceFunctionState4.status == "Success"){
            stakeSSGT4()
        }else if(approveAllowanceFunctionState4 && approveAllowanceFunctionState4.status == "Exception"){
            setWalletAmount4('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, approveAllowanceFunctionState4.errorMessage))
        }
    },[approveAllowanceFunctionState4])

    useEffect(() => {
        // handle state
        console.log(depositSSGTFunctionState4)
        if(depositSSGTFunctionState4 && depositSSGTFunctionState4.status == "Success"){
            setWalletAmount4('')
            dispatch(stakingSucess())
        }else if(depositSSGTFunctionState4 && depositSSGTFunctionState4.status == "Exception"){
            setWalletAmount('')
            dispatch(stakingFailed())
            dispatch(errorModalAction(true, depositSSGTFunctionState4.errorMessage))
        }
    },[depositSSGTFunctionState4])

    const checkAndHarvest4 = () => {
        console.log("checkAndHarvest")
        dispatch(harvestingInProgress())
        harvest4()
    }

    useEffect(() => {
        // handle state
        console.log(harvestFunctionState4)
        if(harvestFunctionState4 && harvestFunctionState4.status == "Success"){
            dispatch(harvestingSuccess())
        }else if(harvestFunctionState4 && harvestFunctionState4.status == "Exception"){
            setWalletAmount4('')
            dispatch(harvestingFailed())
            dispatch(errorModalAction(true, harvestFunctionState4.errorMessage))
        }
    },[harvestFunctionState4])

    const renderPool1 = () => {
        return <FarmingCard
            title="DAO1"
            uniqueKey="1"
            tokenName="DAO1-USDT SAFESWAP LP" 
            alloc="100 DAO1/Day"
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked1} 
            tokenEarned={tokenEarned1} 
            logo={StakeLogo1}
            linkUrl="https://safeswap.yfdai.finance/#/add/0xCE3f6f6672616c39D8B6858F8DAC9902eCa42C84/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            lockInPeriod="30 Days"
            lockIn={30}
            isNFTEnabled={false} 
            allowance = {allowance}
            walletBalance = {walletBalance}
            walletAmount = {walletAmount}
            usdRate = {usdRate}
            usdDAO1Rate = {usdDAO1Rate}
            usdUSDTRate = {usdUSDTRate}
            showLiquidity = {true}
            tokenDao1 = {tokenDao1}
            tokenUSDT1 = {tokenUSDT1}
            updateWalletAmount = {updateWalletAmount}
            checkAndStakeSSGT = {checkAndStakeSSGT}
            checkAndUnStakeSSGT = {checkAndUnStakeSSGT}
            checkAndHarvest = {checkAndHarvest}
            >
        </FarmingCard>
    }

    const renderPool2 = () => {
        return <FarmingCard
            title="DAO1"
            uniqueKey="2"
            tokenName="DAO1-USDT UNISWAP LP"
            alloc="30 DAO1/Day" 
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked2} 
            tokenEarned={tokenEarned2} 
            logo={StakeLogo1}
            linkUrl="https://app.uniswap.org/#/add/v2/0xCE3f6f6672616c39D8B6858F8DAC9902eCa42C84/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            lockInPeriod="30 Days"
            lockIn={30}
            isNFTEnabled={false} 
            allowance = {allowance2}
            walletBalance = {walletBalance2}
            walletAmount = {walletAmount2}
            usdRate = {usdRate}
            usdDAO1Rate = {usdDAO1Rate}
            usdUSDTRate = {usdUSDTRate}
            showLiquidity = {true}
            tokenDao1 = {tokenDao2}
            tokenUSDT1 = {tokenUSDT2}
            updateWalletAmount = {updateWalletAmount2}
            checkAndStakeSSGT = {checkAndStakeSSGT2}
            checkAndUnStakeSSGT = {checkAndUnStakeSSGT2}
            checkAndHarvest = {checkAndHarvest2}
            >
        </FarmingCard>
    }

    const renderPool3 = () => {
        return <FarmingCard
            title="DAO1"
            uniqueKey="3"
            tokenName="YFDAI-WETH UNISWAP LP"
            alloc="60 DAO1/Day"
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked3} 
            tokenEarned={tokenEarned3} 
            logo={StakeLogo1}
            linkUrl="https://app.uniswap.org/#/add/v2/0xf4CD3d3Fda8d7Fd6C5a500203e38640A70Bf9577/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            lockInPeriod="60 Days"
            lockIn={60}
            isNFTEnabled={false} 
            allowance = {allowance3}
            walletBalance = {walletBalance3}
            walletAmount = {walletAmount3}
            usdRate = {usdRate}
            usdDAO1Rate = {usdYFDAIRate}
            usdUSDTRate = {usdWETHRate}
            showLiquidity = {true}
            tokenDao1 = {tokenDao3}
            tokenUSDT1 = {tokenUSDT3}
            updateWalletAmount = {updateWalletAmount3}
            checkAndStakeSSGT = {checkAndStakeSSGT3}
            checkAndUnStakeSSGT = {checkAndUnStakeSSGT3}
            checkAndHarvest = {checkAndHarvest3}
            >
        </FarmingCard>
    }

    const renderPool4 = () => {
        return <FarmingCard
            title="DAO1"
            uniqueKey="4"
            tokenName="DAI VAULT"
            alloc="45 DAO1/Day"
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked4} 
            tokenEarned={tokenEarned4} 
            logo={StakeLogo1}
            linkUrl=""
            lockInPeriod="120 Days"
            lockIn={120}
            isNFTEnabled={false} 
            allowance = {allowance4}
            walletBalance = {walletBalance4}
            walletAmount = {walletAmount4}
            usdRate = {usdRate}
            usdDAO1Rate = {usdYFDAIRate}
            usdUSDTRate = {usdWETHRate}
            showLiquidity = {false}
            tokenDao1 = {tokenDao4}
            tokenUSDT1 = {tokenUSDT4}
            updateWalletAmount = {updateWalletAmount4}
            checkAndStakeSSGT = {checkAndStakeSSGT4}
            checkAndUnStakeSSGT = {checkAndUnStakeSSGT4}
            checkAndHarvest = {checkAndHarvest4}
            >
        </FarmingCard>
    }

    return( 
        <>
            {renderPool1()}
            {renderPool2()}
            {renderPool3()}
            {renderPool4()}
        </>
    )
}

export default Farming;