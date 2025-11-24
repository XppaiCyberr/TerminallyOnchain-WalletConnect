"use client";

import { useAccount } from "wagmi";
import type { Abi } from "viem";
import GmNetworkCard from "./GmNetworkCard";

// Contract addresses for different networks
const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  8453: "0xFbA531cD5CE42CA4e4F6e30cFBcF3Db2556121B9", // Base
  1: "0x6446D1c1629aF33378210fe5fefA7AC8f316F070", // Ethereum
  10: "0x701b2c96BD7695dFcD933d382B028E934DFd9D9a", // Optimism
  42161: "0xE2278AD2De00B570CD6AdED056e57FF4E6F18Efc", // Arbitrum
};

const getContractAddress = (chainId: number | undefined): `0x${string}` | undefined => {
  if (!chainId) return undefined;
  return CONTRACT_ADDRESSES[chainId];
};

const NETWORKS = [
  { id: 8453, name: "Base", contractAddress: CONTRACT_ADDRESSES[8453] },
  { id: 1, name: "Ethereum", contractAddress: CONTRACT_ADDRESSES[1] },
  { id: 10, name: "Optimism", contractAddress: CONTRACT_ADDRESSES[10] },
  { id: 42161, name: "Arbitrum", contractAddress: CONTRACT_ADDRESSES[42161] },
];

const CONTRACT_ABI: Abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "countForUser",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dayNumber",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "streakForUser",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePaid",
        type: "uint256",
      },
    ],
    name: "GmSent",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "FEE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "canGm",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gm",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "message",
        type: "string",
      },
    ],
    name: "gm",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "gmCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "gmStreak",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lastGmDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalGm",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
    ],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

export default function GmTool() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-emerald-500/20">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <span className="text-emerald-400 font-mono text-lg sm:text-xl">$</span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">gm_protocol</h2>
        </div>
        <div className="bg-black/50 border border-emerald-500/30 rounded p-3 sm:p-4 font-mono text-xs sm:text-sm">
          <p className="text-zinc-400">
            <span className="text-emerald-500">{'>'}</span> Wallet connection required
          </p>
          <p className="text-zinc-500 mt-2 ml-4 text-xs sm:text-sm">
            Please connect your wallet to access the GM protocol.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 md:p-8 border border-emerald-500/20">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-emerald-400 font-mono text-lg sm:text-xl">$</span>
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono break-all">gm_protocol.execute()</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {NETWORKS.map((network) => (
          <GmNetworkCard
            key={network.id}
            networkId={network.id}
            networkName={network.name}
            contractAddress={network.contractAddress}
            contractAbi={CONTRACT_ABI}
          />
        ))}
      </div>
    </div>
  );
}

