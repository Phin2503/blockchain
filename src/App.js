import { useState, useEffect } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import "bulma/css/bulma.min.css";
import contractABI from './ABIContract.json';

const contractAddress = "0x0D67B91eCaB8e9C6582Fc7b15050cC96a1a3D6F7";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
  });

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const handleWithdraw = async () => {
    try {
      if (web3Api.web3 && account) {
        const contract = new web3Api.web3.eth.Contract(contractABI.abi, contractAddress);
        const amountInEth = 1;
        const amountInWei = web3Api.web3.utils.toWei(String(amountInEth), 'ether');
        const gasAmount = await contract.methods.withdraw(amountInWei).estimateGas({ from: account });
        await contract.methods.withdraw(amountInWei).send({ from: account, gas: gasAmount });

        await loadBalance();
      }
    } catch (error) {
      console.error(error);
    }
  };

 

  const loadBalance = async () => {
    if (web3Api.web3 && account) {
      const balance = await web3Api.web3.eth.getBalance(account);
      const etherBalance = web3Api.web3.utils.fromWei(balance, "ether");
      setBalance(etherBalance);
    }
  };

  const connectWallet = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
        });
      } else {
        console.error("Please install MetaMask.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      if (web3Api.web3) {
        const accounts = await web3Api.web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          console.error("Error while getting accounts or accounts is empty.");
        }
      }
    };

    getAccount();
  }, [web3Api.web3]);

  useEffect(() => {
    loadBalance();
  }, [web3Api.web3, account]);

  return (
    <div className="wrapper">
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="balance-view is-size-2">
            Current balance:{" "}
            <strong>
              {balance !== null ? `${balance} ether` : "Loading..."}
            </strong>
          </div>
          <button className="button" onClick={handleWithdraw}>
            Withdraw
          </button>
         
          <button
            className="button is-success ml-5"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          <div className="adress-ac">
            <p>
              <strong className="text-address">Account Address:</strong>{" "}
              {account ? account : "Account Denied"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;