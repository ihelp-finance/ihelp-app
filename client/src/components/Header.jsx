//import Link from "next/link";
import { BrowserRouter, Route, NavLink,Link,useLocation } from "react-router-dom";
//import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback,useContext } from "react";
import {
    MdMenu,
    MdClose
}
from "react-icons/md";
import { gsap } from "gsap/dist/gsap";
import { Power4 } from "gsap/dist/gsap";
import $ from "jquery";
import { useThemeSwitcher } from "react-css-theme-switcher";

import WalletConnectProvider from "@walletconnect/web3-provider";

import Web3Modal from "web3modal";
//import { INFURA_ID, NETWORK, NETWORKS } from "./constants";
const { ethers } = require("ethers");
import WalletLink from "walletlink";

import logo_wt from "../assets/logos/logo.IHELP.wt.svg";
import logo from "../assets/logos/logo.IHELP.svg";

import Account from "./Account";

const Header = (props) => {
  
    const { currentTheme } = useThemeSwitcher();

    const {web3Modal,loadWeb3Modal,address,localProvider,userSigner,mainnetProvider,price,logoutOfWeb3Modal,blockExplorer} = props;

    const router = useLocation();
    
    const [injectedProvider, setInjectedProvider] = useState();

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
    
    return (
        <div className="header">
        <div className="mob-header">
          <div className="box">
            <div className="mob-header-content">
                  <Link to="/">
                    <a className={router.pathname == "/" ? "activeLink" : ""}>
                      CONTRIBUTE
                    </a>
                  </Link>
                  <Link to="/dashboard" passHref={true}>
                    <a
                      className={
                        router.pathname == "/dashboard" ? "activeLink" : ""
                      }
                    >
                      DASHBOARD
                    </a>
                  </Link>
                  <Link to="/stake" passHref={true}>
                    <a className={router.pathname == "/stake" ? "activeLink" : ""}>
                      STAKE
                    </a>
                  </Link>
                  <Link to="/leaderboard" passHref={true}>
                    <a
                      className={
                        router.pathname == "/leaderboard" ? "activeLink" : ""
                      }
                    >
                      LEADERBOARD
                    </a>
                  </Link>
              </div>
              {/*<button className="white-btn">Ethereum Network</button>*/}
              
              <div style={{width:'100%',textAlign:'center'}}>
              <Account
                      address={address}
                      localProvider={localProvider}
                      userSigner={userSigner}
                      mainnetProvider={mainnetProvider}
                      //price={price}
                      web3Modal={web3Modal}
                      loadWeb3Modal={loadWeb3Modal}
                      logoutOfWeb3Modal={logoutOfWeb3Modal}
                      blockExplorer={blockExplorer}
                      burner={false}
                    />
              </div>
              
                  
          </div>
        </div>
        <div className="box">
      
          <div className="headerContent">

                <Link to="/">
                  <img onClick={moveTo1}  src={currentTheme == 'dark' ? logo_wt : logo} alt="logo" />
                </Link>
        
                <div className={"headerRight"}>
                  <Link to="/" passHref={true} className={router.pathname == "/" ? "link activeLink" : "link"}>
                      CONTRIBUTE
                  </Link>
                  <Link to="/dashboard" passHref={true} className={ router.pathname == "/dashboard" ? "link activeLink" : "link" }>
                      DASHBOARD
                  </Link>
                  <Link to="/stake" passHref={true} className={router.pathname == "/stake" ? "link activeLink" : "link"}>
                      STAKE
                    
                  </Link>
                  <Link to="/leaderboard" passHref={true} 
                      className={
                        router.pathname == "/leaderboard" ? "link activeLink" : "link"
                      }
                    >
                      LEADERBOARD
                    
                  </Link>
                 </div>
                  
                  
              {/*<button className="grd-btn">Ethereum Network</button>*/}
              <div className="headerRightButton">
                  
                 <div className={'headerRightButtonInner'}>
                  <Account
                      address={address}
                      localProvider={localProvider}
                      userSigner={userSigner}
                      mainnetProvider={mainnetProvider}
                      //price={price}
                      //minimized={true}
                      web3Modal={web3Modal}
                      loadWeb3Modal={loadWeb3Modal}
                      logoutOfWeb3Modal={logoutOfWeb3Modal}
                      blockExplorer={blockExplorer}
                      burner={false}
                    />
                    </div>
                  
                  <span style={{top:'5px'}}>
                    <MdMenu onClick={openMobHeader} style={{fontSize:'36px'}} className="open-mob-header" />
                    <MdClose onClick={closeMobHeader} style={{fontSize:'36px'}} className="close-mob-header" />
                  </span>
                  
              </div>
      
          </div>
      
        </div>
      </div>)

}

export default Header;