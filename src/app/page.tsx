"use client";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import { ethers } from "ethers";
import { formatEther, parseEther } from "@ethersproject/units";
import { useEffect, useState } from "react";

const [metaMask, hooks] = initializeConnector(
  (action) => new MetaMask({ actions: action })
);
const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider } =
  hooks;

export default function Home() {
  const contractChain = 11155111;
  const contractAddress = "0x5a1301d99489931059f5e89138edfec7fe52648b";

  const chainId = useChainId();
  const accounts = useAccounts();
  const isActivating = useIsActivating();
  const isActive = useIsActive();
  const provider = useProvider();

  // const[balance,]
  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };

  return (
    <div>
      <p>chainId: {chainId}</p>
      <p>isActive: {isActive.toString()}</p>
      <p>accounts: {accounts ? accounts : ""}</p>
      {isActive ? (
        <input
          type="button"
          onClick={handleDisconnect}
          className="bg-neutral-300 p-2"
          value={"Disconnect"}
        />
      ) : (
        <input
          type="button"
          onClick={handleConnect}
          className="bg-green-500 p-2"
          value={"Connect"}
        />
      )}
    </div>
  );
}
