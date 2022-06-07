import React, { useEffect, useState, useContext } from "react";
import st from "./styles/contributeNew.module.css";
import { Link,NavLink,Redirect,useHistory } from "react-router-dom";
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

import usdc from '../assets/images/other/usdc.png';
import dai from '../assets/images/other/dai.png';
import avax from '../assets/images/other/avax.png';
import sortByArrow from '../assets/images/icon/sortByArrow.png';
import kse from '../assets/images/other/kse.png';
import searchIcon from '../assets/images/icon/searchIcon.png';

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

import { Header,Footer, CheckboxContainer } from "../components";

  const PlaceholderLogo = () => (
<svg width="8rem" height="8rem" viewBox="0 0 66 58" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M60.5028 6.52588L34.332 34.9145L35.049 47.9139L65.3139 20.9819C65.3139 20.755 65.3426 20.5244 65.3498 20.2938C65.5469 15.2361 63.8086 10.2985 60.5028 6.52588Z" fill="#8E40DA"/>
<path d="M8.09663 3.57959C7.21158 4.22008 6.38053 4.935 5.6122 5.71688C5.17841 6.16337 4.76613 6.62816 4.37895 7.10393C2.54421 9.369 1.23635 12.0292 0.553711 14.8845L30.3848 40.6345L31.2309 27.7595L8.09663 3.57959Z" fill="#8830EF"/>
<path d="M60.4986 6.52573C60.262 6.25125 60.0146 5.9841 59.7565 5.7206C59.4984 5.45709 59.2402 5.21188 58.9749 4.96668C55.328 1.64183 50.573 -0.132469 45.6853 0.00771667C40.7977 0.147903 36.1478 2.19195 32.6895 5.7206L34.0733 30.3507L60.4986 6.52573Z" fill="#B559F7"/>
<path d="M10.0792 2.32444C9.39451 2.70227 8.73249 3.12145 8.09668 3.57974L31.4747 24.034L32.6793 5.73533C29.7713 2.76323 26.0028 0.82652 21.9321 0.212159C17.8615 -0.402202 13.7052 0.338472 10.0792 2.32444Z" fill="#AC6EF4"/>
<path d="M35.2988 52.3418L35.6143 57.9998L59.7559 33.3551C62.9878 30.0662 64.9569 25.7031 65.3056 21.0583C65.3038 21.0352 65.3038 21.0119 65.3056 20.9888L35.2988 52.3418Z" fill="#5C1AA8"/>
<path d="M0.549778 14.8882L0.506754 15.0858C-0.238276 18.3225 -0.160683 21.6998 0.732159 24.8972C1.625 28.0946 3.30347 31.0061 5.60826 33.3553L29.2695 57.5096L30.0941 45.0006L0.549778 14.8882Z" fill="#560AC1"/>
</svg>
)

const ContributeNew = (props) => {
  
  const [totalInterest, setTotalInterest] = useState(commafy(''));
  const [tvl, setTvl] = useState(commafy(''));
  const [totalCharities, setTotalCharities] = useState(commafy(''));
  const [totalCountries, setTotalCountries] = useState(commafy(''));
  const [totalHelpers, setTotalHelpers] = useState(commafy(''));
  
  const [allCategories, setAllCategories] = useState([]);
  const [allCharities, setAllCharities] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  const [filteredShownCharities, setFilteredShownCharities] = useState(8);
  
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

  const mainAreasOperation = {
    title: 'Main areas of operation',
    checkbox: [
        {
            name: "United States",
        },
        {
            name: "France",
        },
        {
            name: "Italy",
        },
        {
            name: "Germany",
        },
        {
            name: "Germany",
        },
        {
            name: "Germany",
        },
        {
            name: "Germany",
        },
        {
            name: "Germany",
        },
        {
            name: "Germany",
        },
        ]
    }
    const countryIncorporation = {
        title: 'Country of Incorporation',
        checkbox: [
            {
                name: "United States",
            },
            {
                name: "France",
            },
            {
                name: "Italy",
            },
            {
                name: "Germany",
            },
            {
                name: "Germany",
            },
            {
                name: "Germany",
            },
            {
                name: "Germany",
            },
            {
                name: "Germany",
            },
            {
                name: "Germany",
            },
        ]
    }
    const charityDetailedCategory = {
        title: 'Charity Detailed Category',
        checkbox: [
            {name: "Natural Resource Conservation and Protection (C30)"},
            {name: "Land Resources Conservation (C34)"},
            {name: "Alliance/Advocacy Organizations (N01) "},
        ]
    }
    const charityGeneralCategory = {
        title: 'Charity General Category',
        checkbox: [
            {name: "Environment (C)"},
            {name: "Recreation & Sports (N) "},
        ]
    }
    const cryptosAvailableDeposit = {
        title: "Cryptos Available for Deposit",
        checkbox: [
            {
                name: "USDC",
                source: usdc,
                icon: true,
            },
            {
                name: "DAI",
                source: dai,
                icon: true
            },
            {
                name: "AVAX",
                source: avax,
                icon: true
            },
        ]
    }
    
    const handleShowMore = () => {
        
        setFilteredShownCharities(filteredShownCharities+8)
        
    }

    try{
        console.log(Object.keys(filteredCharities[0]))
    }catch(e){}

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
     
          {/*<div className={st.searchFilter}>
          
          
             <main className={st.filterBox}>
            
              <h6 className={st.topText}>
                  Welcome to the <a href='https://docs.ihelp.finance' target="_blank"> iHelp Protocol</a>. Click on any charity to learn more and contribute.
                </h6>
            
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
          
          */}
          
          
          <div className='banner'>
                <div className='filters'>
                    <h4>Filters</h4>
                    <div className='btnBanner'>
                        <button>Apply</button>
                        <button>Reset</button>
                    </div>
                    <div className='inputBanner'>
                        <label className='title'>Total Revenue ($)</label>
                        <input type="number" placeholder='0'/>
                        <input type="number" placeholder='999.999'/>
                    </div>
                    <div className='inputBanner'>
                        <label className='title'>Program expense (%)</label>
                        <input type="number" placeholder='0'/>
                        <input type="number" placeholder='100'/>
                    </div>
                    <CheckboxContainer data={mainAreasOperation} seeMore={true}/>
                    <CheckboxContainer data={countryIncorporation} seeMore={true}/>
                    <div className='inputBanner'>
                        <label className='title'>Year Incorporated</label>
                        <input type="number" placeholder='2000'/>
                        <input type="number" placeholder='2022'/>
                    </div>
                    <CheckboxContainer data={charityDetailedCategory}/>
                    <CheckboxContainer data={charityGeneralCategory}/>
                    <CheckboxContainer data={cryptosAvailableDeposit}/>
                    <div className='btnBanner bottom'>
                        <button>Apply</button>
                        <button>Reset</button>
                    </div>
                </div>
                <div className='stItemContainer'>
                    <div className='head-bar'>
                        <button className='sortBySelect'>
                            <div className='sortByView'>
                                <p>Sort by</p>
                                <img src={sortByArrow} alt=""/>
                            </div>
                            <div className='sortByBody'>

                            </div>
                        </button>
                        <div className='searchFilter'>
                            <div className='searchBar'>
                                <img src={searchIcon} alt=""/>
                                <input type="text" placeholder="Search" onChange={handleSearch}/>
                            </div>
                        </div>
                    </div>
                    <div className='kseBanner'>

                        {
                            filteredCharities.map((item, index) => {
                            
                                if (index >= filteredShownCharities) { 
                                    return ''
                                }
                                else {
                            
                                    return (
                                        <div key={index} className='kseItem'>
                                            <div className='kseBody'>
                                                <div className='kseLogo'>{item['Logo'] != '' ? (<img src={item['Logo']} alt=""/>) : <PlaceholderLogo />}</div>
                                                <p className='kseName'>
                                                    {item['Organization Name']}                                                    </p>
                                                <p className='kseDescription'>
                                                    {item['Short Description for Front of Card']}
                                                </p>
                                                <div className='keyDataBanner'>
                                                    <NavLink to={`/charity/${item['Id']}`} className='cta'>Details</NavLink>
                                                    <div>
                                                        <p className='name'>
                                                            Total Revenue
                                                        </p>
                                                        <p className='price'>
                                                            {item['Total Revenue']}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='name'>
                                                            Total Expenses
                                                        </p>
                                                        <p className='price'>
                                                            {item['Total Expenses']}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='name'>
                                                            Net Income
                                                        </p>
                                                        <p className='price'>
                                                            {item['Net Income']}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='name'>
                                                            Year Founded
                                                        </p>
                                                        <p className='price'>
                                                            {item['Year Incorporated']}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                
                            })
                        }
                        {filteredCharities.length > filteredShownCharities ? (<div className='loadMoreContent'>
                            <button className='loadMoreBtn' onClick={handleShowMore}>
                                LOAD MORE
                            </button>
                        </div>) : ''}
                    </div>
                </div>
            </div>
          
          
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
