import {combineReducers} from 'redux';
import sideBarReducer from './sidebarReducer';
import modalReducer from './modalReducer';
import connectionReducer from './connectionReducer';
import stakedReducer from './stakedReducer';
import stakingReducer from './stakingReducer';



export const rootReducer = combineReducers(
    {
        sideBarReducer,
        modalReducer,
        connectionReducer,
        stakedReducer,
        stakingReducer
    }
);