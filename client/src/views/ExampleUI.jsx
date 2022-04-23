import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Input, List, Progress, Slider, Spin, Switch } from "antd";
import React, { Fragment, useState, useEffect } from "react";
import { Address, Balance } from "../components";
const Big = require('big.js');
import useOnBlock from "../hooks/OnBlock";
import usePoller from "../hooks/Poller";
var commafy = require('commafy')
import Chart from "react-apexcharts";

export default function ExampleUI({
  loaded,
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  injectedProvider,
  targetNetwork,
  //useContractReader
}) {
  
  // console.log('injected',injectedProvider);

  const [daiAmount, setDaiAmount] = useState('');
  const [cdaiAmount, setcDaiAmount] = useState('');
  const [usdcAmount, setUsdcAmount] = useState('');
  const [cusdcAmount, setcUsdcAmount] = useState('');
  const [sponsorAmount1, setSponsorAmount1] = useState('');
  const [sponsorAmount2, setSponsorAmount2] = useState('');
  const [sponsorAmount3, setSponsorAmount3] = useState('');
  const [donationAmount1, setDonationAmount1] = useState('');
  const [donationAmount2, setDonationAmount2] = useState('');
  const [donationAmount3, setDonationAmount3] = useState('');
  const [stakeAmount, setstakeAmount] = useState('');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(true);
  const [nickname, setNickname] = useState('');

  const [topContributors, settopContributors] = useState([]);
  const [topCharities, settopCharities] = useState([]);
  const [series, setSeries] = useState(null);
  const [options, setOptions] = useState(null);
  const [totalInterestByCharities, settotalInterestByCharities] = useState(null);

  const [daiBalance, setDaiBalance] = useState(null);
  const [usdcBalance, setUsdcBalance] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);

  const [allowanceCharity1, setAllowanceCharity1] = useState(null);
  const [allowanceCharity2, setAllowanceCharity2] = useState(null);
  const [allowanceCharity3, setAllowanceCharity3] = useState(null);
  const [allowanceStaking, setAllowanceStaking] = useState(null);

  const [iHelpBalance, setiHelpBalance] = useState(null);
  const [iHelpTokenPhase, setiHelpTokenPhase] = useState(null);
  const [iHelpTokensPerPhase, setiHelpTokensPerPhase] = useState(null);
  const [iHelpCirculating, setiHelpCirculating] = useState(null);
  const [iHelpSupply, setiHelpSupply] = useState(null);
  const [iHelpClaimable, setiHelpClaimable] = useState(null);
  const [iHelpRegisteredCharities, setiHelpRegisteredCharities] = useState(null);
  const [iHelpTotalInterest, setiHelpTotalInterest] = useState(null);
  
  const [xHelpBalance, setxHelpBalance] = useState(null);
  const [xHelpSupply, setxHelpSupply] = useState(null);
  const [xHelpValue, setxHelpValue] = useState(null);

  const [charityPool1Balance, setcharityPool1Balance] = useState(null);
  const [charityPool1Token, setcharityPool1Token] = useState(null);
  const [charityPool1TotalInterestEarned, setcharityPool1TotalInterestEarned] = useState(null);
  const [charityPool1TotalBalance, setcharityPool1TotalBalance] = useState(null);
  
  const [charityPool2Balance, setcharityPool2Balance] = useState(null);
  const [charityPool2Token, setcharityPool2Token] = useState(null);
  const [charityPool2TotalInterestEarned, setcharityPool2TotalInterestEarned] = useState(null);
  const [charityPool2TotalBalance, setcharityPool2TotalBalance] = useState(null);

  const [charityPool3Balance, setcharityPool3Balance] = useState(null);
  const [charityPool3Token, setcharityPool3Token] = useState(null);
  const [charityPool3TotalInterestEarned, setcharityPool3TotalInterestEarned] = useState(null);
  const [charityPool3TotalBalance, setcharityPool3TotalBalance] = useState(null);
  
  const [charityPool1Decimals, setcharityPool1Decimals] = useState(null);
  const [charityPool2Decimals, setcharityPool2Decimals] = useState(null);
  const [charityPool3Decimals, setcharityPool3Decimals] = useState(null);
  
  const [iHelpStakingPool, setiHelpStakingPool] = useState(null);
  const [iHelpDevelopmentPool, setiHelpDevelopmentPool] = useState(null);
  const [iHelpCharityPool, setiHelpCharityPool] = useState(null);
  
  const [iHelpStakingPoolBalanceDAI, setiHelpStakingPoolBalanceDAI] = useState(null);
  const [iHelpDevelopmentPoolBalanceDAI, setiHelpDevelopmentPoolBalanceDAI] = useState(null);
  const [iHelpCharityPoolBalanceDAI, setiHelpCharityPoolBalanceDAI] = useState(null);

  const DEBUG = false;

  const updateValue = async(contracts, contractName, functionName, args) => {
    //try {
    let newValue;
    if (DEBUG) console.log("CALLING ", contractName, functionName, "with args", args);
    if (args && args.length > 0) {
      newValue = await contracts[contractName][functionName](...args);
      if (DEBUG)
        console.log("contractName", contractName, "functionName", functionName, "args", args, "RESULT:", newValue);
    }
    else {
      newValue = await contracts[contractName][functionName]();
    }
    //console.log("GOT VALUE", newValue)
    return newValue;
    // }
    // catch (e) {
    //   console.log(e);
    // }
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
      if (DEBUG) console.log("on-request", contractName, functionName);
      updateValue(readContracts, contractName, functionName, args).then((d) => {
        if (d != variable) {

          callback(d);

        }
      })
    }
    }
    // });
  }

  const getLeaderboard = () => {

    // get the db info for the users address
    fetch(`/api/v1/data/topcontributors`).then((d) => {
      if (d.ok) {
        return d.json()
      }
    }).then((d) => {
      console.log(d);
      settopContributors(d);
    })
    
    fetch(`/api/v1/data/totalinterestbycharities`).then((d) => {
      if (d.ok) {
        return d.json()
      }
    }).then((d) => {
      console.log(d);
      settotalInterestByCharities(d);
    })

    fetch(`/api/v1/data/topcharities`).then((d) => {
      if (d.ok) {
        return d.json()
      }
    }).then((d) => {
      console.log(d);
      settopCharities(d);
    })

    fetch(`/api/v1/data/contribovertime`).then((d) => {
      if (d.ok) {
        return d.json()
      }
    }).then((d) => {
      console.log(d);

      const series = [{
        name: 'Contributions over Time',
        data: d
      }]
      
      const options = {
        chart: {
          type: 'area',
          stacked: false,
          height: 250,
          background: 'transparent',
          zoom: {
            type: 'x',
            enabled: false,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
        },
        // title: {
        //   text: 'Contributions Over Time',
        //   align: 'left'
        // },
         theme: {
            mode: window.localStorage.getItem("theme"), 
            palette: 'palette1', 
            monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'light',
                shadeIntensity: 0.65
            },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          labels: {
            formatter: function(val) {
              return commafy(val)
            },
          },
          // title: {
          //   text: 'Total Contributions'
          // },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'htt'
          }
        },
        tooltip: {
          shared: false,
           x: {
              show: true,
              format: 'dd MMM htt',
              formatter: undefined,
          },
          y: {
            formatter: function(val) {
              return commafy(val)
            },
          }
        }
      }

      setOptions(options);
      setSeries(series);

    })

  }

  const updateContracts = async(contract) => {

    console.log('updating values', contract);
    if (contract == 'init') {

      setValue("iHelp", "stakingPool", null, iHelpStakingPool, setiHelpStakingPool);
      setValue("iHelp", "developmentPool", null, iHelpDevelopmentPool, setiHelpDevelopmentPool);
      setValue("iHelp", "holdingPool", null, iHelpCharityPool, setiHelpCharityPool);
      
      setValue("iHelp", "allowance", [address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);

      setValue("DAI", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setAllowanceCharity2);
      //setValue("DAI", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      setValue("USDC", "allowance", [address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      setValue("charityPool1", "tokenname", null, charityPool1Token, setcharityPool1Token);
      setValue("charityPool2", "tokenname", null, charityPool2Token, setcharityPool2Token);
      setValue("charityPool3", "tokenname", null, charityPool3Token, setcharityPool3Token);
      
      setValue("DAI", "decimals", null, charityPool1Decimals, setcharityPool1Decimals);
      setValue("USDC", "decimals", null, charityPool2Decimals, setcharityPool2Decimals);
      //setValue("charityPool3", "decimals", null, charityPool3Decimals, setcharityPool3Decimals);

      setValue("ETH", "balance", null, ethBalance, setEthBalance);


      if (targetNetwork.name.indexOf("local") == -1) {
        
        getLeaderboard();
        
        setInterval(()=>{
          getLeaderboard();
        },30000);
      
      }
      

    }

    if (contract == 'DAI' || contract == 'all') {

      setValue("DAI", "balanceOf", [address], daiBalance, setDaiBalance);
      setValue("DAI", "balanceOf", [iHelpStakingPool], iHelpStakingPoolBalanceDAI, setiHelpStakingPoolBalanceDAI);
      setValue("DAI", "balanceOf", [iHelpDevelopmentPool], iHelpDevelopmentPoolBalanceDAI, setiHelpDevelopmentPoolBalanceDAI);
      setValue("DAI", "balanceOf", [iHelpCharityPool], iHelpCharityPoolBalanceDAI, setiHelpCharityPoolBalanceDAI);

      setValue("DAI", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setdaiAllowanceCharity2);
      setValue("DAI", "allowance", [address, readContracts.charityPool3.address], allowanceCharity3, setAllowanceCharity3);
      
    }
    
    if (contract == 'USDC' || contract == 'all') {

      setValue("USDC", "balanceOf", [address], usdcBalance, setUsdcBalance);

      //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], daiAllowanceCharity1, setdaiAllowanceCharity1);
      setValue("USDC", "allowance", [address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

    }

    if (contract == 'charityPool1' || contract == 'all') {
      setValue("charityPool1", "balanceOf", [address], charityPool1Balance, setcharityPool1Balance);
      setValue("charityPool1", "totalInterestEarned", null, charityPool1TotalInterestEarned, setcharityPool1TotalInterestEarned);
      setValue("charityPool1", "getAccountedBalance", null, charityPool1TotalBalance, setcharityPool1TotalBalance);
    }

    if (contract == 'charityPool2' || contract == 'all') {
      setValue("charityPool2", "balanceOf", [address], charityPool2Balance, setcharityPool2Balance);
      setValue("charityPool2", "totalInterestEarned", null, charityPool2TotalInterestEarned, setcharityPool2TotalInterestEarned);
      setValue("charityPool2", "getAccountedBalance", null, charityPool2TotalBalance, setcharityPool2TotalBalance);
    }

    if (contract == 'charityPool3' || contract == 'all') {
      setValue("charityPool3", "balanceOf", [address], charityPool3Balance, setcharityPool3Balance);
      setValue("charityPool3", "totalInterestEarned", null, charityPool3TotalInterestEarned, setcharityPool3TotalInterestEarned);
      setValue("charityPool3", "getAccountedBalance", null, charityPool3TotalBalance, setcharityPool3TotalBalance);
      //setValue("ETH", "balance", null, ethBalance, setEthBalance);
    }

    if (contract == 'iHelp' || contract == 'all') {
      setValue("iHelp", "balanceOf", [address], iHelpBalance, setiHelpBalance);
      setValue("iHelp", "tokenPhase", null, iHelpTokenPhase, setiHelpTokenPhase);
      setValue("iHelp", "currentTokensPerInterest", null, iHelpTokensPerPhase, setiHelpTokensPerPhase);
      setValue("iHelp", "totalCirculating", null, iHelpCirculating, setiHelpCirculating);
      setValue("iHelp", "totalAvailableSupply", null, iHelpSupply, setiHelpSupply);
      setValue("iHelp", "getClaimableTokens", [address], iHelpClaimable, setiHelpClaimable);
      setValue("iHelp", "numberOfCharities", null, iHelpRegisteredCharities, setiHelpRegisteredCharities);
      setValue("iHelp", "getTotalCharityPoolInterest", null, iHelpTotalInterest, setiHelpTotalInterest);
      setValue("iHelp", "allowance", [address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
    }
    
    if (contract == 'xHelp' || contract == 'all') {
    
      setValue("xHelp", "balanceOf", [address], xHelpBalance, setxHelpBalance);
      setValue("xHelp", "totalSupply", null, xHelpSupply, setxHelpSupply);
      setValue("xHelp", "exchangeRateCurrent", null, xHelpValue, setxHelpValue);
    
    }

  };

  if (readContracts && readContracts["iHelp"] && readContracts["iHelp"].provider) {
    useEffect(async() => {

      await updateContracts('init');
      console.log('calling')

    }, [])
  }

  if (injectedProvider && loading == true && iHelpStakingPool != null && iHelpDevelopmentPool != null && iHelpCharityPool != null) {

    setLoading(false);
    updateContracts('all');

    const listener = (blockNumber, contract) => {
      if (contract != undefined) {
        console.log(contract, blockNumber); // , fn, args, provider.listeners()
        updateContracts(contract);
      }
    };

    const contractsToListen = ["DAI", 'USDC', 'iHelp', 'xHelp', 'charityPool1', 'charityPool2', 'charityPool3']

    contractsToListen.map(c => {

      //if (c == 'DAI') {

      // not the most efficient because this will update on each block
      readContracts[c].provider.on("block", (block) => { listener(block, c) });

      // }
      // else {

      //   // update on any transaction

      //   // const filter = {
      //   //   address: readContracts[c].address,
      //   //   topics: [
      //   //     "*"
      //   //     //utils.id("Transfer(address,address,uint256)")
      //   //   ]
      //   // }
      //   console.log(readContracts[c].address);
      //   readContracts[c].provider.on(readContracts[c].address, (block) => { listener(block, c) });
      // }

    });

  }

  const dd = {
    daiBalance: daiBalance,
    usdcBalance: usdcBalance,
    ethBalance: ethBalance,
    charityPool1Balance: charityPool1Balance,
    charityPool1TotalInterestEarned: charityPool1TotalInterestEarned,
    charityPool1TotalBalance: charityPool1TotalBalance,
    charityPool2Balance: charityPool2Balance,
    charityPool2TotalInterestEarned: charityPool2TotalInterestEarned,
    charityPool2TotalBalance: charityPool2TotalBalance,
    charityPool3Balance: charityPool3Balance,
    charityPool3TotalInterestEarned: charityPool3TotalInterestEarned,
    charityPool3TotalBalance: charityPool3TotalBalance,
    iHelpBalance: iHelpBalance,
    iHelpTokenPhase: iHelpTokenPhase,
    iHelpTokensPerPhase: iHelpTokensPerPhase,
    iHelpCirculating: iHelpCirculating,
    iHelpSupply: iHelpSupply,
    iHelpClaimable: iHelpClaimable,
    iHelpRegisteredCharities: iHelpRegisteredCharities,
    iHelpStakingPool: iHelpStakingPool,
    iHelpDevelopmentPool: iHelpDevelopmentPool,
    iHelpCharityPool: iHelpCharityPool,
    iHelpStakingPoolBalanceDAI: iHelpStakingPoolBalanceDAI,
    iHelpDevelopmentPoolBalanceDAI: iHelpDevelopmentPoolBalanceDAI,
    iHelpCharityPoolBalanceDAI: iHelpCharityPoolBalanceDAI,
    xHelpBalance: xHelpBalance,
    xHelpValue: xHelpValue,
    allowanceCharity1: allowanceCharity1,
    allowanceCharity2: allowanceCharity2,
    allowanceCharity3: allowanceCharity3,
    allowanceStaking: allowanceStaking
  }
  //console.log(dd);
  let isFull = Object.values(dd).every(x => x != null);
  
  if (injectedProvider == undefined) {
    isFull = true;
  }
  
  if (isFull == true) {
    // console.log('contract data:', dd);
  }
  if (isFull == false) {
    return '';
  }

  let charity1Enabled = false;
  let charity2Enabled = false;
  let charity3Enabled = false;
  let stakingEnabled = false;

  if (injectedProvider) {
    if (utils.formatEther(allowanceCharity1) >= 100000000) {
      charity1Enabled = true;
    }
    if (utils.formatEther(allowanceCharity2) >= 100000000) {
      charity2Enabled = true;
    }
    if (utils.formatEther(allowanceCharity3) >= 100000000) {
      charity3Enabled = true;
    }
    if (utils.formatEther(allowanceStaking) >= 100000000) {
      stakingEnabled = true;
    }
  }

  const fromBigNumber = (number) => {
    return parseFloat(utils.fromWei(Big(number).toFixed(0)))
  }
  
  let tvl = '';
  let totalinterest = '';
  if (totalInterestByCharities != null) {
    totalinterest = 0;
    totalInterestByCharities.map((d)=>{
      totalinterest+=d.total_interest;
    })
    totalinterest = '$'+commafy(totalinterest.toFixed());
  }
  if (series != null && series.length >0) {
    try {
      tvl = series[0]['data'][0][1];
    //console.log(series);
    } catch(e) {
      tvl = 0;
    }
    tvl = '$' + commafy(tvl.toFixed(0)) + '';
  }
  
  return (
    <div>
      
      <div style={{ border: "0px solid #cccccc", padding: 16, minWidth:600, width: '70%', margin: "auto", marginTop: 12 }}>
  
        <div style={{ margin: 8 }}>
        
        <div style={{display: targetNetwork.name.indexOf("local") == -1 ? '' : 'none'}}>
        <h2>Leaderboard:</h2><span style={{fontSize:'12px',marginTop:'-16px',display:'block'}}>(updated every minute)</span>
        
        <br/>
        <h3>Total Value Locked (TVL): {tvl}</h3>
        <h3>Total Interest Generated: {totalinterest}</h3>

        <div style={{fontStyle:'italic',marginTop:'20px'}}>Top 5 Contributors:</div>
        <List
          bordered
          dataSource={topContributors}
          renderItem={item => {
            return (
              <List.Item key={item.useraddress}>
                <div style={{textAlign:'center',width:'33%',fontWeight:'bold',fontSize:16,display:'inline-block'}}>{item.nickname != null ? item.nickname : ''}</div>
                
                <div style={{textAlign:'center',width:'33%',fontWeight:'bold',fontSize:16,display:'inline-block'}}>{'$'+commafy(item.total_contrib_usd.toFixed(0))}</div>
                
                <div style={{textAlign:'center',width:'33%',display:'inline-block'}} >
                <Address address={item.useraddress} ensProvider={mainnetProvider} fontSize={16} />
                </div>

              </List.Item>
            );
          }}
        />
        
        <div style={{fontStyle:'italic',marginTop:'12px'}}>Top 3 Charity Contributions:</div>
        <List
          bordered
          dataSource={topCharities}
          renderItem={item => {
            return (
              <List.Item key={item.charityaddress}>
              
                <div style={{textAlign:'center',width:'33%',fontWeight:'bold',fontSize:16,display:'inline-block'}}>{item.charityname}</div>
                
                <div style={{textAlign:'center',width:'33%',fontWeight:'bold',fontSize:16,display:'inline-block'}}>{'$'+commafy(item.total_contrib_usd.toFixed(0))}</div>
                
                <div style={{textAlign:'center',width:'33%',display:'inline-block'}} >
                <Address address={item.charityaddress} ensProvider={mainnetProvider} fontSize={16} />
                </div>

              </List.Item>
            );
          }}
        />
        
        <div style={{fontStyle:'italic',marginTop:'12px'}}>Total Contributions (USD):</div>
         <div id="chart">
         {options != null && series !=null ? (<Chart options={options} series={series} type="area" height={250} />) : ''}
        </div>

 { (injectedProvider) && <Fragment>     
        <Divider />
        </Fragment>}
        
        </div>
        
       { (injectedProvider) && <Fragment>        

        
        
        <h2>iHelp Protocol (HELP):</h2>
       Contract Address:
          <Address address={readContracts ? readContracts.iHelp.address : '...'} ensProvider={localProvider} fontSize={16} />
        <br/><br/>
       
        <h4>Number of Charities: {iHelpRegisteredCharities ? utils.formatUnits(iHelpRegisteredCharities,0) : '...'}</h4>

        <h4>Total HELP Circulating: {iHelpCirculating ? commafy(parseFloat(utils.formatEther(iHelpCirculating)).toFixed(2)) : '...'}</h4>
        <h4>Total HELP Supply: {iHelpSupply ? commafy(parseFloat(utils.formatEther(iHelpSupply)).toFixed(2)) : '...'}</h4>
        <h4>Token Phase: {iHelpTokenPhase ? utils.formatUnits(iHelpTokenPhase,0) : '...'}</h4>
        <h4>Tokens / Interest: {iHelpTokensPerPhase ? commafy(parseFloat(utils.formatEther(iHelpTokensPerPhase)).toFixed(2)) : '...'}</h4>
        <h4>Total Interest Earned: {totalinterest}</h4>
        <br/>
        
        <h4>Your HELP Token Balance: {iHelpBalance ? commafy(parseFloat(utils.formatEther(iHelpBalance)).toFixed(2)) : '...'}</h4>
        <h4>Your Claimable HELP Tokens: {iHelpClaimable ? commafy(parseFloat(utils.formatEther(iHelpClaimable)).toFixed(2)) : '...'}</h4>
         
         <Button
            style={{ marginTop: 8, width: '100%' }}
            onClick={async () => {
            
            console.log('claiming tokens...')
            
             const result = tx(writeContracts.iHelp.claimTokens(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);

            

            }}
            disabled={iHelpClaimable && parseFloat(utils.formatEther(iHelpClaimable)) > 0 ? false : true}
          >
            Claim HELP Tokens
            
          </Button>
          
          <br/>
          <br/>
          
          <h4>Your xHELP Token Balance: {xHelpBalance ? commafy(parseFloat(utils.formatEther(xHelpBalance)).toFixed(2)) : '...'}</h4>
          <h4>Total xHELP Supply: {xHelpSupply ? commafy(parseFloat(utils.formatEther(xHelpSupply)).toFixed(2)) : '...'}</h4>
          <h4>1 HELP = {xHelpValue ? commafy(parseFloat(utils.formatEther(xHelpValue)).toFixed(2))+' xHELP' : '...'}</h4>
          
          <div style={{fontStyle:'italic',fontSize:'9px'}}>
            Stake HELP here and receive xHELP as receipt representing your share of the pool. This pool automatically compounds and by using a 15% portion of all interest generated to buy back HELP which means the xHELP to HELP ratio will grow over time! 
            <br/>
            Like liquidity providing (LP), you will earn fees according to your share in the pool, and your xHELP receipt is needed as proof when claiming the rewards.
          </div>
          
          
          <Button
            style={{ marginTop: 8,width:'30%',display: stakingEnabled == false ? '' : 'none' }}
            onClick={async () => {
            
            // FIRST APPROVE THE TRANSFER
            
            const approveTx = tx(writeContracts['iHelp'].approve(readContracts.xHelp.address,utils.parseEther('100000000000')), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", approveTx);
              console.log(await approveTx);

            }}
          >
            Enable Staking
          </Button>
          
          
          
          <div>
          <Button
            style={{ marginTop: 8,width:'30%',display: stakingEnabled == true ? '' : 'none' }}
            disabled={stakeAmount == '' || iHelpBalance == 0 ? true : false}
            onClick={async () => {
            
            console.log('staking',stakeAmount,'HELP tokens to xHELP staking contract:',readContracts.xHelp.address)
            const stakeAmountWei = utils.parseEther(stakeAmount).toString(10);
            
              const sponsorTx = tx(writeContracts.xHelp.deposit(stakeAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", sponsorTx);
              console.log(await sponsorTx);
              
              setstakeAmount('');
            
            }}
          >
            Stake HELP Tokens
          </Button>
          <Input
          style={{width:'70%',display: stakingEnabled == true ? '' : 'none'}}
            placeholder={'Amount of HELP tokens to stake...'}
            onChange={e => {
              setstakeAmount(e.target.value);
            }}
            value={stakeAmount}
          />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: stakingEnabled == true ? '' : 'none' }}
            disabled={xHelpBalance && parseFloat(utils.formatEther(xHelpBalance)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('withdrawing staked tokens...')

             const result = tx(writeContracts.xHelp.withdraw(xHelpBalance), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Withdraw xHELP Tokens
          </Button>
          </div>
         
        <Divider />

        
          <h2>Charity 1 ({charityPool1Token}):</h2>
          Contract Address:
          <Address address={readContracts ? readContracts.charityPool1.address : '...'} ensProvider={localProvider} fontSize={16} />
          {/*<br/>
          Charity Wallet:
          <Address address={charityPool1Wallet ? charityPool1Wallet : '...'} ensProvider={localProvider} fontSize={16} />
          <h4>Charity Wallet Balance: {charityPool1WalletBalance ? parseFloat(utils.formatEther(charityPool1WalletBalance)).toFixed(2) : '...'}</h4>*/}

          <br/>
          <h4>Your Contribution Balance: {charityPool1Balance ? commafy(parseFloat(utils.formatEther(charityPool1Balance)).toFixed(2)) : "..."}</h4>
          <h4>Your {charityPool1Token} Balance: {daiBalance ? commafy(parseFloat(utils.formatEther(daiBalance)).toFixed(2)) : "..."}</h4>
          <h4>Total Charity Contributions: {charityPool1TotalBalance ? commafy(parseFloat(utils.formatEther(charityPool1TotalBalance)).toFixed(2)) : "..."}</h4>
          {/*<h4>Current Interest Earned: {charityPool1CurrentInterestEarned ? parseFloat(utils.formatEther(charityPool1CurrentInterestEarned)).toFixed(2) : "..."}</h4>*/}
          <h4>Total Interest USD Earned: {charityPool1TotalInterestEarned ? commafy(parseFloat(utils.formatEther(charityPool1TotalInterestEarned)).toFixed(2)) : "..."}</h4>

          <div>
          
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity1Enabled == false ? '' : 'none' }}
            onClick={async () => {
            
            // FIRST APPROVE THE TRANSFER
            
            const approveTx = tx(writeContracts[charityPool1Token].approve(readContracts.charityPool1.address,utils.parseEther('100000000000')), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", approveTx);
              console.log(await approveTx);

            }}
          >
            Enable Charity
          </Button>
          
          
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity1Enabled == true ? '' : 'none' }}
            disabled={sponsorAmount1 == '' ? true : false}
            onClick={async () => {
            
            console.log('sponsoring',sponsorAmount1,'gwei dai to charity:',readContracts.charityPool1.address)
            const sponsorAmountWei = utils.parseUnits(sponsorAmount1,charityPool1Decimals).toString(10);
            
              // NOW DO THE TRANSFER
              const sponsorTx = tx(writeContracts.charityPool1.sponsor(sponsorAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", sponsorTx);
              console.log(await sponsorTx);
              
              setSponsorAmount1('');
            
            }}
          >
            Contribute
          </Button>
          <Input
          style={{width:'70%',display: charity1Enabled == true ? '' : 'none' }}
            placeholder={'Amount to contribute to charity in DAI - e.g. 10 gwei'}
            onChange={e => {
              setSponsorAmount1(e.target.value);
            }}
            value={sponsorAmount1}
          />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: charity1Enabled == true ? '' : 'none'  }}
            disabled={charityPool1Balance && parseFloat(utils.formatEther(charityPool1Balance)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('withdrawing contribution from charity...')

             const result = tx(writeContracts.charityPool1.withdraw(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Withdraw Contribution
          </Button>
          </div>
          
          <div>
          
            <Button
              style={{ marginTop: 8,width:'30%',display: charity1Enabled == true ? '' : 'none' }}
              disabled={donationAmount1 == '' ? true : false}
              onClick={async () => {
              
              console.log('sponsoring',donationAmount1,'gwei dai to charity:',readContracts.charityPool1.address)
              const donateAmountWei = utils.parseUnits(donationAmount1,charityPool1Decimals).toString(10);
              
                // NOW DO THE TRANSFER
                const sponsorTx = tx(writeContracts.charityPool1.directDonation(donateAmountWei), update => {
               
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });
                console.log("awaiting metamask/web3 confirm result...", sponsorTx);
                console.log(await sponsorTx);
                
                setDonationAmount1('');
              
              }}
            >
              Direct Donation
            </Button>
            <Input
            style={{width:'70%',display: charity1Enabled == true ? '' : 'none' }}
              placeholder={`Amount to directly donate to charity in ${charityPool1Token} - e.g. 10 gwei`}
              onChange={e => {
                setDonationAmount1(e.target.value);
              }}
              value={donationAmount1}
            />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: 'none'  }}
            //disabled={charityPool1CurrentInterestEarned && parseFloat(utils.formatEther(charityPool1CurrentInterestEarned)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('sending earned interest to charity...')

             const result = tx(writeContracts.charityPool1.redeemInterest(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Send Interest to Charity
          </Button>
          </div>
          
        
        
        <span style={{display:''}}>
        
        <Divider />

          <h2>Charity 2 ({charityPool2Token}):</h2>
          Contract Address:
          <Address address={readContracts ? readContracts.charityPool2.address : '...'} ensProvider={localProvider} fontSize={16} />
          {/*<br/>
          Charity Wallet:
          <Address address={charityPool2Wallet ? charityPool2Wallet : '...'} ensProvider={localProvider} fontSize={16} />
          <h4>Charity Wallet Balance: {charityPool2WalletBalance ? parseFloat(utils.formatEther(charityPool2WalletBalance)).toFixed(2) : '...'}</h4>*/}
          <br/>
          <h4>Your Contribution Balance: {charityPool2Balance ? commafy(parseFloat(utils.formatUnits(charityPool2Balance,charityPool2Decimals)).toFixed(2)) : "..."}</h4>
          <h4>Your {charityPool2Token} Balance: {usdcBalance ? commafy(parseFloat(utils.formatUnits(usdcBalance,charityPool2Decimals)).toFixed(2)) : "..."}</h4>
          <h4>Total Charity Contributions: {charityPool2TotalBalance ? commafy(parseFloat(utils.formatUnits(charityPool2TotalBalance,charityPool2Decimals)).toFixed(2)) : "..."}</h4>
          {/*<h4>Current Interest Earned: {charityPool2CurrentInterestEarned ? parseFloat(utils.formatEther(charityPool2CurrentInterestEarned)).toFixed(2) : "..."}</h4>*/}
          <h4>Total Interest USD Earned: {charityPool2TotalInterestEarned ? commafy(parseFloat(utils.formatUnits(charityPool2TotalInterestEarned,charityPool2Decimals)).toFixed(2)) : "..."}</h4>

          <div>
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity2Enabled == false ? '' : 'none' }}
            onClick={async () => {
            
            // FIRST APPROVE THE TRANSFER
            
            const approveTx = tx(writeContracts[charityPool2Token].approve(readContracts.charityPool2.address,utils.parseEther('100000000000')), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", approveTx);
              console.log(await approveTx);

            }}
          >
            Enable Charity
          </Button>
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity2Enabled == true ? '' : 'none'  }}
            disabled={sponsorAmount2 == '' ? true : false}
            onClick={async () => {
            
            console.log('sponsoring',sponsorAmount2,'gwei dai to charity:',readContracts.charityPool2.address)
            const sponsorAmountWei = utils.parseUnits(sponsorAmount2,charityPool2Decimals).toString(10);
            
            console.log(charityPool2Decimals,sponsorAmountWei);
            
              // NOW DO THE TRANSFER
              const sponsorTx = tx(writeContracts.charityPool2.sponsor(sponsorAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", sponsorTx);
              console.log(await sponsorTx);
              
              setSponsorAmount2('');
            
            }}
          >
            Contribute
          </Button>
          <Input
          style={{width:'70%',display: charity2Enabled == true ? '' : 'none'}}
            placeholder={`Amount to contribute to charity in ${charityPool2Token} - e.g. 10 gwei`}
            onChange={e => {
              setSponsorAmount2(e.target.value);
            }}
            value={sponsorAmount2}
          />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: charity2Enabled == true ? '' : 'none' }}
            disabled={charityPool2Balance && parseFloat(utils.formatEther(charityPool2Balance)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('withdrawing contribution from charity...')

             const result = tx(writeContracts.charityPool2.withdraw(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Withdraw Contribution
          </Button>
          </div>
          
          <div>
          
            <Button
              style={{ marginTop: 8,width:'30%',display: charity2Enabled == true ? '' : 'none' }}
              disabled={donationAmount2 == '' ? true : false}
              onClick={async () => {
              
              console.log('sponsoring',donationAmount2,'gwei dai to charity:',readContracts.charityPool2.address)
              const donateAmountWei = utils.parseUnits(donationAmount2,charityPool2Decimals).toString(10);
              console.log(donateAmountWei);
              
                // NOW DO THE TRANSFER
                const sponsorTx = tx(writeContracts.charityPool2.directDonation(donateAmountWei), update => {
               
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });
                console.log("awaiting metamask/web3 confirm result...", sponsorTx);
                console.log(await sponsorTx);
                
                setDonationAmount2('');
              
              }}
            >
              Direct Donation
            </Button>
            <Input
            style={{width:'70%',display: charity2Enabled == true ? '' : 'none' }}
              placeholder={`Amount to directly donate to charity in ${charityPool2Token} - e.g. 10 gwei`}
              onChange={e => {
                setDonationAmount2(e.target.value);
              }}
              value={donationAmount2}
            />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: 'none' }}
            //disabled={charityPool2CurrentInterestEarned && parseFloat(utils.formatEther(charityPool2CurrentInterestEarned)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('sending earned interest to charity...')

             const result = tx(writeContracts.charityPool2.redeemInterest(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Send Interest to Charity
          </Button>
          </div>
          
           <Divider />
           
           </span>
        
        <span style={{display:''}}>
        <h2>Charity 3 ({charityPool1Token}):</h2>
          Contract Address:
          <Address address={readContracts ? readContracts.charityPool3.address : '...'} ensProvider={localProvider} fontSize={16} />
          {/*<br/>
          Charity Wallet:
          <Address address={charityPool3Wallet ? charityPool3Wallet : '...'} ensProvider={localProvider} fontSize={16} />
          <h4>Charity Wallet Balance: {charityPool3WalletBalance ? parseFloat(utils.formatEther(charityPool3WalletBalance)).toFixed(2) : '...'}</h4>*/}

          <br/>
          <h4>Your Contribution Balance: {charityPool3Balance ? commafy(parseFloat(utils.formatEther(charityPool3Balance)).toFixed(2)) : "..."}</h4>
          <h4>Your {charityPool3Token} Balance: {daiBalance ? commafy(parseFloat(utils.formatEther(daiBalance)).toFixed(2)) : "..."}</h4>
          <h4>Total Charity Contributions: {charityPool3TotalBalance ? commafy(parseFloat(utils.formatEther(charityPool3TotalBalance)).toFixed(2)) : "..."}</h4>
          {/*<h4>Current Interest Earned: {charityPool3CurrentInterestEarned ? parseFloat(utils.formatEther(charityPool3CurrentInterestEarned)).toFixed(2) : "..."}</h4>*/}
          <h4>Total Interest USD Earned: {charityPool3TotalInterestEarned ? commafy(parseFloat(utils.formatEther(charityPool3TotalInterestEarned)).toFixed(2)) : "..."}</h4>

          <div>
          
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity3Enabled == false ? '' : 'none' }}
            onClick={async () => {
            
            // FIRST APPROVE THE TRANSFER
            
            const approveTx = tx(writeContracts[charityPool3Token].approve(readContracts.charityPool3.address,utils.parseEther('100000000000')), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", approveTx);
              console.log(await approveTx);

            }}
          >
            Enable Charity
          </Button>
          
          
          
          <Button
            style={{ marginTop: 8,width:'30%',display: charity3Enabled == true ? '' : 'none' }}
            disabled={sponsorAmount3 == '' ? true : false}
            onClick={async () => {
            
            console.log('sponsoring',sponsorAmount3,'gwei dai to charity:',readContracts.charityPool3.address)
            const sponsorAmountWei = utils.parseUnits(sponsorAmount3,charityPool3Decimals).toString(10);
            
              // NOW DO THE TRANSFER
              const sponsorTx = tx(writeContracts.charityPool3.sponsor(sponsorAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", sponsorTx);
              console.log(await sponsorTx);
              
              setSponsorAmount3('');
            
            }}
          >
            Contribute
          </Button>
          <Input
          style={{width:'70%',display: charity3Enabled == true ? '' : 'none' }}
            placeholder={'Amount to contribute to charity in DAI - e.g. 10 gwei'}
            onChange={e => {
              setSponsorAmount3(e.target.value);
            }}
            value={sponsorAmount3}
          />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: charity3Enabled == true ? '' : 'none'  }}
            disabled={charityPool3Balance && parseFloat(utils.formatEther(charityPool3Balance)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('withdrawing contribution from charity...')

             const result = tx(writeContracts.charityPool3.withdraw(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Withdraw Contribution
          </Button>
          </div>
          
          <div>
          
            <Button
              style={{ marginTop: 8,width:'30%',display: charity3Enabled == true ? '' : 'none' }}
              disabled={donationAmount3 == '' ? true : false}
              onClick={async () => {
              
              console.log('sponsoring',donationAmount3,'gwei dai to charity:',readContracts.charityPool3.address)
              const donateAmountWei = utils.parseUnits(donationAmount3,charityPool3Decimals).toString(10);
              
                // NOW DO THE TRANSFER
                const sponsorTx = tx(writeContracts.charityPool3.directDonation(donateAmountWei), update => {
               
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });
                console.log("awaiting metamask/web3 confirm result...", sponsorTx);
                console.log(await sponsorTx);
                
                setDonationAmount3('');
              
              }}
            >
              Direct Donation
            </Button>
            <Input
            style={{width:'70%',display: charity3Enabled == true ? '' : 'none' }}
              placeholder={`Amount to directly donate to charity in ${charityPool3Token} - e.g. 10 gwei`}
              onChange={e => {
                setDonationAmount3(e.target.value);
              }}
              value={donationAmount3}
            />
          
          </div>
          
          <div>
          <Button
            style={{ marginTop: 8,width:'100%',display: 'none'  }}
            //disabled={charityPool3CurrentInterestEarned && parseFloat(utils.formatEther(charityPool3CurrentInterestEarned)) != 0 ? false : true}
            onClick={async () => {
            
            console.log('sending earned interest to charity...')

             const result = tx(writeContracts.charityPool3.redeemInterest(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            
            }}
          >
            Send Interest to Charity
          </Button>
          </div>
          
           </span>
          
           </Fragment>}
          
          </div>
          
         
  
   { (injectedProvider) && <Fragment>     
   <Divider />
    </Fragment>}
        
   { (injectedProvider) && <Fragment>     
   
       <h2>Pool Balances:</h2>
      
      Holding Pool:
          <Address address={iHelpCharityPool ? iHelpCharityPool : '...'} ensProvider={localProvider} fontSize={16} />
      <h4>Holding Pool DAI Balance: {iHelpCharityPoolBalanceDAI ? commafy(parseFloat(utils.formatEther(iHelpCharityPoolBalanceDAI)).toFixed(2)) : '...'}</h4>
 <br/>
 Staking Pool:
          <Address address={iHelpStakingPool ? iHelpStakingPool : '...'} ensProvider={localProvider} fontSize={16} />
       <h4>Staking Pool DAI Balance: {iHelpStakingPoolBalanceDAI ? commafy(parseFloat(utils.formatEther(iHelpStakingPoolBalanceDAI)).toFixed(2)) : '...'}</h4>
 <br/>
        Development Pool:
          <Address address={iHelpDevelopmentPool ? iHelpDevelopmentPool : '...'} ensProvider={localProvider} fontSize={16} />
         <h4>Development Pool DAI Balance: {iHelpDevelopmentPoolBalanceDAI ? commafy(parseFloat(utils.formatEther(iHelpDevelopmentPoolBalanceDAI)).toFixed(2)) : '...'}</h4>

        

        <Divider />
        
        
        <h2>Utilities:</h2>
        
        DAI Address:
          <Address address={readContracts ? readContracts.DAI.address : '...'} ensProvider={localProvider} fontSize={16} /><br/>
        cDAI Address:
          <Address address={readContracts ? readContracts.cDAI.address : '...'} ensProvider={localProvider} fontSize={16} /><br/>
        USDC Address:
          <Address address={readContracts ? readContracts.USDC.address : '...'} ensProvider={localProvider} fontSize={16} /><br/>
        cUSDC Address:
          <Address address={readContracts ? readContracts.cUSDC.address : '...'} ensProvider={localProvider} fontSize={16} /><br/>
        {/*cETH Address:
          <Address address={readContracts ? readContracts.cETH.address : '...'} ensProvider={localProvider} fontSize={16} />
          */}
          <div>
       <Button
            style={{ marginTop: 8,width:'30%' }}
            disabled={nickname == '' ? true : false}
            onClick={async () => {
            
            console.log('setting nickname for address:',address)
            
              const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ address:address,nickname:nickname })
              };
              fetch('/api/v1/data/nickname', requestOptions)
                  .then(response => response.json())

              setNickname('');
            
            }}
            
          >
            Set Address Nickname
          </Button>
        <Input
            placeholder={'address nickname'}
            onChange={e => {
              setNickname(e.target.value);
            }}
            value={nickname}
            style={{width:'70%'}}
          />
        </div>
          

        <div>
       <Button
            style={{ marginTop: 8,width:'30%' }}
            disabled={daiAmount == '' ? true : false}
            onClick={async () => {
            
            console.log('minting',daiAmount,'gwei dai to my address:',address)
            const daiAmountWei = utils.parseEther(daiAmount).toString(10);
            
             const result = tx(writeContracts.DAI.allocateTo(address,daiAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
              
              setDaiAmount('');
            
            }}
            
          >
            Get DAI
          </Button>
        <Input
            placeholder={'Amount of DAI (gwei) to mint to your wallet - e.g. 10 gwei'}
            onChange={e => {
              setDaiAmount(e.target.value);
            }}
            value={daiAmount}
            style={{width:'70%'}}
          />
        </div>
        
          <div>
       <Button
            style={{ marginTop: 8,width:'30%' }}
            disabled={usdcAmount == '' ? true : false}
            onClick={async () => {
            
            console.log('minting',usdcAmount,'gwei usdc to my address:',address)
            const usdcAmountWei = utils.parseUnits(usdcAmount,6).toString(10);
            
             const result = tx(writeContracts.USDC.allocateTo(address,usdcAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
              
              setUsdcAmount('');
            
            }}
            
          >
            Get USDC
          </Button>
        <Input
            placeholder={'Amount of USDC (gwei) to mint to your wallet - e.g. 10 gwei'}
            onChange={e => {
              setUsdcAmount(e.target.value);
            }}
            value={usdcAmount}
            style={{width:'70%'}}
          />
        </div>
        
        
       { targetNetwork.name.indexOf("local") > -1 ? (<span>
         <Button
            style={{ marginTop: 8, width: '100%' }}
            onClick={async () => {
            
            console.log('dripping tokens...')

            const result = tx(writeContracts.iHelp.drip(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);

            }}
          >
            Drip HELP Tokens
            
          </Button>
        
          <Button
            style={{ marginTop: 8, width: '100%' }}
            onClick={async () => {
            
            console.log('dumping tokens...')

            const result = tx(writeContracts.iHelp.dump(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);

            }}
          >
            Dump HELP Interest
            
          </Button>
          
          </span>) : ''}
        
       
                 { /*
         <div>
       <Button
            style={{ marginTop: 8,width:'30%' }}
            disabled={cdaiAmount == '' ? true : false}
            onClick={async () => {
            
            console.log('accuring',cdaiAmount,'gwei dai to cdai contract:',readContracts.cDAI.address)
            const cdaiAmountWei = utils.parseEther(cdaiAmount).toString(10);
            
             const result = tx(writeContracts.cDAI.accrueCustom(cdaiAmountWei), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
              
              const result1 = tx(writeContracts.iHelp.drip(), update => {
             
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                  console.log(
                    " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                  );
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result1);
              console.log(await result1);
              
              setcDaiAmount('');
            
            }}
            
          >
           Accure cDAI Interest
          </Button>
        <Input
            placeholder={'Amount of interest to accrue to cDAI - e.g. 5 gwei'}
            onChange={e => {
              setcDaiAmount(e.target.value);
            }}
            value={cdaiAmount}
            style={{width:'70%'}}
          />
        </div>
        */} 
        
        <Divider />
        
          </Fragment>}
          
      </div>

    </div>
  );
}
