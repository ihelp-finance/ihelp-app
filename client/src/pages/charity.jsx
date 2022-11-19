import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Footer, Header } from "../components";
import classes from "../views/styles/charity.module.css";
import { statsData } from "../constants";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const CompanyDetailView = ({ props }) => {
  const { id } = useParams();
  const [charity, setCharity] = useState({});
  console.log(charity);

  useEffect(() => {
    axios
      .get(`https://app.ihelp.finance/api/v1/data/charities`)
      .then(res => setCharity(res.data.find(element => element.Id === id)))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={classes.charityMain}>
      <Header {...props} />
      <div className={classes.waveBg}>
        <div className={classes.navigation}>
          <img src="/assets/arrow-left.png" alt="" />
          <img src={charity.Logo} alt="" className={classes.logo} />
          <img src="/assets/arrow-right.png" alt="" />
        </div>
      </div>
      <div className={classes.CompanyInfo}>
        <h1 className={classes.companyName}>{charity["Organization Name"]}</h1>
        <div className={classes.socialInfo}>
          <div className={classes.website}>
            <img src="/assets/icons/globe.svg" alt="" />
            <a href={charity["Organization Website"]} target="_blank">
              <p>www.awf.org</p>
            </a>
          </div>
          <div className={classes.website}>
            <img src="/assets/icons/location.svg" alt="" />
            <p>
              {charity["Headquarter Street Address"]}, {charity["Headquarter City"]}, {charity["Headquarter Country"]}
            </p>
          </div>
          <div className={classes.socials}>
            <a href={charity["Organization Twitter"]} target="_blank">
              <img src="/assets/icons/twitter.svg" alt="" />
            </a>
            <a href={charity["Organization Youtube"]} target="_blank">
              <img src="/assets/icons/youtube.svg" alt="" />
            </a>
          </div>
        </div>
        <div className={classes.tags}>
          <p>{charity["Charity GENERAL Category #1"]}</p>
          <p>{charity["Charity GENERAL Category #2"]}</p>
          {charity["Charity GENERAL Category #3"]?.length === 0 ? null : <p>charity["Charity GENERAL Category #3"]</p>}
        </div>
      </div>
      <div className={classes.stats}>
        <div className={classes.donations}>
          <h1>$49.38m</h1>
          <p>Total Direct Donations</p>
        </div>
        <div className={classes.donors}>
          {statsData.map((item, ind) => (
            <div className={classes.totalValue} key={ind}>
              <img src={item.icon} alt="diamond" />
              <div>
                <h6>{item.text}</h6>
                <p>{item.subText}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={classes.moneyTransaction}>
        <div className={classes.money}>
          <p className={classes.interest}>Donate Interest:</p>
          <p className={classes.deposit}>DEPOSIT</p>
          <p className={classes.withdraw}>WITHDRAW</p>
        </div>
        <div className={classes.donationMethod}>
          <p className={classes.principle}>Donate Principle:</p>
          <p className={classes.direct}>DIRECT DONATE</p>
        </div>
      </div>
      <div className={classes.details}>
        <div className={classes.profile}>
          <div>
            <h4 className={classes.profileHead}>Profile</h4>
            <p className={classes.profileSubPara}>Learn about us.</p>
            <p className={classes.description}>
              Elephants, lions, giraffes, and rhinos are only some of Africa's magnificent wildlife species at risk of
              disappearing forever. In just the last few decades alone, the world has lost more than 60 percent of
              forest elephants and more than 40 percent of lions. Poaching, driven by global demand, is at crisis
              levels. But it’s habitat loss that poses the most extensive threat to African wildlife.
            </p>

            <p className={classes.description}>
              The state of rainforests in Africa and around the world is an example. Scientists estimate that if current
              deforestation rates go unchecked, rainforests will be gone in 100 years -- and most of their inhabitants
              with them. The picture is bleak, but not set in stone.
            </p>

            <p className={classes.description}>
              There is a growing consciousness that thoughtful economic and infrastructure development can and should
              incorporate conservation priorities. AWF helped bring about this change and works tirelessly every day to
              ensure a positive future for Africa's wildlife and wild lands. Even where land and habitat have been
              secured, certain species face unique threats and require a targeted conservation approach. Populations of
              rare and endangered species, such as the rhinoceros, gorilla, and all of the great cats, have been
              diminished due to poaching, disease, and conflict with humans. AWF uses a number of methods to monitor and
              protect key populations and ensure these species survive and thrive in their native habitat. One of these
              tactics is to provide funding to partners on the ground through the Species Protection Grants Program.
            </p>

            <p className={classes.description}>
              The program offers a way to directly combat wildlife trafficking as it funds projects that help to stop
              the killing and stop the illegal trade in African wildlife.
            </p>

            <p className={classes.description}>
              AWF was founded on the belief that conservation efforts must ultimately rest in the hands of the people of
              Africa who, with educational support, will construct a viable platform to conserve the continent's
              wildlife heritage. Over the past decades, AWF has sponsored hundreds of young African conservationists to
              study wildlife management and to acquire higher degrees in conservation-related fields.
            </p>
          </div>
          <div className={classes.transaction}>
            <h4 className={classes.profileHead}>Transactions</h4>
            <p className={classes.profileSubPara}>Showing 5 of 5 total transactions.</p>
            <table className={classes.transactionTable}>
              <tr style={{ background: "#F7F0FF" }}>
                <th>Time</th>
                <th>Type</th>
                <th>Nickname</th>
                <th>Address</th>
                <th>Currency</th>
                <th>Amount (USD)</th>
                <th>Memo</th>
              </tr>
              <tr>
                <td>
                  <p className={classes.date}>14-Oct-2022</p>
                  <p className={classes.time}>05:31:09 pm</p>
                </td>
                <td>Withdrawn</td>
                <td></td>
                <td>0xdeeC</td>
                <td>
                  <img src="/assets/icons/USDC.svg" alt="" width="20px" height="20px" />
                </td>
                <td>$-315.60</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={classes.date}>14-Oct-2022</p>
                  <p className={classes.time}>05:31:09 pm</p>
                </td>
                <td>Withdrawn</td>
                <td></td>
                <td>0xdeeC</td>
                <td>
                  <img src="/assets/icons/USDC.svg" alt="" width="20px" height="20px" />
                </td>
                <td>$-315.60</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={classes.date}>14-Oct-2022</p>
                  <p className={classes.time}>05:31:09 pm</p>
                </td>
                <td>Withdrawn</td>
                <td></td>
                <td>0xdeeC</td>
                <td>
                  <img src="/assets/icons/USDC.svg" alt="" width="20px" height="20px" />
                </td>
                <td>$-315.60</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={classes.date}>14-Oct-2022</p>
                  <p className={classes.time}>05:31:09 pm</p>
                </td>
                <td>Withdrawn</td>
                <td></td>
                <td>0xdeeC</td>
                <td>
                  <img src="/assets/icons/USDC.svg" alt="" width="20px" height="20px" />
                </td>
                <td>$-315.60</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <p className={classes.date}>14-Oct-2022</p>
                  <p className={classes.time}>05:31:09 pm</p>
                </td>
                <td>Withdrawn</td>
                <td></td>
                <td>0xdeeC</td>
                <td>
                  <img src="/assets/icons/USDC.svg" alt="" width="20px" height="20px" />
                </td>
                <td>$-315.60</td>
                <td></td>
              </tr>
            </table>
            <div className={classes.pagination}>
              <div className={classes.prev}>
                <BsChevronLeft />
                <p>Prev</p>
              </div>
              <div className={classes.number}>1</div>
              <div className={classes.next}>
                <p>Next</p>
                <BsChevronRight />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.companyDetails}>
          <div className={classes.detailsHeader}>
            <div>
              <h4 className={classes.profileHead}>Videos</h4>
              <p className={classes.profileSubPara}>Showing 1 of 1 videos.</p>
            </div>
            <div className={classes.navigate}>
              <img src="/assets/small-arrow-left.png" alt="" />
              <img src="/assets/icons/circle.svg" alt="" />
              <img src="/assets/small-arrow-right.png" alt="" />
            </div>
          </div>
          <iframe
            width="100%"
            height="248px"
            src={charity["Video for Charity Card"].replace("/watch?v=", "/embed/")}
            title="YouTube video player"
            frameborder="0"
            style={{
              borderRadius: "12px",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div className={classes.financialDetailsMain}>
            <h4 className={classes.profileHead}>Company</h4>
            <p className={classes.profileSubPara}>Details and financials.</p>
            <div className={classes.financialDetails}>
              <div>
                <h4 className={classes.detailsHead}>Details</h4>
                <p className={classes.detailsSubHead}>Country of Incorporation</p>
                <p className={classes.detailsSubPara}>{charity["Country of Incorporation"]}</p>
                <p className={classes.detailsSubHead}>Year Incorporated</p>
                <p className={classes.detailsSubPara}>{charity["Year Incorporated"]}</p>
                <p className={classes.detailsSubHead}>Active In</p>
                <p className={classes.detailsSubPara}>Africa</p>
                <p className={classes.detailsSubHead}>Tax ID Number</p>
                <p className={classes.detailsSubPara}>{charity["Tax ID Number"]}</p>
                <p className={classes.detailsSubHead}>Organization Type</p>
                <p className={classes.detailsSubPara}>{charity["Organization Type"]}</p>
              </div>
              <div>
                <h4 className={classes.financialsHead}>financials</h4>
                <p className={classes.financialsSubHead}>Total Revenue</p>
                <p className={classes.financialsSubPara}>{charity["Total Revenue"]}</p>
                <p className={classes.financialsSubHead}>Total Expenses</p>
                <p className={classes.financialsSubPara}>{charity["Total Expenses"]}</p>
                <p className={classes.financialsSubHead}>Net Income</p>
                <p className={classes.financialsSubPara}>{charity["Net Income"]}</p>
                <p className={classes.financialsSubHead}>Financial Data Year</p>
                <p className={classes.financialsSubPara}>{charity["Financial Data Year"]}</p>
                <p className={classes.financialsSubHead}>Program Expenses</p>
                <p className={classes.financialsSubPara}>{charity["Program Expense"]}</p>
                <p className={classes.financialsSubHead}>Program Expenses / Revenue</p>
                <p className={classes.financialsSubPara}>{charity["Program Expense / Revenue"]}</p>
                <p className={classes.financialsSubHead}>Administrative Expenses</p>
                <p className={classes.financialsSubPara}>{charity["Administrative Expense"]}</p>
              </div>
            </div>
          </div>
          <div className={classes.charityCategory}>
            <h4 className={classes.charityHead}>Charity Detailed Category</h4>
            <p className={classes.categoryItem}>Wildlife Preservation/Protection (D30)</p>
            <p className={classes.categoryItem}>Natural Resource Conservation and Protection (C30)</p>
            <p className={classes.categoryItem}>Research Institutes and/or Public Policy Analysis (S05)</p>
          </div>
        </div>
      </div>
      <Footer {...props} />
    </div>
  );
};

export default CompanyDetailView;
