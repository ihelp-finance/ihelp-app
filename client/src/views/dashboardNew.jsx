import React, { useEffect, useState } from "react";
import st from "./styles/dashboardNew.module.css";
import { Link,Redirect,useHistory } from "react-router-dom";
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
import { Table, Tag, Space,Tooltip } from 'antd';

import { Header, Footer } from "../components";

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
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  const charityDecimals = props.charityDecimals;
  
  useEffect(async() => {
    document.title = `iHelp | Dashboard (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);

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

  if (statsLoaded == false && props.address != '0x0000000000000000000000000000000000000000') {

    setStatsLoaded(true);

    const updateStats = () => {
      
      setTimeout(()=>{
         setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
      setValue("iHelp", "getClaimableTokens", [props.address], claimableHelpTokens, setclaimableHelpTokens);
      setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
      },10)
     

      let url = `/api/v1/data/userstats?address=${props.address}`;
      console.log(url);

      fetch(url).then((d) => {
        if (d.ok) {
          return d.json()
        }
        else {
          setTimeout(() => {
            updateStats();
          }, 60000);
        }
      }).then((d) => {
        console.log(d);
        
         setNickname(d.nickname);
         setcontribTotal(d['contrib_by_charity_summary']['total']);
         setChartData(d['contribovertime']);
         
         // format the table data
         const tableRawData = [];
         
         for (var i=0;i<Object.keys(d['contrib_by_charity_summary']).length;i++) {
           var key =Object.keys(d['contrib_by_charity_summary'])[i];
           if (key != 'total') {
             var data = {
               name:key,
               logo:d['contrib_by_charity_summary'][key]['logo'],
               currencies: [],
               id: d['contrib_by_charity_summary'][key]['id'],
               contributed: d['contrib_by_charity_summary'][key]['total'],
               
             }
             
             try {
              data['currencies'].push('DAI-'+d['contrib_by_charity_summary'][key]['DAI']['contrib'].toFixed(2))
             }catch(e){}
             try {
              data['currencies'].push('USDC-'+d['contrib_by_charity_summary'][key]['USDC']['contrib'].toFixed(2))
             }catch(e){}
             
             tableRawData.push(data);
           }
           
         }
         setTableData(tableRawData);
         
        /*
          setTotalInterest(commafy(d['totalInterest']))
          setTvl(commafy(d['tvl']))
          setTotalCharities(commafy(d['totalCharities']))
          setTotalCountries(commafy(d['totalCountries']))
          setTotalHelpers(commafy(d['totalHelpers']))

          setTimeout(() => {
            updateStats();
          }, 60000);

        }).catch((d) => {
          console.log('error', d);
          setTimeout(() => {
            updateStats();
          }, 60000);
          */

      })

    }

    updateStats();

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
      </Head>*/}
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      <Header {...props}/>
      <div className={st.dashboard + " " + "section"}>
      <div className="box">
   <div style={{width:'100%',display:'inline-block',position:'relative',textAlign:'center'}}>
   <img src={`/assets/icons/wallet.svg`} style={{height:'200px',marginRight:'5px',marginBottom:'-30px'}}/>
   <h2>Please connect wallet to view dashboard...</h2>
   </div>
   </div>
   </div>
   </div>)

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
    
    setTimeout(()=>{
         setValue("iHelp", "balanceOf", [props.address], ihelpBalance, setihelpBalance);
        setValue("iHelp", "getClaimableTokens", [props.address], claimableHelpTokens, setclaimableHelpTokens);
        setValue("xHelp", "balanceOf", [props.address], xhelpBalance, setxhelpBalance);
    },0)
    
  }
  
  const handleChangeNickname = (e) => {
    
     //console.log('setting nickname for address:',props.address)
            
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address:props.address,nickname:e.target.value })
      };
      fetch('/api/v1/data/nickname', requestOptions)

    setNickname(e.target.value);
  
  }

  const charityColumns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
     // width: '5%',
    },
    {
      title: 'Charity Name',
      dataIndex: 'name',
      key: 'name',
      //defaultSortOrder: 'descend',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: text => <a>{text}</a>,
      sorter: (a, b) => a['name'].localeCompare(b['name']),
      sortDirections: ['ascend','descend'],
    //  width: '15%',
    },
    {
      title: 'Total Deposits',
      dataIndex: "contributed",
      key: 'contributed',
      render: c => `$${commafy(c.toFixed(0))}`,
      sorter: (a, b) => a['contributed'] - b['contributed'],
      sortDirections: ['ascend','descend'],
     // width: '10%',
    },
    {
      title: 'Deposits by Currency',
      dataIndex: 'currencies',
      key: 'currencies',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      filters: [
        { text: 'DAI', value: 'DAI' },
        { text: 'USDC', value: 'USDC' },
      ],
    //  width: '10%',
      onFilter: (value, c) => c['currencies'].indexOf(value) > -1,
      render: (c) => {
        const objs = [];
        c.map((cc)=>{
          
          var ccci = cc.split('-')[0];
          var cccd = cc.split('-')[1];
          
          objs.push(<Tooltip title={ccci}>
            <img src={`/assets/icons/${ccci}.svg`} style={{marginTop:'5px',height:'20px',marginRight:'5px'}}/>
            {commafy(cccd)}<br/>
        </Tooltip>
  );
        })
        return objs}
    },
    {
      title: 'Details',
      dataIndex: 'id',
      key: 'id',
      render: (c) => {
        return (<Tooltip title={`Go to Charity ${c}`}>
        <div>
          <button className="grd-btn" onClick={(e)=>{history.push('/charity/'+c)}}>Adjust Contributions</button>
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
      </Head>*/}
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header {...props}/>

      <div className={st.dashboard + " " + "section"}>
        <div className="box">
          {/* Dashboard Top Text */}
          {/*<h6 className={st.dashTopP}>
            Dashboard Explainer: Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis
            ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt
            id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris
            molestie elit, et lacinia.
          </h6>*/}

          {/* Dashboard Wallet Name */}
          <div className={st.dashboardMainGrid}>

            {/* Dashboard Graph */}
            <main className={st.dashboardGraph}>
              <h5>My Contributions</h5>
              <h6>Total:  {contribTotal ? `$${commafy(contribTotal.toFixed(2))}` : "..."}</h6>
              {/*<h6>Total Interest Donated: $1,321,312</h6>
              <h6>Total Direct Donations: $0</h6>
              <h6>Contributions Over Time:</h6> */}
              <div className={st.dashboardGraphBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    width={500}
                    height={300}
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
              <span style={{width:'100%',fontStyle:'italic',textAlign:'center',fontSize:'10px',display:'inline-block',position:'relative',top:'-15px'}}>
                (stats updated every minute)
              </span>
              {/*<button className="grd-btn">Wallet Donation Report</button>*/}
            </main>
            {/* Leaderboard Ranking */}
            <main className={st.leaderBoardHeading}>
              <h5>Leaderboard</h5>
              <main className={st.walletName} style={{marginTop:'-12px'}}>
              <h6>Wallet Nickname: </h6>
              {nickName ? (
                <div className={st.displayName}>
                  <span>{nickname}</span>
                  <MdEdit onClick={() => setNickName(false)} />
                </div>
              ) : (
                <div className={st.displayNameEdit}>
                  <input type="text" onChange={handleChangeNickname}/>
                  <MdClose onClick={() => setNickName(true)} />
                </div>
              )}
              </main>
             {/* <span>
                <MdContentCopy />
                <FaTwitter />
              </span> */}
              
              {/*
              <h6>24h Ranking: 1st</h6>
              <h6>7d Ranking: 3rd</h6>
              <h6>30d Ranking: 4th</h6>
              <h6>All Time Ranking: 5th</h6>*/}
            </main>
            {/* Dashboard Balance */}
            <main className={st.dashboardBalance}>
            <h5>My Rewards & Staking</h5>
              <main>
              <div>
                <h6 style={{marginTop:'-10px'}}>Claimable HELP Tokens: {claimableHelpTokens ? commafy(parseFloat(utils.formatUnits(claimableHelpTokens,charityDecimals['DAI'])).toFixed(2)) : "..."}</h6>
                <span> 
                <button onClick={handleClaimTokens} disabled={claimableHelpTokens > 0 ? false : true} className="grd-btn">Claim HELP Tokens</button>
                </span>
                </div>
                
                <div>
                <h6>HELP Balance: {ihelpBalance ? commafy(parseFloat(utils.formatUnits(ihelpBalance,charityDecimals['DAI'])).toFixed(2)) : "..."}</h6>
                <h6>xHELP Balance: {xhelpBalance ? commafy(parseFloat(utils.formatUnits(xhelpBalance,charityDecimals['DAI'])).toFixed(2)) : "..."}</h6>
                <span>
                <button className="grd-btn" onClick={(e)=>{history.push('/stake')}}>Adjust Staking Positions</button>
                </span>
                </div>
                
              </main>

            </main>
          </div>

          {/* Table Grid */}
          <div className={st.tableGrid}>
            {/* Current Deposit Detail */}
            <div className={st.tableContainer}>
              <h5>My Contribution Details</h5>
              {/* Table */}
              <div className={st.dashboardTable + " " + "table"}>
          
          <Table 
          className={st.tableContribute + " " + "table"} columns={charityColumns} dataSource={tableData} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
        
              {/*
                <table>
                  <thead>
                    <tr>
                      <th>Charity</th>
                      <th>Your Deposits</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Save the Planets</td>
                      <td>Charity 2 Deposits in DAI, USDC, WETH</td>
                      <td>
                        <div>
                          <button className="grd-btn">Adjust</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>Charity 2 Deposits in DAI, USDC, WETH</td>
                      <td>
                        <div>
                          <button className="grd-btn">Adjust</button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Save the Planets</td>
                      <td>Charity 2 Deposits in DAI, USDC, WETH</td>
                      <td>
                        <div>
                          <button className="grd-btn">Adjust</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                */}
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
