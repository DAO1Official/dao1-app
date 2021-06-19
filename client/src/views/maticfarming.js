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
import { Contract } from '@ethersproject/contracts'

const MaticFarming = () => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.modalReducer.title)

    const [usdDAO1Rate, setUsdDAO1Rate] = useState(0)
    const [usdUSDTRate, setUsdUSDTRate] = useState(0)
    
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

    useEffect(async () => {   
        const usddao1rate = await getDAO1USDRate()
        const usdusdtrate = await getUSDTUSDRate()

        setUsdDAO1Rate(usddao1rate)
        setUsdUSDTRate(usdusdtrate)
    },[])
    
    const getDAO1USDRateURL = () => {
        return "https://api.coingecko.com/api/v3/simple/price?ids=DAO1&vs_currencies=USD"
    }

    const getUSDTUSDRateURL = () => {
        return "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=USD"
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

    const userBalance = useTokenBalance(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance)
        setWalletBalance(!!userBalance ? utils.formatEther(userBalance) : 0)
    },[userBalance])

    
    const userBalance2 = useTokenBalance(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS, account)
    useEffect(() => {
        console.log("userBalance", userBalance2)
        setWalletBalance2(!!userBalance2 ? utils.formatEther(userBalance2) : 0)
    },[userBalance2])

    useEffect(()=>{
        let lpTokenEarnedArray = []
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_60DAYS_FARMING_ADDRESS,account))
        lpTokenEarnedArray.push(lpTokenEarnedContractCall(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_30DAYS_FARMING_ADDRESS,account))
        
        setLpTokenEarnedContractAbis(lpTokenEarnedArray)

        let lpTokenStakedArray = []
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_60DAYS_FARMING_ADDRESS,account))
        lpTokenStakedArray.push(lpTokenStakedContractCall(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_30DAYS_FARMING_ADDRESS,account))
        
        setLpTokenStakedContractAbis(lpTokenStakedArray)

    },[])
    
    const lpTokenEarnedCall = useContractCalls(lpTokenEarnedContractAbis)
    const lpTokenStakedCall = useContractCalls(lpTokenStakedContractAbis)

    const balanceOfLPDAO1TokenCall = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_DAO1_MATIC_ADDRESS, process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS))
    const balanceOfLPUSDTTokenCall = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_USDT_MATIC_ADDRESS, process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS))
    const balanceOfLPDAO1TokenCall2 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_DAO1_MATIC_ADDRESS, process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS))
    const balanceOfLPUSDTTokenCall2 = useContractCall(balanceOfTokenContractCall(process.env.REACT_APP_USDT_MATIC_ADDRESS, process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS))
    
    const lpTokenNameCall = useContractCall(lpTokenNameContractCall(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS))

    useEffect(() => {
        setTokenEarned1(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[0] ? utils.formatUnits(lpTokenEarnedCall[0][0]._hex, 18) : 0) : 0)
        setTokenStaked1(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[0] ? utils.formatUnits(lpTokenStakedCall[0][0]._hex, 18) : 0) : 0)
        setTokenEarned2(lpTokenEarnedCall.length>0 ? (lpTokenEarnedCall[1] ? utils.formatUnits(lpTokenEarnedCall[1][0]._hex, 18) : 0) : 0)
        setTokenStaked2(lpTokenStakedCall.length>0 ? (lpTokenStakedCall[1] ? utils.formatUnits(lpTokenStakedCall[1][0]._hex, 18) : 0) : 0)

        setTokenDao1(balanceOfLPDAO1TokenCall ? utils.formatUnits(balanceOfLPDAO1TokenCall[0]._hex, 18) : 0)
        setTokenUSDT1(balanceOfLPUSDTTokenCall ? utils.formatUnits(balanceOfLPUSDTTokenCall[0]._hex, 18) : 0)
        setTokenDao2(balanceOfLPDAO1TokenCall2 ? utils.formatUnits(balanceOfLPDAO1TokenCall2[0]._hex, 18) : 0)
        setTokenUSDT2(balanceOfLPUSDTTokenCall2 ? utils.formatUnits(balanceOfLPUSDTTokenCall2[0]._hex, 18) : 0)
        
        //setTokenName(lpTokenNameCall?)
    }, [lpTokenEarnedCall,lpTokenStakedCall, lpTokenNameCall,
        balanceOfLPDAO1TokenCall, balanceOfLPUSDTTokenCall,
        balanceOfLPDAO1TokenCall2, balanceOfLPUSDTTokenCall2
        ])


    const farmingContract1 = new Contract(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_60DAYS_FARMING_ADDRESS, farmingAbiInterface)
    const farmingContract2 = new Contract(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_30DAYS_FARMING_ADDRESS, farmingAbiInterface)
    
    const tokenContract1 = new Contract(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS, tokenAbiInterface)
    const tokenContract2 = new Contract(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_LP_ADDRESS, tokenAbiInterface)

    const { state:depositSSGTFunctionState, send:depositSSGT } = useContractFunction(farmingContract1, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState, send:sendApproveAllowance } = useContractFunction(tokenContract1, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState, send:withdrawSSGT } = useContractFunction(farmingContract1, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState, send:harvest} = useContractFunction(farmingContract1, harvestFarmingTokenFunction)
    
    const { state:depositSSGTFunctionState2, send:depositSSGT2 } = useContractFunction(farmingContract2, stakeFarmingTokenFunction)
    const { state:approveAllowanceFunctionState2, send:sendApproveAllowance2 } = useContractFunction(tokenContract2, approveAllowanceFunction)
    const { state:withdrawSSGTFunctionState2, send:withdrawSSGT2 } = useContractFunction(farmingContract2, withdrawFarmingTokenFunction)
    const { state:harvestFunctionState2, send:harvest2} = useContractFunction(farmingContract2, harvestFarmingTokenFunction)
    
    
    const updateWalletAmount = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount(inputAmount)
    }

    const updateWalletAmount2 = (inputAmount) => {
        console.log("inputAmount", inputAmount)
        setWalletAmount2(inputAmount)
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
                sendApproveAllowance(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_60DAYS_FARMING_ADDRESS, BigNumber.from(2).pow(256).sub(1))
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
                sendApproveAllowance2(process.env.REACT_APP_DAO1_USDT_QUICKSWAP_30DAYS_FARMING_ADDRESS, BigNumber.from(2).pow(256).sub(1))
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

    const renderPool1 = () => {
        return <FarmingCard
            title="DAO1"
            uniqueKey="1"
            tokenName="DAO1-USDT QUICKSWAP LP" 
            alloc="100 DAO1/Day"
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked1} 
            tokenEarned={tokenEarned1} 
            logo={StakeLogo1}
            linkUrl="https://quickswap.exchange/#/add/0x3c5D1617C30BA71972adD4b0C9A6B9848f2afeeD/0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
            lockInPeriod="60 Days"
            lockIn={60}
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
            tokenName="DAO1-USDT QUICKSWAP LP"
            alloc="55 DAO1/Day" 
            aprRate={12.00} 
            totalstaked={parseFloat(totalStaked)} 
            totalstakers={totalStakers} 
            tokenStaked={tokenStaked2} 
            tokenEarned={tokenEarned2} 
            logo={StakeLogo1}
            linkUrl="https://quickswap.exchange/#/add/0x3c5D1617C30BA71972adD4b0C9A6B9848f2afeeD/0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
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

    return( 
        <>
            {renderPool1()}
            {renderPool2()}
        </>
    )
}

export default MaticFarming;