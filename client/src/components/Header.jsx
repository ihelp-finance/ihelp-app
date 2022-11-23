//import Link from "next/link";
import { BrowserRouter, Route, NavLink, Link, useLocation } from "react-router-dom";
//import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { MdMenu, MdClose, MdArrowDropDown } from "react-icons/md";
import { gsap } from "gsap/dist/gsap";
import { Power4 } from "gsap/dist/gsap";
import $ from "jquery";
import { useThemeSwitcher } from "react-css-theme-switcher";

import WalletConnectProvider from "@walletconnect/web3-provider";

const { ethers } = require("ethers");
import WalletLink from "walletlink";

import logo_wt from "../assets/logos/logo.IHELP.wt.svg";
import logo from "../assets/logos/logo.IHELP.svg";

import Account from "./Account";

const Header = props => {
  const { currentTheme } = useThemeSwitcher();
  const [button, setButton] = useState("wallet");
  const {
    web3Modal,
    loadWeb3Modal,
    address,
    localProvider,
    userSigner,
    mainnetProvider,
    price,
    logoutOfWeb3Modal,
    blockExplorer,
  } = props;

  const router = useLocation();

  const [injectedProvider, setInjectedProvider] = useState();

  let subdomain = window.location.hostname.split(".")[0];
  if (subdomain == "app" || subdomain.indexOf("dev") > -1) {
    subdomain = "avax";
  }
  const [lang, setLang] = useState(subdomain);

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

  const handleLangChange = selectedLang => {
    let openDomain = selectedLang;
    if (openDomain == "avax") {
      openDomain = "app";
    }
    if (subdomain != openDomain && window.location.hostname.split(".")[0] != openDomain) {
      window.open(`https://${selectedLang}.ihelp.finance`, "_self");
    }
  };

  const languageFlag = {
    avax: "/assets/icons/avax.svg",
    // "optimism": "/assets/icons/optimism.svg",
  };
  const languages = Object.keys(languageFlag);

  const additionalOptions = [];
  for (let i = 0; i < languages.length; i++) {
    if (languages[i] != lang) {
      additionalOptions.push(languages[i]);
    }
  }

  return (
    <div className="header">
      <div className="mob-header">
        <div className="box">
          <div className="mob-header-content">
            <Link to="/">
              <a className={router.pathname == "/" ? "activeLink" : ""}>CONTRIBUTE</a>
            </Link>
            <Link to="/dashboard" passHref={true}>
              <a className={router.pathname == "/dashboard" ? "activeLink" : ""}>DASHBOARD</a>
            </Link>
            <Link to="/stake" passHref={true}>
              <a className={router.pathname == "/stake" ? "activeLink" : ""}>STAKE</a>
            </Link>
            <Link to="/leaderboard" passHref={true}>
              <a className={router.pathname == "/leaderboard" ? "activeLink" : ""}>LEADERBOARD</a>
            </Link>
          </div>
          {/*<button className="white-btn">Ethereum Network</button>*/}

          {/* <div style={{ width: "100%", textAlign: "center" }}></div> */}
        </div>
      </div>
      <div className="box">
        <div className="headerContent">
          <Link to="/">
            <img onClick={moveTo1} src={currentTheme == "dark" ? logo_wt : logo} alt="logo" className="logo" />
          </Link>

          <div className={"headerRight"}>
            <Link to="/" passHref={true} className={router.pathname == "/" ? "link activeLink" : "link"}>
              CONTRIBUTE
            </Link>
            <Link
              to="/dashboard"
              passHref={true}
              className={router.pathname == "/dashboard" ? "link activeLink" : "link"}
            >
              DASHBOARD
            </Link>
            <Link to="/stake" passHref={true} className={router.pathname == "/stake" ? "link activeLink" : "link"}>
              STAKE
            </Link>
            <Link
              to="/leaderboard"
              passHref={true}
              className={router.pathname == "/leaderboard" ? "link activeLink" : "link"}
            >
              LEADERBOARD
            </Link>

            {/* <div className="switch-lang">
              <div className="current-lang">
                <img className="lang-flag" src={languageFlag[lang]} />
              </div>
              <div className="lang-dropdown">
                {additionalOptions.map(l => {
                  return (
                    <div
                      key={l}
                      onClick={() => {
                        handleLangChange(l);
                      }}
                      className="selecting-lang"
                    >
                      <img className="lang-flag" src={languageFlag[l]} />
                      <p className="lang-text">{l.toUpperCase()}</p>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>

          {/*<button className="grd-btn">Ethereum Network</button>*/}
          <div className="headerRightButton">
            <div className={button === "avax" ? "avax-logo-focus" : "avax-logo"} onClick={() => setButton("avax")}>
              <img src="/assets/icons/avax.svg" alt="avax" width="24px" />
              <p className="">AVAX</p>
              {button === "avax" ? (
                <MdArrowDropDown size="25px" fill="white" style={{paddingLeft: '-10px'}} />
              ) : (
                <img src="/assets/icons/chevron-square-down.svg" alt="down" width="12px" />
              )}
            </div>
            <div className={"headerRightButtonInner"}>
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
                button={button}
                setButton={setButton}
              />
              {/* <button></button> */}
            </div>
          </div>
          <span style={{ top: "5px" }}>
            <MdMenu onClick={openMobHeader} style={{ fontSize: "36px" }} className="open-mob-header" />
            <MdClose onClick={closeMobHeader} style={{ fontSize: "36px" }} className="close-mob-header" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
