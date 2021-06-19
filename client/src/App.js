import ConnectWallet from './pages/connectWallet';
import Staking from './pages/staking';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Farming from './pages/farming';
import SafeTrade from './pages/safetrade';
import SafeSwap from './pages/safeswap';
import LaunchPad from './pages/launchpad';


function App() {
 return (
    <div className="App" >
      <BrowserRouter>
        <Switch>
          <Route path='/' component={ConnectWallet} exact />
          <Route path='/farming' component={Staking} />
          <Route path='/staking' component={Farming} />
          <Route path='/safeswap' component={SafeSwap} />
          <Route path='/safetrade' component={SafeTrade} />
          <Route path='/launchpad' component={LaunchPad} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
