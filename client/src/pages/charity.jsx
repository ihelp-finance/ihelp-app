import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Modal, Tooltip, Select, Input } from "antd";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { statsData } from "../constants";
import { Footer, Header } from "../components";
import classes from "../views/styles/charity.module.css";

const CompanyDetailView = ({ props }) => {
  const { id } = useParams();
  const [charity, setCharity] = useState({});
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`https://app.ihelp.finance/api/v1/data/charities/${id}`)
      .then(res => setCharity(res.data.data))
      .catch(err => console.log("charity charity", err));

    axios
      .get(`https://app.ihelp.finance/api/v1/data/events_by_charity?address=${id}`)
      .then(res => setEvents(res.data))
      .catch(err => console.log("event by charity", err));
  }, []);

  const handleChange = value => {
    console.log(`selected ${value}`);
  };

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
              <p>{charity["Organization Website"]}</p>
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
          {charity["Charity GENERAL Category #3"]?.length === 0 ? null : (
            <p>{charity["Charity GENERAL Category #3"]}</p>
          )}
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
          <p className={classes.deposit} onClick={() => setModalOpen(true)}>
            DEPOSIT
          </p>
          <p className={classes.withdraw}>WITHDRAW</p>
          <Modal
            title={
              <div className={classes.modalHeader}>
                <img src={charity.Logo} alt="" className={classes.modalLogo} />
                <div>
                  <h4 className={classes.modalHead}>Donate interest to {charity["Organization Name"]}</h4>
                  <p className={classes.modalSubPara}>{charity["Short Description for Front of Card"]}</p>
                </div>
              </div>
            }
            centered
            visible={modalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            maskStyle={{
              background: "radial-gradient(82.5% 59.4% at 50% 27.2%, #FFFFFF 0%, rgba(110, 30, 207, 0.5) 100%)",
              backdropFilter: "blur(5px)",
            }}
            footer={false}
          >
            <div className={classes.lenderMain}>
              <div className={classes.lender}>
                <p>LENDER</p>
                <Select
                  defaultValue="aave0x6ab7"
                  style={{
                    width: "100%",
                    border: "1px solid white",
                  }}
                  onChange={handleChange}
                  options={[
                    {
                      value: "aave0x6ab7",
                      label: "aave0x6ab7",
                    },
                    {
                      value: "aanr0x1ab7",
                      label: "aanr0x1ab7",
                    },
                  ]}
                />
              </div>
              <div className={classes.lenderApy}>
                <p>LENDER APY</p>
                <input type="text" placeholder="2.47%" />
              </div>
            </div>
            <div className={classes.wallet}>
              <div className="avax-logo">
                <img src="/assets/icons/avax.svg" alt="avax" width="24px" />
                <p className="">AVAX</p>
                <img src="/assets/icons/chevron-square-down.svg" alt="down" width="12px" />
              </div>
              <div className={classes.breaker} />
              <input type="number" placeholder="0" />
            </div>
            <Input
              prefix={<img src="/assets/icons/memo-circle-check.svg" alt="" />}
              placeholder="Start typing donation memo here (60 char max)"
              className={classes.memo}
            />
            <div className={classes.tokens}>
              <div>
                <p className={classes.token}>TOKEN</p>
                <p className={classes.answer}>0x9720</p>
              </div>
              <div>
                <p className={classes.token}>CHARITY</p>
                <p className={classes.answer}>0x3362</p>
              </div>
            </div>
            <button className={classes.avaxBtn}>DEPOST AVAX</button>
          </Modal>
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
            <p className={classes.description}>{charity["Brief Description & History"]}</p>
          </div>
          <div className={classes.transaction}>
            <h4 className={classes.profileHead}>Transactions</h4>
            <p className={classes.profileSubPara}>
              Showing {events.length} of {events.length} total transactions.
            </p>
            <div className={classes.transactionTable}>
              <table>
                <tr style={{ background: "#F7F0FF" }}>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Nickname</th>
                  <th>Address</th>
                  <th>Currency</th>
                  <th>Amount (USD)</th>
                  <th>Memo</th>
                </tr>
                {events?.map((item, ind) => (
                  <tr key={ind}>
                    <td>
                      <p className={classes.date}>{moment(item.createdAt).format("DD-MMM-yy")}</p>
                      <p className={classes.time}>{moment(item.createdAt).format("hh:mm:ss A")}</p>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.provider}</td>
                    <Tooltip title={item.lendingAddress}>
                      <td>{item.lendingAddress.slice(0, 6)}</td>
                    </Tooltip>
                    <td>{item.currency}</td>
                    <td>{item.amount}</td>
                    <td>{item.memo}</td>
                  </tr>
                ))}
              </table>
            </div>
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
            src={charity["Video for Charity Card"]?.replace("/watch?v=", "/embed/")}
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
            <p className={classes.categoryItem}>{charity["Charity DETAILED Category #1"]}</p>
            <p className={classes.categoryItem}>{charity["Charity DETAILED Category #2"]}</p>
            {charity["Charity DETAILED Category #3"]?.length === 0 ? null : (
              <p className={classes.categoryItem}>{charity["Charity DETAILED Category #3"]}</p>
            )}
          </div>
        </div>
      </div>
      <Footer {...props} />
    </div>
  );
};

export default CompanyDetailView;
