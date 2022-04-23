import { PageHeader } from "antd";
import React from "react";

// displays a page header
import logo_wt from "../ihelp_logo_wt.png";
import logo from "../ihelp_logo.svg";

export default function Header() {
  
  const theme = window.localStorage.getItem("theme");
  
  return (
   
   <div style={{position:'relative',width:'100%',height:'30px',display:'inline-block'}}>
      <img src={theme == 'dark' ? logo_wt : logo} alt="logo" style={{height: '55px',marginTop: '12px',marginLeft: '27px',float: 'left'}} />
   </div>
   
  );
}

 {/*
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 scaffold-eth"
        subTitle="forkable Ethereum dev stack focused on fast product iteration"
        style={{ cursor: "pointer" }}
      />
    </a>*/}