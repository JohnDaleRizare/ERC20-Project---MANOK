"use client";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import { useState } from "react";
import { getContract } from "../config";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [mintingAmount, setMintingAmount] = useState<number>();
  const [stakingAmount, setStakingAmount] = useState<number>();
  const [processingFunds, setProcessingFunds] = useState(false);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletKey(accounts[0]);
  };

  const mintCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.mint(signer, mintingAmount);
      await tx.wait();
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting Failed: ${decodedError?.args}`);
    }
  };

  const mintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
    } else {
      setMintingAmount(0);
    }
  };

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      const tx = await contract.stake(stakingAmount);
      await tx.wait();
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking Failed: ${decodedError?.args}`);
    }
  };

  const stakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
    } else {
      setStakingAmount(0);
    }
  };

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);
    try {
      setProcessingFunds(true);
      const tx = await contract.withdraw();
      await tx.wait();
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Withdrawal Failed: ${decodedError?.args}`);
    } finally {
      setProcessingFunds(false);
    }
  };

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
      console.log("Token is Added:", wasAdded);
    } catch (error) {
      console.error("Error", error);
      alert("Failed to add the token. Please try again.");
    }
  };

  return (
    <main
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-photo/aguascalientes-mexico-march-27-2018-600nw-1333340810.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div className={styles.roundedImage}>
        <Image
          src="https://img.freepik.com/premium-photo/cute-round-thai-chicken-fiery-emblem-our-restaurant_983420-11635.jpg"
          alt="Token Image"
          width={100}
          height={100}
        />
      </div>
      <h1 className="text-red-500 text-4xl font-bold">
          Cock-a-doodle-doo! It&apos;s Time for a{" "}
          <span className="text-yellow-500">Featherweight Fight!</span>
        </h1>
      <div style={{ minHeight: "10vh" }}>
        <button
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(120%)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
          onClick={() => connectWallet()}
          className="p-3 bg-green-500 text-white rounded mr-4 mb-4"
        >
          {walletKey !== "" ? `${walletKey} (Connected)` : "Enter the Arena"}
        </button>
        <button
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(120%)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
          onClick={importToken}
          className="p-3 bg-red-500 text-white rounded"
        >
          Sharpen Your Claws (Add MANOK To Metamask)
        </button>
      </div>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div className={styles.roundedImage}>
          <Image
            src="https://t3.ftcdn.net/jpg/05/69/02/32/360_F_569023216_r2YOh0ILJSoL4Wsjrv2RqJal61SW20x4.jpg"
            alt="Sabong"
            width={520}
            height={128}
          />
        </div>
      </div>
      <div className="flex justify-center items-center flex-col p-4">
        <label className="text-white text-lg">Place Your Bet (Amount to Mint)</label>
        <input
          type="number"
          value={mintingAmount}
          onChange={(e) => mintAmountChange(e)}
          className="border-2 border-gray-300 p-2 rounded-lg mt-2"
        />
        <input
          type="range"
          min={0}
          max={500}
          value={mintingAmount}
          onChange={(e) => mintAmountChange(e)}
          className="mt-2"
        />
        <button
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(120%)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
          onClick={() => mintCoin()}
          className="p-3 bg-green-500 text-white rounded mt-2"
        >
          Mint CHICKEN
        </button>
      </div>
      <div className="flex justify-center items-center flex-col p-4">
        <label className="text-white text-lg">Train Your Fighters (Amount to Stake)</label>
        <input
          type="number"
          value={stakingAmount}
          onChange={(e) => stakeAmountChange(e)}
          className="border-2 border-gray-300 p-2 rounded-lg mt-2"
        />
        <input
          type="range"
          min={0}
          max={500}
          value={stakingAmount}
          onChange={(e) => stakeAmountChange(e)}
          className="mt-2"
        />
        <button
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(120%)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
          onClick={() => stakeCoin()}
          className="p-3 bg-red-500 text-white rounded mt-2"
        >
          Stake CHICKEN
        </button>
      </div>
      <div className="flex justify-center items-center flex-col p-4">
        {processingFunds ? (
          <label className="text-white text-lg">
            Please wait while processing your funds.
            <br />
            ETA: 1 Minute
          </label>
        ) : (
          <button
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(120%)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
            onClick={() => withdrawCoin()}
            className="p-3 bg-green-500 text-white rounded"
          >
            Collect Your Winnings (Withdraw Staked Chicken + Rewards)
          </button>
        )}
      </div>
      <p className="text-white text-lg mt-4">
        A Revolutionary Shit Coin That Will Hatch Money For You. It&apos;s all a game of CHICKEN at the end of the day.
      </p>
    </main>
  );
}