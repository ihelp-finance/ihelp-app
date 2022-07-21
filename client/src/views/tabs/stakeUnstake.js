import React, {useState,useRef} from 'react'

  import { utils } from "ethers";
  
export function StakeUnstake(propsraw) {
     
     const props = propsraw.props;
     const ihelpBalance = propsraw.ihelpBalance;
     const xhelpBalance = propsraw.xhelpBalance;

      const useFocus = () => {
    const htmlElRef = useRef(null)
    const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}

    return [ htmlElRef, setFocus ] 
}

     const [amount, setAmount] = useState('');
     const [inputRef, setInputFocus] = useFocus()


  let stakeEnabled = false;
  if (  ihelpBalance > 0 && amount != '' && parseFloat(amount) > 0 && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(ihelpBalance,18)) * 1000000) / 1000000) {
    stakeEnabled = true;
  }
  
  let unstakeEnabled = false;
  if (  xhelpBalance > 0 && amount != '' && parseFloat(amount) > 0 && parseFloat(amount) <= Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000) {
    unstakeEnabled = true;
  }

     const handleUnstake = async() => {
    
    console.log('unstaking',amount,'HELP tokens to xHELP staking contract:',props.readContracts.xHelp.address)
    const unstakeAmountWei = utils.parseEther(amount).toString(10);
    
    setAmount('');
    
      const sponsorTx = props.tx(props.writeContracts.xHelp.withdraw(unstakeAmountWei), update => {
     
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
      });
      console.log("awaiting metamask/web3 confirm result...", sponsorTx);
      console.log(await sponsorTx);
      
  }
  
    return (

        <div className='stake'>
            <div className='approve'>
                <input  autoFocus type="number" value={amount} ref={inputRef} placeholder={`0 xHELP`} onChange={(e)=>{setAmount(e.target.value)}}/>
                <button  className="max-button" onClick={(e)=>{setAmount((Math.floor(parseFloat(utils.formatUnits(xhelpBalance,18)) * 1000000) / 1000000).toFixed(6))}}>MAX</button>
                <button disabled={props.web3Modal && props.web3Modal.cachedProvider && unstakeEnabled ? false : true} onClick={handleUnstake}>UNSTAKE</button>
            </div>
        </div>
    )
}
