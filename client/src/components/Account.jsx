import { Button } from "antd";
import React from "react";
import { useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { FaWallet } from "react-icons/fa";

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

  <Account
    address={address}
    localProvider={localProvider}
    userProvider={userProvider}
    mainnetProvider={mainnetProvider}
    price={price}
    web3Modal={web3Modal}
    loadWeb3Modal={loadWeb3Modal}
    logoutOfWeb3Modal={logoutOfWeb3Modal}
    blockExplorer={blockExplorer}
    burner={useBurner}
    isContract={isContract}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide the bool for whether or not to use the burner wallet/account
  - Provide is the account component being used for a contract?
*/

export default function Account({
  address,
  userSigner,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
  isContract,
  burner,
  setButton,
  button,
}) {
  const modalButtons = [];

  let isInIframe = false;

  if (web3Modal) {
    // console.log('web3Modal',web3Modal)
    // console.log('cachedProvider',web3Modal.cachedProvider)

    if (web3Modal.cachedProvider || web3Modal.safe) {
      // web3Modal.isSafeApp().then((d)=>{console.log(d)})

      if (window?.parent === window) {
        isInIframe = false;
      } else {
        isInIframe = true;
      }

      if (isInIframe == false) {
        modalButtons.push(
          <button
            key="logoutbutton"
            //style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
            className="grd-btn"
            // shape="round"
            // size="large"
            onClick={logoutOfWeb3Modal}
          >
            LOGOUT
          </button>,
        );
      } else {
        modalButtons.push("");
      }
    } else {
      modalButtons.push(
        <button
          key="loginbutton"
          //style={{ verticalAlign: "top", marginLeft: 8, marginTop: 4 }}
          className={button === "wallet" ? "grd-btn-focus" : "grd-btn"}
          // shape="round"
          // size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={() => {
            loadWeb3Modal();
            setButton("wallet");
          }}
        >
          CONNECT WALLET
          {button === "wallet" ? (
            <img src="/assets/icons/wallet 0.2.svg" alt="wallet" />
          ) : (
            <FaWallet size="16px" style={{ marginLeft: "17px" }} />
          )}
        </button>,
      );
    }
  }

  const { currentTheme } = useThemeSwitcher();

  function isValidAddress(address) {
    return address && address !== "0x0000000000000000000000000000000000000000";
  }

  //console.log('address',address)

  const display = minimized ? (
    <span className={"addressHeader"}>
      {web3Modal && (web3Modal.cachedProvider || web3Modal.safe) ? (
        <Address
          address={address}
          size={isInIframe == false ? "short" : "long"}
          ensProvider={mainnetProvider}
          minimized={true}
          blockExplorer={blockExplorer}
        />
      ) : (
        ""
      )}
    </span>
  ) : (
    <span>
      {web3Modal && (web3Modal.cachedProvider || web3Modal.safe) ? (
        <span className={"addressHeader"}>
          <Address
            address={address}
            size={isInIframe == false ? "short" : "long"}
            ensProvider={mainnetProvider}
            blockExplorer={blockExplorer}
          />
          {/* <Balance address={address} provider={localProvider} price={price} />
          <Wallet
            address={address}
            provider={localProvider}
            signer={userSigner}
            ensProvider={mainnetProvider}
            price={price}
            color={currentTheme === "light" ? "#1890ff" : "#2caad9"}
          />*/}
        </span>
      ) : burner ? (
        ""
      ) : (
        ""
      )}
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
}
