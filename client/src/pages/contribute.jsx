import React, { useMemo, useState, useEffect } from "react";
import { Footer, Header } from "../components";
import { categories, companyCard, statsData } from "../constants";
import classes from "../views/styles/contribute.module.css";
import { Input, Select } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";
import CompanyDetailsCard from "../components/contribute/companyDetailsCard";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Contribute = props => {
  const [hover, setHover] = useState("");
  const [charities, setCharities] = useState([]);
  const [limitedCharities, setLimitedCharities] = useState([]);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const { Option } = Select;
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setLimitedCharities(charities?.filter(element => element["Organization Name"].includes(search)).slice(0, limit));
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

  return (
    <div className={classes.contributeMain}>
      <Header {...props} />
      <div className={classes.contributeBanner}>
        <div className={classes.carousel}>
          <div className={classes.navigation}>
            <h1>Spotlight</h1>
            <p>Health & Medical</p>
            <div className={classes.arrows}>
              <img src="/assets/arrow-left.png" />
              <div className={classes.dots}>
                <img src="/assets/icons/filled-circle.svg" />
                <img src="/assets/icons/unfilled-circle.svg" />
                <img src="/assets/icons/unfilled-circle.svg" />
                <img src="/assets/icons/unfilled-circle.svg" />
              </div>
              <img src="/assets/arrow-right.png" />
            </div>
          </div>
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
                  AKF works on behalf of the 37 million Americans living with kidney disease, and the millions more at
                  risk ...
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
                <Select defaultValue="Around the world">
                  <Option value="Zhejiang">Zhejiang</Option>
                  <Option value="Jiangsu">Jiangsu</Option>
                </Select>
                <div className={classes.filterIco}>
                  <FaFilter size="18px" fill="#BF52F2" />
                </div>
              </div>
            }
          />
        </div>
      </div>
      <div className={classes.categoriesSection}>
        <div></div>
        <div className={classes.allCategories}>
          <p className={classes.categoryHead}>Categories:</p>
          {categories.map((item, ind) => (
            <p className={classes.category} key={ind}>
              {item}
            </p>
          ))}
          <p className={classes.showMore}>Show More</p>
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
              country: item["Country of Incorporation"],
            };
            return (
              <div
                className={classes.charityCompanyCard}
                onMouseEnter={() => setHover(item.Id)}
                onMouseLeave={() => setHover("")}
                key={ind}
              >
                <CompanyDetailsCard hover={hover} name={item.Id} info={cardInfo} />
                <div className={classes.companyInfo}>
                  <div>
                    <h1 className={classes.charityCompanyName}>{item["Organization Name"]}</h1>
                    <p className={classes.charityCompanyInfo}>{item["Short Description for Front of Card"]}...</p>
                  </div>
                  <div className={classes.carouselBottom}>
                    <div className={classes.companySupportingIcons}>
                      <img src="/assets/icons/animal-paw.svg" />
                      <img src="/assets/icons/eco-friendly.svg" />
                      <img src="/assets/icons/network.svg" />
                    </div>
                    {hover === item.Id && (
                      <button
                        className={classes.detailView}
                        onClick={() => history.push(`/charity/${item["CharityPool Contract"]}`)}
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
      {limitedCharities.length === charities.length || limitedCharities.length < 6 || loading ? null : (
        <p className={classes.moreCards} onClick={() => setLimit(limit + 6)}>
          SHOW MORE
        </p>
      )}
      <Footer {...props} />
    </div>
  );
};

export default Contribute;
