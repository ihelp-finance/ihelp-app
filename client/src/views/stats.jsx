import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
  
  const history = useHistory();

  useEffect(async() => {
    document.title = `iHelp | Stats (${props.targetNetwork.name.replace('host','').charAt(0).toUpperCase() + props.targetNetwork.name.replace('host','').substr(1).toLowerCase()})`;
  }, []);

  return (
    <div id="app" className="app">
     {/* <Head>
        <title>iHelp | Leaderboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}
      
      <Header {...props}/>
      
          <iframe style={{border:'0px',width:'100vw',height:'calc( 100vh - 150px )'}} src="https://info.ihelp.finance/superset/dashboard/11/?standalone=true"></iframe>            
       
      <Footer {...props}/>
      
    </div>
  );
};

export default ContributeNew;
