"use client";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getContract } from "../config";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [currentData, setcurrentData] = useState("");

  const [processingFunds, setProcessingFunds] = useState(false);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletKey(accounts[0]);
  };

  // Manok Minting
  const [mintingAmount, setMintingAmount] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting Failed: ${decodedError?.args}`);
    }
  };

  const mintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setMintingAmount(0);
    }
  };

  //Hen House Staking
  const [stakingAmount, setStakingAmount] = useState<number>();
  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakingAmount);
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking Failed: ${decodedError?.args}`);
    }
  };

  const stakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
      console.log(inputValue);
    } else {
      setStakingAmount(0);
    }
  };

  //The Big Coop Withdraw
  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      setProcessingFunds(true);
      const tx = await contract.withdraw();
      await tx.wait();
      setSubmitted(true);
      setTransactionHash(tx.hash);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Withdrawal Failed: ${decodedError?.args}`);
    } finally {
      setProcessingFunds(false);
    }
  };

  //Import Token
  const importToken = async () => {
    const { ethereum } = window as any;
    const tokenAddress = "0x13dab8d8F442C4aC5E5E3CDC1F36dFe49627c5df";
    const tokenSymbol = "MANOK";
    const tokenDecimal = 18;
    const tokenImage = "https://w7.pngwing.com/pngs/926/827/png-transparent-chicken-rooster-drawing-gamecock-chicken-animals-chicken-galliformes-thumbnail.png";

    try {
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimal,
            image: tokenImage,
          },
        },
      });
      console.log("Token Added Successfully:", wasAdded);
    } catch (error) {
      console.error("Error adding token:", error);
      alert("Failed to add the token. Please try again.");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(to bottom, rgba(0, 0, 128, 0.8) 0%, rgba(0, 0, 128, 1) 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ position: 'absolute', top: 130, right: 750 }}>
        <Image src="https://img.freepik.com/premium-photo/cute-round-thai-chicken-fiery-emblem-our-restaurant_983420-11635.jpg" alt="Token Image" width={50} height={50} />
      </div>
      <h1 style={{ color: "red", fontSize: "36px" }}>
        Cock-a-doodle-doo! It&apos;s Time for a{" "}
        <span style={{ color: "yellow" }}>Featherweight Fight</span>
      </h1>
      <div style={{ minHeight: "15vh" }}>
        <button
          onClick={() => {
            connectWallet();
          }}
          className="p-3 bg-green-500 text-white rounded"
          style={{ marginRight: "10px" }}
        >
          {walletKey !== "" ? `${walletKey} (Connected)` : "Enter the Coop"}
        </button>
        <button
          onClick={importToken}
          className="p-3 bg-red-500 text-white rounded"
        >
          Sharpen Your Claws (Add MANOK To Metamask)
        </button>
      </div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Image
          src="https://t3.ftcdn.net/jpg/05/69/02/32/360_F_569023216_r2YOh0ILJSoL4Wsjrv2RqJal61SW20x4.jpg"
          alt="Jupiter Logo"
          width={520}
          height={128}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <br />
        <form>
          <label style={{ color: "white", fontSize: "18px" }}>
            {" "}
            Place Your Bet (Amount to Mint)
          </label>
          <br />
        </form>
        <input
          type="number"
          value={mintingAmount}
          onChange={(e) => mintAmountChange(e)}
          style={{ color: "black" }}
        />
        <button
          onClick={() => {
            mintCoin();
          }}
          className="p-3 bg-green-500 text-white rounded"
        >
          {" "}
          Mint CHICKEN{" "}
        </button>
      </div>

      <br />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <form>
          <label style={{ color: "white", fontSize: "18px" }}>
            {" "}
            Train Your Fighters (Amount to Stake)
          </label>
          <br />
        </form>
        <input
          type="number"
          value={stakingAmount}
          onChange={(e) => stakeAmountChange(e)}
          style={{ color: "black" }}
        />
        <button
          onClick={stakeCoin}
          className="p-3 bg-red-500 text-white rounded"
        >
          {" "}
          Stake CHICKEN{" "}
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {processingFunds ? (
          <label style={{ color: "white", fontSize: "16px" }}>
            Please wait while processing your funds.
            <br />
            ETA: 1 Minute
          </label>
        ) : (
          <button
            onClick={withdrawCoin}
            className="p-3 bg-green-500 text-white rounded"
          >
            Collect Your Winnings (Withdraw Staked Chicken + Rewards)
          </button>
        )}
      </div>
      <p style={{ color: "white", fontSize: "14px", marginTop: "20px" }}>
        A Revolutionary Shit Coin That Will Hatch Money For You. It&apos;s all a game of CHICKEN at the end of the day.
      </p>
    </main>
  );
}