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
import { utils } from "ethers";
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

import EducationBadge from '../assets/images/badges/Education.png';
import HealthCareBadge from '../assets/images/badges/Health Care.png';

import BadgeLookup from '../assets/images/badges/badgeLookup.js';

// preimport the images one time
Object.keys(BadgeLookup).map((d)=>{
  BadgeLookup[d]['image'] = require(`../assets/images/badges/${BadgeLookup[d]['File']}`).default
})

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
  const [searchValue, setSearchValue] = useState('');
  
  const [allCategories, setAllCategories] = useState([]);
  const [allCharities, setAllCharities] = useState([]);
  const [filteredCharities, setFilteredCharities] = useState([]);
  const [filteredShownCharities, setFilteredShownCharities] = useState(8);
  
  
  const [areasOfOperation, setareasOfOperation] = useState([]);

  
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

  const setValue = props.setValue;
  const updateValue = props.updateValue;

  
   const listener = (blockNumber, contract) => {
    if (contract != undefined) {
      //console.log(contract, blockNumber); // , fn, args, provider.listeners()
      updateContracts(contract);
    }
  };
  
  
  const updateContracts = () => {
    
      if (props.readContracts == undefined) {
       
         setTimeout(()=>{
          updateContracts();
        },50);
        
      } else {
        
      // console.log(props.readContracts['iHelp'].address)
      //     console.log('README',props.readContracts)
      
      props.readContracts["analytics"]["generalStats"](...[props.readContracts['iHelp'].address,0,100]).then((d) => {
        //console.log(d)  
        
        const totalHelpers = commafy(parseFloat(d['totalHelpers']).toFixed(0))
        const totalCharities = commafy(parseFloat(d['totalCharities']).toFixed(0))
        
        setTotalHelpers(totalHelpers)
        setTotalCharities(totalCharities)
        setTotalInterest(commafy(parseFloat(utils.formatUnits(d['totalInterestGenerated'],18)).toFixed(0)))
        setTvl(commafy(parseFloat(utils.formatUnits(d['totalValueLocked'],18)).toFixed(0)))
        
      });
      
      }
  };

  useEffect(async() => {

    updateContracts();
    
     let url = `/api/v1/data/charities`;
      fetch(url).then((d) => {
        return d.json();

      }).then((d)=>{
        
        const categories = [];
        const categoriesCount = [];
        d.map((c)=>{
          
              c['Charity GENERAL Category (One Cell)'].split('\n').map((cc)=>{
                  
                  if (categoriesCount.indexOf(cc.trim()) == -1 && cc != '') {
                      categories.push({name:cc.trim(),isChecked:false})
                      categoriesCount.push(cc.trim())
                  }
              })
            
        })
        
        const chars = [];
        d.map((c)=>{
          if (c['Status'] == 'LIVE' && c['CharityPool Contract'] != '') {
            chars.push(c)
          }
        })
        
        
        let geos = [];
        const geoCount = [];
        d.map((c)=>{
          
              c['Main Areas of Operation'].split(',').map((cc)=>{
                  
                  if (geoCount.indexOf(cc.trim()) == -1 && cc != '') {
                      geos.push({name:cc.trim(),isChecked:false})
                      geoCount.push(cc.trim())
                  }
              })
            
        })
        
        geos.sort((a, b) => (a.name > b.name) ? 1 : -1)
        categories.sort((a, b) => (a.name > b.name) ? 1 : -1)
        
        function prepend(value, array) {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
}


        geos = prepend({name:'Global Non-Profit',isChecked:false},geos);
       // console.log(categories)
        
         const initialCharityGeneralCategory = {
            title: 'General Charity Category',
            checkbox: categories
        }
        // setcharityGeneralCategory(initialCharityGeneralCategory)
        filteredParams['categories'] = initialCharityGeneralCategory;
        
        const initialCharityGeography = {
            title: 'Main Areas of Operation',
            checkbox: geos
        }
        // setcharityGeneralCategory(initialCharityGeneralCategory)
        filteredParams['geography'] = initialCharityGeography;
        
        setinitialFilterState(filteredParams)
        
        setFilteredParams(filteredParams)
        setActualFilterParams(filteredParams)
        
        setAllCategories(categories);
        setAllCharities(chars);
        setFilteredCharities(chars);
      })
      
  }, [props]);
  
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
    
    const searchvalue = e.target.value;
    setSearchValue(searchvalue)
    
    
    // setTimeout(()=>{
    //          processFilterSearches();
    //      },100);
    
    /*
    allCharities.map((c)=>{
      
      const key = [c['Organization Name'],c['Charity GENERAL Category (One Cell)'],c['Brief Description & History']].join(',');
      
      if (key.toLowerCase().indexOf(searchvalue.toLowerCase()) > -1 && c['Status'] == 'LIVE') {
        filtered.push(c);
      }
      
    })
    
    setFilteredCharities(filtered);
    */
    
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
   
    //  const [charityGeneralCategory, setcharityGeneralCategory] = useState({title: 'General Charity Category',
    //         checkbox: []});
    
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

     const updateFilterParams = (e) => {
         
         const value = e.target.value;
         const input = e.target.name;
         
         console.log(input,value)

         const newParams = JSON.parse(JSON.stringify(filteredParams));
         newParams[input] = value;
         
         console.log(newParams)
         
         setFilteredParams(newParams)
         
     }

     const resetFilterState = () => {
         console.log('reseting filter')
         setFilteredParams(initialFilterState)
         setActualFilterParams(initialFilterState)
        //  setTimeout(()=>{
        //      processFilterSearches();
        //  },100);
     }
     
     const operators = {
        '>': function(a, b) { return a > b },
        '<': function(a, b) { return a < b },
    };
     
     
     const paramMap = {
         'revenue_min': ['Total Revenue',operators['>']],
         'revenue_max': ['Total Revenue',operators['<']],
         'prog_exp_rev_min': ['Program Expense / Revenue',operators['>']],
         'prog_exp_rev_max': ['Program Expense / Revenue',operators['<']],
         'year_inc_min': ['Year Incorporated',operators['>']],
         'year_inc_max': ['Year Incorporated',operators['<']],
     }
     
    const [initialFilterState, setinitialFilterState] = useState({
         'revenue_min':'',
         'revenue_max':'',
         'prog_exp_rev_min':'',
         'prog_exp_rev_max':'',
         'year_inc_min':'',
         'year_inc_max':'',
         'categories': {title: 'General Charity Category',checkbox: []},
         'geography': {title: 'Main Areas of Operation',checkbox: []}
    })
    
     const [filteredParams, setFilteredParams] = useState(initialFilterState);
         
     const [actualFilterParams, setActualFilterParams] = useState(initialFilterState);

     const allAreTrue = (arr) => {
      return arr.every(element => element === true);
    }
    
     useEffect(() => {
   // const processFilterSearches = () => {
        
        console.log(filteredParams);
        
         // get checks to pass
        const checks = [];
        Object.keys(filteredParams).map((c)=>{
            if (filteredParams[c]) {
                checks.push(c)
            }
        })
         
        const filtered = [];
        
        let selectedCharities = []
        try {
        filteredParams.categories.checkbox.map((cc)=>{
            if (cc['isChecked'] == true){
                selectedCharities.push(cc.name)
            }
        })
        }catch(e){}
        //console.log('selectedCharities',selectedCharities)

        let selectedGeographies = [];
        try {
        filteredParams.geography.checkbox.map((cc)=>{
            if (cc['isChecked'] == true){
                selectedGeographies.push(cc.name)
            }
        })
        }catch(e){}
        console.log('selectedGeographies',selectedGeographies)

        allCharities.map((c)=>{
            
            let searchpass = false;
            if (searchValue != '') {
                const key = [c['Organization Name'],c['Charity GENERAL Category (One Cell)'],c['Brief Description & History']].join(',');
              if (key.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 && c['Status'] == 'LIVE') {
                searchpass = true;
              }
            } else {
                searchpass = true;
            }
            
            let categorypass = false;
            if (selectedCharities.length > 0) {
                const charityCategories = c['Charity GENERAL Category (One Cell)'].split('\n');
                for (let cc=0;cc<charityCategories.length;cc++) {
                    //console.log(charityCategories[cc])
                    if (selectedCharities.indexOf(charityCategories[cc].trim()) > -1) {
                        categorypass = true 
                        break
                    }
            }} else {
                categorypass = true 
            }
            
            let geographypass = false;
            if (selectedGeographies.length > 0) {
                const charityGeographies = c['Main Areas of Operation'].split(',');
                for (let cc=0;cc<charityGeographies.length;cc++) {
                    //console.log(charityCategories[cc])
                    if (selectedGeographies.indexOf(charityGeographies[cc].trim()) > -1) {
                        geographypass = true 
                        break
                    }
            }} else {
                geographypass = true 
            }
            
           
            //   const key = [c['Organization Name'],c['Charity GENERAL Category (One Cell)'],c['Brief Description & History']].join(',');
            //   if (key.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 && c['Status'] == 'LIVE') {
            //     filtered.push(c);
            //   }
        
            const passes = [];
            checks.map((cc)=>{
                if (cc.indexOf('min') > -1 || cc.indexOf('max') > -1){
                 if ( paramMap[cc][1](parseFloat(c[paramMap[cc][0]].replace(/,/g,'').replace(/\$/g,'')),parseFloat(filteredParams[cc]))){
                     passes.push(true)
                 } else {
                     passes.push(false)
                 }
                }
            })
            
            //console.log(c['Organization Name'],passes)
            
            if (allAreTrue(passes) && searchpass && categorypass && geographypass){
                filtered.push(c);
            }
 
        })
        
        setFilteredCharities(filtered);
         
        
     }, [actualFilterParams,setActualFilterParams,setSearchValue,searchValue]);
    
     const applyFilteredParams = () =>{
         
        setActualFilterParams(filteredParams);
      //  processFilterSearches();  
       
     }
     
    const filtersMatch = JSON.stringify(actualFilterParams) == JSON.stringify(filteredParams);
   
   //console.log(filtersMatch,actualFilterParams,filteredParams);

    // try{
    //     console.log(Object.keys(filteredCharities[0]))
    // }catch(e){}
    
    function getVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
    
        return (match && match[2].length === 11)
          ? match[2]
          : null;
    }
        
    const handleCategoryCheckboxChange = (data) => {
       // console.log(data);
        
        const newParams = JSON.parse(JSON.stringify(filteredParams));
        newParams.categories = {title: 'General Charity Category',checkbox: data};
        setFilteredParams(newParams)
        
        //setcharityGeneralCategory();
    }
    
    const handleGeographyCheckboxChange = (data) => {
       // console.log(data);
        
        const newParams = JSON.parse(JSON.stringify(filteredParams));
        newParams.geography = {title: 'Main Areas of Operation',checkbox: data};
        setFilteredParams(newParams)
        
        //setcharityGeneralCategory();
    }
    
    const [currentTab, setCurrentTab] = useState('tab1');
    const tabList = [
        {
            name: 'tab1',
            label: 'Category',
            content: (
               <CheckboxContainer data={filteredParams.categories} onHandleChange={handleCategoryCheckboxChange} seeMore={true}/>
            )
        },
        {
            name: 'tab2',
            label: 'Geography',
            content: (
                <CheckboxContainer data={filteredParams.geography} onHandleChange={handleGeographyCheckboxChange} seeMore={true}/>
            )
        },
        {
            name: 'tab3',
            label: 'Other',
            content: (
<span>
<div className='inputBanner'>
                        <label className='title'>Total Revenue ($)</label>
                        <input type="number" placeholder='0' value={filteredParams['revenue_min']} name='revenue_min' onChange={updateFilterParams} />
                        <input type="number" placeholder='999.999' value={filteredParams['revenue_max']} name='revenue_max' onChange={updateFilterParams} />
                    </div>
                    <div className='inputBanner'>
                        <label className='title'>Program Expense / Revenue (%)</label>
                        <input type="number" placeholder='0' value={filteredParams['prog_exp_rev_min']} name='prog_exp_rev_min' onChange={updateFilterParams} />
                        <input type="number" placeholder='100' value={filteredParams['prog_exp_rev_max']} name='prog_exp_rev_max' onChange={updateFilterParams}/>
                    </div>
                    <div className='inputBanner'>
                        <label className='title'>Year Incorporated</label>
                        <input type="number" placeholder='2000' value={filteredParams['year_inc_min']} name='year_inc_min' onChange={updateFilterParams}/>
                        <input type="number" placeholder='2022' value={filteredParams['year_inc_max']} name='year_inc_max' onChange={updateFilterParams}/>
                    </div>
</span>
            )
        }
    ];
    

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
              <p>Total Yield Donated</p>
              
            </div>
            <div className={"quickInfo"}>
              
              <img src={helpers_light} alt="logo" className='quickInfoIcon'/>
              <div className={"quickInfoSub"}>{totalHelpers}</div>
              <p>Total Yield Donors</p>
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
                        <button onClick={applyFilteredParams} disabled={filtersMatch ? 'disabled' : false}>Apply</button>
                        <button onClick={resetFilterState}>Reset</button>
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
                    
                    
                    
                    
                     {/* <CheckboxContainer data={ {category:charityGeneralCategory, geography:[], other}} seeMore={true}/>
                     
                   <CheckboxContainer data={mainAreasOperation} seeMore={true}/>
                    <CheckboxContainer data={countryIncorporation} seeMore={true}/>*/}
                    
                     {/*<CheckboxContainer data={charityDetailedCategory} seeMore={true}/>*/}
                   
                    {/*<CheckboxContainer data={cryptosAvailableDeposit}/>*/}
                    <div className='btnBanner bottom'>
                        <button onClick={applyFilteredParams}  disabled={filtersMatch ? 'disabled' : false}>Apply</button>
                        <button onClick={resetFilterState}>Reset</button>
                    </div>
                </div>
                <div className='stItemContainer'>
                    <div className='head-bar' style={{float:'right'}}>
                         {/*<button className='sortBySelect'>
                           <div className='sortByView'>
                                <p>Sort by</p>
                                <img src={sortByArrow} alt=""/>
                            </div>
                            <div className='sortByBody'>
                                
                            </div>
                        </button>*/}
                        <div className='searchFilter'>
                            <div className='searchBar'>
                                <img src={searchIcon} alt=""/>
                                <input type="text" placeholder="Search" value={searchValue} onChange={handleSearch}/>
                            </div>
                        </div>
                        
                    </div>
                    
                    <span style={{fontSize:'14px',fontStyle:'italic',marginTop:'13px',position:'absolute',marginLeft:'15px',color:'rgba(0, 0, 0, 0.5)'}}>Found {filteredCharities.length} out of {allCharities.length} total charities...</span>
                    
                    <div className='kseBanner'>

                        {
                            filteredCharities.map((item, index) => {
                            
                          //  console.log(item)
                            
                                if (index >= filteredShownCharities) { 
                                    return ''
                                }
                                else {
                            
                                    let cat1img = null;
                                    let cat2img = null;
                                    let cat3img = null;

                                    try {
                                        if (item['Charity GENERAL Category #1'] && item['Charity GENERAL Category #1'] != '') {
                                            const catId = item['Charity GENERAL Category #1'].split('(')[1].split(')')[0];
                                            cat1img = BadgeLookup[catId]['image']
                                        }
                                    }catch(e){console.log('MISSING FILE 1',item['Charity GENERAL Category #1'])}
                                    try {
                                        if (item['Charity GENERAL Category #2'] && item['Charity GENERAL Category #2'] != '') {
                                            const catId = item['Charity GENERAL Category #2'].split('(')[1].split(')')[0];
                                            cat2img = BadgeLookup[catId]['image']
                                        }
                                    }catch(e){console.log('MISSING FILE 2',item['Charity GENERAL Category #2'])}
                                    try {
                                        if (item['Charity GENERAL Category #3'] && item['Charity GENERAL Category #3'] != '') {
                                            const catId = item['Charity GENERAL Category #3'].split('(')[1].split(')')[0];
                                            cat3img = BadgeLookup[catId]['image']
                                        }
                                    }catch(e){console.log('MISSING FILE 3',item['Charity GENERAL Category #3'])}

                                    return (
                                        <div key={index} className='kseItem'>
                                            <div className='kseBody'>
                                            
                                            <div className='header-section'>
                                            
                                                {cat1img ? (<div className='badge-section'>
                                                
                                                    <div className='badge-layout'>

                                                        {cat1img ? <img className="badge-icon" src={cat1img} alt=""/> : ''}
                                                        {cat2img ? <img className="badge-icon" src={cat2img} alt=""/> : ''}
                                                        {cat3img ? <img className="badge-icon" src={cat3img} alt=""/> : ''}
                                                 
                                                        
                                                    </div>

                                                </div>) : '' }
                                                {/*<img className="logo-icon" src={item['Logo']} alt=""/>*/}
                                                {item['Logo'] != '' ? (<div className='logo-section'>
                                                    <div className='logo-layout'>
                                                        <img className="logo-icon" src={item['Logo']} alt=""/>
                                                    </div>
                                                </div>):''}
                                            
                                            </div>
                                                
                                                <p className='kseName'>
                                                    {item['Organization Name']}                                                    </p>
                                                
                                                <div className='keyDataBanner'>
                                                
                                                    {item['Video for Charity Card'] && item['Video for Charity Card'] != '' ? (<iframe className='infoVideo' height={'200px'} width={'400px'} src={`https://www.youtube.com/embed/${item['Video for Charity Card'] && item['Video for Charity Card'] != '' ? getVideoId(item['Video for Charity Card'].split('\n')[0]) : ''}`} title="" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>) : <span className='infoVideo' style={{marginTop:'20px',width:'100%',textAlign:'center',fontSize:'18px'}}>No video found...</span>}
                                                    
                                                    <NavLink to={`/charity/${item['CharityPool Contract']}`} className='cta'>Details</NavLink>
                                                    
                                                    <div style={{height:'120px',overflow:'hidden'}}>
                                                        <p className='kseDescription'>
                                                            {item['Short Description for Front of Card']}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="full">
                                                        <p className='name'>
                                                            Operating In: 
                                                        </p>
                                                        <p className='price' style={{fontSize:'14px'}}>
                                                            {item['Main Areas of Operation']}
                                                        </p>
                                                    </div>
                                                    
                                                    {/*
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
                                                    */}
                                                    <div className="half">
                                                        <p className='name'>
                                                            Total Revenue
                                                        </p>
                                                        <p className='price'>
                                                            {item['Total Revenue']}
                                                        </p>
                                                    </div>
                                                    <div className="half">
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
