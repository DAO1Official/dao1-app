import React from 'react'
import {modalAction, unStakeModalAction, nftModalAction} from '../actions/modalAction'
import {useDispatch,useSelector} from 'react-redux'
import {staked, unStaked} from '../actions/stakedAction'
import StakeAdder from '../components/stakeadder'
import StakeWithdraw from '../components/stakeWithdraw'
import Errorbox from '../components/errorbox'
import MintNFT from '../components/mintNFT'
import Loading from '../assets/loading.png'
import InfoIcon from '../assets/infoIcon.png'

const StakeCard = (props) => {
    //console.log(props)
    const stakingTransactionState = useSelector((state) => state.stakingReducer.stakingTransactionState)
    const unStakingTransactionState = useSelector((state) => state.stakingReducer.unStakingTransactionState)
    const nftClaimTransactionState = useSelector((state) => state.stakingReducer.nftClaimTransactionState)
    const harvestTransactionState = useSelector((state) => state.stakingReducer.harvestTransactionState)
    
    const dispatch = useDispatch();
    const stake = () =>{
        dispatch(modalAction(true, props.title))
    }
    const unStake = () => {
        dispatch(unStakeModalAction(true,props.title))
    }
    const mintNFT = () => {
        dispatch(nftModalAction(true,props.title))
    }

    const selector = useSelector((state) => state.stakedReducer.stake)
    const unStakeSelector = useSelector((state) => state.stakedReducer.unStake)
    const modalStatus = useSelector((state) => state.modalReducer.value);
    const unStakeModalStatus = useSelector((state) => state.modalReducer.unStakeModal);
    const nftModalStatus = useSelector((state) => state.modalReducer.nftModal);
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

    const getEquivalentUSDRate = (value) => {
        return +(props.usdRate * value).toFixed(2)
    }

    return(
        <div className='stake-cards'>
            <div className="stack-cards-child">
            <div className = "stake-title">
                <img src={props.logo} alt="" />
                <p className="stake-name">
                Stake {props.title}
                </p>
            </div>
            <div className = "stake-details">
                <div className="apy value">
                    <p>APY</p>
                    <p className="percent">{props.percent}%</p>
                </div>
                <div className="apy staked">
                    <p>TOTAL STAKED</p>
                    <p className="percent">${getEquivalentUSDRate(props.totalstaked)}</p>
                </div>
                <div className="apy stakes">
                    <p>TOTAL STAKERS</p>
                    <p className="percent">{props.totalstakers}</p>
                </div>
            </div>
            <div className="stake-buttons">
                <div className="stake-values">
                    <p>{props.title} STAKED</p>
                    {props.isNFTEnabled ? <p>{props.ssgtStaked+props.totalNftTokens}</p> : <p>{props.ssgtStaked}</p>}
                    <span className="usd-eq">{props.isNFTEnabled ? <p>~{getEquivalentUSDRate(props.ssgtStaked+props.totalNftTokens)} USD</p> : <p>~{getEquivalentUSDRate(props.ssgtStaked)} USD</p>}</span>
                </div>
                {
                <div className="stake-button">
                    { unStakingTransactionState === 'IN_PROGRESS' ? <div className="loading"><img src={Loading} alt="" /><p>Unstaking in progress...</p></div> : <div className="btn">
                    { (stakingTransactionState === 'IN_PROGRESS' || nftClaimTransactionState === 'IN_PROGRESS') ? <button disabled onClick={unStake}>Unstake&nbsp;&nbsp;&nbsp;-</button> : <button onClick={unStake}>Unstake&nbsp;&nbsp;&nbsp;-</button>}
                    </div>
                    }
                    { stakingTransactionState === 'IN_PROGRESS' ? <div className="loading"><img src={Loading} alt="" /><p>Staking in progress...</p></div> : <div className="btn">
                    { (unStakingTransactionState === 'IN_PROGRESS' || nftClaimTransactionState === 'IN_PROGRESS') ? <button disabled onClick={stake}>Stake&nbsp;&nbsp;&nbsp;+</button> : <button onClick={stake}>Stake&nbsp;&nbsp;&nbsp;+</button>}
                    </div>}
                </div>
                }
            </div>
            <div className="stake-earned">
                <div className="stake-values">
                    <p>{props.title} EARNED</p>
                    <p>{props.ssgtEarned}</p>
                    <span className="usd-eq"><p>~{getEquivalentUSDRate(props.ssgtEarned)} USD</p></span>
                </div>
                <div className="stake-button">
                    {harvestTransactionState === 'IN_PROGRESS' ?
                    <div className="loader"><img src={Loading} alt=""/><div className="transaction-text"><p>Harvesting in progress...</p><a href="#">View transaction</a></div></div> :
                    <button onClick={props.checkAndHarvest}>Harvest</button>
                    }
                </div>
            </div>
            </div>
            {props.isNFTEnabled && <div className="stake-nft-view">
                <div className="stake-nft-title"><p>NFT's</p><a href="#" className="info-icon"><img src={InfoIcon} alt="" /></a></div>
                <div className="stake-nft-desc"><p>For every 2500 SSGT staked you are eligible to own 1 NFT allowing you
                    to <span><a href="#">vote on our proposals</a></span></p></div>
                <div className="stake-nft-mint">
                    <div className="stake-nft-container">
                        <div>
                            <p className="stake-value-title">OWNED</p>
                            {props.ownedNFT != 0 ? <p className="stake-value">{props.ownedNFT}</p> : <p className="stake-value-disabled">{props.ownedNFT}</p>}
                        </div>
                    </div>
                    <div className="stake-buttons">
                        {nftClaimTransactionState === 'IN_PROGRESS' ? 
                        <div className="loader"><img src={Loading} alt=""/><div className="transaction-text"><p>Transaction in progress...</p><a>View transaction</a></div></div> :
                        <div className="stake-button">
                        <div className="btn">
                        { (unStakingTransactionState === 'IN_PROGRESS' || stakingTransactionState === 'IN_PROGRESS') ? <button disab onClick={mintNFT} className="stake-button">Claim {props.title}</button> : <button onClick={mintNFT} className="stake-button">Claim {props.title}</button>}
                        </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
            }
            {modalStatus === true ? 
                <StakeAdder 
                    title={props.title}
                    logo={props.logo}
                    allowance={props.allowance}
                    walletBalance={props.walletBalance}
                    walletAmount={props.walletAmount}
                    updateWalletAmount={props.updateWalletAmount}
                    checkAndStakeSSGT={props.checkAndStakeSSGT}
                    >
                </StakeAdder> 
                
                : ''}
            {unStakeModalStatus === true ? 
                <StakeWithdraw 
                    title={props.title} 
                    logo={props.logo} 
                    ssgtStaked={props.ssgtStaked}
                    walletAmount={props.walletAmount}
                    updateWalletAmount={props.updateWalletAmount} 
                    checkAndUnStakeSSGT={props.checkAndUnStakeSSGT}
                    /> : ''}
            {nftModalStatus === true ? 
                <MintNFT 
                    isApprovedForNft={props.isApprovedForNftClaim}
                    title={props.title} 
                    logo={props.logo}
                    selectedTokenList={props.selectedTokenList}
                    updateTokenIdList={props.updateTokenIdList}
                    checkAndclaimSSGT={props.checkAndclaimSSGT}
                    tokenList={props.tokenList}
                />
                : ''
            }
            {errorModalStatus === true? <Errorbox errorMessage={errorModalMessage}></Errorbox>: ''}
        </div>
    )
}

export default StakeCard;