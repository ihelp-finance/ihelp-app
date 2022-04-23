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
import { Header } from "../components";

const ContributeNew = (props) => {
  
  const [exchangeChartData, setexchangeChartData] = useState([]);
  const [rewardChartData, setrewardChartData] = useState([]);
  const [apyChartData, setapyChartData] = useState([]);
  const [stakingStats, setstakingStats] = useState(null);
  
  const [ihelpSupply, setihelpSupply] = useState(null);
  const [ihelpCirculating, setihelpCirculating] = useState(null);
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
  
  if (props.readContracts && statsLoaded == false && props.address != '0x0000000000000000000000000000000000000000') {

    setStatsLoaded(true);
  
  const updateStats = (c) => {
    
    setTimeout(()=>{
      setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
      setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
      setValue("iHelp", "totalSupply", null, ihelpSupply, setihelpSupply);
      setValue("iHelp", "totalCirculating", null, ihelpCirculating, setihelpCirculating);
      setValue("xHelp", "totalSupply", null, xhelpSupply, setxhelpSupply);
      setValue("xHelp", "claimableRewardOf", [props.address], claimableReward, setclaimableReward);
      //setValue("xHelp", "getCash", null, xhelpCash, setxhelpCash);
      //setValue("xHelp", "exchangeRateCurrent", null, exchangeRate, setexchangeRate);
      setValue("iHelp", "allowance", [props.address,props.readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
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
      setxhelpAPY(0);
      
       setrewardChartData(d['rewardovertime']);
       
    })
    
  }
  
  const listener = (blockNumber, contract) => {
    if (contract != undefined) {
      //.log(contract, blockNumber); // , fn, args, provider.listeners()
      updateStats(contract);
    }
  };
  
  updateStats();
  
   const contractsToListen = ['iHelp'] // ,'xHelp'
    contractsToListen.map(c => {

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
  
  let stakeEnabled = false;
  if (ihelpBalance > 0 && amount != '' && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000) {
    stakeEnabled = true;
  }
  
  let unstakeEnabled = false;
  if (xhelpBalance > 0 && amount != '' && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000) {
    unstakeEnabled = true;
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

  
  return (
    <div id="app" className="app">
      {/*<Head>
        <title>iHelp | Stake</title>
      </Head>*/}
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header {...props}/>

      <div className={st.stake + " " + " section"}>
        <div className="box">
          <div className={st.stakeGrid}>
            <div className={st.stakeGridLeft}>
              <h5>Staking Actions</h5>
              <div className={st.maxFormGroup}>
              
                <h6 style={{marginTop:'-8px'}}>My HELP Balance: {ihelpBalance ? commafy(parseFloat(utils.formatUnits(ihelpBalance,18)).toFixed(2)) : "..."}</h6>
                <h6>My xHELP Balance: {xhelpBalance ? commafy(parseFloat(utils.formatUnits(xhelpBalance,18)).toFixed(2)) : "..."}</h6>
                {/*<h6>Redeemable HELP from xHELP: {redeemableHELP ? commafy(parseFloat(redeemableHELP).toFixed(2)) : "..."}</h6>*/}
              
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
                  <div className={st.buttonGroup} style={{marginTop:'20px'}}>
                <button className={mode == 'stake' ? "grd-btn" : 'white-btn'} onClick={(e)=>{setMode('stake');setAmount('');setInputFocus()}}>Stake</button>
                <button className={mode == 'unstake' ? "grd-btn" : 'white-btn'} onClick={(e)=>{setMode('unstake');setAmount('');setInputFocus()}}>Unstake</button>
              </div>
              
                <div className={st.maxInput}>
                  <input autoFocus type="number" value={amount} ref={inputRef} placeholder={`0  ${mode == 'stake' ? 'HELP' : 'xHELP'}`} onChange={(e)=>{setAmount(e.target.value)}}/>
                  <button className="grd-btn" onClick={(e)=>{mode == 'stake' ? setAmount((Math.floor(parseFloat(utils.formatUnits(ihelpBalance,18)) * 1000000) / 1000000).toFixed(6)) : setAmount((Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000).toFixed(6)) }}>MAX</button>
                </div>
         
              <div className={st.charityBtnGrd} style={{marginTop:'-10px',gridTemplateColumns:'repeat(1,1fr)'}}>
                    <button style={{display:mode == 'stake' ? '' : 'none'}} disabled={props.web3Modal && props.web3Modal.cachedProvider && stakeEnabled ? false : true} className="grd-btn" onClick={handleStake}>Approve Stake</button>
                    <button style={{display:mode == 'unstake' ? '' : 'none'}} disabled={props.web3Modal && props.web3Modal.cachedProvider && unstakeEnabled ? false : true} className="grd-btn" onClick={handleUnstake}>Approve Unstake</button>
                  </div>
                  
                  <h6 style={{marginTop:'30px'}}>My Claimable DAI Staking Reward: {claimableReward ? commafy(parseFloat(utils.formatUnits(claimableReward,18)).toFixed(2)) : "..."}</h6>
                  <div className={st.charityBtnGrd} style={{marginTop:'10px',gridTemplateColumns:'repeat(1,1fr)'}}>
                    <button disabled={claimableReward && props.web3Modal && props.web3Modal.cachedProvider && parseFloat(utils.formatUnits(claimableReward,18)) > 0 ? false : true} className="grd-btn" onClick={handleClaim}>Claim Reward</button>
                  </div>
                  
                  
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
            </div>
            <div className={st.stakeGridRight}>
              <h5 style={{marginBottom:'20px'}}>Staking Data</h5>
              
              <span>
                <h6>HELP Circulating: {ihelpCirculating ? commafy(parseFloat(utils.formatUnits(ihelpCirculating,18)).toFixed(2)) : "..."}</h6>
                <h6>xHELP in Staking Pool: {xhelpSupply && ihelpCirculating? `${commafy(parseFloat(utils.formatUnits(xhelpSupply,18)).toFixed(2)) } (${commafy(((parseFloat(utils.formatUnits(xhelpSupply,18))/parseFloat(utils.formatUnits(ihelpCirculating,18)))*100).toFixed(1))}% staked)` : "..."}</h6>

               {/* <h6 style={{marginTop:'18px'}}>1 xHELP =  {exchangeRate ? commafy(parseFloat(utils.formatUnits(exchangeRate,18)).toFixed(4)) : "..."} HELP</h6>
                <h6>Staking APY: {xhelpAPY ? `$${commafy(xhelpAPY.toFixed(2))}` : "..."}</h6>*/}
                
              <h6 style={{marginTop:'20px'}}>Reward History</h6>
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
                    <YAxis tick={{fontSize: 7}} type="number" dataKey="xhelp_total_reward" domain = {['auto', 'auto']} tickFormatter={yStr => commafy(yStr.toFixed(5))}/>
                    <ChartTooltip />
                    <Legend />
                    <Scatter
                    legendType='none'
                    //  type="monotone"
                      dataKey="xhelp_total_reward"
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
              
             </span>
                            
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
  );
};

export default ContributeNew;
