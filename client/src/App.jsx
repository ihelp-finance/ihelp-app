import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link  } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Contract, GasGauge, Header, ThemeSwitch } from "./components";
import { GOOGLEANALYTICS_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useGasPrice,
  useOnBlock,
  useUserSigner,
} from "./hooks";
// import Hints from "./Hints";
import ReactGA from "react-ga4";
import { Contribute,Dashboard,Leaderboard,Stake,Charity,Login,CharityAccount } from "./views";

const { ethers } = require("ethers");

if (GOOGLEANALYTICS_ID != undefined && GOOGLEANALYTICS_ID != '') {
  ReactGA.initialize(GOOGLEANALYTICS_ID);
  ReactGA.send(window.location.pathname + window.location.search);
}

const targetNetwork = NETWORKS[ process.env.REACT_APP_NETWORK || 'localhost' ];
console.log('DEPLOYED NETWORK:',process.env.REACT_APP_NETWORK);

document.title = `iHelp (${targetNetwork.name.replace('host','').charAt(0).toUpperCase() + targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;

if (process.env.NODE_ENV === 'production') {
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.debug = () => {}
}

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false;

// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
//const scaffoldEthProvider = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;

const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider(targetNetwork.rpcUrl) : null;

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: 'coinbase',
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(
    localProviderUrl,
    43114,
);

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: 'avalanche', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme:"light", // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        bridge: "https://bridge.walletconnect.org",
        // infuraId: INFURA_ID,
        rpc: {
          1:process.env.REACT_APP_RPC_URL, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          42: process.env.REACT_APP_RPC_URL,
          43114:process.env.REACT_APP_RPC_URL,
          100:process.env.REACT_APP_RPC_URL,
        },
      },
    },
    // torus: {
    //   package: Torus,
    // },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        //description: 'Coinbase Wallet',
      },
      package: walletLinkProvider,
      connector: async (provider, options) => {
        await provider.enable();
        return provider;
      },
    },
  },
});



function App(props) {
  
  const mainnetProvider = mainnetInfura // scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000");
  const [loaded, setLoaded] = useState(false);

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if(injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function"){
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");
  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userSigner = useUserSigner(injectedProvider, localProvider, USE_BURNER_WALLET);

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
    
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  // const faucetTx = Transactor(localProvider, gasPrice);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, { chainId: localChainId });
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });
  
 // if (targetNetwork.name.indexOf("local") !== -1) {
   // const mainnetContracts = useContractLoader(mainnetProvider, { chainId: localChainId });
//  }
  
  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  
  useEffect(() => {
    if (
      DEBUG &&
      mainnetProvider &&
      address &&
      selectedChainId &&
      readContracts &&
      writeContracts
    ) {
      console.log("_____________________________________ IHELP DAPP _____________________________________");
      //console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      //console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      //console.log("💵 yourMainnetBalance", yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : "...");
      console.log("📝 contracts", readContracts);
      //console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      //console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      //console.log("🔐 writeContracts", writeContracts);
      
      // setTimeout(()=>{
         setLoaded(true);
      // },5000)

    }
  }, [
    mainnetProvider,
    address,
    selectedChainId,
    readContracts,
    writeContracts,
  ]);

  let networkDisplay = "";
  
  // console.log('NETWORKCHECK',NETWORKCHECK,localChainId,selectedChainId)
  
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId != selectedChainId) {
    
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 200000, position: "absolute", right: 0, top: 0, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network ID"
            description={
              <div>
                You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
                HardHat.
                <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    } else {
      
      console.log('WRONG NETWORK')
      
      networkDisplay = (
        <div className="wrongNetwork">
          <Alert
            //message="⚠️ Wrong Network"
            style={{backgroundColor:'#F35454', border:'0px',color:'white',textAlign:'center'}}
            description={
              <div style={{color:'white',fontSize:'18px'}}>
                <b style={{color:'white'}}>{networkSelected && networkSelected.name.toUpperCase()}</b> is not supported. Please switch to{" "}
                <Button
                  style={{}}
                  onClick={async () => {
                  
                  /*
                    const ethereum = window.ethereum;
                    const data = [
                      {
                        chainId: "0x" + targetNetwork.chainId.toString(16),
                        chainName: targetNetwork.name,
                        nativeCurrency: targetNetwork.nativeCurrency,
                        rpcUrls: [targetNetwork.rpcUrl],
                        blockExplorerUrls: [targetNetwork.blockExplorer],
                      },
                    ];
                    console.log("data", data);
                    const tx = await ethereum.request({ method: "wallet_addEthereumChain", params: data }).catch();
                    if (tx) {
                      console.log(tx);
                    }
                    */
                    
                    try {
                      if (targetNetwork == NETWORKS.localhost) {
                        window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '31337', chainName: 'iHelp Local', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://dev.ihelp.finance/rpc'], blockExplorerUrls: [] }] })
                      }
                      else if (targetNetwork == NETWORKS.avalanche) {
                        window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '43114', chainName: 'Avalanche Network', nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 }, rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'], blockExplorerUrls: ['https://snowtrace.io/'] }] })
                      }
                    }catch(e){}
                    
                    
                    
                  }}
                >
                  <b>{networkLocal && networkLocal.name.toUpperCase()}</b>
                </Button>
                .
              </div>
            }
            type="error"
            closable={false}
          />
        </div>
      );
    }
  } else {
    networkDisplay = (
      <div style={{ zIndex: 2000000, position: "fixed", right: 83, bottom: 3, padding: 16, fontStyle:'italic',color: targetNetwork.color }}>
        {targetNetwork.name} {process.env.REACT_APP_VERSION_TAG}
      </div>
    );
  }


   
  const updateValue = async(contracts, contractName, functionName, args) => {
    let newValue;
    if (args && args.length > 0) {
      newValue = await contracts[contractName][functionName](...args);
    }
    else {
      newValue = await contracts[contractName][functionName]();
    }
    return newValue;
  };
  
  const setValue = async(contractName, functionName, args, variable, callback) => {
    // useOnBlock(readContracts && readContracts[contractName] && readContracts[contractName].provider, () => {
    if (contractName == 'ETH') {
      
      const d = await localProvider.getBalance(address);
      if (d !== variable) {
        callback(d);
      }
      
    } else {

    if (readContracts && readContracts[contractName]) {
      updateValue(readContracts, contractName, functionName, args).then((d) => {

        if (d != variable) {
        
          callback(d);

        }
      })
    }
    }
    // });
  }

  const loadWeb3Modal = useCallback(async (force) => {
    
    // let c = null;
    // if (force != true) {
    //   c = prompt(`iHelp is currently in limited beta. Please enter the passcode for connect your ${targetNetwork.name} wallet and interact with the app.`)
    // } 
    // if (c == 'ihelpGO' || force == true) {
      
      const provider = await web3Modal.connect();
      
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
      
      provider.on("chainChanged", chainId => {
        console.log(`chain changed to ${chainId}! updating providers`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      provider.on("accountsChanged", () => {
        console.log(`account changed!`);
        setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });
  
      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        logoutOfWeb3Modal();
      });
    
    // }
    
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal(true);
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [faucetClicked, setFaucetClicked] = useState(false);
  
  const charityDecimals = {
    'DAI': 18,
    'USDC': 6
  }

  const params = {faucetAvailable,updateValue,setValue,charityDecimals,readContracts,writeContracts,tx,targetNetwork,web3Modal,loadWeb3Modal,address,localProvider,userSigner,mainnetProvider,logoutOfWeb3Modal,blockExplorer}
  
  return (
    <div className="App">
      {networkDisplay}
      <Router>
       <Switch>
          <Route exact path="/">
            <Contribute
              {...params}
            />  
          </Route>
          <Route exact path="/dashboard">
            <Dashboard
              {...params}
            />  
          </Route>
          <Route exact path="/stake">
            <Stake
              {...params}
            />  
          </Route>
          <Route exact path="/leaderboard">
            <Leaderboard
              {...params}
            />  
          </Route>
          <Route exact path="/charity/:id">
            <Charity
              {...params}
            />  
          </Route>
          <Route exact path="/login">
            <Login
              {...params}
            />  
          </Route>
          <Route exact path="/account">
            <CharityAccount
              {...params}
            />  
          </Route>
        </Switch>
      </Router>
      <ThemeSwitch />
      
    </div>
  );
}

export default App;
