import React, { useEffect, useState, useContext } from "react";
import st from "./styles/dashboardNew.module.css";
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
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { Navigation, Pagination } from "swiper";
// import "swiper/swiper.min.css";
// import "swiper/components/pagination/pagination.min.css";
import commafy from 'commafy';
import { Spin,Table, Tag, Space,Tooltip, Form, Button,Checkbox,Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { utils } from "ethers";

import { Header,Footer,Address } from "../components";

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const ContributeNew = (props) => {
  
  const [charityInfo, setcharityInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [coinbaseAuth, setcoinbaseAuth] = useState(false);
  
  const [daiClaimableInterest, setdaiClaimableInterest] = useState(null);
  const [usdcClaimableInterest, setusdcClaimableInterest] = useState(null);
  
  const [daiDirectDonations, setdaiDirectDonations] = useState(null);
  const [usdcDirectDonations, setusdcDirectDonations] = useState(null);
  
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  
  const setValue = props.setValue;
  const charityDecimals = props.charityDecimals;
  
  const checkAuth = (user) => {
    
    setLoading(true);
    
    //console.log(user)
    // check if the user and password matches the record
    const loadAccount = (tries) => {
      try {
        fetch(`/api/v1/data/login?email=${email}&pass=${password}&fetchWallet=true`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            
            if (data.message == 'success') {
              window.email = data.email;
              setEmail(data.email);
              setcoinbaseAuth(data.coinbase)
              setcharityInfo(data.charity)
              
              setValue("iHelp", "getClaimableCharityInterestOf", [data.charity['DAI CharityPool']], daiClaimableInterest, setdaiClaimableInterest);
              setValue("iHelp", "getClaimableCharityInterestOf", [data.charity['USDC CharityPool']], usdcClaimableInterest, setusdcClaimableInterest);
              
              setValue("DAI", "balanceOf", [data.charity['DAI CharityPool']], daiDirectDonations, setdaiDirectDonations);
              setValue("USDC", "balanceOf", [data.charity['USDC CharityPool']], usdcDirectDonations, setusdcDirectDonations);
              
              setLoading(false)
              
              // authenticated successfully
              if (history.location.pathname == '/login' || history.location.pathname == '/') {
                history.replace('/account');
                
              }
            }
            else {
              localStorage.setItem('authenticatedUser', undefined);
              history.push('/')
              setLoading(false)
            }
          })
          .catch(error => {
            setTimeout(() => {
              loadAccount(tries + 1);
            }, 100)
  
          })
      }
      catch (e) {
        setTimeout(() => {
          loadAccount(tries + 1);
        }, 100)
      }
    }
    let email = '';
    let password = '';
    try {
      email = user.split(':')[0];
      password = user.split(':')[1];
      loadAccount(0)
    }catch(e){
      localStorage.setItem('authenticatedUser', undefined);
      history.push('/login')
      setLoading(false)
    }
  }

  useEffect(async() => {
    document.title = `iHelp | Account (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
    //document.getElementById("favicon").href = "/favicon.ico";
    
    if (localStorage.getItem('authenticatedUser') == "undefined" || localStorage.getItem('authenticatedUser') == null) {
      // setAttemptedPage(history.location.pathname + history.location.search)
      if (history.location.pathname != '/' && history.location.pathname != '/login') {
        history.replace('/login');
      }
    }
    else {
      var user = localStorage.getItem('authenticatedUser');
      checkAuth(user);
    }
    
  }, []);
  
  const handleLogout = () => {
    localStorage.setItem('authenticatedUser', undefined);
    history.push('/login')
  }
  
  const handleClaim = () => {
    alert('Feature coming soon! 1')
  }
  
  const coinbaseurl = `https://www.coinbase.com/oauth/authorize?client_id=50bbd2ddf161d4e414a92fd269a4ce215fd6d9846ae8bd2645ea727a6895bfef&redirect_uri=https%3A%2F%2Favalanche.ihelp.finance%2Fapi%2Fv1%2Fdata%2Fcoinbase%2Fcallback&response_type=code&account=all&scope=wallet:sells:read,wallet:sells:create,wallet:user:read,wallet:accounts:read,wallet:addresses:read,wallet:payment-methods:read&state=${email}`;

  return (
    <div id="app" className="app">

      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header {...props}/>
      
      <div className={st.contribute + " " + "section"}>
        <div className="box">
        
        <div className={st.dashboardMainGrid}>
        
          <main className={st.dashboardGraph}>
          
           {loading ? (<span><h5>Loading Charity Info...</h5><Spin indicator={antIcon} /></span>) :  ( <span>
          
              <h5>{charityInfo ? charityInfo['Organization Name'] : ''}</h5>
              <h6>{charityInfo ? 'Contract Addresses:' : ''}</h6>
              {charityInfo ? Object.keys(charityInfo['Stats']).map((c)=>{
              if (c !='Total') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    <Address address={charityInfo[`${c} CharityPool`]} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} /><br/>
                </Tooltip>
              }}) : ''}
              <br/>
              <h6>{charityInfo ? 'Current Contributions:' : ''}</h6>
              {charityInfo ? Object.keys(charityInfo['Stats']).map((c)=>{
              if (c !='Total') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {commafy(charityInfo['Stats'][c]['contribution'])}<br/>
                </Tooltip>
              }}) : ''}
              <br/>
              <h6>{charityInfo ? 'Interest Generated:' : ''}</h6>
              {charityInfo ? Object.keys(charityInfo['Stats']).map((c)=>{
              if (c !='Total') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {commafy(charityInfo['Stats'][c]['interest'])}<br/>
                </Tooltip>
              }}) : ''}
              
              </span>)}
              
          </main>
          
          <main className={st.dashboardGraph}>
              <h5>Claimable Donations</h5>
              
              {loading ? ('') :  ( <span>
              <h6>{charityInfo ? 'Interest:' : ''}</h6>
              {charityInfo ? Object.keys(charityInfo['Stats']).map((c)=>{
              if (c =='DAI') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {daiClaimableInterest ? commafy(parseFloat(utils.formatUnits(daiClaimableInterest,charityDecimals['DAI']))) : ''}<br/>
                </Tooltip>
              }
                else if (c =='USDC') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {usdcClaimableInterest ? commafy(parseFloat(utils.formatUnits(usdcClaimableInterest,charityDecimals['DAI']))) : ''}<br/>
                </Tooltip>
              }
              }) : ''}
              <br/>
              <button className="grd-btn" onClick={handleClaim}>
                Claim Interest Donations
              </button>
              <br/>
              <br/>
              <h6>{charityInfo ? 'Direct:' : ''}</h6>
              {charityInfo ? Object.keys(charityInfo['Stats']).map((c)=>{
              if (c =='DAI') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {daiDirectDonations ? commafy(parseFloat(utils.formatUnits(daiDirectDonations,charityDecimals['DAI']))) : ''}<br/>
                </Tooltip>
              }
                else if (c =='USDC') {
                return <Tooltip title={c}>
                    <img src={`/assets/icons/${c.replace('.e','')}.svg`} style={{marginTop:'0px',height:'20px',marginRight:'5px'}}/>
                    {usdcDirectDonations ? commafy(parseFloat(utils.formatUnits(usdcDirectDonations,charityDecimals['USDC']))) : ''}<br/>
                </Tooltip>
              }
              }) : ''}
              <br/>
              <button className="grd-btn" onClick={handleClaim}>
                Claim Direct Donations
              </button>
              
              </span>)}
           </main>
          
           <main className={st.dashboardGraph}>
              <h5>Wallet Account</h5>
              
              
              {loading ? ('') :  ( <span>
              
                 {/*
                 { binanceAuth != false ? (<span>
              <h6>Coinbase Connected</h6>
              <h5>User: {binanceAuth['username']}</h5>
              <h5>AVAX Balance: {binanceAuth['avax']}</h5>
              <h5>USD Balance: {binanceAuth['usd']}</h5>
              <br/>
              <a href={coinbaseurl} target="_self">
                <button className="grd-btn">
                      Refresh Coinbase Connection
                </button>
              </a></span>) 
              : (<a href={coinbaseurl} target="_self">
                <button className="grd-btn">
                      Connect Coinbase Account
                </button>
              </a>)}
              
           
              { coinbaseAuth != false ? (<span>
              <h6>Coinbase Connected</h6>
              <h5>User: {coinbaseAuth['username']}</h5>
              <h5>AVAX Balance: {coinbaseAuth['avax']}</h5>
              <h5>USD Balance: {coinbaseAuth['usd']}</h5>
              <br/>
              <a href={coinbaseurl} target="_self">
                <button className="grd-btn">
                      Refresh Coinbase Connection
                </button>
              </a></span>) 
              : (<a href={coinbaseurl} target="_self">
                <button className="grd-btn">
                      Connect Coinbase Account
                </button>
              </a>)}
              */}
              
              
              </span>)}
           </main>
        
        </div>
       
        
        <br/>
        <br/>
        <button className="grd-btn" onClick={handleLogout}>
          Logout of Account
        </button>
          
        </div>
      </div>
      
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
