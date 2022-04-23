import React, { useEffect } from "react";
import st from "./styles/contribute.module.css";
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
        <title>iHelp | Contribute</title>
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

      {/* Contribute Top Details */}
      <div className={st.contributeTop + " " + "section"}>
        <div className="box">
          <div className={st.donationName}>
            <img src="./assets/home.jpg" alt="" />
            <h6>Save The Animal</h6>
          </div>
          <main>
            <h5>Mission</h5>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus,
              quisquam. Iste veniam, libero illum nisi similique accusantium
              consequatur perferendis sint at voluptatum culpa distinctio modi
              ea inventore nostrum. Facilis, necessitatibus.
            </p>
          </main>
        </div>
      </div>

      {/* Contribute Videos Slider */}
      <div className={st.contributeSliderContainer + " " + "section"}>
        <div className="box">
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
            navigation={{
              nextEl: ".charities-right",
              prevEl: ".charities-left",
            }}
            grabCursor="false"
            speed={400}
            pagination={true}
          >
            <SwiperSlide>
              <video src="./assets/earth.mp4" muted controls></video>
            </SwiperSlide>
            <SwiperSlide>
              <video src="./assets/earth.mp4" muted controls></video>
            </SwiperSlide>
            <SwiperSlide>
              <video src="./assets/earth.mp4" muted controls></video>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      {/* Contribute Info Grid */}
      <div className={st.contributeGrid + " " + "section"}>
        <div className="box">
          <div className={st.cgContent}>
            <main>
              <h6>Total Capital Pooled</h6>
              <h5>$112,222,000</h5>
            </main>
            <main>
              <h6>Total Interest Received</h6>
              <h5>$112,222,000</h5>
            </main>
            <main>
              <h6>Total Direct Donation Received</h6>
              <h5>$112,222,000</h5>
            </main>
            <main>
              <h6>Your Deposits</h6>
              <h5>$112,222,000</h5>
            </main>
            <main>
              <h6>Your % of Charity Pool</h6>
              <h5>$112,222,000</h5>
            </main>
          </div>
        </div>
      </div>

      {/* Contribute Donate Section */}
      <div className={st.contributeDonate + " " + "section"}>
        <div className="box">
          <div className={st.cdGrid}>
            <main>
              <h6>Donate Interest</h6>
              <div className={st.cdgGrid}>
                <button className="outline-btn">Deposit</button>
                <button className="outline-btn">Withdraw</button>
              </div>
            </main>
            <main>
              <h6>Donate Principle</h6>
              <div className={st.cdgGrid}>
                <button className="outline-btn">Direct Donate</button>
              </div>
            </main>
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
