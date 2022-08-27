import React, { useEffect } from "react";
import st from "./styles/dashboard.module.css";
import { MdSearch, MdMenu, MdClose, MdChevronRight } from "react-icons/md";
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
import Slider from "@mui/material/Slider";

import { Header } from "../components";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Home = () => {
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
    $(".q1").click(() => {
      $(".a1").slideToggle(350);
      $(".q1 svg").toggleClass("rotate");
    });
    $(".q2").click(() => {
      $(".a2").slideToggle(350);
      $(".q2 svg").toggleClass("rotate");
    });
    $(".q3").click(() => {
      $(".a3").slideToggle(350);
      $(".q3 svg").toggleClass("rotate");
    });
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
        <title>iHelp | Dashboard</title>
      </Head>
      <img src="./assets/bgc.svg" alt="Bgc" className="body-bgc" />
      
      <Header/>

      {/* Dashboard */}
      <div className={st.dashboardHeader + " " + "section"}>
        <div className="box">
          <main>
            <img src="./assets/home.jpg" alt="" />
            <h6>Saim, A</h6>
          </main>
        </div>
      </div>

      {/* Dashboard Graphs */}
      <div className={st.dashboardGraphs + " " + "section"}>
        <div className="box">
          <div className={st.dgGrid}>
            <main>
              <h6>Total Current Deposit</h6>

              <div className={st.dashboardGraphParent}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#ac52f2"
                      fill="#ad52f283"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </main>
            <div className={st.dashboardOtherGraphs}>
              <main>
                <h6>iHelp Balance</h6>
                <Slider
                  defaultValue={75}
                  disabled
                  sx={{
                    color: "var(--light-purple) !important",
                    height: "0.75rem",
                  }}
                />
                <h5>%8,575,600</h5>
                <h4>12 months</h4>
              </main>
              <div className={st.dashboardSmallInfoGrid}>
                <main>
                  <h6>Leaderboard Ranking</h6>
                  <h5>$250,000.00</h5>
                </main>
                <main>
                  <h6>Your Direct Donation</h6>
                  <h5>$250,000.00</h5>
                </main>
                <main>
                  <h6>Total Direct Donation Received</h6>
                  <h5>$250,000.00</h5>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Container */}
      <div className={st.faq + " " + "section"}>
        <div className="box">
          <div className={st.faqContainer}>
            <div className={st.faqBox}>
              <div className={st.faqQ + " " + "q q1"}>
                <p>Current Deposit Details</p>
                <MdChevronRight />
              </div>
              <div className={st.faqA + " " + "a a1"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                dolorum provident facilis nesciunt repudiandae labore aut, ullam
                fugit! Molestias autem minima voluptate rerum sunt, mollitia
                inventore voluptas tenetur unde dicta!
              </div>
            </div>
            <div className={st.faqBox}>
              <div className={st.faqQ + " " + "q q2"}>
                <p>Interest Donation History</p>
                <MdChevronRight />
              </div>
              <div className={st.faqA + " " + "a a2"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                dolorum provident facilis nesciunt repudiandae labore aut, ullam
                fugit! Molestias autem minima voluptate rerum sunt, mollitia
                inventore voluptas tenetur unde dicta!
              </div>
            </div>
            <div className={st.faqBox}>
              <div className={st.faqQ + " " + "q q3"}>
                <p>Direct Donation History</p>
                <MdChevronRight />
              </div>
              <div className={st.faqA + " " + "a a3"}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. In
                dolorum provident facilis nesciunt repudiandae labore aut, ullam
                fugit! Molestias autem minima voluptate rerum sunt, mollitia
                inventore voluptas tenetur unde dicta!
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
