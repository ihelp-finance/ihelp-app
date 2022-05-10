import React, { useEffect, useState } from "react";
import st from "./styles/charity.module.css";
import {
  MdSearch,
  MdMenu,
  MdClose,
  MdEast,
  MdChatBubbleOutline,
}
from "react-icons/md";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
}
from "react-icons/fa";
import $ from "jquery";
import { Power4 } from "gsap/dist/gsap";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
// import Head from "next/head";
// import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import { useParams } from 'react-router-dom';
import { Input,Tabs,Spin,Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
import commafy from 'commafy';
import { utils } from "ethers";

import Address from "../components/Address";
import { Header,Footer } from "../components";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ContributeNew = (props) => {

  const { id } = useParams();
  const [charityInfo, setCharityInfo] = useState(null);
  const [showDepositInterest, setShowDepositInterest] = useState(false);
  const [showDepositDirect, setShowDepositDirect] = useState(false);
  const [showWithdrawInterest, setShowWithdrawInterest] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [inputAmount, setInputAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);
  
  const [contractNameHash, setcontractNameHash] = useState(null);
  
  const [daiCharityBalance, setdaiCharityBalance] = useState(null);
  const [daiCharityBalanceUSD, setdaiCharityBalanceUSD] = useState(null);
  const [daiTotalInterestEarned, setdaiTotalInterestEarned] = useState(null);
  const [daiCharityTotalBalance, setdaiCharityTotalBalance] = useState(null);
  const [daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD] = useState(null);
  const [daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD] = useState(null);
  
  const [usdcCharityBalance, setusdcCharityBalance] = useState(null);
  const [usdcCharityBalanceUSD, setusdcCharityBalanceUSD] = useState(null);
  const [usdcTotalInterestEarned, setusdcTotalInterestEarned] = useState(null);
  const [usdcCharityTotalBalance, setusdcCharityTotalBalance] = useState(null);
  const [usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD] = useState(null);
  const [usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD] = useState(null);
  
  const [allowanceCharityDAI, setallowanceCharityDAI] = useState(0);
  const [allowanceCharityUSDC, setallowanceCharityUSDC] = useState(0);

  const [daiBalance, setdaiBalance] = useState(null);
  const [usdcBalance, setusdcBalance] = useState(null);
  
  const charityDecimals = props.charityDecimals;

  useEffect(() => {
    
    if (props.readContracts != null) {
    // create the charity name hash
    const charityNames = {};
    Object.keys(props.readContracts).map((c)=>{
      if (c.indexOf('Proxy') == -1 && c.indexOf('Implementation') == -1) {
        charityNames[props.readContracts[c]['address']] = c
      }
    })
    console.log('charityNames',charityNames)
    setcontractNameHash(charityNames);

    let url = `/api/v1/data/charities/${id}`;
    fetch(url).then((d) => {
      return d.json();

    }).then((d) => {
      try {
        
        setCharityInfo(d.data);

        console.log('charityInfo', d.data);
        
        setTimeout(()=>{
          setCurrencies(d.data['Currencies'])
        },0)
        
      }
      catch (e) {}
    })
    }

  }, [props.readContracts]);

  useEffect(async() => {
    document.title = `iHelp | Charity (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);

  SwiperCore.use([Navigation, Pagination]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    /* Header on-scroll Animation */
    const headerAnim = gsap.timeline();
    headerAnim.fromTo(
      ".header", {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
      }, {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(5px)",
        scrollTrigger: {
          trigger: ".hero",
          start: "0% 0",
          end: "50% 0",
          scrub: 0.5,
          toggleActions: "start pause resume none",
        },
      }
    );
  }, []);

  /* Mobile Header */
  const openMobHeader = () => {
    $(".header").addClass("active-mob-header");
  };
  const closeMobHeader = () => {
    $(".header").removeClass("active-mob-header");
  };
  /* PC Anchors */
  const moveTo1 = () => {
    gsap.to(window, {
      scrollTo: {
        y: "#app",
      },
      ease: Power4.easeInOut,
      duration: 0.75,
    });
  };
  
  const handleModalClick = (e) => {
    
    //console.log(e.target.className)
    
    if (e.target.className.indexOf('hitbox') > -1 || e.target.className.indexOf('lightbox') > -1) {
      setShowDepositInterest(false);
      setShowDepositDirect(false);
      setShowWithdrawInterest(false);
      setInputAmount('')
    }
    
  }
  
  const handleCurrencyChange = (e) => {
    console.log(e);
    setInputAmount('')
  }
  
   const setValue = props.setValue;
  
  const updateContracts = async(contract) => {

   // console.log('updating values', contract);
    
    if (contract == 'init') {
      
      for (var i=0;i<currencies.length;i++) {

        const contractName = contractNameHash[charityInfo[`${currencies[i]} CharityPool`]];
 
        if (currencies[i] == 'DAI') {
          console.log('setting value',contractName);
          setValue(contractName, "balanceOf", [props.address], daiCharityBalance, setdaiCharityBalance);
          setValue(contractName, "balanceOfUSD", [props.address], daiCharityBalanceUSD, setdaiCharityBalanceUSD);
          setValue(contractName, "totalInterestEarned", null, daiTotalInterestEarned, setdaiTotalInterestEarned);
          setValue(contractName, "getAccountedBalance", null, daiCharityTotalBalance, setdaiCharityTotalBalance);
          setValue(contractName, "totalInterestEarnedUSD", null, daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD);
          setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
          setValue("DAI", "balanceOf", [props.address], daiBalance, setdaiBalance); 
          setValue("DAI", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityDAI, setallowanceCharityDAI);
        }
        else if (currencies[i] == 'USDC') {
          console.log('setting value',contractName);
          setValue(contractName, "balanceOf", [props.address], usdcCharityBalance, setusdcCharityBalance);
          setValue(contractName, "balanceOfUSD", [props.address], usdcCharityBalanceUSD, setusdcCharityBalanceUSD);
          setValue(contractName, "totalInterestEarned", null, usdcTotalInterestEarned, setusdcTotalInterestEarned);
          setValue(contractName, "getAccountedBalance", null, usdcCharityTotalBalance, setusdcCharityTotalBalance);
          setValue(contractName, "totalInterestEarnedUSD", null, usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD);
          setValue(contractName, "getAccountedBalanceUSD", null, usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD);
          setValue("USDC", "balanceOf", [props.address], usdcBalance, setusdcBalance); 
           setValue("USDC", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityUSDC, setallowanceCharityUSDC);
        }
        
      }

      // setValue("charityPool1", "balanceOf", [address], charityPool1Balance, setcharityPool1Balance);
      // setValue("charityPool1", "totalInterestEarned", null, charityPool1TotalInterestEarned, setcharityPool1TotalInterestEarned);
      // setValue("charityPool1", "getAccountedBalance", null, charityPool1TotalBalance, setcharityPool1TotalBalance);
      
      
      // setValue("iHelp", "stakingPool", null, iHelpStakingPool, setiHelpStakingPool);
      // setValue("iHelp", "developmentPool", null, iHelpDevelopmentPool, setiHelpDevelopmentPool);
      // setValue("iHelp", "holdingPool", null, iHelpCharityPool, setiHelpCharityPool);
      
      // setValue("iHelp", "allowance", [props.address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
      
      // setValue("DAI", "allowance", [props.address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setAllowanceCharity2);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      // //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // setValue("USDC", "allowance", [props.address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      // //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      // setValue("charityPool1", "tokenname", null, charityPool1Token, setcharityPool1Token);
      // setValue("charityPool2", "tokenname", null, charityPool2Token, setcharityPool2Token);
      // setValue("charityPool3", "tokenname", null, charityPool3Token, setcharityPool3Token);
      
      // setValue("DAI", "decimals", null, charityPool1Decimals, setcharityPool1Decimals);
      // setValue("USDC", "decimals", null, charityPool2Decimals, setcharityPool2Decimals);
      // //setValue("charityPool3", "decimals", null, charityPool3Decimals, setcharityPool3Decimals);

      // setValue("ETH", "balance", null, ethBalance, setEthBalance);


      // if (targetNetwork.name.indexOf("local") == -1) {
        
      //   getLeaderboard();
        
      //   setInterval(()=>{
      //     getLeaderboard();
      //   },30000);
      
      // }
      

    }

    if (contract == 'DAI' || contract == 'all') {
      
      if (currencies.indexOf('DAI') > -1) {
        setValue("DAI", "balanceOf", [props.address], daiBalance, setdaiBalance); 
      }

      // setValue("DAI", "balanceOf", [props.address], daiBalance, setDaiBalance);
      // setValue("DAI", "balanceOf", [iHelpStakingPool], iHelpStakingPoolBalanceDAI, setiHelpStakingPoolBalanceDAI);
      // setValue("DAI", "balanceOf", [iHelpDevelopmentPool], iHelpDevelopmentPoolBalanceDAI, setiHelpDevelopmentPoolBalanceDAI);
      // setValue("DAI", "balanceOf", [iHelpCharityPool], iHelpCharityPoolBalanceDAI, setiHelpCharityPoolBalanceDAI);

      // setValue("DAI", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setdaiAllowanceCharity2);
      // setValue("DAI", "allowance", [address, readContracts.charityPool3.address], allowanceCharity3, setAllowanceCharity3);
      
    }
    
    if (contract == 'USDC' || contract == 'all') {

      if (currencies.indexOf('USDC') > -1) {
        setValue('USDC', "balanceOf", [props.address], usdcBalance, setusdcBalance);
      }

      // setValue("USDC", "balanceOf", [props.address], usdcBalance, setUsdcBalance);

      // //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], daiAllowanceCharity1, setdaiAllowanceCharity1);
      // setValue("USDC", "allowance", [address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      // //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

    }
    
    if (contract != 'init') {
      for (var i=0;i<currencies.length;i++) {
  
        const contractName = contractNameHash[charityInfo[`${currencies[i]} CharityPool`]];
        
        if (contractName == contract) {
  
          if (currencies[i] == 'DAI') {
            //console.log('setting value',contractName);
            setValue(contractName, "balanceOf", [props.address], daiCharityBalance, setdaiCharityBalance);
            setValue(contractName, "balanceOfUSD", [props.address], daiCharityBalanceUSD, setdaiCharityBalanceUSD);
            setValue(contractName, "totalInterestEarned", null, daiTotalInterestEarned, setdaiTotalInterestEarned);
            setValue(contractName, "getAccountedBalance", null, daiCharityTotalBalance, setdaiCharityTotalBalance);
            setValue(contractName, "totalInterestEarnedUSD", null, daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
            setValue("DAI", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityDAI, setallowanceCharityDAI);
            
          }
          else if (currencies[i] == 'USDC') {
           // console.log('setting value',contractName);
            setValue(contractName, "balanceOf", [props.address], usdcCharityBalance, setusdcCharityBalance);
            setValue(contractName, "balanceOfUSD", [props.address], usdcCharityBalanceUSD, setusdcCharityBalanceUSD);
            setValue(contractName, "totalInterestEarned", null, usdcTotalInterestEarned, setusdcTotalInterestEarned);
            setValue(contractName, "getAccountedBalance", null, usdcCharityTotalBalance, setusdcCharityTotalBalance);
            setValue(contractName, "totalInterestEarnedUSD", null, usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD);
            setValue("USDC", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityUSDC, setallowanceCharityUSDC);
            
          }
        
        }
        
      }
    }

    if (contract == 'iHelp' || contract == 'all') {
      // setValue("iHelp", "balanceOf", [address], iHelpBalance, setiHelpBalance);
      // setValue("iHelp", "tokenPhase", null, iHelpTokenPhase, setiHelpTokenPhase);
      // setValue("iHelp", "currentTokensPerInterest", null, iHelpTokensPerPhase, setiHelpTokensPerPhase);
      // setValue("iHelp", "totalCirculating", null, iHelpCirculating, setiHelpCirculating);
      // setValue("iHelp", "totalAvailableSupply", null, iHelpSupply, setiHelpSupply);
      // setValue("iHelp", "getClaimableTokens", [address], iHelpClaimable, setiHelpClaimable);
      // setValue("iHelp", "numberOfCharities", null, iHelpRegisteredCharities, setiHelpRegisteredCharities);
      // setValue("iHelp", "getTotalCharityPoolInterest", null, iHelpTotalInterest, setiHelpTotalInterest);
      // setValue("iHelp", "allowance", [address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
    }
    
    if (contract == 'xHelp' || contract == 'all') {
    
      // setValue("xHelp", "balanceOf", [address], xHelpBalance, setxHelpBalance);
      // setValue("xHelp", "totalSupply", null, xHelpSupply, setxHelpSupply);
      // setValue("xHelp", "exchangeRateCurrent", null, xHelpValue, setxHelpValue);
    
    }

  };

  const onAction = async (currency) => {
    
    let action = null;
    if (showDepositInterest == true) {
      action = 'deposit';
    } else if  (showWithdrawInterest == true) {
      action = 'withdraw';
    } else if  (showDepositDirect == true) {
      action = 'donate';
    }

    console.log('action',action,currency,inputAmount);
    
    if (action == 'deposit') {
      
      console.log('sponsoring',inputAmount,'gwei dai to charity:',charityInfo[`${currency} CharityPool`])
      
      setLoading(true)
      
      const sponsorAmountWei = utils.parseUnits(inputAmount,charityDecimals[currency]).toString();
      
      const contractName = contractNameHash[charityInfo[`${currency} CharityPool`]];
        
      const sponsorTx = props.tx(props.writeContracts[contractName].sponsor(sponsorAmountWei), update => {
       
          console.log("Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log("Transaction " + update.hash + " finished!");
            console.log(
              "" +
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
        
        // setTimeout(()=>{
           
           setLoading(false)
           setInputAmount('')
           setShowDepositInterest(false);
           setShowDepositDirect(false);
           setShowWithdrawInterest(false);
         
        // },1000)

    }
    
    else if (action == 'withdraw') {
      
      console.log('withdrawing',inputAmount,'gwei dai to charity:',charityInfo[`${currency} CharityPool`])
      
      setLoading(true)
      
      const withdrawAmountWei = utils.parseUnits(inputAmount,charityDecimals[currency]).toString();
      
      const contractName = contractNameHash[charityInfo[`${currency} CharityPool`]];
        
      const sponsorTx = props.tx(props.writeContracts[contractName].withdrawAmount(withdrawAmountWei), update => {
       
          console.log("Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log("Transaction " + update.hash + " finished!");
            console.log(
              "" +
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
        
        // setTimeout(()=>{
           
           setLoading(false)
           setInputAmount('')
           setShowDepositInterest(false);
           setShowDepositDirect(false);
           setShowWithdrawInterest(false);
         
        // },1000)
      
    }
    
    if (action == 'donate') {
      
      console.log('donating',inputAmount,'gwei dai to charity:',charityInfo[`${currency} CharityPool`])
      
      setLoading(true)
      
      const donationAmountWei = utils.parseUnits(inputAmount,charityDecimals[currency]).toString();
      
      const contractName = contractNameHash[charityInfo[`${currency} CharityPool`]];
        
      const sponsorTx = props.tx(props.writeContracts[contractName].directDonation(donationAmountWei), update => {
       
          console.log("Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log("Transaction " + update.hash + " finished!");
            console.log(
              "" +
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
        
        // setTimeout(()=>{
           
           setLoading(false)
           setInputAmount('')
           setShowDepositInterest(false);
           setShowDepositDirect(false);
           setShowWithdrawInterest(false);
         
        // },1000)
              
     
    }
    
  }
  
  const handleMaxClick = (currency) => {
    console.log(currency);
    
    let action = null;
    if (showDepositInterest == true) {
      action = 'deposit';
    } else if  (showWithdrawInterest == true) {
      action = 'withdraw';
    } else if  (showDepositDirect == true) {
      action = 'donate';
    }
    
    if (action == 'deposit' || action == 'donate') {
      if (currency == 'DAI') {
        setInputAmount(parseFloat(utils.formatUnits(daiBalance,charityDecimals['DAI'])).toFixed(6))
      } else if (currency == 'USDC') {
        setInputAmount(parseFloat(utils.formatUnits(usdcBalance,charityDecimals['USDC'])).toFixed(6))
      }
    }
    else if (action == 'withdraw') {
      if (currency == 'DAI') {
        setInputAmount(parseFloat(utils.formatUnits(daiCharityBalance,charityDecimals['DAI'])).toFixed(6))
      } else if (currency == 'USDC') {
        setInputAmount(parseFloat(utils.formatUnits(usdcCharityBalance,charityDecimals['USDC'])).toFixed(6))
      }
    }
    
  }

  const enableCurrency = async(currency) => {
   
   console.log('sponsoring',inputAmount,'gwei dai to charity:',charityInfo[`${currency} CharityPool`])
      
    setLoading(true)
    
    const contractName = contractNameHash[charityInfo[`${currency} CharityPool`]];
    
    const sponsorTx = props.tx(props.writeContracts[currency].approve(props.readContracts[contractName].address, utils.parseEther('100000000000').toString()), update => {
      
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
    
         setLoading(false)
         setInputAmount('')
        // setShowDepositInterest(false);
        // setShowDepositDirect(false);
        // setShowWithdrawInterest(false);
    
  }


  const currencyTabs = currencies.map((d,i) => {
    
    let currencyApproved = false;
    // ensure the contract action is enabled
    if (d == 'DAI' && parseFloat(utils.formatEther(allowanceCharityDAI)) >= 100000000) {
      currencyApproved = true;
    }
    else if (d == 'USDC' && parseFloat(utils.formatEther(allowanceCharityUSDC)) >= 100000000) {
      currencyApproved = true;
    }

    return (
      <TabPane tab={
          <span>
            <img src={`/assets/icons/${d.toUpperCase()}.svg`} style={{height:'20px',marginRight:'5px'}}/>
            {d}.e
          </span>
        } key={d}>
        
        { currencyApproved ? (<span>
        
          {loading ? (<Spin indicator={antIcon} />) :  
      <span><Input
          //style={{width:'100%',display: ''}}
          type='number'
          className={st.inputStyle}
           placeholder={`0`}
           autoFocus
           step="0.1"
            onChange={e => {
                setInputAmount(e.target.value);
            }}
            value={inputAmount}
        /> 
        <button className={st.maxButton} onClick={(e)=>{handleMaxClick(d)}}>Max</button>
           </span>
      }
        <div className={st.charityBtnGrd}>
        
          <button className="grd-btn" 
            onClick={(e)=>onAction(d)}
            disabled={loading || inputAmount == 0}
          >
            {showDepositInterest ? `Deposit ${d}.e` :
             showWithdrawInterest ? `Withdraw ${d}.e` :
             showDepositDirect ? `Donate ${d}.e` : ''}
          </button>
          
          <Address address={charityInfo[`${d} CharityPool`]} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />

          </div>
        
        </span>) : loading ? (<Spin indicator={antIcon} />) : 
        
        <button className="grd-btn" style={{width:'100%',height:'80px',fontSize:'20px',fontWeight:'600'}} onClick={(e)=>enableCurrency(d)}>ENABLE</button>
          
        }

      </TabPane>
      )
  });

  const listener = (blockNumber, contract) => {
    if (contract != undefined) {
      //console.log(contract, blockNumber); // , fn, args, provider.listeners()
      updateContracts(contract);
    }
  };

  // console.log(init,currencies,charityInfo,contractNameHash)

  if (init == false && currencies.length > 0 && charityInfo != null && contractNameHash != null) {
      
      setInit(true);
     
    const contractsToListen = [];
    Object.keys(contractNameHash).map((c)=>{
        contractsToListen.push(contractNameHash[c]);
    });
    
    console.log('contractsToListen',contractsToListen);

    contractsToListen.map(c => {
      // not the most efficient because this will update on each block
      props.readContracts[c].provider.on("block", (block) => { listener(block, c) });
    });
    
    updateContracts('init');
    
    }
    
  let totalInterestUSD = 0;
  if (usdcTotalInterestEarned != null) {
    totalInterestUSD += parseFloat(utils.formatUnits(usdcTotalInterestEarned,charityDecimals['USDC']))
  }
  if (daiTotalInterestEarned != null) {
    totalInterestUSD += parseFloat(utils.formatUnits(daiTotalInterestEarned,charityDecimals['DAI']))
  }
  
  let totalBalanceUSD = 0;
  if (usdcCharityTotalBalance != null) {
    totalBalanceUSD += parseFloat(utils.formatUnits(usdcCharityTotalBalance,charityDecimals['USDC']))
  }
  if (daiCharityTotalBalance != null) {
    totalBalanceUSD += parseFloat(utils.formatUnits(daiCharityTotalBalance,charityDecimals['DAI']))
  }
  
  let myBalanceUSD = 0;
  if (usdcCharityBalance != null) {
    myBalanceUSD += parseFloat(utils.formatUnits(usdcCharityBalance,charityDecimals['USDC']))
  }
  if (daiCharityBalance != null) {
    myBalanceUSD += parseFloat(utils.formatUnits(daiCharityBalance,charityDecimals['DAI']))
  }
  
  let depositEnabled = false;
  // DEPOSIT ALWAYS DISABLED SINCE WE ARE REDEPLOYING
  if (daiBalance > 0 || usdcBalance > 0) {
    depositEnabled = true;
  }
  
  let withdrawEnabled = false;
  if (daiCharityBalance > 0 || usdcCharityBalance > 0) {
    withdrawEnabled = true;
  }
  
  return (
    <div id="app" className="app">
      {/*<Head>
        <title>iHelp | Charity</title>
      </Head>*/}
      <img src="/assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header {...props}/>
      
      {showDepositInterest || showDepositDirect || showWithdrawInterest ? (<div id="deposit_withdraw_modal">
        <div className={st.lightbox} offset="0" opacity="0.4" onClick={handleModalClick}>
          <div className={st.container}>
            <div className={st.hitbox} ></div>
              <div className={st.card}>
                <div className={st.wrapper}>
                  <div className={st.providercontainer}>
                  <div className={st.icon}></div>
                  <div className={st.name}>{showDepositInterest ? `Donate Interest to ${charityInfo['Organization Name']}` : 
                                            showWithdrawInterest ? `Withdraw Principal from ${charityInfo['Organization Name']}` : 
                                            showDepositDirect ? `Direct Donation to ${charityInfo['Organization Name']}` : ''}</div>
                  <div className={st.description}>{showDepositInterest ? `This donation will only contribute your currency and specifically donate the interest generated over time. You can return your contribution at any time.` : 
                                            showWithdrawInterest ? `This will withdraw your currency contribution principal balance.` : 
                                            showDepositDirect ? `This form of donation will be a simple currency transfer to the charity. These donated funds are not reclaimable.` : ''}</div>
                  <Tabs style={{width:'100%'}} onChange={handleCurrencyChange}>
                    {currencyTabs}
                  </Tabs>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>) : ''}

       {charityInfo ? (<div className={st.charity + " " + "section"}>
        <div className="box">
          {/* Charity Top Overviw */}
          <div className={st.charityOverviewGrid}>
            <div className={st.charityImageText}>
              <img src={`${charityInfo['Logo']}`} alt="" />
              <main>
                <h6>{charityInfo['Organization Name']}</h6>
                <p>
                  <span style={{fontStyle:'italic'}}>Brief Description:<br/><span style={{fontWeight:'bold'}}>{charityInfo['Short Description for Front of Card']}</span></span>
                  <br /><a href={charityInfo['Organization Website']} target="_blank">{charityInfo['Organization Website']}</a>
                  <br /> <br />
                  Charity Category: {charityInfo['Charity GENERAL Category (One Cell)']}<br />
                  Country of Incorporation: {charityInfo['Country of Incorporation']}<br />
                  Organization Type: {charityInfo['Organization Type']}<br />
                  Tax ID Number: {charityInfo['Tax ID Number']}<br />
                  Year Incorporated: {charityInfo['Year Incorporated']}<br />
                  Charity Wallet: {charityInfo['Charity Wallet Address'] == 'off-chain' ? <a href="https://institutions.binance.us/account/login" target="_blank">Binance</a> : <Address address={charityInfo['Charity Wallet Address']} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} /> }
                </p>
              </main>
            </div>
            <div className={st.charityTextBoxes}>
              <main>
                <h6>Total Capital Pooled: <span className={st.darkText}><Tooltip title={'USD Fiat'} placement="right" >${commafy(totalBalanceUSD.toFixed(2))}</Tooltip></span></h6>
                {currencies.indexOf('DAI') > -1 ?<div style={{marginLeft:'10px'}}>
                  <Tooltip title={'DAI.e'} placement="right" >
                    <img src={`/assets/icons/DAI.svg`} style={{height:'20px',marginRight:'5px'}}/>
                    {daiCharityTotalBalance ? commafy(parseFloat(utils.formatUnits(daiCharityTotalBalance,charityDecimals['DAI'])).toFixed(2)) : "..."}
                  </Tooltip>
                </div> : ''}
                {currencies.indexOf('USDC') > -1 ?<div style={{marginLeft:'10px'}}>
                <Tooltip title={'USDC.e'} placement="right" >
                  <img src={`/assets/icons/USDC.svg`} style={{height:'20px',marginRight:'5px'}}/>
                  {usdcCharityTotalBalance ? commafy(parseFloat(utils.formatUnits(usdcCharityTotalBalance,charityDecimals['USDC'])).toFixed(2)) : "..."}
                  </Tooltip>
                </div> : ''}
                <h6 style={{marginTop:'10px'}}>Total Interest Generated: <span className={st.darkText}><Tooltip title={'USD Fiat'} placement="right" >${commafy(totalInterestUSD.toFixed(2))}</Tooltip></span></h6>
                {currencies.indexOf('DAI') > -1 ?<div style={{marginLeft:'10px'}}>
                <Tooltip title={'DAI.e'} placement="right" >
                  <img src={`/assets/icons/DAI.svg`} style={{height:'20px',marginRight:'5px'}}/>
                  {daiTotalInterestEarned ? commafy(parseFloat(utils.formatUnits(daiTotalInterestEarned,charityDecimals['DAI'])).toFixed(2)) : "..."}
                  </Tooltip>
                </div> : ''}
                {currencies.indexOf('USDC') > -1 ?<div style={{marginLeft:'10px'}}>
                <Tooltip title={'USDC.e'} placement="right" >
                  <img src={`/assets/icons/USDC.svg`} style={{height:'20px',marginRight:'5px'}}/>
                  {usdcTotalInterestEarned ? commafy(parseFloat(utils.formatUnits(usdcTotalInterestEarned,charityDecimals['USDC'])).toFixed(2)) : "..."}
                </Tooltip>
                </div> : ''}
                {/*<h6>Total Direct Donations Received: $0</h6>*/}
              </main>
              <main>
                <h6>Your Deposits: <span className={st.darkText}><Tooltip title={'USD Fiat'} placement="right" >${commafy(myBalanceUSD.toFixed(2))}</Tooltip></span></h6>
                {currencies.indexOf('DAI') > -1 ? <div style={{marginLeft:'10px'}}>
                <Tooltip title={'DAI.e'} placement="right" >
                  <img src={`/assets/icons/DAI.svg`} style={{height:'20px',marginRight:'5px'}}/>
                  {daiCharityBalance ? commafy(parseFloat(utils.formatUnits(daiCharityBalance,charityDecimals['DAI'])).toFixed(2)) : "..."}
                </Tooltip>
                </div> : ''}
                {currencies.indexOf('USDC') > -1 ?<div style={{marginLeft:'10px'}}>
                <Tooltip title={'USDC.e'} placement="right" >
                  <img src={`/assets/icons/USDC.svg`} style={{height:'20px',marginRight:'5px'}}/>
                  {usdcCharityBalance ? commafy(parseFloat(utils.formatUnits(usdcCharityBalance,charityDecimals['USDC'])).toFixed(2)) : "..."}
                </Tooltip>
                </div> : ''}
                {/*<h6>Your % of Charity Pool: 25%</h6>*/}
              </main>
            </div>
          </div>
          
           <div className={st.charityButtonsGrid} style={{marginTop:'-36px',marginBottom:'36px'}}>
                <main>
                  <h6>Donate Interest</h6>
                  <div className={st.charityBtnGrd} style={{gridTemplateColumns:'repeat(2,1fr)'}}>
                    <button disabled={props.web3Modal && props.web3Modal.cachedProvider && depositEnabled ? false : true} className="grd-btn" onClick={(e)=>setShowDepositInterest(true)}>Deposit</button>
                    <button disabled={props.web3Modal && props.web3Modal.cachedProvider && withdrawEnabled ? false : true} className="grd-btn" onClick={(e)=>setShowWithdrawInterest(true)}>Withdraw</button>
                  </div>
                </main>
                <main>
                  <h6>Donate Principal</h6>
                  <div className={st.charityBtnGrd}>
                    <button disabled={props.web3Modal && props.web3Modal.cachedProvider && depositEnabled ? false : true} className="grd-btn" onClick={(e)=>setShowDepositDirect(true)}>Direct Donate</button>
                  </div>
                </main>
              </div>
          

          {/* Charity Videos and Messages Grid */}
          <div className={st.videoMessagesGrid}>
            <div className={st.charityVideos}>
              <h1>Video Updates</h1>
              
              {charityInfo && charityInfo['Videos'] != '' ? charityInfo['Videos'].split('\n').map((d,i) => {
              return (
                <div className={st.charityVideoBox}>
                  {/*<video
                    controls
                    muted
                    autoPlay
                    loop
                    src="../assets/earth.mp4"
                    ></video>*/}
                  <iframe height={'180px'} src={d.indexOf('facebook') > -1 ? d : `https://www.youtube.com/embed/${d}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                  {/*<h6>Uploaded: October 16, 2021</h6>*/}
                </div>
              )}) : 'no videos...'}
            </div>
            
  
            
            <div className={st.charityMessages}>
              <main>
                <h2>Description & History</h2>
                <h6>
                  {charityInfo['Brief Description & History']}
                </h6>
              </main>
              <main>
                <h2>Main Areas of Operation</h2>
                <h6>
                  {charityInfo['Main Areas of Operation']}
                </h6>
              </main>
              <main>
                <h2>Message Updates</h2>
                
                {charityInfo && charityInfo['Messages'] != '' ? charityInfo['Messages'].split('\n').map((d,i) => {
              return (
                
                <div className={st.charityMessageBox}>
                  <div className={st.Charitymessage}>
                    <MdChatBubbleOutline />
                    <p>
                      <span className="content" dangerouslySetInnerHTML={{__html: d}} />
                    </p>
                  </div>
                  {/*<h6>Uploaded: November 15, 2035</h6>*/}
                </div>
                
                 )}) : 'no messages...'}
                 
               
                {/*<a className={st.seeAllMessages} href="#">
                  See all messages <MdEast />
                </a>*/}
              </main>
             
            </div>
          </div>
        </div>
      </div>) : ''}
      
       <Footer {...props}/>
       
    </div>
  );
};

export default ContributeNew;
