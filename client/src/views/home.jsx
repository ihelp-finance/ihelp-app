import React, { useEffect } from "react";
import st from "./styles/home.module.css";
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
import Slider from "@mui/material/Slider";

import Header from "./common/header";

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
        <title>iHelp | Home</title>
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

      {/* Home Header */}
      <div className={st.homeHeader + " " + "section"}>
        <div className="box">
          <div className={st.homeHeaderContent}>
            <h1>Hello Saim</h1>
            <h2>Help make change today!</h2>
          </div>
        </div>
      </div>
      {/* Main Categories */}
      <div className={st.mainCategories + " " + "section"}>
        <div className="box">
          <div className={st.mainCategoriesContent}>
            <h1 className="mainHeading">Categories</h1>
            <div className={st.categoriesGrid}>
              <span className={st.activeCategory}>Education</span>
              <span>Animal</span>
              <span>Community</span>
              <span>Space</span>
              <span>Psychology</span>
              <span>Motorcycles</span>
              <span>Motorcycles</span>
              <span>Art & Culture</span>
              <span>Animal</span>
              <span>Community</span>
              <span>Space</span>
              <span>Psychology</span>
              <span>Motorcycles</span>
              <span>Motorcycles</span>
              <span>Art & Culture</span>
            </div>
          </div>
        </div>
      </div>
      {/* Charities */}
      <div className={st.charities + " " + "section"}>
        <div className="box">
          <div className={st.charitiesContent}>
            <div className={st.charitiesSliderHeader}>
              <h1>Charities</h1>
              <div className={st.charitiesHeaderRight}>
                <a>See All</a>
                <main>
                  <span className="charities-left">
                    <MdKeyboardArrowLeft />
                  </span>
                  <span className="charities-right">
                    <MdKeyboardArrowRight />
                  </span>
                </main>
              </div>
            </div>

            <div className={st.charitiesSliderContainer}>
              <Swiper
                breakpoints={{
                  700: {
                    slidesPerView: 2,
                  },
                  1000: {
                    slidesPerView: 3,
                  },
                  1250: {
                    slidesPerView: 4,
                  },
                }}
                loop="true"
                slidesPerView="1"
                spaceBetween={25}
                pagination={true}
                navigation={{
                  nextEl: ".charities-right",
                  prevEl: ".charities-left",
                }}
                grabCursor={false}
                speed={400}
              >
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className={st.charitiesSliderContent}>
                    <div className={st.cscHeader}>
                      <img src="./assets/home.jpg" alt="" />
                      <h6>Charity Name</h6>
                    </div>
                    <div className={st.cscBody}>
                      <h5>Description</h5>
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        A nostrum et pariatur recusandae consequatur fugiat
                        commodi esse provident fugit accusamus.
                      </p>
                    </div>
                    <div className={st.scsMoreDetails}>
                      <main>
                        <h5>Contributed</h5>
                        <p>$1220,000</p>
                      </main>
                      <main>
                        <h5>Pool Size</h5>
                        <p>$560,000</p>
                      </main>
                    </div>
                    <div className={st.scsFooter}>
                      <Slider
                        defaultValue={50}
                        sx={{
                          color: "var(--light-purple)",
                          height: "0.75rem",
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
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
