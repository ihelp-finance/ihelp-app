import React, { useEffect, useState } from "react";
import st from "./styles/charity.module.css";
import { General, Details, Financials, Videos, Transactions } from "./tabs";
import { MdSearch, MdMenu, MdClose, MdEast, MdChatBubbleOutline } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import $ from "jquery";
import { Power4 } from "gsap/dist/gsap";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
// import Head from "next/head";
// import Link from "next/link";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore, { Navigation, Pagination } from "swiper";
// import "swiper/swiper.min.css";
// import "swiper/components/pagination/pagination.min.css";
import { useParams } from "react-router-dom";
import { Menu, Space, Dropdown, Input, Tabs, Spin, Tooltip } from "antd";
import { LoadingOutlined, DownOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;
import commafy from "commafy";
import { utils } from "ethers";

import Address from "../components/Address";
import { Header, Footer } from "../components";
import edit from "../assets/images/icon/edit.png";

const antIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;

const ContributeNew = props => {
  const { id } = useParams();
  console.log("id", id);
  const [charityInfo, setCharityInfo] = useState(null);
  const [showDepositInterest, setShowDepositInterest] = useState(false);
  const [showDepositDirect, setShowDepositDirect] = useState(false);
  const [showWithdrawInterest, setShowWithdrawInterest] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [inputAmount, setInputAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const [contractNameHash, setcontractNameHash] = useState(null);

  const [withdrawEnabledLookup, setwithdrawEnabledLookup] = useState(null);
  const [charityBalances, setcharityBalances] = useState(null);
  const [charityBalancesUSD, setcharityBalancesUSD] = useState(null);

  const [charityAllowances, setcharityAllowances] = useState(null);
  const [currencyBalances, setcurrencyBalances] = useState(null);

  // THESE ARE OLD
  const [daiCharityBalance, setdaiCharityBalance] = useState(null);
  const [daiCharityBalanceUSD, setdaiCharityBalanceUSD] = useState(null);
  const [daiTotalInterestEarned, setdaiTotalInterestEarned] = useState(null);
  const [daiCharityTotalBalance, setdaiCharityTotalBalance] = useState(null);
  const [daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD] = useState(null);
  const [daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD] = useState(null);

  const [usdcCharityBalance, setusdcCharityBalance] = useState(null);
  const [usdcCharityBalanceUSD, setusdcCharityBalanceUSD] = useState(null);
  const [usdcTotalInterestEarned, setusdcTotalInterestEarned] = useState(null);
  const [usdcCharityTotalBalance, setusdcCharityTotalBalance] = useState(null);
  const [usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD] = useState(null);
  const [usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD] = useState(null);

  const [daiBalance, setdaiBalance] = useState(null);
  const [usdcBalance, setusdcBalance] = useState(null);

  const [lastTotalBalance, setLastTotalBalance] = useState(null);

  const [selectedLendingProvider, setselectedLendingProvider] = useState(null);

  const [charityDecimals, setCharityDecimals] = useState(null);
  const [currencyAllowances, setcurrencyAllowances] = useState(null);
  const [contributionMemo, setContributionMemo] = useState("");
  const [eventsByCharity, setEventsByCharity] = useState([]);

  useEffect(() => {
    if (props.readContracts != null) {
      // create the charity name hash
      const charityNames = {};
      Object.keys(props.readContracts).map(c => {
        if (c.indexOf("Proxy") == -1 && c.indexOf("Implementation") == -1) {
          charityNames[props.readContracts[c]["address"]] = c;
        }
      });
      console.log("charityNames", charityNames);
      setcontractNameHash(charityNames);

      let url = `/api/v1/data/charities/${id}`;
      fetch(url)
        .then(d => {
          return d.json();
        })
        .then(d => {
          try {
            setCharityInfo(d.data);

            console.log("charityInfo", d.data);

            // setTimeout(()=>{
            //   setCurrencies(d.data['Currencies'])
            // },0)
          } catch (e) {}
        });
    }
  }, [props.readContracts]);

  const [infoItems, setInfoItems] = useState(null);

  useEffect(() => {
    let url = `/api/v1/data/events_by_charity?address=${id}`;
    fetch(url)
      .then(d => {
        return d.json();
      })
      .then(d => {
        console.log("events_by_charity", d);
        setEventsByCharity(d);
      });
  }, [infoItems]);

  useEffect(async () => {
    document.title = `iHelp | Charity (${
      props.targetNetwork.name.replace("host", "").charAt(0).toUpperCase() +
      props.targetNetwork.name.replace("host", "").substr(1).toLowerCase()
    })`;
  }, []);

  // SwiperCore.use([Navigation, Pagination]);
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
      },
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

  const handleModalClick = e => {
    //console.log(e.target.className)
    try {
      if (e.target.className.indexOf("hitbox") > -1 || e.target.className.indexOf("lightbox") > -1) {
        setShowDepositInterest(false);
        setShowDepositDirect(false);
        setShowWithdrawInterest(false);
        setInputAmount("");
        setContributionMemo("");
      }
    } catch (e) {}
  };

  const [currentCurrencyTab, setcurrentCurrencyTab] = useState(null);

  const handleCurrencyChange = e => {
    setcurrentCurrencyTab(e);
    setInputAmount("");
    setselectedLendingProvider(null);
  };

  const setValue = props.setValue;

  const [supportedCurrencyDetails, setSupportedCurrencyDetails] = useState({});

  const updateContracts = async contract => {
    // console.log('updating values', contract);

    // setValue("DAI", "allowance", [props.address, charityInfo[`CharityPool Contract`]], allowanceCharityDAI, setallowanceCharityDAI);
    // setValue("USDC", "allowance", [props.address, charityInfo[`CharityPool Contract`]], allowanceCharityUSDC, setallowanceCharityUSDC);
    // setValue("WETH", "allowance", [props.address, charityInfo[`CharityPool Contract`]], allowanceCharityUSDC, setallowanceCharityUSDC);

    const nativeBalance = await props.localProvider.getBalance(props.address);
    //console.log('BALANCE:',newBalance)

    props.readContracts["analytics"]
      ["getDonationCurrencyAllowances"](charityInfo[`CharityPool Contract`], props.address)
      .then(d => {
        const cHash = {};
        d.map(c => {
          cHash[c["currency"]] = parseInt(c["allowance"]);
        });
        setcurrencyAllowances(cHash);
      });

    props.readContracts["analytics"]
      ["getUserWalletBalances"](props.readContracts["iHelp"].address, props.address)
      .then(d => {
        const cHash = {};
        d.map(c => {
          cHash[c["currency"]] = c["balance"];
          if (c["currency"][0] == "W") {
            cHash[c["currency"].replace("W", "")] = nativeBalance;
          }
        });

        console.log("getUserWalletBalances", cHash);
        setcurrencyBalances(cHash);
      });

    props.readContracts["analytics"]
      ["getUserTokenContributionsPerCharity"](charityInfo[`CharityPool Contract`], props.address)
      .then(d => {
        console.log("getUserTokenContributionsPerCharity", d);
        const cHash = {};
        const wHash = {};
        d.map(c => {
          cHash[`${c["currency"]}-${c["tokenAddress"]}`] = c["totalContributions"];

          if (c["totalContributions"] > 0) {
            wHash[c["currency"]] = true;
          }

          if (c["currency"][0] == "W") {
            cHash[`${c["currency"].replace("W", "")}-${c["tokenAddress"]}`] = c["totalContributions"];
            wHash[c["currency"].replace("W", "")] = true;
          }
        });

        console.log("cHash", cHash);

        setwithdrawEnabledLookup(wHash);
        setcharityBalances(cHash);
      });

    props.readContracts["analytics"]
      ["getSupportedCurrencies"](props.readContracts["iHelp"].address, props.targetNetwork.blockTime)
      .then(d => {
        // console.log('pricefeeds:',d)

        // get hash of currencies and their lending protocols

        const currencyHash = {};

        const charityDecimalHash = {};

        for (let i = 0; i < d.length; i++) {
          charityDecimalHash[d[i]["currency"]] = parseInt(d[i]["decimals"]);

          // console.log(parseFloat(utils.formatUnits(d[i]['apr'],parseInt(d[i]['decimals']))))

          if (Object.keys(currencyHash).indexOf(d[i]["currency"]) > -1) {
            currencyHash[d[i]["currency"]].push(d[i]);
          } else {
            currencyHash[d[i]["currency"]] = [];
            currencyHash[d[i]["currency"]].push(d[i]);
          }

          if (d[i]["currency"].toLowerCase() == "weth" || d[i]["currency"].toLowerCase() == "wavax") {
            const newD = JSON.parse(JSON.stringify(d[i]));

            newD["native"] = true;
            newD["currency"] = d[i]["currency"].replace("W", "");
            newD["decimals"] = d[i]["decimals"];
            newD["lendingAddress"] = d[i]["lendingAddress"];
            newD["price"] = d[i]["price"];
            newD["priceDecimals"] = d[i]["priceDecimals"];
            newD["priceFeed"] = d[i]["priceFeed"];
            newD["provider"] = d[i]["provider"];
            newD["underlyingToken"] = d[i]["underlyingToken"];
            newD["apr"] = d[i]["apr"];

            if (Object.keys(currencyHash).indexOf(d[i]["currency"].replace("W", "")) > -1) {
              currencyHash[d[i]["currency"].replace("W", "")].push(newD);
            } else {
              currencyHash[d[i]["currency"].replace("W", "")] = [];
              currencyHash[d[i]["currency"].replace("W", "")].push(newD);
            }
            charityDecimalHash[d[i]["currency"].replace("W", "")] = charityDecimalHash[d[i]["currency"]];
          }
        }
        console.log("currencyHash", currencyHash);
        console.log("charityDecimals", charityDecimalHash);

        setCharityDecimals(charityDecimalHash);
        setCurrencies(Object.keys(currencyHash));
        setSupportedCurrencyDetails(currencyHash);
        setcurrentCurrencyTab(Object.keys(currencyHash)[0]);
      });

    props.readContracts["analytics"]["charityStats"](charityInfo[`CharityPool Contract`]).then(d => {
      console.log("charityStats", d);

      const totalHelpers = commafy(parseFloat(d["numerOfContributors"]).toFixed(0));
      const totalDirectDonations = commafy(parseFloat(utils.formatUnits(d["totalDirectDonations"], 18)).toFixed(0));
      const totalYield = commafy(parseFloat(utils.formatUnits(d["totalYieldGenerated"], 18)).toFixed(2));
      const tvl = commafy(parseFloat(utils.formatUnits(d["totalValueLocked"], 18)).toFixed(0));

      setInfoItems([
        {
          value: `$${tvl}`,
          name: "Total Value Locked (TVL)",
        },
        {
          value: `$${totalYield}`,
          name: "Total Yield Donated",
        },
        {
          value: totalHelpers,
          name: "Total Donors",
        },
        {
          value: `$${totalDirectDonations}`,
          name: "Total Direct Donations",
        },
      ]);
    });

    /*
    
    if (contract == 'init') {
      
      for (var i=0;i<currencies.length;i++) {

        const contractName = contractNameHash[charityInfo[`${currencies[i]} CharityPool`]];
 
        if (currencies[i] == 'DAI') {
          console.log('setting value',contractName);
          setValue(contractName, "balanceOf", [props.address], daiCharityBalance, setdaiCharityBalance);
          setValue(contractName, "balanceOfUSD", [props.address], daiCharityBalanceUSD, setdaiCharityBalanceUSD);
          setValue(contractName, "totalInterestEarned", null, daiTotalInterestEarned, setdaiTotalInterestEarned);
          setValue(contractName, "getAccountedBalance", null, daiCharityTotalBalance, setdaiCharityTotalBalance);
          setValue(contractName, "totalInterestEarnedUSD", null, daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD);
          setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
          setValue("DAI", "balanceOf", [props.address], daiBalance, setdaiBalance); 
          setValue("DAI", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityDAI, setallowanceCharityDAI);
        }
        else if (currencies[i] == 'USDC') {
          console.log('setting value',contractName);
          setValue(contractName, "balanceOf", [props.address], usdcCharityBalance, setusdcCharityBalance);
          setValue(contractName, "balanceOfUSD", [props.address], usdcCharityBalanceUSD, setusdcCharityBalanceUSD);
          setValue(contractName, "totalInterestEarned", null, usdcTotalInterestEarned, setusdcTotalInterestEarned);
          setValue(contractName, "getAccountedBalance", null, usdcCharityTotalBalance, setusdcCharityTotalBalance);
          setValue(contractName, "totalInterestEarnedUSD", null, usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD);
          setValue(contractName, "getAccountedBalanceUSD", null, usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD);
          setValue("USDC", "balanceOf", [props.address], usdcBalance, setusdcBalance); 
           setValue("USDC", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityUSDC, setallowanceCharityUSDC);
        }
        
      }

      // setValue("charityPool1", "balanceOf", [address], charityPool1Balance, setcharityPool1Balance);
      // setValue("charityPool1", "totalInterestEarned", null, charityPool1TotalInterestEarned, setcharityPool1TotalInterestEarned);
      // setValue("charityPool1", "getAccountedBalance", null, charityPool1TotalBalance, setcharityPool1TotalBalance);
      
      
      // setValue("iHelp", "stakingPool", null, iHelpStakingPool, setiHelpStakingPool);
      // setValue("iHelp", "developmentPool", null, iHelpDevelopmentPool, setiHelpDevelopmentPool);
      // setValue("iHelp", "holdingPool", null, iHelpCharityPool, setiHelpCharityPool);
      
      // setValue("iHelp", "allowance", [props.address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
      
      // setValue("DAI", "allowance", [props.address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setAllowanceCharity2);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      // //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // setValue("USDC", "allowance", [props.address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      // //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

      // setValue("charityPool1", "tokenname", null, charityPool1Token, setcharityPool1Token);
      // setValue("charityPool2", "tokenname", null, charityPool2Token, setcharityPool2Token);
      // setValue("charityPool3", "tokenname", null, charityPool3Token, setcharityPool3Token);
      
      // setValue("DAI", "decimals", null, charityPool1Decimals, setcharityPool1Decimals);
      // setValue("USDC", "decimals", null, charityPool2Decimals, setcharityPool2Decimals);
      // //setValue("charityPool3", "decimals", null, charityPool3Decimals, setcharityPool3Decimals);

      // setValue("ETH", "balance", null, ethBalance, setEthBalance);


      // if (targetNetwork.name.indexOf("local") == -1) {
        
      //   getLeaderboard();
        
      //   setInterval(()=>{
      //     getLeaderboard();
      //   },30000);
      
      // }
      

    }

    if (contract == 'DAI' || contract == 'all') {
      
      if (currencies.indexOf('DAI') > -1) {
        setValue("DAI", "balanceOf", [props.address], daiBalance, setdaiBalance); 
      }

      // setValue("DAI", "balanceOf", [props.address], daiBalance, setDaiBalance);
      // setValue("DAI", "balanceOf", [iHelpStakingPool], iHelpStakingPoolBalanceDAI, setiHelpStakingPoolBalanceDAI);
      // setValue("DAI", "balanceOf", [iHelpDevelopmentPool], iHelpDevelopmentPoolBalanceDAI, setiHelpDevelopmentPoolBalanceDAI);
      // setValue("DAI", "balanceOf", [iHelpCharityPool], iHelpCharityPoolBalanceDAI, setiHelpCharityPoolBalanceDAI);

      // setValue("DAI", "allowance", [address, readContracts.charityPool1.address], allowanceCharity1, setAllowanceCharity1);
      // //setValue("DAI", "allowance", [address, readContracts.charityPool2.address], daiAllowanceCharity2, setdaiAllowanceCharity2);
      // setValue("DAI", "allowance", [address, readContracts.charityPool3.address], allowanceCharity3, setAllowanceCharity3);
      
    }
    
    if (contract == 'USDC' || contract == 'all') {

      if (currencies.indexOf('USDC') > -1) {
        setValue('USDC', "balanceOf", [props.address], usdcBalance, setusdcBalance);
      }

      // setValue("USDC", "balanceOf", [props.address], usdcBalance, setUsdcBalance);

      // //setValue("USDC", "allowance", [address, readContracts.charityPool1.address], daiAllowanceCharity1, setdaiAllowanceCharity1);
      // setValue("USDC", "allowance", [address, readContracts.charityPool2.address], allowanceCharity2, setAllowanceCharity2);
      // //setValue("USDC", "allowance", [address, readContracts.charityPool3.address], daiAllowanceCharity3, setdaiAllowanceCharity3);

    }
    
    if (contract != 'init') {
      for (var i=0;i<currencies.length;i++) {
  
        const contractName = contractNameHash[charityInfo[`${currencies[i]} CharityPool`]];
        
        if (contractName == contract) {
  
          if (currencies[i] == 'DAI') {
            //console.log('setting value',contractName);
            setValue(contractName, "balanceOf", [props.address], daiCharityBalance, setdaiCharityBalance);
            setValue(contractName, "balanceOfUSD", [props.address], daiCharityBalanceUSD, setdaiCharityBalanceUSD);
            setValue(contractName, "totalInterestEarned", null, daiTotalInterestEarned, setdaiTotalInterestEarned);
            setValue(contractName, "getAccountedBalance", null, daiCharityTotalBalance, setdaiCharityTotalBalance);
            setValue(contractName, "totalInterestEarnedUSD", null, daiTotalInterestEarnedUSD, setdaiTotalInterestEarnedUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, daiCharityTotalBalanceUSD, setdaiCharityTotalBalanceUSD);
            setValue("DAI", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityDAI, setallowanceCharityDAI);
            
          }
          else if (currencies[i] == 'USDC') {
           // console.log('setting value',contractName);
            setValue(contractName, "balanceOf", [props.address], usdcCharityBalance, setusdcCharityBalance);
            setValue(contractName, "balanceOfUSD", [props.address], usdcCharityBalanceUSD, setusdcCharityBalanceUSD);
            setValue(contractName, "totalInterestEarned", null, usdcTotalInterestEarned, setusdcTotalInterestEarned);
            setValue(contractName, "getAccountedBalance", null, usdcCharityTotalBalance, setusdcCharityTotalBalance);
            setValue(contractName, "totalInterestEarnedUSD", null, usdcTotalInterestEarnedUSD, setusdcTotalInterestEarnedUSD);
            setValue(contractName, "getAccountedBalanceUSD", null, usdcCharityTotalBalanceUSD, setusdcCharityTotalBalanceUSD);
            setValue("USDC", "allowance", [props.address, props.readContracts[contractName].address], allowanceCharityUSDC, setallowanceCharityUSDC);
            
          }
        
        }
        
      }
    }

    if (contract == 'iHelp' || contract == 'all') {
      // setValue("iHelp", "balanceOf", [address], iHelpBalance, setiHelpBalance);
      // setValue("iHelp", "tokenPhase", null, iHelpTokenPhase, setiHelpTokenPhase);
      // setValue("iHelp", "currentTokensPerInterest", null, iHelpTokensPerPhase, setiHelpTokensPerPhase);
      // setValue("iHelp", "totalCirculating", null, iHelpCirculating, setiHelpCirculating);
      // setValue("iHelp", "totalAvailableSupply", null, iHelpSupply, setiHelpSupply);
      // setValue("iHelp", "getClaimableTokens", [address], iHelpClaimable, setiHelpClaimable);
      // setValue("iHelp", "numberOfCharities", null, iHelpRegisteredCharities, setiHelpRegisteredCharities);
      // setValue("iHelp", "getTotalCharityPoolInterest", null, iHelpTotalInterest, setiHelpTotalInterest);
      // setValue("iHelp", "allowance", [address,readContracts.xHelp.address], allowanceStaking, setAllowanceStaking);
    }
    
    if (contract == 'xHelp' || contract == 'all') {
    
      // setValue("xHelp", "balanceOf", [address], xHelpBalance, setxHelpBalance);
      // setValue("xHelp", "totalSupply", null, xHelpSupply, setxHelpSupply);
      // setValue("xHelp", "exchangeRateCurrent", null, xHelpValue, setxHelpValue);
    
    }
    
    */
  };

  const onAction = async currency => {
    let action = null;
    if (showDepositInterest == true) {
      action = "deposit";
    } else if (showWithdrawInterest == true) {
      action = "withdraw";
    } else if (showDepositDirect == true) {
      action = "donate";
    }

    console.log("action", action, currency, inputAmount);

    if (action == "deposit") {
      console.log(
        "sponsoring",
        inputAmount,
        "gwei",
        currency,
        "to charity",
        charityInfo[`CharityPool Contract`],
        "with lender",
        selectedLendingProvider.lendingAddress,
      );

      setLoading(true);

      const sponsorAmountWei = utils.parseUnits(inputAmount, charityDecimals[currency]).toString();

      const contractName = contractNameHash[charityInfo[`CharityPool Contract`]];

      let nativeToken = false;
      if (currency == "ETH" || currency == "AVAX") {
        nativeToken = true;
      }

      let sponsorTx = null;

      if (nativeToken == false) {
        console.log(props.writeContracts[contractName]);

        props.tx(
          props.writeContracts[contractName].version().then(d => {
            console.log("version", d);
          }),
        );

        sponsorTx = props.tx(
          props.writeContracts[contractName].depositTokens(
            selectedLendingProvider.lendingAddress,
            sponsorAmountWei,
            contributionMemo,
          ),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      } else {
        sponsorTx = props.tx(
          props.writeContracts[contractName].depositNative(selectedLendingProvider.lendingAddress, contributionMemo, {
            value: sponsorAmountWei,
          }),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      }

      console.log("awaiting metamask/web3 confirm result...", sponsorTx);
      console.log(await sponsorTx);

      // setTimeout(()=>{

      setLoading(false);
      setInputAmount("");
      setContributionMemo("");
      setShowDepositInterest(false);
      setShowDepositDirect(false);
      setShowWithdrawInterest(false);

      // },1000)
    } else if (action == "withdraw") {
      console.log(
        "withdrawing",
        inputAmount,
        "gwei",
        currency,
        "to charity",
        charityInfo[`CharityPool Contract`],
        "with lender",
        selectedLendingProvider.lendingAddress,
      );

      setLoading(true);

      const withdrawAmountWei = utils.parseUnits(inputAmount, charityDecimals[currency]).toString();

      const contractName = contractNameHash[charityInfo[`CharityPool Contract`]];

      let nativeToken = false;
      if (currency == "ETH" || currency == "AVAX") {
        nativeToken = true;
      }

      let sponsorTx = null;

      if (nativeToken == false) {
        sponsorTx = props.tx(
          props.writeContracts[contractName].withdrawTokens(selectedLendingProvider.lendingAddress, withdrawAmountWei),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      } else {
        sponsorTx = props.tx(
          props.writeContracts[contractName].withdrawNative(selectedLendingProvider.lendingAddress, withdrawAmountWei),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      }

      console.log("awaiting metamask/web3 confirm result...", sponsorTx);
      console.log(await sponsorTx);

      // setTimeout(()=>{

      setLoading(false);
      setInputAmount("");
      setContributionMemo("");
      setShowDepositInterest(false);
      setShowDepositDirect(false);
      setShowWithdrawInterest(false);

      // },1000)
    }

    if (action == "donate") {
      console.log("donating", inputAmount, "gwei", currency, "to charity", charityInfo[`CharityPool Contract`]);

      setLoading(true);

      const donationAmountWei = utils.parseUnits(inputAmount, charityDecimals[currency]).toString();

      const contractName = contractNameHash[charityInfo[`CharityPool Contract`]];

      let nativeToken = false;
      if (currency == "ETH" || currency == "AVAX") {
        nativeToken = true;
      }

      let sponsorTx = null;

      if (nativeToken == false) {
        const currencyAddress = props.readContracts[currency].address;

        sponsorTx = props.tx(
          props.writeContracts[contractName].directDonation(currencyAddress, donationAmountWei),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      } else {
        sponsorTx = props.tx(
          props.writeContracts[contractName].directDonationNative({ value: donationAmountWei }),
          update => {
            console.log("Transaction Update:", update);
            if (update && (update.status === "confirmed" || update.status === 1)) {
              console.log("Transaction " + update.hash + " finished!");
              console.log(
                "" +
                  update.gasUsed +
                  "/" +
                  (update.gasLimit || update.gas) +
                  " @ " +
                  parseFloat(update.gasPrice) / 1000000000 +
                  " gwei",
              );
            }
          },
        );
      }

      console.log("awaiting metamask/web3 confirm result...", sponsorTx);
      console.log(await sponsorTx);

      // setTimeout(()=>{

      setLoading(false);
      setInputAmount("");
      setContributionMemo("");
      setShowDepositInterest(false);
      setShowDepositDirect(false);
      setShowWithdrawInterest(false);

      // },1000)
    }
  };

  const handleMaxClick = currency => {
    console.log(currency);

    let action = null;
    if (showDepositInterest == true) {
      action = "deposit";
    } else if (showWithdrawInterest == true) {
      action = "withdraw";
    } else if (showDepositDirect == true) {
      action = "donate";
    }

    let nativeToken = false;
    if (currency == "ETH" || currency == "AVAX") {
      nativeToken = true;
    }

    if (action == "deposit" || action == "donate") {
      setInputAmount(parseFloat(utils.formatUnits(currencyBalances[currency], charityDecimals[currency])).toFixed(6));

      // if (currency == 'DAI') {
      //   setInputAmount(parseFloat(utils.formatUnits(daiBalance,charityDecimals['DAI'])).toFixed(6))
      // } else if (currency == 'USDC') {
      //   setInputAmount(parseFloat(utils.formatUnits(usdcBalance,charityDecimals['USDC'])).toFixed(6))
      // }
    } else if (action == "withdraw") {
      console.log(selectedLendingProvider);
      console.log(charityBalances);
      console.log(`${currency}-${selectedLendingProvider["lendingAddress"]}`);
      setInputAmount(
        parseFloat(
          utils.formatUnits(
            charityBalances[`${currency}-${selectedLendingProvider["lendingAddress"]}`],
            charityDecimals[currency],
          ),
        ).toFixed(6),
      );

      // if (currency == 'DAI') {
      //   setInputAmount(parseFloat(utils.formatUnits(daiCharityBalance,charityDecimals['DAI'])).toFixed(6))
      // } else if (currency == 'USDC') {
      //   setInputAmount(parseFloat(utils.formatUnits(usdcCharityBalance,charityDecimals['USDC'])).toFixed(6))
      // }
    }
  };

  const enableCurrency = async currency => {
    console.log("sponsoring", inputAmount, "gwei dai to charity:", charityInfo[`CharityPool Contract`]);

    setLoading(true);

    let nativeToken = false;
    let mapToken = currency;
    if (currency == "ETH" || currency == "AVAX") {
      nativeToken = true;
      mapToken = `W${currency}`;
    }

    const contractName = contractNameHash[charityInfo[`CharityPool Contract`]];

    const sponsorTx = props.tx(
      props.writeContracts[mapToken].approve(
        props.readContracts[contractName].address,
        utils.parseEther("100000000000").toString(),
      ),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );
        }
      },
    );
    console.log("awaiting metamask/web3 confirm result...", sponsorTx);
    const tx = await sponsorTx;

    if (tx != undefined) {
      const numberOfTries = 10;
      let tryCounter = 0;

      const processEnableTries = () => {
        console.log("trying enable:", tryCounter, "/", numberOfTries);

        tryCounter += 1;

        props.readContracts["analytics"]
          ["getDonationCurrencyAllowances"](charityInfo[`CharityPool Contract`], props.address)
          .then(d => {
            console.log(d);

            let allowComplete = false;

            d.map(c => {
              if (c["currency"] == mapToken) {
                if (parseInt(c["allowance"]) >= 100000000) {
                  allowComplete = true;
                }
              }
            });

            if (allowComplete == false && tryCounter > numberOfTries) {
              alert(
                "ERROR - something went wrong with enabling. We are going to refresh the page and please try again...",
              );
              window.location.reload();
            } else {
              if (allowComplete == false) {
                setTimeout(() => {
                  processEnableTries();
                }, 1200);
              } else {
                const cHash = {};
                d.map(c => {
                  cHash[c["currency"]] = parseInt(c["allowance"]);
                });
                setcurrencyAllowances(cHash);
                setTimeout(() => {
                  setLoading(false);
                  setInputAmount("");
                }, 100);
              }
            }
          });
      };

      setTimeout(() => {
        processEnableTries();
      }, 1500);
    } else {
      setLoading(false);
      setInputAmount("");
    }
  };

  const handleSetLendingProvider = value => {
    setselectedLendingProvider({
      provider: value.key.split("---")[0],
      lendingAddress: value.key.split("---")[1],
      apr: value.key.split("---")[2] / 1e18,
      apy: (1 + value.key.split("---")[2] / 1e18 / 365) ** 365 - 1,
    });
  };

  const handleContributionMemo = e => {
    if (e.target.value.length < 60) {
      setContributionMemo(e.target.value);
    }
  };

  const handleTokenAdd = async currency => {
    let nativeToken = false;
    let mapToken = currency;
    if (currency == "ETH" || currency == "AVAX") {
      nativeToken = true;
      mapToken = `W${currency}`;
    }

    const tokenAddress = props.readContracts[mapToken].address;
    const tokenSymbol = mapToken;
    const tokenDecimals = await props.readContracts[mapToken].decimals();
    //const tokenImage = `https://ihelp.finance/assets/${mapToken.replace('.e','')}.svg`;

    console.log(tokenAddress, tokenSymbol, tokenDecimals);

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            //image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Token Added");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const currencyTabs = currencies.map((d, i) => {
    let currencyApproved = false;

    // REVISE WITH NEW CURRENCY ALLOWANCES

    let nativeToken = false;
    let mapToken = d;
    if (d == "ETH" || d == "AVAX") {
      nativeToken = true;
      mapToken = `W${d}`;
    }

    let currencyAddress = null;
    try {
      currencyAddress = props.readContracts[mapToken].address;
    } catch (e) {}
    // console.log('currencyAddress',currencyAddress);

    // ensure the contract action is enabled
    if (
      nativeToken ||
      (currencyAllowances &&
        Object.keys(currencyAllowances).indexOf(mapToken) > -1 &&
        currencyAllowances[mapToken] >= 100000000)
    ) {
      currencyApproved = true;
    }

    const items = [];

    Object.keys(supportedCurrencyDetails).length > 0
      ? supportedCurrencyDetails[d].map((c, i) => {
          const details = c;

          items.push(
            <Menu.Item key={`${details.provider}---${details.lendingAddress}---${details.apr}`}>
              <div>
                {details.provider}{" "}
                <Address
                  address={details.lendingAddress}
                  ensProvider={props.mainnetProvider}
                  blockExplorer={props.blockExplorer}
                />
              </div>
            </Menu.Item>,
          );
        })
      : null;

    const menu = <Menu onClick={handleSetLendingProvider}>{items}</Menu>;

    let action = null;
    if (showDepositInterest == true) {
      action = "deposit";
    } else if (showWithdrawInterest == true) {
      action = "withdraw";
    } else if (showDepositDirect == true) {
      action = "donate";
    }

    let buttonDisabled = false;
    if (action == "deposit" || action == "donate") {
      if (
        currencyBalances &&
        Object.keys(currencyBalances).indexOf(d) > -1 &&
        (currencyBalances[d] == 0 ||
          inputAmount > parseFloat(utils.formatUnits(currencyBalances[d], charityDecimals[d])))
      ) {
        buttonDisabled = true;
      }
    } else if (action == "withdraw") {
      console.log(selectedLendingProvider);
      try {
        const key = `${d}-${selectedLendingProvider.lendingAddress}`;

        if (
          charityBalances &&
          Object.keys(charityBalances).indexOf(key) > -1 &&
          (charityBalances[key] == 0 ||
            inputAmount > parseFloat(utils.formatUnits(charityBalances[key], charityDecimals[d])))
        ) {
          buttonDisabled = true;
        }
      } catch (e) {
        console.log(e);
      }
    }

    return (
      <TabPane
        tab={
          <span>
            <img
              src={`/assets/icons/${d.replace(".e", "").toUpperCase()}.svg`}
              style={{ height: "20px", marginRight: "5px" }}
            />
            {d}
          </span>
        }
        key={d}
      >
        {currencyApproved ? (
          <span>
            {loading ? (
              <Spin style={{ zoom: "3", marginTop: "2px" }} />
            ) : (
              <span>
                <Input
                  //style={{width:'100%',display: ''}}
                  type="number"
                  className={"charityinputStyle"}
                  placeholder={`0`}
                  autoFocus
                  step="0.1"
                  onChange={e => {
                    setInputAmount(e.target.value);
                  }}
                  value={inputAmount}
                />
                <button
                  className={"charitymaxButton"}
                  onClick={e => {
                    handleMaxClick(d);
                  }}
                >
                  Max
                </button>
              </span>
            )}
            <div className={st.charityBtnGrd}>
              <Dropdown overlay={menu} trigger={["click"]}>
                <a
                  onClick={e => e.preventDefault()}
                  style={{ width: "50%", marginTop: "-10px", visibility: showDepositDirect ? "hidden" : "visible" }}
                >
                  <Space>
                    Lender
                    {selectedLendingProvider ? (
                      <span>
                        → {selectedLendingProvider.provider}{" "}
                        <Address
                          style={{ marginTop: "2px", position: "relative" }}
                          address={selectedLendingProvider.lendingAddress}
                          ensProvider={props.mainnetProvider}
                          blockExplorer={props.blockExplorer}
                        />
                      </span>
                    ) : (
                      ""
                    )}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>

              <div
                style={{
                  right: "25px",
                  position: "absolute",
                  display: action == "donate" || action == "deposit" ? "inline-block" : "none",
                  width: "50%",
                  height: "40px",
                  marginTop: "-15px",
                }}
              >
                <input
                  style={{
                    fontStyle: "italic",
                    border: "0px",
                    textAlign: "right",
                    width: "80%",
                    height: "100%",
                    marginLeft: "5%",
                  }}
                  onChange={handleContributionMemo}
                  value={contributionMemo}
                  placeholder="Donation memo (60 char max)"
                />
                <span
                  style={{
                    border: "0px",
                    textAlign: "right",
                    right: "0px",
                    float: "right",
                    width: "10%",
                    marginTop: "7px",
                  }}
                >
                  <img src={edit} alt="" onClick={() => setNickName(false)} />
                </span>
              </div>

              <button
                className="grd-btn"
                onClick={e => onAction(d)}
                disabled={loading || inputAmount == 0 || buttonDisabled}
              >
                {showDepositInterest
                  ? `Deposit ${d}`
                  : showWithdrawInterest
                  ? `Withdraw ${d}`
                  : showDepositDirect
                  ? `Donate ${d}`
                  : ""}
              </button>
            </div>
          </span>
        ) : loading ? (
          <Spin style={{ zoom: "3", marginTop: "7px" }} />
        ) : (
          <button
            className="grd-btn"
            style={{ width: "100%", height: "80px", fontSize: "20px", fontWeight: "600" }}
            onClick={e => enableCurrency(d)}
          >
            ENABLE {d}
          </button>
        )}

        <div style={{ marginTop: "20px" }}>
          <span
            style={{ paddingLeft: "10px", textAlign: "left", float: "left", width: "33%", display: "inline-block" }}
          >
            Token →{" "}
            <Address
              style={{ marginTop: "2px", position: "relative" }}
              address={currencyAddress}
              ensProvider={props.mainnetProvider}
              blockExplorer={props.blockExplorer}
            />
            <a
              style={{ fontStyle: "italic", marginTop: "0px", position: "absolute" }}
              onClick={() => handleTokenAdd(d)}
            >
              add
            </a>
          </span>
          <span
            style={{
              visibility: action == "deposit" ? "visible" : "hidden",
              marginTop: "2px",
              paddingLeft: "10px",
              textAlign: "center",
              width: "33%",
              display: "inline-block",
            }}
          >
            {selectedLendingProvider && selectedLendingProvider.apy
              ? "Lender APY → " + (selectedLendingProvider.apy * 100).toFixed(2) + "%"
              : ""}
          </span>
          <span
            style={{ paddingRight: "10px", textAlign: "right", float: "right", width: "33%", display: "inline-block" }}
          >
            Charity →{" "}
            <Address
              style={{ marginTop: "2px", position: "relative" }}
              address={charityInfo[`CharityPool Contract`]}
              ensProvider={props.mainnetProvider}
              blockExplorer={props.blockExplorer}
            />
          </span>
        </div>
      </TabPane>
    );
  });

  if (Object.keys(supportedCurrencyDetails).length > 0 && selectedLendingProvider == null && currentCurrencyTab) {
    setselectedLendingProvider({
      provider: supportedCurrencyDetails[currentCurrencyTab][0].provider,
      lendingAddress: supportedCurrencyDetails[currentCurrencyTab][0].lendingAddress,
      apr: supportedCurrencyDetails[currentCurrencyTab][0].apr / 1e18,
      apy: (1 + supportedCurrencyDetails[currentCurrencyTab][0].apr / 1e18 / 365) ** 365 - 1,
    });
  }

  // console.log(init,currencies,charityInfo,contractNameHash)

  useEffect(() => {
    // console.log('init',init)

    if (props && props.readContracts && charityInfo && contractNameHash != null && init == false) {
      const contractName = contractNameHash[charityInfo[`CharityPool Contract`]];

      console.log("contractName", contractName);

      if (contractName != undefined) {
        setInit(true);

        const contractsToListen = ["iHelp"];
        console.log("contractsToListen", contractsToListen);
        const listener = (blockNumber, contract) => {
          if (contract != undefined) {
            console.log("UPDATING CONTRACTS");
            //console.log(contract, blockNumber); // , fn, args, provider.listeners()
            updateContracts(contract);
          }
        };

        contractsToListen.map(c => {
          // not the most efficient because this will update on each block
          props.readContracts[c].provider.removeAllListeners("block");
          props.readContracts[c].provider.on("block", block => {
            listener(block, c);
          });
        });

        updateContracts("init");
      }
    }
  }, [currencies, props.readContracts, contractNameHash, charityInfo]);

  let depositEnabled = false;
  let withdrawEnabled = false;

  currencies.map(c => {
    try {
      if (currencyBalances[c] > 0) {
        depositEnabled = true;
      }
    } catch (e) {}
    try {
      if (withdrawEnabledLookup[c] == true) {
        withdrawEnabled = true;
      }
    } catch (e) {}
  });
  // console.log('depositEnabled',depositEnabled)
  // console.log('withdrawEnabled',withdrawEnabled)

  const [currentTab, setCurrentTab] = useState("tab1");
  const tabList = [
    {
      name: "tab1",
      label: "General",
      content: <General charityInfo={charityInfo} />,
    },
    {
      name: "tab2",
      label: "Details",
      content: <Details charityInfo={charityInfo} />,
    },
    {
      name: "tab3",
      label: "Financials",
      content: <Financials charityInfo={charityInfo} />,
    },
    {
      name: "tab5",
      label: "Transactions",
      content: (
        <Transactions
          charityInfo={charityInfo}
          eventsByCharity={eventsByCharity}
          mainnetProvider={props.mainnetProvider}
          blockExplorer={props.blockExplorer}
          charityDecimals={charityDecimals}
          st={st}
        />
      ),
    },
    {
      name: "tab4",
      label: "Videos",
      content: <Videos charityInfo={charityInfo} />,
    },
  ];

  // if (selectedLendingProvider) {
  //   console.log('selectedLendingProvider',selectedLendingProvider)
  // }

  return (
    <div id="app" className="app">
      {/*<Head>
        <title>iHelp | Charity</title>
      </Head>
      <img src="/assets/bgc.svg" alt="Bgc" className="body-bgc" />*/}

      <Header {...props} />

      {showDepositInterest || showDepositDirect || showWithdrawInterest ? (
        <div id="deposit_withdraw_modal">
          <div className={st.lightbox} offset="0" opacity="0.4" onClick={handleModalClick}>
            <div className={st.container}>
              <div className={st.hitbox}></div>
              <div className={"charityCard"}>
                <div className={st.wrapper}>
                  <div className={"providercontainer"}>
                    <div className={st.icon}></div>
                    <div className={"charityName"}>
                      {showDepositInterest
                        ? `Donate Interest to ${charityInfo["Organization Name"]}`
                        : showWithdrawInterest
                        ? `Withdraw Principal from ${charityInfo["Organization Name"]}`
                        : showDepositDirect
                        ? `Direct Donation to ${charityInfo["Organization Name"]}`
                        : ""}
                    </div>
                    <div className={st.description}>
                      {showDepositInterest
                        ? `This donation will only contribute your currency and specifically donate the interest generated over time. You can return your contribution at any time.`
                        : showWithdrawInterest
                        ? `This will withdraw your currency contribution principal balance.`
                        : showDepositDirect
                        ? `This form of donation will be a simple currency transfer to the charity. These donated funds are not reclaimable.`
                        : ""}
                    </div>
                    <Tabs style={{ width: "100%" }} onChange={handleCurrencyChange}>
                      {currencyTabs}
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {charityInfo && infoItems ? (
        <div className={st.charity + " " + "section"}>
          <div className="box">
            <div className="kseItem">
              <div className="banner">
                {infoItems.map((item, index) => {
                  return (
                    <div className="infoItem" key={index}>
                      <h3>{item.value}</h3>
                      <p>{item.name}</p>
                    </div>
                  );
                })}
              </div>

              <div className="charityButtonsGrid" style={{ marginTop: "-36px", marginBottom: "36px" }}>
                <main>
                  <h2 style={{ textAlign: "center" }}>Donate Interest</h2>
                  <div className={st.charityBtnGrd} style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
                    <button
                      disabled={
                        props.web3Modal && (props.web3Modal.cachedProvider || props.web3Modal.safe) && depositEnabled
                          ? false
                          : true
                      }
                      className="grd-btn"
                      onClick={e => setShowDepositInterest(true)}
                    >
                      Deposit
                    </button>
                    <button
                      disabled={
                        props.web3Modal && (props.web3Modal.cachedProvider || props.web3Modal.safe) && withdrawEnabled
                          ? false
                          : true
                      }
                      className="grd-btn"
                      onClick={e => setShowWithdrawInterest(true)}
                    >
                      Withdraw
                    </button>
                  </div>
                </main>
                <main>
                  <h2 style={{ textAlign: "center" }}>Donate Principal</h2>
                  <div className={st.charityBtnGrd}>
                    <button
                      disabled={
                        props.web3Modal && (props.web3Modal.cachedProvider || props.web3Modal.safe) && depositEnabled
                          ? false
                          : true
                      }
                      className="grd-btn"
                      onClick={e => setShowDepositDirect(true)}
                    >
                      Direct Donate
                    </button>
                  </div>
                </main>
              </div>

              <div className="tabs">
                {tabList.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTab(tab.name)}
                    className={tab.name === currentTab ? "active" : ""}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              {tabList.map((tab, i) => {
                if (tab.name === currentTab) {
                  return <div key={i}>{tab.content}</div>;
                } else {
                  return null;
                }
              })}

              <div style={{ height: "50px" }}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mainLoader">
          <Spin />
        </div>
      )}

      <Footer {...props} />
    </div>
  );
};

export default ContributeNew;
