import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Input, Select, Tooltip } from "antd";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { FaSearch, FaFilter } from "react-icons/fa";
import { Footer, Header } from "../components";
import { categories, statsData, geography } from "../constants";
import classes from "../views/styles/contribute.module.css";
import CompanyDetailsCard from "../components/contribute/companyDetailsCard";
import { getCharityPrevNextIds } from "../helpers/charity";

const BadgeLookup = {
  "Arts, Culture & Humanities": {
    Category: "Arts, Culture & Humanities",
    File: "Arts, Culture & Humanities.png",
  },
  Education: {
    Category: "Education",
    File: "Education.png",
  },
  Environment: {
    Category: "Environment",
    File: "Environment.png",
  },
  "Animal-Related": {
    Category: "Animal-Related",
    File: "Animal-Related.png",
  },
  "Health Care": {
    Category: "Health Care",
    File: "Health Care.png",
  },
  "Mental Health & Crisis Intervention": {
    Category: "Mental Health & Crisis Intervention",
    File: "Mental Health & Crisis Intervention.png",
  },
  "Voluntary Health Associations & Medical Disciplines": {
    Category: "Voluntary Health & Medical Disciplines",
    File: "Voluntary Health & Medical Disciplines.png",
  },
  "Medical Research": {
    Category: "Medical Research",
    File: "Medical Research.png",
  },
  "Crime & Legal-Related": {
    Category: "Crime & Legal-Related",
    File: "Crime & Legal-Related.png",
  },
  Employment: {
    Category: "Employment",
    File: "Employment.png",
  },
  "Food, Agriculture & Nutrition": {
    Category: "Food, Agriculture & Nutrition",
    File: "Food, Agriculture & Nutrition.png",
  },
  "Housing & Shelter": {
    Category: "Housing & Shelter",
    File: "Housing & Shelter.png",
  },
  "Public Safety, Disaster Preparedness & Relief": {
    Category: "Public Safety, Disaster Preparedness & Relief",
    File: "Public Safety, Disaster Preparedness & Relief.png",
  },
  "Recreation & Sports": {
    Category: "Recreation & Sports",
    File: "Recreation & Sports.png",
  },
  "Youth Development": {
    Category: "Youth Development",
    File: "Youth Development.png",
  },
  "Human Services": {
    Category: "Human Services",
    File: "Human Services.png",
  },
  "International, Foreign Affairs & National Security": {
    Category: "International, Foreign Affairs & National Security",
    File: "International, Foreign Affairs & National Security.png",
  },
  "Civil Rights, Social Action & Advocacy": {
    Category: "Civil Rights, Social Action & Advocacy",
    File: "Civil Rights, Social Action & Advocacy.png",
  },
  "Community Improvement & Capacity Building": {
    Category: "Community Improvement & Capacity Building",
    File: "Community Improvement & Capacity Building.png",
  },
  "Philanthropy, Voluntarism & Grantmaking Foundations": {
    Category: "Philanthropy, Voluntarism & Grantmaking Foundations",
    File: "Philanthropy, Voluntarism & Grantmaking Foundations.png",
  },
  "Science & Technology": {
    Category: "Science & Technology",
    File: "Science & Technology.png",
  },
  "Social Science": {
    Category: "Social Science",
    File: "Social Science.png",
  },
  "Public & Societal Benefit": {
    Category: "Public & Societal Benefit",
    File: "Public & Societal Benefit.png",
  },
  "Religion-Related": {
    Category: "Religion-Related",
    File: "Religion-Related.png",
  },
};

// // preimport the images one time
Object.keys(BadgeLookup).map(d => {
  BadgeLookup[d]["image"] = require(`../assets/images/badges/${BadgeLookup[d]["File"]}`).default;
});

const Contribute = props => {
  const [hover, setHover] = useState("");
  const [videoFocused, setVideoFocused] = useState("");
  const [charities, setCharities] = useState([]);
  const [limitedCharities, setLimitedCharities] = useState([]);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [swiperRef, setSwiperRef] = useState();
  const [activeSlide, setActiveSlide] = useState(0);
  const [filteredCharity, setFilteredCharity] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [geographyFilter, setGeographyFilter] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { Option } = Select;
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    if (categoryFilter.length === 0 && geographyFilter.length === 0) {
      setLimitedCharities(
        charities
          ?.filter(element => element["Organization Name"].toLowerCase().includes(search.toLowerCase()))
          .slice(0, limit),
      );
    } else {
      setLimitedCharities(
        filteredCharity
          ?.filter(element => element["Organization Name"].toLowerCase().includes(search.toLowerCase()))
          .slice(0, limit),
      );
    }

    setLoading(false);
  }, [limit, search]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://app.ihelp.finance/api/v1/data/charities")
      .then(res => {
        setCharities(res.data);
        setLimitedCharities(res.data.slice(0, limit));
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (categoryFilter.length > 0) {
      let filteredCharities = [];
      let toBeFiltered;
      if (geographyFilter.length > 0) {
        toBeFiltered = [...filteredCharity];
      } else {
        toBeFiltered = [...charities];
      }

      categoryFilter.map(item => {
        const temp = toBeFiltered?.filter(element =>
          element["Charity GENERAL Category (One Cell)"]
            .replace(/[^a-zA-Z0-9 ]/g, " ")
            .includes(item.replace(/[^a-zA-Z0-9 ]/g, " ")),
        );

        filteredCharities = [...temp, ...filteredCharities];
      });
      setFilteredCharity([...filteredCharities]);
      setLimitedCharities([...filteredCharities.slice(0, limit)]);
    } else {
      if (geographyFilter.length === 0) {
        setLimitedCharities(
          charities
            ?.filter(element => element["Organization Name"].toLowerCase().includes(search.toLowerCase()))
            .slice(0, limit),
        );
      } else {
        let filteredCharities = [];
        let toBeFiltered;
        if (categoryFilter.length > 0) {
          toBeFiltered = [...filteredCharity];
        } else {
          toBeFiltered = [...charities];
        }
        geographyFilter.map(item => {
          const temp = toBeFiltered?.filter(element => element["Main Areas of Operation"].includes(item));

          filteredCharities = [...temp, ...filteredCharities];
        });
        setFilteredCharity([...filteredCharities]);
        setLimitedCharities([...filteredCharities.slice(0, limit)]);
      }
    }
  }, [categoryFilter]);

  useEffect(() => {
    if (geographyFilter.length > 0) {
      let filteredCharities = [];
      let toBeFiltered;
      if (categoryFilter.length > 0) {
        toBeFiltered = [...filteredCharity];
      } else {
        toBeFiltered = [...charities];
      }
      geographyFilter.map(item => {
        const temp = toBeFiltered?.filter(element => element["Main Areas of Operation"].includes(item));

        filteredCharities = [...temp, ...filteredCharities];
      });
      setFilteredCharity([...filteredCharities]);
      setLimitedCharities([...filteredCharities.slice(0, limit)]);
    } else {
      if (categoryFilter.length === 0) {
        setLimitedCharities(
          charities
            ?.filter(element => element["Organization Name"].toLowerCase().includes(search.toLowerCase()))
            .slice(0, limit),
        );
      } else {
        let filteredCharities = [];
        let toBeFiltered;
        if (geographyFilter.length > 0) {
          toBeFiltered = [...filteredCharity];
        } else {
          toBeFiltered = [...charities];
        }

        categoryFilter.map(item => {
          const temp = toBeFiltered?.filter(element =>
            element["Charity GENERAL Category (One Cell)"]
              .replace(/[^a-zA-Z0-9 ]/g, " ")
              .includes(item.replace(/[^a-zA-Z0-9 ]/g, " ")),
          );

          filteredCharities = [...temp, ...filteredCharities];
        });
        setFilteredCharity([...filteredCharities]);
        setLimitedCharities([...filteredCharities.slice(0, limit)]);
      }
    }
  }, [geographyFilter]);

  useEffect(() => {
    setLimit(6);
  }, [categoryFilter.length, geographyFilter.length]);

  const handleLeftClick = useCallback(() => {
    if (!swiperRef) return;
    swiperRef.slidePrev();
  }, [swiperRef]);

  const handleRightClick = useCallback(() => {
    if (!swiperRef) return;
    swiperRef.slideNext();
  }, [swiperRef]);

  return (
    <div className={classes.contributeMain}>
      <Header {...props} />
      <div className={classes.contributeBanner}>
        <div className={classes.carousel}>
          <div className={classes.navigation}>
            <h1>Spotlight</h1>
            <p>Health & Medical</p>
            <div className={classes.arrows}>
              {activeSlide > 0 ? (
                <img src="/assets/icons/arrow-left-purple.svg" onClick={handleLeftClick} />
              ) : (
                <img src="/assets/icons/arrow-left.svg" onClick={handleLeftClick} />
              )}
              <div className={classes.dots}>
                <img src={`/assets/icons/${activeSlide === 0 ? "filled" : "unfilled"}-circle.svg`} />
                <img src={`/assets/icons/${activeSlide === 1 ? "filled" : "unfilled"}-circle.svg`} />
                <img src={`/assets/icons/${activeSlide === 2 ? "filled" : "unfilled"}-circle.svg`} />
                <img src={`/assets/icons/${activeSlide === 3 ? "filled" : "unfilled"}-circle.svg`} />
              </div>
              {activeSlide < 3 ? (
                <img src="/assets/icons/arrow-right-purple.svg" onClick={handleRightClick} />
              ) : (
                <img src="/assets/icons/arrow-right.svg" onClick={handleRightClick} />
              )}
            </div>
          </div>
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={swiper => setActiveSlide(swiper.activeIndex)}
            onSwiper={setSwiperRef}
            pagination={{ clickable: true }}
          >
            <SwiperSlide>
              <div
                className={classes.carouselItem}
                onMouseEnter={() => setHover("banner")}
                onMouseLeave={() => setHover("")}
              >
                <CompanyDetailsCard hover={hover} name="banner" info={[]} />
                <div className={classes.carouselDetails}>
                  <div>
                    <h3>American Kidney Fund, Inc.</h3>
                    <p>
                      AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more
                      at risk AKF works on behalf of the 37 million Americans living with kidney disease, and the
                      millions more at risk ...
                    </p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.supportingIcons}>
                      <img src="/assets/icons/animals.svg" />
                      <img src="/assets/icons/enviroment-friendly.svg" />
                    </div>

                    <button className={classes.detailView}>VIEW DETAILS</button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className={classes.carouselItem}
                onMouseEnter={() => setHover("banner")}
                onMouseLeave={() => setHover("")}
              >
                <CompanyDetailsCard hover={hover} name="banner" info={[]} />
                <div className={classes.carouselDetails}>
                  <div>
                    <h3>American Kidney Fund, Inc.</h3>
                    <p>
                      AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more
                      at risk ...
                    </p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.supportingIcons}>
                      <img src="/assets/icons/animals.svg" />
                      <img src="/assets/icons/enviroment-friendly.svg" />
                    </div>

                    {hover === "banner" && <button className={classes.detailView}>VIEW DETAILS</button>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className={classes.carouselItem}
                onMouseEnter={() => setHover("banner")}
                onMouseLeave={() => setHover("")}
              >
                <CompanyDetailsCard hover={hover} name="banner" info={[]} />
                <div className={classes.carouselDetails}>
                  <div>
                    <h3>American Kidney Fund, Inc.</h3>
                    <p>
                      AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more
                      at risk ...
                    </p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.supportingIcons}>
                      <img src="/assets/icons/animals.svg" />
                      <img src="/assets/icons/enviroment-friendly.svg" />
                    </div>

                    {hover === "banner" && <button className={classes.detailView}>VIEW DETAILS</button>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div
                className={classes.carouselItem}
                onMouseEnter={() => setHover("banner")}
                onMouseLeave={() => setHover("")}
              >
                <CompanyDetailsCard hover={hover} name="banner" info={[]} />
                <div className={classes.carouselDetails}>
                  <div>
                    <h3>American Kidney Fund, Inc.</h3>
                    <p>
                      AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more
                      at risk ...
                    </p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.supportingIcons}>
                      <img src="/assets/icons/animals.svg" />
                      <img src="/assets/icons/enviroment-friendly.svg" />
                    </div>

                    {hover === "banner" && <button className={classes.detailView}>VIEW DETAILS</button>}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <div className={classes.stats}>
        <div className={classes.figures}>
          <div className={classes.donations}>
            <h1>$49.38m</h1>
            <p>Total Direct Donations</p>
          </div>
          <div className={classes.charity}>
            <h1>{charities.length}</h1>
            <p>Total Charities</p>
          </div>
        </div>
        <div className={classes.donors}>
          {statsData.map((item, ind) => (
            <div className={classes.totalValue}>
              <img src={item.icon} alt="diamond" />
              <div>
                <h6>{item.text}</h6>
                <p>{item.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.exploreHeader}>
        <div>
          <h1 className={classes.exploreHead}>Explore</h1>
          <p className={classes.explorePara}>
            Showing {limitedCharities.length} of {charities.length} total charities.
          </p>
        </div>
        <div className={classes.searchFilter}>
          <Input
            placeholder="Enter keyword to search charities ... "
            onChange={e => setSearch(e.target.value)}
            prefix={<FaSearch size="18px" fill="#BF52F2" className={classes.searchIco} />}
            classNam={classes.searchInput}
            suffix={
              <div className={classes.countries}>
                <Select value="Around the world">
                  {geography.map((item, ind) => (
                    <Option key={ind}>
                      <label>
                        <input
                          type={"checkbox"}
                          className={classes.check}
                          onChange={() => {
                            const temp = [];
                            let found = false;
                            geographyFilter.map(element => {
                              if (element !== item) {
                                temp.push(element);
                              } else {
                                found = true;
                              }
                            });
                            if (found === false) temp.push(item);
                            setGeographyFilter([...temp]);
                          }}
                          value={geographyFilter.includes(item)}
                          checked={geographyFilter.includes(item)}
                        />
                        <span>{item}</span>
                      </label>
                    </Option>
                  ))}
                </Select>
                <div className={classes.filterIco}>
                  <FaFilter size="18px" fill="#BF52F2" />
                </div>
              </div>
            }
          />

          <div className={classes.categoriesSection}>
            <div className={classes.allCategories}>
              <p className={classes.categoryHead}>Categories:</p>
              {categories.map((item, ind) => {
                return !showAllCategories ? (
                  ind < 3 && (
                    <p
                      className={categoryFilter.includes(item) ? classes.selected : classes.category}
                      key={ind}
                      onClick={() => {
                        const temp = [];
                        let found = false;
                        categoryFilter.map(element => {
                          if (element !== item) {
                            temp.push(element);
                          } else {
                            found = true;
                          }
                        });
                        if (found === false) temp.push(item);
                        setCategoryFilter([...temp]);
                      }}
                    >
                      {item}
                    </p>
                  )
                ) : (
                  <p
                    className={categoryFilter.includes(item) ? classes.selected : classes.category}
                    key={ind}
                    onClick={() => {
                      const temp = [];
                      let found = false;
                      categoryFilter.map(element => {
                        if (element !== item) {
                          temp.push(element);
                        } else {
                          found = true;
                        }
                      });
                      if (found === false) temp.push(item);
                      setCategoryFilter([...temp]);
                    }}
                  >
                    {item}
                  </p>
                );
              })}
              <p
                className={classes.showMore}
                onClick={() => {
                  setShowAllCategories(!showAllCategories);
                }}
              >
                {showAllCategories ? "Show Less" : "Show More"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.companies}>
        {loading ? (
          <p>Loading...</p>
        ) : limitedCharities.length === 0 ? (
          <p>No result found</p>
        ) : (
          limitedCharities?.map((item, ind) => {
            let video = item["Video for Charity Card"];
            let cardInfo = {
              frame: video.replace("/watch?v=", "/embed/"),
              logo: item.Logo,
              foundedIn: item["Year Incorporated"],
              revenue: item["Total Revenue"],
              country: item["Main Areas of Operation"],
            };

            let cat1obj = null;
            let cat2obj = null;
            let cat3obj = null;

            try {
              if (item["Charity GENERAL Category #1"] && item["Charity GENERAL Category #1"] != "") {
                const catId = item["Charity GENERAL Category #1"];
                cat1obj = {
                  img: BadgeLookup[catId]["image"],
                  text: catId,
                };
              }
            } catch (e) {
              console.log("MISSING FILE 1", item["Charity GENERAL Category #1"]);
            }
            try {
              if (item["Charity GENERAL Category #2"] && item["Charity GENERAL Category #2"] != "") {
                const catId = item["Charity GENERAL Category #2"];
                cat2obj = {
                  img: BadgeLookup[catId]["image"],
                  text: catId,
                };
              }
            } catch (e) {
              console.log("MISSING FILE 2", item["Charity GENERAL Category #2"]);
            }
            try {
              if (item["Charity GENERAL Category #3"] && item["Charity GENERAL Category #3"] != "") {
                const catId = item["Charity GENERAL Category #3"];
                cat3obj = {
                  img: BadgeLookup[catId]["image"],
                  text: catId,
                };
              }
            } catch (e) {
              console.log("MISSING FILE 3", item["Charity GENERAL Category #3"]);
            }

            return (
              <div
                className={classes.charityCompanyCard}
                onMouseEnter={() => setHover(item.Id)}
                onMouseLeave={() => setHover("")}
                key={ind}
              >
                <CompanyDetailsCard setHover={setHover} hover={hover} name={item.Id} info={cardInfo} />
                <div className={classes.companyInfo}>
                  <div>
                    <h1 className={classes.charityCompanyName}>{item["Organization Name"]}</h1>
                    <p className={classes.charityCompanyInfo}>{item["Short Description for Front of Card"]}...</p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.companySupportingIcons}>
                      {cat1obj ? (
                        <Tooltip title={cat1obj.text}>
                          <img className="badge-icon" src={cat1obj.img} alt="" />
                        </Tooltip>
                      ) : (
                        ""
                      )}
                      {cat2obj ? (
                        <Tooltip title={cat2obj.text}>
                          <img className="badge-icon" src={cat2obj.img} alt="" />
                        </Tooltip>
                      ) : (
                        ""
                      )}
                      {cat3obj ? (
                        <Tooltip title={cat3obj.text}>
                          <img className="badge-icon" src={cat3obj.img} alt="" />
                        </Tooltip>
                      ) : (
                        ""
                      )}
                    </div>
                    {hover === item.Id && (
                      <button
                        className={classes.detailView}
                        onClick={() => {
                          getCharityPrevNextIds(limitedCharities, ind);
                          history.push(`/charity/${item["CharityPool Contract"]}`);
                        }}
                      >
                        VIEW DETAILS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {limitedCharities.length === charities.length ||
      limitedCharities.length === filteredCharity.length ||
      limitedCharities.length < 6 ||
      loading ? null : (
        <p className={classes.moreCards} onClick={() => setLimit(limit + 6)}>
          SHOW MORE
        </p>
      )}
      <Footer {...props} />
    </div>
  );
};

export default Contribute;
