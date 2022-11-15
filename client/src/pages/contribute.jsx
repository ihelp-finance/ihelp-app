import React, { useMemo, useState } from "react";
import { Footer, Header } from "../components";
import { categories, companyCard, statsData } from "../constants";
import classes from "../views/styles/contribute.module.css";
import { Input, Select } from "antd";
import { FaSearch, FaFilter } from "react-icons/fa";
import CompanyDetailsCard from "../components/contribute/companyDetailsCard";

const Contribute = props => {
  const [hover, setHover] = useState("");

  const { Option } = Select;

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
                {hover && <button className={classes.detailView}>VIEW DETAILS</button>}
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
            <h1>165</h1>
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
          <p className={classes.explorePara}>Showing 6 of 165 total charities.</p>
        </div>
        <div className={classes.searchFilter}>
          <Input
            placeholder="Xihu District, Hangzhou"
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
        {companyCard.map((item, ind) => (
          <div
            className={classes.charityCompanyCard}
            onMouseEnter={() => setHover(item.name)}
            onMouseLeave={() => setHover("")}
            key={ind}
          >
            <CompanyDetailsCard hover={hover} name={item.name} info={item.cardInfo} />
            <div className={classes.companyInfo}>
              <div>
                <h1 className={classes.charityCompanyName}>{item.companyName}</h1>
                <p className={classes.charityCompanyInfo}>{item.description}</p>
              </div>
              <div className={classes.companySupportingIcons}>
                {item.icons.map((item, ind) => (
                  <img src={item} key={ind} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className={classes.moreCards}>SHOW MORE</p>
      <Footer {...props} />
    </div>
  );
};

export default Contribute;
