import React from 'react';
import {unStakeModalAction} from '../actions/modalAction';
import {useDispatch,useSelector} from 'react-redux'

const StakeWithdraw = (props) =>{
    const dispatch = useDispatch();
    const selector = useSelector((state) => state.modalReducer.title)
    const close = () =>{
        dispatch(unStakeModalAction(false,selector))
    }
    
    return(
        <div className="card-shadow">
            <div className="stake-adder-card">
                <div className="stake-header">
                    <p>Withdraw {props.title}</p>
                    <p onClick={close}>x</p>
                </div>
                <div className="balance">
                    <p>{props.tokenName.replace(/ *\([^)]*\)*/g, "")} Staked: {props.tokenStaked}</p>
                </div>
                <div className="add-on">
                    <div className="input-value">
                    <input type="text" placeholder={"Enter amount"} value={props.walletAmount} onChange={(e) => props.updateWalletAmount(e.target.value)} />
                    </div>
                    <input type="submit" value="MAX" onClick={() => props.updateWalletAmount(props.tokenStaked)}/>
                    <div className="stake-type">
                        <p>{props.tokenName.replace(/ *\([^)]*\)*/g, "")}</p>
                    </div>
                </div>
                <div className="button-stake">
                    {props.walletAmount === '' || (props.walletAmount && props.walletAmount.length ===  0)  ? <button disabled>Withdraw</button> : <button onClick={props.checkAndUnStakeSSGT}>Withdraw</button>}
                </div>
            </div>
        </div>
    )
}
export default StakeWithdraw;