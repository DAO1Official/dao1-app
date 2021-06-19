import React, { useEffect } from 'react'
import {modalAction, unStakeModalAction} from '../actions/modalAction'
import {useDispatch,useSelector} from 'react-redux'
import {staked, unStaked} from '../actions/stakedAction'
import StakeAdder from '../components/stakeadder'
import StakeWithdraw from '../components/stakeWithdraw'
import Errorbox from '../components/errorbox'
import Loading from '../assets/loading.png'
import { utils } from 'ethers'
import LinkIcon from '../assets/link_icon.png'
import { BigNumber } from '@ethersproject/bignumber'

const FarmingCard = (props) => {
    console.log("props", props)
    const stakingTransactionState = useSelector((state) => state.stakingReducer.stakingTransactionState)
    const unStakingTransactionState = useSelector((state) => state.stakingReducer.unStakingTransactionState)
    const harvestTransactionState = useSelector((state) => state.stakingReducer.harvestTransactionState)
    
    const dispatch = useDispatch();
    const stake = () =>{
        dispatch(modalAction(true, props.uniqueKey))
    }
    const unStake = () => {
        dispatch(unStakeModalAction(true,props.uniqueKey))
    }
    const selector = useSelector((state) => state.stakedReducer.stake)
    const unStakeSelector = useSelector((state) => state.stakedReducer.unStake)
    const modalStatus = useSelector((state) => state.modalReducer.value);
    const modalStatusKey = useSelector((state) => state.modalReducer.title);
    const unStakeModalStatus = useSelector((state) => state.modalReducer.unStakeModal);
    const unStakeModalStatusKey = useSelector((state) => state.modalReducer.title);
    const errorModalStatus = useSelector((state) => state.modalReducer.errorModal);
    const errorModalMessage = useSelector((state) => state.modalReducer.title);
    
    if (selector === true){
        setTimeout(function(){ 
            // setLoading(true)
            dispatch(staked(false))
         }, 4000);
    } 
    if(unStakeSelector === true){
        setTimeout(function(){
            dispatch(unStaked(false))
        }, 4000)
    }

    const getEquivalentUSDRate = (value, multiplier) => {
        return +(multiplier * value).toFixed(2)
    }

    const getNumberOfDays = () => {
        
        const date1 = new Date("06/11/2021");
        var todayDate = new Date().toISOString().slice(0, 10);
        const date2 = new Date(todayDate);
        
        // One day in milliseconds
        const oneDay = 1000 * 60 * 60 * 24;
    
        // Calculating the time difference between two dates
        const diffInTime = date2.getTime() - date1.getTime();
    
        // Calculating the no. of days between two dates
        const diffInDays = Math.round(diffInTime / oneDay);
    
        return diffInDays;
    }

    useEffect(()=>{
        console.log(getNumberOfDays())
    },[])

    return(
        <div className='stake-cards'>
            <div className="stack-cards-child">
            <div className = "stake-title">
                <img src={props.logo} alt="" />
                <p className="stake-name">
                {props.tokenName}
                {props.linkUrl !== "" ? 
                <a href={props.linkUrl} target="_blank"><img src={LinkIcon} className="link-img" alt="" /></a>
                : ''}
                </p>
            </div>
            <div className = "stake-details">
                <div className="apy value">
                    <p>Allocation</p>
                    <p className="percent" style={{fontSize:"12px"}}>{props.alloc}</p>
                </div>
                <div className="apy staked">
                    <p>TOTAL LIQUIDITY</p>
                    {props.showLiquidity ? 
                    <p className="percent">${getEquivalentUSDRate(props.tokenDao1, props.usdDAO1Rate)+getEquivalentUSDRate(props.tokenUSDT1, props.usdUSDTRate)}</p> :
                    <p className="percent">NA</p> }
                </div>
                <div className="apy stakes">
                    <p>LOCK</p>
                    <p className="percent">{props.lockInPeriod}</p>
                </div>
            </div>
            <div className="stake-buttons">
                <div className="stake-values">
                    <p>{props.tokenName.replace(/ *\([^)]*\)*/g, "")} STAKED</p>
                    {<p>{props.tokenStaked}</p>}
                </div>
                {
                <div className="stake-button">
                    { unStakingTransactionState === 'IN_PROGRESS' ? <div className="loading"><img src={Loading} alt="" /><p>Unstaking in progress...</p></div> : <div className="btn">
                    { (stakingTransactionState === 'IN_PROGRESS') ? <button disabled>Withdraw&nbsp;&nbsp;&nbsp;-</button> : (props.lockIn >= getNumberOfDays() ? <button disabled onClick={unStake}>Withdraw&nbsp;&nbsp;&nbsp;-</button> :<button onClick={unStake}>Withdraw&nbsp;&nbsp;&nbsp;-</button>)}
                    </div>
                    }
                    { stakingTransactionState === 'IN_PROGRESS' ? <div className="loading"><img src={Loading} alt="" /><p>Staking in progress...</p></div> : <div className="btn">
                    { (unStakingTransactionState === 'IN_PROGRESS') ? <button disabled>Deposit&nbsp;&nbsp;&nbsp;+</button> : <button onClick={stake}>Deposit&nbsp;&nbsp;&nbsp;+</button>}
                    </div>}
                </div>
                }
            </div>
            <div className="stake-earned">
                <div className="stake-values">
                    <p>{props.title} EARNED</p>
                    <p>{props.tokenEarned}</p>
                </div>
                <div className="stake-button">
                    {harvestTransactionState === 'IN_PROGRESS' ?
                    <div className="loader"><img src={Loading} alt=""/><div className="transaction-text"><p>Harvesting in progress...</p><a href="#">View transaction</a></div></div> :
                    <button onClick={props.checkAndHarvest}>Harvest</button>
                    }
                </div>
            </div>
            </div>
            {modalStatus === true &&  modalStatusKey===props.uniqueKey ? 
                <StakeAdder 
                    title={props.title}
                    logo={props.logo}
                    uniqueKey={props.uniqueKey}
                    tokenName={props.tokenName}
                    allowance={props.allowance}
                    walletBalance={props.walletBalance}
                    walletAmount={props.walletAmount}
                    updateWalletAmount={props.updateWalletAmount}
                    checkAndStakeSSGT={props.checkAndStakeSSGT}
                    >
                </StakeAdder> 
                
                : ''}
            {unStakeModalStatus === true &&  unStakeModalStatusKey===props.uniqueKey ?
                <StakeWithdraw 
                    title={props.title}
                    uniqueKey={props.uniqueKey}
                    tokenName={props.tokenName} 
                    logo={props.logo} 
                    ssgtStaked={props.ssgtStaked}
                    tokenStaked={props.tokenStaked}
                    walletAmount={props.walletAmount}
                    updateWalletAmount={props.updateWalletAmount} 
                    checkAndUnStakeSSGT={props.checkAndUnStakeSSGT}
                    /> : ''}
            {errorModalStatus === true? <Errorbox errorMessage={errorModalMessage}></Errorbox>: ''}
        </div>
    )
}

export default FarmingCard;