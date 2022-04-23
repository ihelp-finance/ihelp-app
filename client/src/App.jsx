import WalletConnectProvider from "@walletconnect/web3-provider";
//import Torus from "@toruslabs/torus-embed"
import WalletLink from "walletlink";
import { Alert, Button, Col, Menu, Row } from "antd";
import "antd/dist/antd.css";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link  } from "react-router-dom";
import Web3Modal from "web3modal";
import "./App.css";
import { Account, Contract, Faucet, GasGauge, Header, Ramp, ThemeSwitch } from "./components";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
import { Transactor } from "./helpers";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useEventListener,
  useExchangePrice,
  useGasPrice,
  useOnBlock,
  useUserSigner,
} from "./hooks";
// import Hints from "./Hints";

import { Contribute,Dashboard,Leaderboard,Stake,Charity,Login,CharityAccount } from "./views";

const { ethers } = require("ethers");

import ReactGA from "react-ga4";
ReactGA.initialize("G-LYM0H4VML6");
ReactGA.send(window.location.pathname + window.location.search);

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.avalanche; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
//const targetNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

document.title = `iHelp (${targetNetwork.name.replace('host','').charAt(0).toUpperCase() + targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false;

// 🛰 providers
//if (DEBUG) console.log("📡 Connecting to Rinkeby Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
//const scaffoldEthProvider = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544") : null;
//const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://rinkeby.infura.io/v3/" + INFURA_ID) : null;
//const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/UipRFhJQbBiZ5j7lbcWt46ex5CBjVBpW") : null;
const mainnetInfura = navigator.onLine ? new ethers.providers.StaticJsonRpcProvider("https://api.avax.network/ext/bc/C/rpc") : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I )

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

// Coinbase walletLink init
/*
const walletLink = new WalletLink({
  appName: 'coinbase',
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(
    `https://api.avax.network/ext/bc/C/rpc`,
    43114,
);
*/

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
          1:`https://mainnet.infura.io/v3/${INFURA_ID}`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          43114:`https://api.avax.network/ext/bc/C/rpc`, // mainnet // For more WalletConnect providers: https://docs.walletconnect.org/quick-start/dapps/web3-provider#required
          100:"https://dai.poa.network", // xDai
        },
      },
    },
    /*torus: {
      package: Torus,
    },
    'custom-walletlink': {
      display: {
        logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
        name: 'Coinbase',
        description: 'Connect to Coinbase Wallet (not Coinbase App)',
      },
      package: walletLinkProvider,
      connector: async (provider, options) => {
        await provider.enable();
        return provider;
      },
    },*/
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

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangePrice(targetNetwork, mainnetProvider);

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
  const faucetTx = Transactor(localProvider, gasPrice);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, { chainId: localChainId });

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, { chainId: localChainId });

 // if (targetNetwork.name.indexOf("local") !== -1) {
   const mainnetContracts = useContractLoader(mainnetProvider, { chainId: localChainId });
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
      console.log("📝 readContracts", readContracts);
      //console.log("🌍 DAI contract on mainnet:", mainnetContracts);
      //console.log("💵 yourMainnetDAIBalance", myMainnetDAIBalance);
      console.log("🔐 writeContracts", writeContracts);
      
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
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);
    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
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
      networkDisplay = (
        <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
          <Alert
            message="⚠️ Wrong Network"
            description={
              <div>
                You have <b>{networkSelected && networkSelected.name}</b> selected and you need to be on{" "}
                <Button
                  onClick={async () => {
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
                  }}
                >
                  <b>{networkLocal && networkLocal.name}</b>
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
      <div style={{ zIndex: -1, position: "absolute", right: 18, top: 38, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
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

  const params = {setValue,charityDecimals,readContracts,writeContracts,tx,targetNetwork,web3Modal,loadWeb3Modal,address,localProvider,userSigner,mainnetProvider,price,logoutOfWeb3Modal,blockExplorer}
  
  return (
    <div className="App">
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
