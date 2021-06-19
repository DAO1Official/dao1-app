import React from 'react';
import {useDispatch} from 'react-redux'
import {errorModalAction} from '../actions/modalAction';
import AlertIcon from '../assets/alert-icon.png'

const Errorbox = ({errorMessage}) =>{
    const dispatch = useDispatch();
    const close = () =>{
        dispatch(errorModalAction(false))
    }

    return(
        <div className="card-shadow">
            <div className="stake-adder-card">
                <div className="stake-header">
                    <p>Error <img className="imgIcon" src={AlertIcon} alt="" /></p>
                    <p onClick={close}>x</p>
                </div>
                <div>
                    <p>{errorMessage}</p>
                </div>
            </div>
        </div>
    )
}
export default Errorbox;