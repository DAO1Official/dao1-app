import React from 'react'
import ReactDOM from 'react-dom'
import './sass/index.scss'
import App from './App'
import { createStore} from 'redux'
import { Provider} from 'react-redux'
import { rootReducer } from './reducers'
import { DAppProvider } from '@usedapp/core'
import {ChainId} from '@usedapp/core'

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const config = {
  supportedChains:[ChainId.Mainnet, ChainId.Rinkeby, ChainId.Polygon, ChainId.Mumbai]
}

ReactDOM.render(
    <Provider store={store}>
      <DAppProvider>
        <App />
      </DAppProvider>
    </Provider>,
  document.getElementById('root')
);