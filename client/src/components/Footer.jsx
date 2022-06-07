//import Link from "next/link";
import { BrowserRouter, Route, Link,useLocation } from "react-router-dom";
//import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback,useContext } from "react";
import {
    MdMenu,
    MdClose
}
from "react-icons/md";
import {
  FaTwitter,
  FaDiscord,
  FaMedium,
  FaGithub,
} 
from "react-icons/fa";
import { gsap } from "gsap/dist/gsap";
import { Power4 } from "gsap/dist/gsap";
import $ from "jquery";
import { useThemeSwitcher } from "react-css-theme-switcher";
 
import st from "../views/styles/footer.module.css";

const Footer = (props) => {
    
    return (
      <footer>
        <div className={st.footer}>
        <div className="box">
          <div className={st.footerContent}>
            <div className={st.footerLeft}>
              <a href="https://turbinex.io" target="_blank" style={{fontWeight:'',fontSize:'14px'}}><h4 style={{fontWeight:'normal',marginTop:'10px'}}>© 2022 Turbine X, LLC</h4></a> 
              | 
              <Link to="/login">
                   <h4 style={{fontWeight:'normal',marginLeft:'16px',marginTop:'7px',fontSize:'14px'}}>Charity Login</h4>
              </Link>
              |
              <a href="https://status.ihelp.finance" target="_blank">
                   <h4 style={{fontWeight:'normal',marginLeft:'16px',marginTop:'7px',fontSize:'14px'}}>Status</h4>
              </a>
              |
              <a href="https://docs.ihelp.finance" target="_blank">
                   <h4 style={{fontWeight:'normal',marginLeft:'16px',marginTop:'7px',fontSize:'14px'}}>Docs</h4>
              </a>
            </div>
            <div className={`${st.footerRight} footerLink`}>
              <a href="https://discord.gg/qXKE27dZVb" target="_blank">
                <FaDiscord />
              </a>
              <a href="https://twitter.com/ihelp_defi" target="_blank">
                <FaTwitter />
              </a>
              <a href="https://ihelp-finance.medium.com" target="_blank">
                <FaMedium />
              </a>
              <a href="https://github.com/iHelp-Finance" target="_blank">
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
      </div></footer>)

}

export default Footer;