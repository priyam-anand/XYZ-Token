import React, { useState, useEffect } from 'react'
import { getWeb3 } from "./util.js"
import Token from "./contracts/Token.json"
import Vesting from "./contracts/Vesting.json";
import Loading from "./components/Loading/Loading"
import "./App.css";
import Navbar from './components/Navbar/Navbar.jsx';
import Add from "./components/Add/Add"
import Card from './components/Card/Card.jsx';
const App = () => {

  const [web3, setWeb3] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [vesting, setVesting] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [allAccounts, setAllAccounts] = useState([]);
  const [isAccountSet, setIsAccountSet] = useState(undefined);
  const [tokenAddress,setTokenAddress] = useState(undefined);
  const [change,setChange] = useState(1);
  const isReady = () => {
    return (
      typeof token !== 'undefined'
      && typeof vesting !== 'undefined'
      && typeof web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof isAccountSet !== 'undefined'
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
      const isAccSet = await vestingContract.methods.isAccountsSet().call();

      setWeb3(web3);
      setTokenAddress(tokenNetwork.address);
      setAccounts(accounts);
      setVesting(vestingContract);
      setToken(tokenContract);
      setIsAccountSet(isAccSet);
    }
    init();
  }, [])

  useEffect(()=>{
    const getAdd = async () => {
      const data = await vesting.methods.getAddresses().call();
      setAllAccounts(data);
    }
    if(isAccountSet)
    {
      getAdd();
    }
  },[isAccountSet])

  const addTokenAddress = async (e) => {
    e.preventDefault();
    await vesting.methods.setTokenAddress(tokenAddress).send({from:accounts[0]});
  }

  const handleWithdraw = async (e) => {
    e.preventDefault();
    await vesting.methods.withdraw().send({from:accounts[0]});
    setChange(change * -1);
  }

  if (!isReady()) {
    return <Loading />;
  }

  return (
    <div>

      <Navbar />

      {
        isAccountSet ?
          null
          : (
            <>
              <div className="container set-token my-2">
                <button className='btn btn-primary btn-lg' onClick={addTokenAddress}>
                  Initialize
                </button>
              </div>
              <Add vesting={vesting} account={accounts[0]} setIsAccountSet={setIsAccountSet}/>
            </>
          )
      }

      {
        isAccountSet ?
          (<>
            <div className="container mt-4">
              <div className="row">
                {
                  allAccounts.map((data,index) => {
                  return <Card data={data} token={token} key={index} web3={web3} change={change}/>
                })
                }
              </div>
            </div>

            <div className="container set-token my-2">
              <button className='btn btn-primary btn-lg' onClick={handleWithdraw}>
                Withdraw
              </button>
            </div>
          </>)
          : null
      }
    </div>
  )
}

export default App
