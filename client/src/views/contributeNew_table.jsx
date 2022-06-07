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
/*
import {
    usdc,
    dai,
    avax,
    sortByArrow,
    kse,
    valueLocked_light,
    generated_light,
    helpers_light,
    charities_light,
    valueLocked_dark,
    generated_dark,
    helpers_dark,
    charities_dark, searchIcon,
} from '../assets/images'
*/
import valueLocked_light from '../assets/images/lightMode/valueLocked_light.png';
import valueLocked_dark from '../assets/images/darkMode/valueLocked_dark.png';

import generated_light from '../assets/images/lightMode/generated_light.png';
import generated_dark from '../assets/images/darkMode/generated_dark.png';

import helpers_light from '../assets/images/lightMode/helpers_light.png';
import helpers_dark from '../assets/images/darkMode/helpers_dark.png';

import charities_light from '../assets/images/lightMode/charities_light.png';
import charities_dark from '../assets/images/darkMode/charities_dark.png';

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

     {/*   <title>iHelp | Contribute</title> 
    
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      */}
      <Header {...props}/>

      <div className={"contribute section"} >
        <div className="box">
          {/* Contribute Top Minimal Information */}
          <div className={"topMainGrid"}>
            <div className={"quickInfo"}>
              
              <img src={valueLocked_light} alt="logo" className='quickInfoIcon'/>
              <div className={"quickInfoSub"}>{tvl == '' ? '' : `$${tvl}`}</div>
              <p>Total Value Locked (TVL)</p>
              
            </div>
            <div className={"quickInfo"}>
              
              <img src={generated_light} alt="logo" className='quickInfoIcon'/>
              <div className={"quickInfoSub"}>{totalInterest == '' ? '' : `$${totalInterest}`}</div>
              <p>Total Interest Generated</p>
              
            </div>
            <div className={"quickInfo"}>
              
              <img src={helpers_light} alt="logo" className='quickInfoIcon'/>
              <div className={"quickInfoSub"}>{totalHelpers}</div>
              <p>Total Helpers</p>
            </div>
            <div className={"quickInfo"}>
              
              <img src={charities_light} alt="logo" className='quickInfoIcon'/>
              <div className={"quickInfoSub"}>{totalCharities}</div>
              <p>Total Charities</p>
            </div>
          </div>
     
          <div className={st.searchFilter}>
          
             <main className={st.filterBox}>
            
              {/*  <h6 className={st.topText}>
                  Welcome to the <a href='https://docs.ihelp.finance' target="_blank"> iHelp Protocol</a>. Click on any charity to learn more and contribute.
                </h6>*/}
            
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
