import React, { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { inandout } from '../actions/sidebarAction';
import { connectionAction } from '../actions/connectionAction';
import WalletLogo from '../assets/Vector.png';
import {useHistory} from 'react-router-dom';
import { useEthers, shortenAddress } from '@usedapp/core'
import MakeQuerablePromise from '../utils/querable-promise'

const Navbar = () => {
    const { account, error, deactivate, activateBrowserWallet } = useEthers()
    
    const dispatch = useDispatch();
    const history = useHistory();
    const isConnected = useSelector((state) => state.connectionReducer)

    let navbarName = window.location.pathname.split('/').join('');
    if (navbarName === '' || navbarName.toLowerCase() === 'farming'){
        navbarName = 'Farming'
    }
    if (navbarName === 'staking'){
        navbarName = 'Staking'
    }
    const SideBar = () => {
        dispatch(inandout(true))
    }

    const activateWallet = async () => {
        const activateBrowserWalletPromise = MakeQuerablePromise(activateBrowserWallet())       
        activateBrowserWalletPromise.then(
            function() {
                if(activateBrowserWalletPromise.isFulfilled()){
                    dispatch(connectionAction(true))
                }
            },
            function() { 
                /* code if some error */ 
                dispatch(connectionAction(false))
            }
        );
    }

    const deactivateWallet = () => {
        deactivate()
        dispatch(connectionAction(false))
    }

    useEffect(() => {
        if (error) {
            // show error to user if user denied connection request
            console.log(error)
            dispatch(connectionAction(false))
        }
    }, [error])

    useEffect(() => {
        console.log("isConnected", isConnected)
        if ((!isConnected && navbarName === 'Farming')){
            history.push("/") 
        }
    }, [isConnected, account])

    useEffect(() => {
        if (!account) {
            // show error to user if user denied connection request
            dispatch(connectionAction(false))
        }
    }, [account])

    return (
        <div className="navbar-main">
            <div className="navbar-name">
                <div className ="burger" onClick={SideBar}>
                    <div className="burger-icon"></div>
                    <div className="burger-icon"></div>
                    <div className="burger-icon"></div>
                </div>
                <p>{navbarName}</p>
            </div>
            <div className="connection">
                {isConnected && <div className="details"><img src={WalletLogo} alt="" /><p>{account && shortenAddress(account)}</p></div>}
                {!isConnected && <button onClick={activateWallet}>Connect Wallet</button>}
                {isConnected && <button onClick={deactivateWallet}>Disconnect Wallet</button>} 
            </div>
        </div>
    )
}


export default Navbar;