import React, { useState, useEffect } from 'react'
import { getWeb3 } from "./util.js"
import Token from "./contracts/Token.json"
import Vesting from "./contracts/Vesting.json";
import Loading from "./components/Loading/Loading"
const App = () => {

  const [web3, setWeb3] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [vesting, setVesting] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);

  const isReady = () => {
    return (
      typeof token !== 'undefined'
      && typeof vesting !== 'undefined'
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
    );
  }

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const tokenNetwork = Token.networks[networkId];
      const vestingNetwork = Vesting.networks[networkId];
      if (tokenNetwork === undefined || vestingNetwork === undefined)
        throw new Error('Make sure you are on the corrent network. Set the network to Ropsten Test Network');
      const tokenContract = new web3.eth.Contract(
        Token.abi,
        tokenNetwork && tokenNetwork.address
      );
      const vestingContract = new web3.eth.Contract(
        Vesting.abi,
        vestingNetwork && vestingNetwork.address
      );

      setWeb3(web3);
      setAccounts(accounts);
      setVesting(vestingContract);
      setToken(tokenContract);
    }
    init();
  }, [])

  if (!isReady()) {
    return <Loading />;
  }

  return (
    <div>
      Home
    </div>
  )
}

export default App
