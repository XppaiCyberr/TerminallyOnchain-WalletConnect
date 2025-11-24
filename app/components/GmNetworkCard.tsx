"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { formatEther } from "viem";
import type { Abi } from "viem";
import confetti from "canvas-confetti";

interface GmNetworkCardProps {
  networkId: number;
  networkName: string;
  contractAddress: `0x${string}`;
  contractAbi: Abi;
}

export default function GmNetworkCard({ networkId, networkName, contractAddress, contractAbi }: GmNetworkCardProps) {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isOnThisNetwork = chainId === networkId;
  const canInteract = isConnected && isOnThisNetwork;

  // Read contract data
  const { data: fee, isLoading: isLoadingFee, refetch: refetchFee } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "FEE",
    chainId: networkId,
    query: { enabled: true }, // Always enabled to show data even if not on this network
  });

  const { data: totalGm, isLoading: isLoadingTotal, refetch: refetchTotalGm } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "totalGm",
    chainId: networkId,
    query: { enabled: true },
  });

  const { data: gmCount, isLoading: isLoadingCount, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "gmCount",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { enabled: !!address },
  });

  const { data: gmStreak, isLoading: isLoadingStreak, refetch: refetchStreak } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "gmStreak",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { enabled: !!address },
  });

  const { data: lastGmDay, isLoading: isLoadingLastDay, refetch: refetchLastDay } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "lastGmDay",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { enabled: !!address },
  });

  const { data: canGm, isLoading: isLoadingCanGm, refetch: refetchCanGm } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "canGm",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { enabled: !!address },
  });

  // Write contract
  const { writeContract, data: hash, isPending: isSending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success and refresh stats
  useEffect(() => {
    if (isConfirmed) {
      setSuccess("GM sent successfully! 🎉");
      setMessage("");
      
      // Trigger confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Launch confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      
      // Refresh all stats after successful transaction
      if (address) {
        refetchCount();
        refetchStreak();
        refetchLastDay();
        refetchCanGm();
      }
      
      refetchTotalGm();
      
      // Invalidate all contract queries
      queryClient.invalidateQueries({
        queryKey: [{ entity: 'readContract', address: contractAddress, chainId: networkId }],
      });

      // Cleanup interval on unmount
      return () => {
        clearInterval(interval);
      };
    }
  }, [isConfirmed, address, refetchCount, refetchStreak, refetchLastDay, refetchCanGm, refetchTotalGm, queryClient, contractAddress, networkId]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || "Failed to send GM");
    }
  }, [writeError]);

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: networkId });
    }
  };

  const sendGm = () => {
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    if (!isOnThisNetwork) {
      setError(`Please switch to ${networkName} network first`);
      return;
    }

    if (!fee) {
      setError("Fee not loaded yet");
      return;
    }

    setError(null);
    setSuccess("Transaction sent! Waiting for confirmation...");

    if (message.trim()) {
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "gm",
        args: [message.trim()],
        value: fee as bigint,
      });
    } else {
      writeContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "gm",
        args: [],
        value: fee as bigint,
      });
    }
  };

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-5 border ${
      isOnThisNetwork 
        ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10" 
        : "border-emerald-500/20"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-mono">{'>'}</span>
          <h3 className="text-lg font-bold text-emerald-400 font-mono">
            {networkName.toLowerCase()}.gm
          </h3>
        </div>
        {!isOnThisNetwork && isConnected && (
          <button
            onClick={handleSwitchNetwork}
            className="px-3 py-1 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 font-mono rounded transition-all"
          >
            switch
          </button>
        )}
        {isOnThisNetwork && (
          <span className="px-3 py-1 text-xs bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-mono rounded flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            active
          </span>
        )}
      </div>

      {/* Contract Info */}
      <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded font-mono text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-zinc-500">fee:</span>
            <span className="text-emerald-400">
              {isLoadingFee ? "loading..." : fee ? `${formatEther(fee as bigint)} ETH` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">total_gms:</span>
            <span className="text-emerald-400">
              {isLoadingTotal ? "loading..." : totalGm ? totalGm.toString() : "N/A"}
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[10px] text-zinc-600 break-all">
          {contractAddress}
        </div>
      </div>

      {/* User Stats */}
      {address && (
        <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400 font-mono text-xs">$</span>
            <h4 className="font-mono text-emerald-400 text-xs">stats.user</h4>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <div className="text-zinc-500 text-[10px]">count</div>
              <div className="text-emerald-400 font-semibold">
                {isLoadingCount ? "..." : gmCount ? gmCount.toString() : "0"}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">streak</div>
              <div className="text-emerald-400 font-semibold">
                {isLoadingStreak ? "..." : gmStreak ? `${gmStreak.toString()}d` : "0d"}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-[10px]">ready</div>
              <div className={`font-semibold ${canGm ? "text-emerald-400" : "text-red-400"}`}>
                {isLoadingCanGm ? "..." : canGm ? "yes" : "no"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send GM Form */}
      {!isConnected ? (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded font-mono text-xs text-center text-yellow-400">
          <span className="text-yellow-500">⚠</span> wallet.connect() required
        </div>
      ) : !isOnThisNetwork ? (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded font-mono text-xs text-center text-blue-400">
          <span className="text-blue-500">→</span> switch to {networkName.toLowerCase()}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label htmlFor={`message-${networkId}`} className="block text-xs font-mono text-zinc-500 mb-1.5">
              msg.content <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              id={`message-${networkId}`}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="gm anon..."
              className="w-full px-3 py-2 text-sm font-mono border border-emerald-500/30 rounded bg-black/50 text-emerald-400 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
              disabled={isSending || isConfirming}
            />
          </div>

          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded font-mono text-xs text-red-400">
              <span className="text-red-500">✗</span> {error}
            </div>
          )}

          {success && (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded font-mono text-xs text-emerald-400">
              <span className="text-emerald-500">✓</span> {success}
            </div>
          )}

          <button
            onClick={sendGm}
            disabled={isSending || isConfirming || isLoadingFee || (canGm === false)}
            className="w-full px-4 py-2.5 text-sm bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 hover:border-emerald-500 disabled:bg-zinc-800/50 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-600 text-emerald-400 font-mono rounded transition-all"
          >
            {isConfirming
              ? "⏳ confirming..."
              : isSending
              ? "📡 sending..."
              : isLoadingFee
              ? "⌛ loading..."
              : canGm === false
              ? "⏸ cooldown active"
              : fee
              ? `./gm.sh (${formatEther(fee as bigint)} ETH)`
              : "./gm.sh"}
          </button>
        </div>
      )}
    </div>
  );
}

