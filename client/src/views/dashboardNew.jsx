import React, { useEffect, useState } from "react";
import st from "./styles/dashboardNew.module.css";
import { Link, Redirect, useHistory } from "react-router-dom";
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
}
from "react-icons/md";
import { FaTwitter, FaCopy } from "react-icons/fa";
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
import commafy from 'commafy';
import { utils } from "ethers";
import moment from 'moment'
import { Table, Tag, Space, Tooltip,Spin } from 'antd';

import { LoadingOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;

import { Header, Footer, Address } from "../components";

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

import usdc from '../assets/images/other/usdc.png';
import dai from '../assets/images/other/dai.png';
import avax from '../assets/images/other/avax.png';
import sortByArrow from '../assets/images/icon/sortByArrow.png';
import edit from '../assets/images/icon/edit.png';
import kse from '../assets/images/other/kse.png';
import searchIcon from '../assets/images/icon/searchIcon.png';

const ContributeNew = (props) => {

  const history = useHistory();

  SwiperCore.use([Navigation, Pagination]);

  const [nickname, setNickname] = useState('');
  const [nickName, setNickName] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);

  const [claimableHelpTokens, setclaimableHelpTokens] = useState(null);
  const [ihelpBalance, setihelpBalance] = useState(null);
  const [xhelpBalance, setxhelpBalance] = useState(null);
  
  const [contribTotal, setcontribTotal] = useState(null);
  const [totalInterestGenerated, settotalInterestGenerated] = useState(null);
  const [directDonations, setdirectDonations] = useState(null);
  
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState(null);


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


  useEffect(async() => {
    document.title = `iHelp | Dashboard (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);

  const handleTokenAdd = async() => {
      
    const tokenAddress = props.readContracts['iHelp'].address;
    const tokenSymbol = 'HELP';
    const tokenDecimals = 18;
    const tokenImage = 'https://ihelp.finance/assets/ihelp_icon.png';
    
    console.log(tokenAddress)
    
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

  const setValue = props.setValue;

  // console.log(props.address, statsLoaded)
  
  const [charityDecimals,setCharityDecimals] = useState(null);

  if (statsLoaded == false && props.address != '0x0000000000000000000000000000000000000000' && props.readContracts) {

    setStatsLoaded(true);

    const updateStats = () => {

     console.log('CALLING STATS')
      
      let url = `/api/v1/data/userstats?address=${props.address}`;
     // console.log(url);

      fetch(url).then((d) => {
        if (d.ok) {
          return d.json()
        }
      }).then((d) => {
        // console.log(d);
        
        try {
          
         setNickname(d.nickname);
         setChartData(d['contribovertime']);
         
        }catch(e){console.log('error',e)}

      })


      setTimeout(() => {
        
        setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
        setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
        setValue("iHelp", "getClaimableTokens", [props.address], claimableHelpTokens, setclaimableHelpTokens);

        props.readContracts["analytics"]["userStats"](props.readContracts['iHelp'].address, props.address, 0, 1000).then((d) => {

          console.log('userStats', d)
          
          //console.log(charityDecimals)

          setcontribTotal(d['totalContributions']);
          setdirectDonations(d['totalDirectDonations']);
          settotalInterestGenerated(d['totalInterestGenerated']);

        });
        
        props.readContracts["analytics"]["getSupportedCurrencies"](props.readContracts['iHelp'].address,props.targetNetwork.blockTime).then((d) => {

          // console.log('pricefeeds:',d)

          // get hash of currencies and their lending protocols

          const currencyHash = {};

          const charityDecimalHash = {}

          for (let i = 0; i < d.length; i++) {

            charityDecimalHash[d[i]['currency']] = parseInt(d[i]['decimals'])

            if (Object.keys(currencyHash).indexOf(d[i]['currency']) > -1) {
              currencyHash[d[i]['currency']].push(d[i])
            }
            else {
              currencyHash[d[i]['currency']] = []
              currencyHash[d[i]['currency']].push(d[i])
            }

            if (d[i]['currency'].toLowerCase() == 'weth' || d[i]['currency'].toLowerCase() == 'wavax') {
              const newD = JSON.parse(JSON.stringify(d[i]))
              newD['native'] = true
              if (Object.keys(currencyHash).indexOf(d[i]['currency'].replace('W', '')) > -1) {
                currencyHash[d[i]['currency'].replace('W', '')].push(newD)
              }
              else {
                currencyHash[d[i]['currency'].replace('W', '')] = []
                currencyHash[d[i]['currency'].replace('W', '')].push(newD)
              }
              charityDecimalHash[d[i]['currency'].replace('W', '')] = charityDecimalHash[d[i]['currency']]
            }

          }
          console.log('currencyHash', currencyHash)
          console.log('charityDecimals', charityDecimalHash)

          setCharityDecimals(charityDecimalHash)
          // setCurrencies(Object.keys(currencyHash))
          // setSupportedCurrencyDetails(currencyHash)

        })
     
        let numberOfCharities = 0;
        props.readContracts["iHelp"]["numberOfCharities"]().then((d) => {
          
          console.log('numberOfCharities',parseInt(d.toString()))
          numberOfCharities = parseInt(d.toString());
          
          processCharityBatches();
          
        })
        
        const processCharityBatches = async () => {
          
          const charityData = []
          
          
          let BATCH_SIZE = 50;
          if (process.env.NODE_ENV === 'development') {
            BATCH_SIZE = 30;
          }
          let index=0;
          for (let i=index;i<numberOfCharities;i=i+BATCH_SIZE) {
            
              console.log(i,i+BATCH_SIZE)
              
              const d = await props.readContracts["analytics"]["getUserContributionsPerCharity"](props.readContracts['iHelp'].address,props.address,i,BATCH_SIZE)
              
              d.map((c)=>{
                if (c['totalContributions'] > 0 || c['totalDonations'] > 0 || c['yieldGenerated'] > 0) {
                  
                  const curr = []
                  
                  c['tokenStatistics'].map((r)=>{
                    if (r['totalContributions'] > 0) { 
                      
                      curr.push([r['currency'],r['totalContributions']])
                      
                    } 
                  })
                  
                  charityData.push({
                    address:c['charityAddress'],
                    name:c['charityName'],
                    contributed:c['totalContributions'],
                    directdonations:c['totalDonations'],
                    yieldgenerated:c['yieldGenerated'],
                    currencies:curr,
                  })
                }
              })
              
          }
          
          setTableData(charityData)
          
        }
        
        /*
        props.readContracts["analytics"]["getUserContributionsPerCharity"](props.readContracts['iHelp'].address, props.address, 0, 1000).then((d) => {
          
          console.log('userContributionsPerCharity',d)
          
          const charityData = []
          
          d.map((c)=>{
            if (c['totalContributions'] > 0 || c['totalDonations'] > 0 || c['yieldGenerated'] > 0) {
              
              const curr = []
              
              c['tokenStatistics'].map((r)=>{
                if (r['totalContributions'] > 0) { 
                  
                  curr.push([r['currency'],r['totalContributions']])
                  
                } 
              })
              
              charityData.push({
                address:c['charityAddress'],
                name:c['charityName'],
                contributed:c['totalContributions'],
                directdonations:c['totalDonations'],
                yieldgenerated:c['yieldGenerated'],
                currencies:curr,
              })
            }
          })
          
          setTableData(charityData)
          
        });
        */

      }, 10)

    }

    updateStats();
    
    const contractsToListen = ['iHelp'];

      console.log('contractsToListen',contractsToListen);
  
      const listener = (blockNumber, contract) => {
        if (contract != undefined) {
          //console.log(contract, blockNumber); // , fn, args, provider.listeners()
          updateStats(contract);
        }
      };
  
      contractsToListen.map(c => {
        // not the most efficient because this will update on each block
        props.readContracts[c].provider.on("block", (block) => { listener(block, c) });
      });

  }


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

  if (props.web3Modal && props.address == '0x0000000000000000000000000000000000000000') {

    console.log('not connected');

    return (<div id="app" className="app">
      {/*<Head>
        <title>iHelp | Dashboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      <Header {...props}/>
      <div className={st.dashboard + " " + "section"}>
      <div className="box">
      <div className="sectionHeader">My Dashboard</div>
   <div style={{width:'100%',display:'inline-block',position:'relative',textAlign:'center'}}>
   
   {/*<img src={`/assets/icons/wallet.svg`} style={{height:'200px',marginRight:'5px',marginBottom:'-30px'}}/>*/}
    <DashboardIcon />
   <div className="dashboardHelp">Please connect wallet to view dashboard...</div>
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
   </div>
   </div><Footer {...props}/>
   </div>)

  }
  
  const handleWithdrawAll = async() => {
    
    const allCharities = [];
    tableData.map((c)=>{
      allCharities.push(c['address']);
    })

    console.log('allCharities',allCharities);
    
    const result = props.tx(props.writeContracts.iHelp.withdrawBulk(allCharities), update => {

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

    // setTimeout(() => {
    //   setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
    //   setValue("iHelp", "getClaimableTokens", [props.address], claimableHelpTokens, setclaimableHelpTokens);
    //   setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
    // }, 0)
    
  }

  const handleClaimTokens = async() => {

    const result = props.tx(props.writeContracts.iHelp.claimTokens(), update => {

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

    setTimeout(() => {
      setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
      setValue("iHelp", "getClaimableTokens", [props.address], claimableHelpTokens, setclaimableHelpTokens);
      setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
    }, 0)

  }

  const handleChangeNickname = (e) => {

    //console.log('setting nickname for address:',props.address)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: props.address, nickname: e.target.value })
    };
    fetch('/api/v1/data/nickname', requestOptions)

    setNickname(e.target.value);

  }

  const charityColumns = [
    // {
    //   title: 'Logo',
    //   dataIndex: 'logo',
    //   key: 'logo',
    //   //sorter: (a, b) => a.age - b.age,
    //   //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    //   render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
    //   // width: '5%',
    // },
    {
      title: 'Contract',
      dataIndex: 'address',
      key: 'address',
      //defaultSortOrder: 'descend',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      render: t => (<Address address={t} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
      sorter: (a, b) => a['address'].localeCompare(b['address']),
      sortDirections: ['ascend', 'descend'],
       width: '10%',
    },
    {
      title: 'Charity',
      dataIndex: 'name',
      key: 'name',
      //defaultSortOrder: 'descend',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: text => <a>{text}</a>,
      sorter: (a, b) => a['name'].localeCompare(b['name']),
      sortDirections: ['ascend', 'descend'],
      //  width: '15%',
    },
    {
      title: 'Yield Generated',
      dataIndex: "yieldgenerated",
      key: 'yieldgenerated',
      render: c => `${'$'+commafy(parseFloat(utils.formatUnits(c,18)).toFixed(2) )}`,
      sorter: (a, b) => a['yieldgenerated'] - b['yieldgenerated'],
      sortDirections: ['ascend', 'descend'],
      // width: '10%',
    },
    {
      title: 'Active Contributions',
      dataIndex: "contributed",
      key: 'contributed',
      render: c => `${'$'+commafy(parseFloat(utils.formatUnits(c,18)).toFixed(2) )}`,
      sorter: (a, b) => a['contributed'] - b['contributed'],
      sortDirections: ['ascend', 'descend'],
      // width: '10%',
    },
    {
      title: 'Contributions by Currency',
      dataIndex: 'currencies',
      key: 'currencies',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      filters: [
        { text: 'DAI', value: 'DAI' },
        { text: 'USDC', value: 'USDC' },
        { text: 'WETH', value: 'WETH' },
      ],
      //  width: '10%',
      onFilter: (value, c) => c['currencies'].indexOf(value) > -1,
      render: (c) => {
        const objs = [];
        c.map((cc) => {

          var ccci = cc[0];
          var cccd = cc[1];

          objs.push(<Tooltip title={ccci}>
            <img src={`/assets/icons/${ccci.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'10px',display:'inline'}}/>
            {charityDecimals ? commafy(parseFloat(utils.formatUnits(cccd,charityDecimals[ccci])).toFixed(2) ) : ''}<br/>
        </Tooltip>);
        })
        return objs
      }
    },
    {
      title: 'Direct Donations',
      dataIndex: "directdonations",
      key: 'directdonations',
      render: c => `${charityDecimals ? '$'+commafy(parseFloat(utils.formatUnits(c,charityDecimals['DAI'])).toFixed(2) ) : ''}`,
      sorter: (a, b) => a['contributed'] - b['contributed'],
      sortDirections: ['ascend', 'descend'],
      // width: '10%',
    },
    {
      title: 'Details',
      dataIndex: 'address',
      key: 'id',
      render: (c) => {
        return (<Tooltip title={`Go to Charity ${c}`}>
        <div>
          <button className="grd-btn" onClick={(e)=>{history.push('/charity/'+c)}}>Adjust</button>
        </div>
        </Tooltip>)
      },

      //width: '10%',
    },
    /* {
       title: 'Pool Size',
       dataIndex: ["Stats", "Total","interest"],
       key: 'poolsize',
       render: c => `$${commafy(c.toFixed(0))}`,
       sorter: (a, b) => a['Stats']['Total']['interest'] - b['Stats']['Total']['interest'],
       sortDirections: ['ascend','descend'],
       width: '10%',
     },
     {
       title: 'Contributed',
       dataIndex: ["Stats", "Total","contribution"],
       key: 'contributed',
       render: c => `$${commafy(c.toFixed(0))}`,
       sorter: (a, b) => a['Stats']['Total']['contribution'] - b['Stats']['Total']['contribution'],
       sortDirections: ['ascend','descend'],
       width: '10%',
     }*/
  ];

  return (
    <div id="app" className="app">
      {/*<Head>
        <title>iHelp | Dashboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      
      <Header {...props}/>

      <div className={st.dashboard + " " + "section"}>
        <div className="box">
        
         <div className="sectionHeader">My Dashboard</div>
         
          {/* Dashboard Top Text */}
          {/*<h6 className={st.dashTopP}>
            Dashboard Explainer: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis
            ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt
            id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris
            molestie elit, et lacinia.
          </h6>*/}
          
          <div className="dashboard">
          <div className="body">
                    <div className='contributionsContent' style={{textAlign:'center'}}>
                        <h4>Contributions</h4>
                        
                        <div style={{padding: '2.4rem',width:'34%',display:'inline-block',textAlign:'center'}}>
                            <p>Active Contributions</p>
                            <h5>{contribTotal ? `$${commafy(parseFloat(utils.formatUnits(contribTotal,18)).toFixed(2))}` : <Spin />}</h5>
                        </div>
                        <div style={{padding: '2.4rem',width:'33%',display:'inline-block',textAlign:'center'}}>
                            <p>Yield Generated</p>
                            <h5>{totalInterestGenerated ? `$${commafy(parseFloat(utils.formatUnits(totalInterestGenerated,18)).toFixed(2))}` : <Spin />}</h5>
                        </div>
                        <div style={{padding: '2.4rem',width:'33%',display:'inline-block',textAlign:'center'}}>
                            <p>Direct Donations</p>
                            <h5>{directDonations ? `$${commafy(parseFloat(utils.formatUnits(directDonations,18)).toFixed(2))}` : <Spin />}</h5>
                        </div>
                        
                        {/*<h6>Total Interest Donated: $1,321,312</h6>
                        <h6>Total Direct Donations: $0</h6>
                        <h6>Contributions Over Time:</h6> */}
                        <div className={st.dashboardGraphBox}>
                          <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                              width={500}
                              height={500}
                              data={chartData}
                              margin={{
                                top: 0,
                                right: 5,
                                left: 7,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis tick={{fontSize: 10}} dataKey="time" domain = {['auto', 'auto']} tickFormatter={timeStr => moment(timeStr).format('M-D-H')} />
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
                        </div>
                        {/*<span style={{width:'100%',fontStyle:'italic',textAlign:'center',fontSize:'10px',display:'inline-block',position:'relative',top:'-15px'}}>
                          (stats updated every minute)
                        </span>*/}
                        
                    </div>
                    <div className='rewardsContent' style={{textAlign:'center'}}>
                        <h4>Rewards & Staking</h4>
                        <div >
                            <p>Claimable HELP Tokens</p>
                            <h5>{claimableHelpTokens ? commafy(parseFloat(utils.formatUnits(claimableHelpTokens,18)).toFixed(2)) : <Spin />}</h5>
                            <button  onClick={handleClaimTokens} disabled={claimableHelpTokens > 0 ? false : true}>CLAIM HELP TOKENS</button>
                        </div>
                        <div style={{textAlign:'center'}}>
                            <ul>
                                <li>
                                    <p>HELP Balance  <a style={{fontStyle:'italic'}} onClick={handleTokenAdd}>add</a></p>
                                    <h5>{ihelpBalance ? commafy(parseFloat(utils.formatUnits(ihelpBalance,18)).toFixed(2)) : <Spin />}</h5>
                                </li>
                                <li>
                                    <p>xHELP Balance</p>
                                    <h5>{xhelpBalance ? commafy(parseFloat(utils.formatUnits(xhelpBalance,18)).toFixed(2)) : <Spin />}</h5>
                                </li>
                            </ul>
                            <button style={{color:'#5C0FC5', backgroundColor:"transparent"}} onClick={(e)=>{history.push('/stake')}}>ADJUST STAKING POSITIONS</button>
                        </div>
                    </div>
                    <div className='leaderboardContent' style={{textAlign:'center'}}>
                        <h4>Settings</h4>
                        <p>
                            Wallet Nickname
                        </p>
                        
                         {/*
              <h6>24h Ranking: 1st</h6>
              <h6>7d Ranking: 3rd</h6>
              <h6>30d Ranking: 4th</h6>
              <h6>All Time Ranking: 5th</h6>*/}
                        
                            {nickName ? (
               <div>
                       <p>{nickname}</p>
                     <img src={edit} alt="" onClick={() => setNickName(false)}/>
               </div>
              ) : (
                <div className={st.displayNameEdit}>
                  <input type="text" onChange={handleChangeNickname}/>
                  <MdClose onClick={() => setNickName(true)} />
                </div>
              )}
              
              
                <button  style={{width:'90%'}} onClick={handleWithdrawAll} disabled={contribTotal && contribTotal > 0 ? false : true}>WITHDRAW ALL</button>
              
              
                    </div>
                    
                    
                    
                </div>

         
          </div>

          {/* Table Grid */}
          <div className={st.tableGrid}>
            {/* Current Deposit Detail */}
            <div className={st.tableContainer}>
            {/*  <div className='contributionDetailsContent'>
                      <h4>My Contribution Details</h4>
                      
                    </div>*/}
                    
              {/* Table */}
              <div className={st.dashboardTable + " " + "table"} >
          
          <Table 
          className={st.tableContribute + " " + "table"} loading={tableData == null ? true : false} columns={charityColumns} dataSource={tableData} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
        
              </div>
            </div>

            {/*
            <div className={st.tableContainer}>
              <h5>Direct Donation History</h5>
              <div className={st.dashboardTable + " " + "table"}>
                <table>
                  <thead>
                    <tr>
                      <th>Charity</th>
                      <th>Direct Donation Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={st.tableContainer}>
              <h5>Interest Donation History</h5>
              <div className={st.dashboardTable + " " + "table"}>
                <table>
                  <thead>
                    <tr>
                      <th>Charity</th>
                      <th>Interest Donation</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>$100,000</td>
                      <td>Dec 31, 2021</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
