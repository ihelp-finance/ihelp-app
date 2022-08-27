import React, { useEffect } from "react";
import st from "./styles/leaderboard.module.css";
import {
  MdSearch,
  MdMenu,
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import $ from "jquery";
import { Power4 } from "gsap/dist/gsap";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import Head from "next/head";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Header from "./common/header";

const data = [
  {
    name: "Page A",
    pv: 800,
  },
  {
    name: "Page B",
    pv: 967,
  },
  {
    name: "Page C",
    pv: 1098,
  },
  {
    name: "Page D",
    pv: 1200,
  },
  {
    name: "Page E",
    pv: 1108,
  },
  {
    name: "Page F",
    pv: 680,
  },
];

const Home = () => {
  SwiperCore.use([Navigation, Pagination]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    /* Header on-scroll Animation */
    const headerAnim = gsap.timeline();
    headerAnim.fromTo(
      ".header",
      {
        backgroundColor: "transparent",
        backdropFilter: "blur(0px)",
      },
      {
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
    <div id="app" className="app">
      <Head>
        <title>iHelp | Leaderboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      {/* Header */}
      <div className="header">
        <div className="mob-header">
          <div className="box">
            <div className="mob-header-content">
              <Link href="/">Home</Link>
              <Link href="/contribute">Contribute</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
          </div>
        </div>
        <div className="box">
          <div className="headerContent">
            <Link href="/">
              <img onClick={moveTo1} src="./assets/logo.svg" alt="" />
            </Link>
            <div className="headerRight">
              <Link href="/">Home</Link>
              <Link href="/contribute">Contribute</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/leaderboard">Leaderboard</Link>
              <MdSearch />
              <MdMenu onClick={openMobHeader} className="open-mob-header" />
              <MdClose onClick={closeMobHeader} className="close-mob-header" />
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className={st.leaderboard + " " + "section"}>
        <div className="box">
          <div className={st.leaderboardGrid}>
            <div className={st.lggCell}>
              <h1>Helpers</h1>
              <main className={st.helpersBtngrid}>
                <button className="tab-btn active-tab-btn">
                  Interest Donations
                </button>
                <button className="tab-btn">Direct Donations</button>
              </main>
              <div className={st.leaderboardGraphBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    layout="vertical"
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" scale="band" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" barSize={20} fill="#ac52f2" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className={st.lggCell}>
              <h1>Charities</h1>
              <main className={st.charitiesBtngrid}>
                <button className="tab-btn active-tab-btn">24 Hr</button>
                <button className="tab-btn">7 Days</button>
                <button className="tab-btn">30 Days</button>
                <button className="tab-btn">All Time</button>
              </main>
              <div className={st.leaderboardGraphBox}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    layout="vertical"
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" scale="band" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" barSize={20} fill="var(--light-purple)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="box">
          <div className="footerContent">
            <div className="footerLeft">
              <a href="">Terms & Risks</a>
              <a href="">Privacy Policy & Cookies</a>
              <a href="">Press</a>
              <a href="">Copyright</a>
            </div>
            <div className="footerRight">
              <a href="">
                <FaFacebookF />
              </a>
              <a href="">
                <FaTwitter />
              </a>
              <a href="">
                <FaLinkedinIn />
              </a>
              <a href="">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
