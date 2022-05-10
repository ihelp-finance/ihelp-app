import React, { useEffect, useState, useContext } from "react";
import st from "./styles/contributeNew.module.css";
import { Link,Redirect,useHistory } from "react-router-dom";
import {
  MdSearch,
  MdMenu,
  MdClose,
  MdKeyboardArrowLeft,
  MdOutlineFilterList,
  MdKeyboardArrowRight,
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
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import commafy from 'commafy';
import { Table, Tag, Space,Tooltip } from 'antd';

import { Header,Footer } from "../components";

const ContributeNew = (props) => {
  
  const [totalInterest, setTotalInterest] = useState(commafy(''));
  const [tvl, setTvl] = useState(commafy(''));
  const [totalCharities, setTotalCharities] = useState(commafy(''));
  const [totalCountries, setTotalCountries] = useState(commafy(''));
  const [totalHelpers, setTotalHelpers] = useState(commafy(''));
  
  const [allCategories, setAllCategories] = useState([]);
  const [allCharities, setAllCharities] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  
  const history = useHistory();

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

  useEffect(async() => {
    document.title = `iHelp | Contribute (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
    //document.getElementById("favicon").href = "/favicon.ico";
  }, []);

  useEffect(async() => {

    const updateStats = () => {

      let url = `/api/v1/data/stats`;

      fetch(url).then((d) => {
        if (d.ok) {
          return d.json()
        }else {
        //   setTimeout(()=>{
        //   updateStats();
        // },5000);
        }
      }).then((d) => {
        
        console.log(d);
        
        setTotalInterest(commafy(d['totalInterest']))
        setTvl(commafy(d['tvl']))
        setTotalCharities(commafy(d['totalCharities']))
        setTotalCountries(commafy(d['totalCountries']))
        setTotalHelpers(commafy(d['totalHelpers']))
        
        // setTimeout(()=>{
        //   updateStats();
        // },5000);
        
      }).catch((d) => {
        console.log('error',d);
        // setTimeout(()=>{
        //   updateStats();
        // },5000);
      })

    }
    updateStats();
    
     let url = `/api/v1/data/charities`;
      fetch(url).then((d) => {
        return d.json();

      }).then((d)=>{
        
        const categories = [];
        const categoriesCount = [];
        d.map((c)=>{
          if (categoriesCount.indexOf(c['Charity GENERAL Category (One Cell)']) == -1) {
            categories.push({text:c['Charity GENERAL Category (One Cell)'],value:c['Charity GENERAL Category (One Cell)']})
            categoriesCount.push(c['Charity GENERAL Category (One Cell)'])
          }
        })
        
        const chars = [];
        d.map((c)=>{
          if (c['Status'] == 'LIVE') {
            chars.push(c)
          }
        })
        
        setAllCategories(categories);
        setAllCharities(chars);
        setFilteredCharities(chars);
      })
      
  }, []);
  
  const charityColumns = [
    {
      title: 'Logo',
      dataIndex: 'Logo',
      key: 'logo',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      render: url => <img style={{textAlign:'center'}} height={24} src={url}/>,
      width: '5%',
    },
    {
      title: 'Name',
      dataIndex: 'Organization Name',
      key: 'name',
      //defaultSortOrder: 'descend',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      //render: text => <a>{text}</a>,
      sorter: (a, b) => a['Organization Name'].localeCompare(b['Organization Name']),
      sortDirections: ['ascend','descend'],
      width: '15%',
    },
    {
      title: 'Category',
      dataIndex: 'Charity GENERAL Category (One Cell)',
      key: 'category',
      sorter: (a, b) => a['Charity GENERAL Category (One Cell)'].localeCompare(b['Charity GENERAL Category (One Cell)']),
      sortDirections: ['ascend','descend'],
      width: '25%',
      filters: allCategories,
      onFilter: (value, c) => c['Charity GENERAL Category (One Cell)'] == value,
    },
    {
      title: 'Description',
      dataIndex: 'Shorted Description',
      key: 'description',
      width: '40%',
      render: (c) => (<div style={{maxHeight:'120px',overflow:'hidden',textOverflow:'ellipsis'}}>{c}</div>)
    },
    {
      title: 'Currencies',
      dataIndex: 'Currencies',
      key: 'currencies',
      //sorter: (a, b) => a.age - b.age,
      //sortOrder: sortedInfo.columnKey === 'age' && sortedInfo.order,
      filters: [
        { text: 'DAI', value: 'DAI' },
        { text: 'USDC', value: 'USDC' },
      ],
      width: '10%',
      onFilter: (value, c) => c['Currencies'].indexOf(value) > -1,
      render: (c) => {
        const objs = [];
        c.map((cc)=>{
          objs.push(<Tooltip title={cc}>
            <img src={`/assets/icons/${cc}.svg`} style={{height:'20px',marginRight:'5px'}}/>
        </Tooltip>
  );
        })
        return objs}
    },
    {
      title: 'Pool Size',
      dataIndex: ["Stats", "Total","contribution"],
      key: 'contributed',
      render: c => `$${commafy(c.toFixed(0))}`,
      sorter: (a, b) => a['Stats']['Total']['contribution'] - b['Stats']['Total']['contribution'],
      sortDirections: ['ascend','descend'],
      width: '10%',
    },
    {
      title: 'Interest Generated',
      dataIndex: ["Stats", "Total","interest"],
      key: 'poolsize',
      render: c => `$${commafy(c.toFixed(2))}`,
      sorter: (a, b) => a['Stats']['Total']['interest'] - b['Stats']['Total']['interest'],
      sortDirections: ['ascend','descend'],
      width: '10%',
    }
  ];
  
  const handleSearch = (e)=> {

    const filtered = [];
    
    allCharities.map((c)=>{
      
      const key = [c['Organization Name'],c['Charity GENERAL Category (One Cell)'],c['Brief Description & History']].join(',');
      
      if (key.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 && c['Status'] == 'LIVE') {
        filtered.push(c);
      }
      
    })
    
    setFilteredCharities(filtered);
    
  }

  return (
    <div id="app" className="app">

     {/*   <title>iHelp | Contribute</title> */}
    
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header {...props}/>

      <div className={st.contribute + " " + "section"}>
        <div className="box">
          {/* Contribute Top Minimal Information */}
          <div className={st.topMainGrid}>
            <div className={st.quickInfo}>
              <h6>Total Value Locked (TVL):</h6>
              <div className={st.quickInfoSub}>${tvl}</div>
            </div>
            <div className={st.quickInfo}>
              <h6>Total Interest Generated:</h6>
              <div className={st.quickInfoSub}>${totalInterest}</div>
            </div>
            <div className={st.quickInfo}>
              <h6>Total Helpers: </h6>
              <div className={st.quickInfoSub}>{totalHelpers}</div>
            </div>
            <div className={st.quickInfo}>
              <h6>Total Charities: </h6>
              <div className={st.quickInfoSub}>{totalCharities}</div>
            </div>
          </div>
        {/*
          <div className={st.tableContribute + " " + "table"} style={{width:'50%',display:'inline-block',paddingRight:'10px'}}>
            <table>
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>NickName/Wallet Address</th>
                  <th>Curent TVL ($USD)</th>
                  <th>Total Donations ($USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className={st.tableContribute + " " + "table"} style={{width:'50%',display:'inline-block',paddingLeft:'10px'}}>
            <table>
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>NickName/Wallet Address</th>
                  <th>Curent TVL ($USD)</th>
                  <th>Total Donations ($USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Cobe</td>
                  <td>$28,214,123.22</td>
                  <td>50,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          */}
          
          {/* Top Text */}
          
          {/* Search and  Filter Box */}
          <div className={st.searchFilter}>
          
             <main className={st.filterBox}>
            
                <h6 className={st.topText}>
                  Welcome to the <a href='https://docs.ihelp.finance' target="_blank"> iHelp Protocol</a>. Click on any charity to learn more and contribute.
                </h6>
            
          {/*    <h6 className={st.filter}>
                Filter <MdOutlineFilterList />
              </h6>
              <div className={st.sortBy}>
                <h6>Sort By: </h6>
                <select name="" id="">
                  <option value="">Name</option>
                  <option value="">Category</option>
                  <option value="">Pool Size</option>
                </select>
              </div>*/}
            </main>
          
            <main>
              <div className={st.searchBar} style={{float:'right',marginTop: '16px'}}>
                <MdSearch />
                <input type="text" placeholder="Search" onChange={handleSearch} />
              </div>
            </main>
         
          </div>

           <Table 
           
           onRow={(record, rowIndex) => {
            return {
              onClick: event => { history.push(`/charity/${record['Id']}`) }
            };
          }}
          className={st.tableContribute + " " + "table"} columns={charityColumns} dataSource={filteredCharities} pagination={{ defaultPageSize: 6,showSizeChanger:true,pageSizeOptions:[6,10,20,50] }} /> 
        
          
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
