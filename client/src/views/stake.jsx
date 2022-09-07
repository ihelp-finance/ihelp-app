import React, { useEffect, useState,useRef } from "react";
import st from "./styles/stake.module.css";
import {
  MdSearch,
  MdMenu,
  MdClose,
  MdKeyboardArrowLeft,
  MdEdit,
  MdOutlineFilterList,
  MdEast,
  MdKeyboardArrowRight,
  MdChatBubbleOutline,
  MdContentCopy,
} from "react-icons/md";
import { FaTwitter, FaCopy } from "react-icons/fa";
import $ from "jquery";
// import { useRouter } from "next/router";
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
import {
  LineChart,
  Scatter,
  ScatterChart,
  Line,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
}
from "recharts";
import commafy from 'commafy';
import { utils } from "ethers";
import moment from 'moment'
import { Header, Footer } from "../components";

import { Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;

import {StakeStake, StakeUnstake} from "./tabs";

const ContributeNew = (props) => {
  
  const [exchangeChartData, setexchangeChartData] = useState([]);
  const [rewardChartData, setrewardChartData] = useState([]);
  const [apyChartData, setapyChartData] = useState([]);
  const [stakingStats, setstakingStats] = useState(null);
  
  const [ihelpSupply, setihelpSupply] = useState(null);
  const [ihelpCirculating, setihelpCirculating] = useState(null);
  const [ihelpStaked, setihelpStaked] = useState(null);
  const [xhelpSupply, setxhelpSupply] = useState(null);
  const [xhelpCash, setxhelpCash] = useState(null);
  const [xhelpAPY, setxhelpAPY] = useState(null);
  const [ihelpBalance, setihelpBalance] = useState(null);
  const [xhelpBalance, setxhelpBalance] = useState(null);
  const [claimableReward, setclaimableReward] = useState(null);
  const [exchangeRate, setexchangeRate] = useState(null);
  const [amount, setAmount] = useState('');
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [allowanceStaking, setAllowanceStaking] = useState(null);
  
  const [contractNameHash, setcontractNameHash] = useState(null);
  

    const DashboardIcon = () => (
    <svg width="202" height="202" className={""} viewBox="0 0 202 202" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M169.835 28.3467H19.5569C8.77319 28.3467 0 37.1199 0 47.904V50.5568C0 61.3405 8.77319 70.1137 19.5569 70.1137H169.836C171.475 70.1137 172.803 68.7857 172.803 67.1469V31.3136C172.803 29.6747 171.475 28.3467 169.835 28.3467Z" fill="#BB98EA"/>
<path d="M0.809973 42.3438C0.285641 44.1073 0 45.9719 0 47.9039V50.5567C0 61.3404 8.77319 70.1136 19.5569 70.1136H169.836C171.475 70.1136 172.803 68.7856 172.803 67.1467V56.3299H19.5569C10.6918 56.3295 3.20912 50.4297 0.809973 42.3438Z" fill="#8B49DB"/>
<path d="M94.5647 19.2232L83.2933 7.95225C82.1349 6.79391 80.2562 6.79391 79.0971 7.95225L22.0013 65.048C21.1526 65.8971 20.8989 67.1726 21.3586 68.2816C21.8174 69.3906 22.9 70.1134 24.0998 70.1134H46.6421C47.4288 70.1134 48.1835 69.801 48.7402 69.2447L94.565 23.4199C95.1213 22.8632 95.4338 22.1088 95.4338 21.3217C95.4338 20.5346 95.1209 19.7803 94.5647 19.2232Z" fill="#78AA17"/>
<path d="M30.5843 56.4648L22.0013 65.0479C21.1526 65.8969 20.8989 67.1724 21.3586 68.2815C21.8174 69.3905 22.9 70.1133 24.0998 70.1133H46.6421C47.4288 70.1133 48.1835 69.8008 48.7402 69.2445L61.5195 56.4652H30.5843V56.4648Z" fill="#6D8915"/>
<path d="M162.931 65.048L105.836 7.95225C104.677 6.79391 102.798 6.79391 101.639 7.95225L44.5437 65.048C43.6951 65.8971 43.4414 67.1726 43.9011 68.2816C44.3599 69.3906 45.4425 70.1134 46.6423 70.1134H160.834C162.034 70.1134 163.116 69.3906 163.575 68.2816C164.033 67.1726 163.78 65.8967 162.931 65.048Z" fill="#8ACC19"/>
<path d="M44.5437 65.0479C43.6951 65.8969 43.4414 67.1724 43.9011 68.2815C44.3599 69.3905 45.4425 70.1133 46.6423 70.1133H160.834C162.034 70.1133 163.116 69.3905 163.575 68.2815C164.034 67.1724 163.781 65.8969 162.932 65.0479L154.349 56.4648H53.1268L44.5437 65.0479Z" fill="#78A017"/>
<path d="M146.183 65.3146L114.484 33.6149C113.927 33.0586 113.172 32.7461 112.386 32.7461C111.599 32.7461 110.845 33.0586 110.287 33.6149C108.583 35.32 106.316 36.259 103.905 36.259C101.494 36.259 99.2276 35.3204 97.5228 33.6152C96.9665 33.0586 96.2118 32.7461 95.4247 32.7461C94.6376 32.7461 93.8832 33.0586 93.3265 33.6149L61.6268 65.3146C60.7781 66.1637 60.5244 67.4392 60.9841 68.5482C61.4429 69.6573 62.5255 70.38 63.7253 70.38H144.085C145.285 70.38 146.368 69.6573 146.827 68.5482C147.285 67.4392 147.031 66.1633 146.183 65.3146Z" fill="#78A017"/>
<path d="M61.5042 65.0479C60.6556 65.8969 60.4019 67.1724 60.8615 68.2815C61.3203 69.3905 62.4029 70.1133 63.6027 70.1133H143.963C145.163 70.1133 146.245 69.3905 146.704 68.2815C147.163 67.1724 146.91 65.8969 146.061 65.0479L137.478 56.4648H70.0868L61.5042 65.0479Z" fill="#6D8915"/>
<path d="M188.272 64.1793H47.1165H20.8833H16.0448C7.5245 64.1793 0.5555 57.5515 0.00315625 49.1709C0.00276172 49.1906 0 49.2104 0 49.2313V49.2317V174.034C0 185.549 9.36814 194.917 20.8833 194.917H188.272C189.911 194.917 191.239 193.589 191.239 191.95V67.1461C191.239 65.5077 189.911 64.1793 188.272 64.1793Z" fill="#BB98EA"/>
<path d="M191.239 115.142H159.304C147.376 115.142 137.671 124.846 137.671 136.775C137.671 148.702 147.375 158.407 159.304 158.407H191.239V115.142Z" fill="#8B49DB"/>
<path d="M193.099 107.522H159.303C147.376 107.522 137.671 117.226 137.671 129.155C137.671 141.082 147.375 150.787 159.303 150.787H193.099C198.007 150.787 202 146.794 202 141.886V116.423C202 111.515 198.007 107.522 193.099 107.522Z" fill="#A06CE2"/>
<path d="M161.816 119.475C156.48 119.475 152.138 123.817 152.138 129.154C152.138 134.49 156.48 138.832 161.816 138.832C167.152 138.832 171.495 134.49 171.495 129.154C171.495 123.817 167.152 119.475 161.816 119.475Z" fill="#F0E6FA"/>
<path d="M102.86 145.751C97.6735 145.751 93.3436 149.322 92.0965 154.121H77.7508C74.6736 154.121 72.171 151.618 72.171 148.541V131.802H92.0965C93.3436 136.6 97.6735 140.171 102.86 140.171C109.014 140.171 114.02 135.166 114.02 129.012C114.02 122.857 109.014 117.852 102.86 117.852C97.6735 117.852 93.3436 121.423 92.0965 126.222H72.171V109.482C72.171 103.328 67.166 98.3228 61.0114 98.3228H57.8254C56.5783 93.5242 52.2484 89.9531 47.0619 89.9531C40.9074 89.9531 35.9023 94.9582 35.9023 101.113C35.9023 107.267 40.9074 112.272 47.0619 112.272C52.2484 112.272 56.5783 108.701 57.8254 103.903H61.0114C64.0887 103.903 66.5912 106.405 66.5912 109.482V148.541C66.5912 154.696 71.5963 159.701 77.7508 159.701H92.0965C93.3436 164.499 97.6735 168.07 102.86 168.07C109.014 168.07 114.02 163.065 114.02 156.911C114.02 150.756 109.014 145.751 102.86 145.751ZM102.86 123.432C105.937 123.432 108.44 125.934 108.44 129.012C108.44 132.089 105.937 134.592 102.86 134.592C99.7827 134.592 97.2801 132.089 97.2801 129.012C97.2801 125.934 99.7827 123.432 102.86 123.432ZM47.0619 106.693C43.9847 106.693 41.4821 104.19 41.4821 101.113C41.4821 98.0355 43.9847 95.5329 47.0619 95.5329C50.1392 95.5329 52.6417 98.0355 52.6417 101.113C52.6417 104.19 50.1392 106.693 47.0619 106.693ZM102.86 162.491C99.7827 162.491 97.2801 159.988 97.2801 156.911C97.2801 153.833 99.7827 151.331 102.86 151.331C105.937 151.331 108.44 153.833 108.44 156.911C108.44 159.988 105.937 162.491 102.86 162.491Z" fill="white"/>
</svg>
  )
  
  const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

  const [inputRef, setInputFocus] = useFocus()
  
  const [mode, setMode] = useState('stake');
  
  useEffect(async() => {
    document.title = `iHelp | Staking (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);
  
  const setValue = props.setValue;
 
   const updateStats = (c) => {
    
    setTimeout(()=>{
      
      if (props && props.address && props.address != '0x0000000000000000000000000000000000000000') {

        setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
        setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
        
        setValue("iHelp", "allowance", [props.address,props.readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
        
        //setValue("xHelp", "claimableRewardOf", [props.address], claimableReward, setclaimableReward);
        //setValue("iHelp", "totalSupply", null, ihelpSupply, setihelpSupply);
        //setValue("iHelp", "totalCirculating", null, ihelpCirculating, setihelpCirculating);
        
        props.readContracts["xHelp"]["claimableRewardOf"](props.address).then((d) => {
          
          console.log('claimableRewardOf',parseFloat(utils.formatUnits(d,18)))
          
          setclaimableReward(d)
        }).catch((e)=>{
          setclaimableReward('0')
        })
        
      
      }
      
      setValue("xHelp", "totalSupply", null, xhelpSupply, setxhelpSupply);
      
      props.readContracts["analytics"]["stakingPoolState"](props.readContracts['iHelp'].address,props.readContracts['xHelp'].address).then((d) => {
        
        console.log('stakingPoolState',parseFloat(utils.formatUnits(d['iHelpTokensInCirculation'],1)))
        
        setihelpCirculating(d['iHelpTokensInCirculation'])
        setihelpStaked(d['iHelpStaked'])
        
      });
      
      /*
      setValue("iHelp", "totalSupply", null, ihelpSupply, setihelpSupply);
      setValue("iHelp", "totalCirculating", null, ihelpCirculating, setihelpCirculating);
      setValue("xHelp", "totalSupply", null, xhelpSupply, setxhelpSupply);
      
      //setValue("xHelp", "getCash", null, xhelpCash, setxhelpCash);
      //setValue("xHelp", "exchangeRateCurrent", null, exchangeRate, setexchangeRate);
      
      */
      
    },10)
    

    let url = `/api/v1/data/stakingstats`;
    //console.log(url);
    fetch(url).then((d) => {
      if (d.ok) {
        return d.json()
      }
      // else {
      //   setTimeout(() => {
      //     updateStats();
      //   }, 60000);
      // }
    }).then((d) => {
     // console.log(d);
      
      // setihelpSupply(0);
      // setihelpCirculating(0);
      // setxhelpSupply(0);
      // setxhelpCash(0);
      // setxhelpAPY(0);
      
        try{
         setrewardChartData(d['rewardovertime']);
        }catch(e){}
       
    })

    
  }
  
  
  useEffect(async() => {
    if (props && props.readContracts) { 
      updateStats()
    }
  }, [props.readContracts,props.address]);
  
  if (props.readContracts && statsLoaded == false) {

    setStatsLoaded(true);
  
  const listener = (blockNumber, contract) => {
    if (contract != undefined) {
      console.log('UPDATING CONTRACTS');
      //.log(contract, blockNumber); // , fn, args, provider.listeners()
      updateStats(contract);
    }
  };
  
  // updateStats();
  
   const contractsToListen = ['iHelp']
   
    contractsToListen.map(c => {
      props.readContracts[c].provider.removeAllListeners("block");
      props.readContracts[c].provider.on("block", (block) => { listener(block, c) });

    });

  
  }
  
  SwiperCore.use([Navigation, Pagination]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    /* Header on-scroll Animation */
    const headerAnim = gsap.timeline();
    headerAnim.fromTo(
      ".header",
      {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
      },
      {
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
  /*   const TogActiveBtn = () => {
    $("#stake").toggleClass(" grd-btn white-btn");
    $("#unstake").toggleClass(" grd-btn white-btn");
  }; */

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
  
  const handleStake = async() => {

    console.log('staking',amount,'HELP tokens to xHELP staking contract:',props.readContracts.xHelp.address)
    const stakeAmountWei = utils.parseEther(amount).toString(10);
    
    setAmount('');
    
      const sponsorTx = props.tx(props.writeContracts.xHelp.deposit(stakeAmountWei), update => {
     
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
    
  }
  
  const handleTokenAdd = async() => {
      
    const tokenAddress = props.readContracts['iHelp'].address;
    const tokenSymbol = 'HELP';
    const tokenDecimals = 18;
    const tokenImage = 'https://ihelp.finance/assets/ihelp_icon.png';
    
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
    
      if (wasAdded) {
        console.log('Help Token Added');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
    
  }
  
  const handleUnstake = async() => {
    
    console.log('unstaking',amount,'HELP tokens to xHELP staking contract:',props.readContracts.xHelp.address)
    const unstakeAmountWei = utils.parseEther(amount).toString(10);
    
    setAmount('');
    
      const sponsorTx = props.tx(props.writeContracts.xHelp.withdraw(unstakeAmountWei), update => {
     
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
      
  }
  
  const handleClaim = async() => {

    console.log('claim rewards:',props.readContracts.xHelp.address)

      const sponsorTx = props.tx(props.writeContracts.xHelp.claimReward(), update => {
     
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
    
  }
  
  
  let redeemableHELP = null;
  if (xhelpBalance > 0) {
    try {
      //console.log('exchangeRate',exchangeRate);
      const er = parseFloat(utils.formatUnits(exchangeRate,18));
      redeemableHELP = parseFloat(utils.formatUnits(xhelpBalance,18))*er;
    }catch(e){}
  }
  
  let stakingEnabled = null;
  if (allowanceStaking != null) {
      // ensure the contract action is enabled
      if (parseFloat(utils.formatEther(allowanceStaking)) >= 100000000) {
        stakingEnabled = true;
      } else {
        stakingEnabled = false;
      }
  }
  
  let stakeEnabled = false;
  if (ihelpBalance > 0 && amount != '' && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(ihelpBalance,18)) * 1000000) / 1000000) {
    stakeEnabled = true;
  }
  
  let unstakeEnabled = false;
  if (xhelpBalance > 0 && amount != '' && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000) {
    unstakeEnabled = true;
  }
  
  const [currentTab, setCurrentTab] = useState('tab1');
    const tabList = [
        {
            name: 'tab1',
            label: 'Stake',
            content: (
                <StakeStake props={props} ihelpBalance={ihelpBalance} xHelpBalance={xhelpBalance}/>
            )
        },
        {
            name: 'tab2',
            label: 'Unstake',
            content: (
                <StakeUnstake props={props} ihelpBalance={ihelpBalance} xhelpBalance={xhelpBalance}/>
            )
        },
    ];
    
    
  return (
    <div id="app" className="app">
      {/*<Head>
        <title>iHelp | Stake</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      
      <Header {...props}/>

      <div className={st.stake + " " + " section"}>
        <div className="box">
         <div className="sectionHeader">Stake</div>
         
          <div className='stake' >
            <div className="body">
         
         
          <div className='stakeAction'>
           
              <h4 style={{textAlign:'center'}}>Staking Actions</h4>
  
                <div className='head-bar' style={{textAlign:'center',display:props && props.address && props.address != '0x0000000000000000000000000000000000000000' ? '' : 'none'}}>
                      <div>
                          <h5>My HELP Balance <a style={{fontStyle:'italic'}} onClick={handleTokenAdd}>add</a></h5>
                          <p>{ihelpBalance ? commafy(parseFloat(utils.formatUnits(ihelpBalance,18)).toFixed(2)) : <Spin />}</p>
                      </div>
                      <div>
                          <h5>My xHELP Balance</h5>
                          <p>{xhelpBalance ? commafy(parseFloat(utils.formatUnits(xhelpBalance,18)).toFixed(2)) : <Spin />}</p>
                      </div>
                  </div>
              
              
          
                {/*<h6>Redeemable HELP from xHELP: {redeemableHELP ? commafy(parseFloat(redeemableHELP).toFixed(2)) : <Spin />}</h6>*/}
              
              {props && props.address && props.address == '0x0000000000000000000000000000000000000000' ? (
               <div style={{width:'100%',display:'inline-block',position:'relative',textAlign:'center'}}>
   
   {/*<img src={`/assets/icons/wallet.svg`} style={{height:'200px',marginRight:'5px',marginBottom:'-30px'}}/>*/}
    <DashboardIcon />
   <div className="dashboardHelp" style={{fontSize:'18px'}}>Please connect wallet to view your staking stats...</div>
   <button
          key="loginbutton"
          //style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          className="grd-btn"
          style={{marginTop:'20px'}}
          // shape="round"
          // size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={props.loadWeb3Modal}
        >
          CONNECT WALLET
        </button>
   </div>
              ) : ''}
              
              
              { !stakingEnabled ? stakingEnabled === null ? '' : (
              
               <button
               className="grd-btn" 
                  style={{marginTop:'20px',marginBottom:'20px',width:'100%',height:'65px',fontSize:'20px',fontWeight:'500'}}
                  onClick={async () => {
                  
                  // FIRST APPROVE THE TRANSFER
                  
                  const approveTx = props.tx(props.writeContracts['iHelp'].approve(props.readContracts.xHelp.address,utils.parseEther('100000000000')), update => {
                   
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
                  ENABLE STAKING
                </button>) : (
                <span>
 
                  <div className='head-bar stake' style={{margin: '0',textAlign:'center'}}>
                      <div>
                      {/*<a style={{fontStyle:'italic'}} onClick={handleTokenAdd}>add</a>*/}
                          <h5>My DAI Staking Rewards</h5>
                          <p>{claimableReward ? commafy(parseFloat(utils.formatUnits(claimableReward,18)).toFixed(2)) : <Spin />}</p>
                      </div>
                      <div>
                          <button disabled={claimableReward && props.web3Modal && ( props.web3Modal.cachedProvider || props.web3Modal.safe ) && parseFloat(utils.formatUnits(claimableReward,18)) > 0 ? false : true} onClick={handleClaim}>CLAIM</button>
                      </div>
                  </div>
            
                 <div className="tabs">
                            {
                                tabList.map((tab, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentTab(tab.name)}
                                        className={(tab.name === currentTab) ? 'active' : ''}>
                                        {tab.label}
                                    </button>
                                ))
                            }
                        </div>

                        {
                            tabList.map((tab, i) => {
                                if (tab.name === currentTab) {
                                    return <div key={i}>{tab.content}</div>;
                                } else {
                                    return null;
                                }
                            })
                        }
                          
                  </span>
                  
                  )}
                  
                   
                       </div>
                  
             {/* <div className={st.stakeInfo}>
              Stake HELP here and receive xHELP as receipt representing your share of the pool. This pool automatically compounds and by using a 15% portion of all interest generated to buy back HELP which means the xHELP to HELP ratio will grow over time!
Like liquidity providing (LP), you will earn fees according to your share in the pool, and your xHELP receipt is needed as proof when claiming the rewards.
              </div> */}
              
              {/*<div>
                You have generated 21.23 IHELP in 23 days. <br /> You have
                deposited 20 IHELP and withdrawn 0 from the staking pool.
              </div>*/}
          
          
             <div className='stake'>
            <div className="body">
         
         
          <div className='stakeData' style={{border:'0px'}}>
          
              <h4 style={{textAlign:'center'}}>Staking Data</h4>
              
              
              <div className='head-bar' style={{textAlign:'center'}}>
                            <div>
                                <h5>HELP Circulating</h5>
                                <p>{ihelpCirculating ? commafy(parseFloat(utils.formatUnits(ihelpCirculating,18)).toFixed(2)) : <Spin />}</p>
                            </div>
                            <div>
                                <h5>xHELP in Staking Pool</h5>
                                <p>{xhelpSupply && ihelpCirculating? `${commafy(parseFloat(utils.formatUnits(xhelpSupply,18)).toFixed(2)) } (${ihelpCirculating == 0 ? '0' : commafy(((parseFloat(utils.formatUnits(xhelpSupply,18))/parseFloat(utils.formatUnits(ihelpCirculating,18)))*100).toFixed(1))}% staked)` : <Spin />}</p>
                            </div>
                        </div>
                        
          {/*
                <h5>HELP Circulating: {ihelpCirculating ? commafy(parseFloat(utils.formatUnits(ihelpCirculating,18)).toFixed(2)) : <Spin />}</h5>
                <h5>xHELP in Staking Pool: {xhelpSupply && ihelpCirculating? `${commafy(parseFloat(utils.formatUnits(xhelpSupply,18)).toFixed(2)) } (${commafy(((parseFloat(utils.formatUnits(xhelpSupply,18))/parseFloat(utils.formatUnits(ihelpCirculating,18)))*100).toFixed(1))}% staked)` : <Spin />}</h5>
*/}
               {/* <h6 style={{marginTop:'18px'}}>1 xHELP =  {exchangeRate ? commafy(parseFloat(utils.formatUnits(exchangeRate,18)).toFixed(4)) : <Spin />} HELP</h6>
                <h6>Staking APY: {xhelpAPY ? `$${commafy(xhelpAPY.toFixed(2))}` : <Spin />}</h6>*/}
                <div className='head-bar' style={{border:'0px'}}>
                            <div>
              <h5>Cumulative Reward History (DAI)</h5>
                   </div>
                        </div>
              <div className={st.stakeGraphBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    width={500}
                    height={350}
                    data={rewardChartData}
                    margin={{
                      top: 0,
                      right: 5,
                      left: 7,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis tick={{fontSize: 10}} dataKey="time" domain = {['auto', 'auto']} tickFormatter={timeStr => moment(timeStr).format('M-D-H')} />
                    <YAxis tick={{fontSize: 7}} type="number" dataKey="total_reward" domain = {['auto', 'auto']} tickFormatter={yStr => commafy(yStr.toFixed(5))}/>
                    <ChartTooltip />
                    <Legend />
                    <Scatter
                    legendType='none'
                    //  type="monotone"
                      dataKey="total_reward"
                      activeDot={{ r: 8 }}
                      dot={false}
                      shape={null}
                      line = {{ stroke: '#5c0fc5' }}
        lineJointType = 'monotoneX'
        lineType = 'joint'
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              {/*<h6 style={{marginTop:'20px'}}>APY History</h6>
              <div className={st.stakeGraphBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    width={500}
                    height={300}
                    data={apyChartData}
                    margin={{
                      top: 0,
                      right: 5,
                      left: 7,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis tick={{fontSize: 10}} dataKey="time" domain = {['auto', 'auto']} tickFormatter={timeStr => moment(timeStr).format('HH:mm')} />
                    <YAxis tick={{fontSize: 7}} type="number" dataKey="contrib" domain = {['auto', 'auto']} tickFormatter={yStr => '$'+commafy(yStr.toFixed(0))}/>
                    <ChartTooltip />
                    <Legend />
                    <Scatter
                    legendType='none'
                    //  type="monotone"
                      dataKey="contrib"
                      activeDot={{ r: 8 }}
                      dot={false}
                      shape={null}
                      line = {{ stroke: '#5c0fc5' }}
        lineJointType = 'monotoneX'
        lineType = 'joint'
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>*/}
              
                  
              {/*<div className={st.stakeGraphBox}>
                <h2>APY</h2>
                <main>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      layout="vertical"
                      width={500}
                      height={400}
                      data={data}
                      margin={{
                        top: 0,
                        right: 5,
                        bottom: 0,
                        left: 0,
                      }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" scale="band" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pv" barSize={20} fill="#ac52f2" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </main>
              </div>
              <div className={st.stakeGraphBox}>
                <h2>HELP/XHELP</h2>
                <h3>2.7134</h3>
                <main>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart width={300} height={100} data={data2}>
                      <Line
                        type="monotone"
                        dataKey="pv"
                        stroke="#5c0fc5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </main>
              </div>
              */}
            </div>
            </div>
            </div>
         
          </div>
          </div>
        </div>
      </div><Footer {...props}/>
    </div>
  );
};

export default ContributeNew;
