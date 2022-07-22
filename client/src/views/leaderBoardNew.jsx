import React, { useEffect, useState } from "react";
import st from "./styles/leaderboardNew.module.css";
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
//import { useRouter } from "next/router";
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
import { Table, Tag, Space,Tooltip } from 'antd';
import commafy from 'commafy';
import Address from "../components/Address";
import { Header,Footer } from "../components";

const ContributeNew = (props) => {
  
  const [allLeaderboard, setAllLeaderboard] = useState([]);
  const [filteredLeaderboard, setfilteredLeaderboard] = useState([]);
  
  const [allCharities, setAllCharities] = useState([]);
  const [filteredCharities, setfilteredCharities] = useState([]);
  
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState('helpers');
  const [searchValue, setsearchValue] = useState('');

  useEffect(async() => {
    document.title = `iHelp | Leaderboard (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);
  
  if (props.readContracts && loaded == false) {

    setLoaded(true);
  
    const updateStats = (c) => {
      
      let url = `/api/v1/data/leaderboard`;
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
        
        d['helpers'].map((e,ei)=>{
          e['ranking'] = ei+1
        })
        d['charities'].map((e,ei)=>{
          e['ranking'] = ei+1
        })
        
        console.log(d)
        
        setAllLeaderboard(d['helpers']);
        setfilteredLeaderboard(d['helpers']);
        
        setAllCharities(d['charities']);
        setfilteredCharities(d['charities']);
        
      })
      
    }
  
   updateStats();

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
  
  
  const leaderboardColumns = [
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      key: 'ranking',
      sorter: (a, b) => a.ranking - b.ranking,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
      width: '10%',
    },
    {
      title: 'Nickname',
      dataIndex: 'name',
      key: 'name',
      //defaultSortOrder: 'descend',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: text => <a>{text}</a>,
      sorter: (a, b) => a['name'].localeCompare(b['name']),
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      // sorter: (a, b) => a['Charity Category'].localeCompare(b['Charity Category']),
      // sortDirections: ['ascend','descend'],
      width: '20%',
      // filters: allCategories,
      render: address => (<Address address={address} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
      //onFilter: (value, c) => c['Charity Category'] == value,
    },
    {
      title: 'Direct Donations (USD)',
      dataIndex: "donations",
      key: 'donations',
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.donations - b.donations,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Yield Generated (USD)',
      dataIndex: "interests",
      key: 'interests',
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.interests - b.interests,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Contributions (USD)',
      dataIndex: "contributions",
      key: 'contributions',
      defaultSortOrder: "descend",
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.contributions - b.contributions,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    }
  ];
  
  const charityColumns = [
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      key: 'ranking',
      sorter: (a, b) => a.ranking - b.ranking,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
      width: '10%',
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
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    // {
    //   title: 'Charity Currency',
    //   dataIndex: 'currency',
    //   key: 'currency',
    //   //sorter: (a, b) => a.age - b.age,
    //   //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
    //   filters: [
    //     { text: 'DAI', value: 'DAI' },
    //     { text: 'USDC', value: 'USDC' },
    //   ],
    //   width: '15%',
    //   onFilter: (value, c) => c['currency'].indexOf(value) > -1,
    //   render: c => (<Tooltip title={c}>
    //                 <img src={`/assets/icons/${c}.svg`} style={{height:'20px',marginRight:'5px'}}/>
    //             </Tooltip>)
    // },
    {
      title: 'Contract',
      dataIndex: 'address',
      key: 'address',
      // sorter: (a, b) => a['Charity Category'].localeCompare(b['Charity Category']),
      // sortDirections: ['ascend','descend'],
      width: '20%',
      // filters: allCategories,
      render: address => (<Address address={address} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} />),
      //onFilter: (value, c) => c['Charity Category'] == value,
    },
    {
      title: 'Direct Donations (USD)',
      dataIndex: "donations",
      key: 'donations',
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.donations - b.donations,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Yield Generated (USD)',
      dataIndex: "interests",
      key: 'interests',
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.interests - b.interests,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Contributions (USD)',
      dataIndex: "contributions",
      key: 'contributions',
      defaultSortOrder: "descend",
      //render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a.contributions - b.contributions,
      //sortDirections: ['ascend','descend'],
      width: '15%',
    }
  ];
  
  const handleSearch = (e)=> {
    
    setsearchValue(e.target.value);

    const filtered = [];
    
    allLeaderboard.map((c)=>{
      
      const key = [c['name'],c['address']].join(',');
      
      if (key.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
        filtered.push(c);
      }
      
    })
    
    setfilteredLeaderboard(filtered);
    
    const filtered1 = [];
    allCharities.map((c)=>{
      
      const key = [c['address'],c['name']].join(',');
      
      if (key.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1) {
        filtered1.push(c);
      }
      
    })
    
    setfilteredCharities(filtered1);
    
  }
  

  return (
    <div id="app" className="app">
     {/* <Head>
        <title>iHelp | Leaderboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      
      <Header {...props}/>
      
      <div className={st.leaderborad + " " + "section"}>
        <div className="box">
        <div className="sectionHeader">Leaderboard</div>
          {/* Search and  Filter Box */}
          <div className={st.searchFilter}>
            <main style={{marginTop:'-30px'}}>
            <div className={st.buttonGroup}>
              <button className={mode == 'helpers' ? "grd-btn" : 'white-btn'} onClick={(e)=>{setMode('helpers');setsearchValue('');setfilteredLeaderboard(allLeaderboard)}}>Helpers</button>
              <button className={mode == 'charities' ? "grd-btn" : 'white-btn'} onClick={(e)=>{setMode('charities');setsearchValue('');setfilteredCharities(allCharities)}}>Charities</button>
            </div>
          </main>
            <main>
              <div className={st.searchBar}>
                <MdSearch />
                <input type="text" placeholder="Search" onChange={handleSearch} value={searchValue}/>
              </div>
            </main>
            {/*<main className={st.filterBox}>
              <div className={st.sortBy}>
                <h6>Category </h6>
                <select name="" id="">
                  <option value="">All</option>
                  <option value="">All</option>
                  <option value="">All</option>
                </select>
              </div>
            </main>*/}
            
          </div>

         {/* <div className={st.leaderboardGrid}>
            
            <div className={st.buttonGroup}>
              <button className="grd-btn">Interest Donations</button>
              <button className="white-btn">Direct Donations</button>
            </div>
            <div className={st.buttonGroup2}>
              <button className="white-btn">24H</button>
              <button className="grd-btn">7 Days</button>
              <button className="white-btn">30 Days</button>
              <button className="white-btn">All Time</button>
            </div>
          </div>*/}
          
          
          { mode == 'helpers' ? (<Table 
               onRow={(record, rowIndex) => {
                return {
                  onClick: event => { console.log(record) }
                };
              }}
              className={st.tableContribute + " " + "table"} columns={leaderboardColumns} dataSource={filteredLeaderboard} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
            ) :
            (<Table 
               onRow={(record, rowIndex) => {
                return {
                  onClick: event => { console.log(record) }
                };
              }}
              className={st.tableContribute + " " + "table"} columns={charityColumns} dataSource={filteredCharities} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
            )
          }
            
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
