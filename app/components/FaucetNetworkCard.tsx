"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { formatEther } from "viem";
import type { Abi } from "viem";

interface FaucetNetworkCardProps {
  networkId: number;
  networkName: string;
  contractAddress: `0x${string}`;
  contractAbi: Abi;
}

export default function FaucetNetworkCard({ networkId, networkName, contractAddress, contractAbi }: FaucetNetworkCardProps) {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isOnThisNetwork = chainId === networkId;
  const canInteract = isConnected && isOnThisNetwork;

  // Read contract data
  const { data: withdrawalAmount, isLoading: isLoadingAmount, refetch: refetchAmount } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "WITHDRAWAL_AMOUNT",
    chainId: networkId,
    query: { enabled: true },
  });

  const { data: lockTime, isLoading: isLoadingLockTime, refetch: refetchLockTime } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "lockTime",
    chainId: networkId,
    query: { enabled: true },
  });

  const { data: faucetBalance, isLoading: isLoadingBalance, refetch: refetchBalance } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getBalance",
    chainId: networkId,
    query: { 
      enabled: true,
      staleTime: 0,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  const { data: canWithdraw, isLoading: isLoadingCanWithdraw, refetch: refetchCanWithdraw } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "canWithdraw",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { 
      enabled: !!address,
      staleTime: 0,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  });

  const { data: timeUntilNext, isLoading: isLoadingTimeUntil, refetch: refetchTimeUntil } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "timeUntilNextWithdrawal",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { 
      enabled: !!address,
      staleTime: 0,
      refetchInterval: 5000,
    },
  });

  const { data: lastWithdrawalTime, isLoading: isLoadingLastWithdrawal, refetch: refetchLastWithdrawal } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "lastWithdrawalTime",
    args: address ? [address] : undefined,
    chainId: networkId,
    query: { 
      enabled: !!address,
      staleTime: 0,
    },
  });

  // Write contract
  const { writeContract, data: hash, isPending: isSending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction being sent
  useEffect(() => {
    if (isSending) {
      setSuccess("📡 Sending transaction...");
      setError(null);
    }
  }, [isSending]);

  // Handle transaction confirming
  useEffect(() => {
    if (isConfirming && !isSending) {
      setSuccess("⏳ Waiting for confirmation...");
      setError(null);
    }
  }, [isConfirming, isSending]);

  // Handle transaction success and refresh stats
  useEffect(() => {
    if (isConfirmed) {
      setSuccess("✅ ETH requested successfully! 💧");
      setError(null);
      
      // Clear success message after 8 seconds
      const successTimer = setTimeout(() => {
        setSuccess(null);
      }, 8000);
      
      // Wait a bit for blockchain state to update, then refetch
      const refetchTimer = setTimeout(() => {
        // Invalidate all contract queries first
        queryClient.invalidateQueries({
          queryKey: [{ entity: 'readContract', address: contractAddress, chainId: networkId }],
        });
        
        // Then manually refetch all stats
        if (address) {
          refetchCanWithdraw();
          refetchTimeUntil();
          refetchLastWithdrawal();
        }
        
        refetchBalance();
      }, 2000); // Wait 2 seconds before refetching to ensure blockchain state is updated

      return () => {
        clearTimeout(successTimer);
        clearTimeout(refetchTimer);
      };
    }
  }, [isConfirmed, address, refetchCanWithdraw, refetchTimeUntil, refetchLastWithdrawal, refetchBalance, queryClient, contractAddress, networkId]);

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || "Failed to request ETH");
      setSuccess(null);
    }
  }, [writeError]);

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: networkId });
    }
  };

  const requestETH = () => {
    if (!address) {
      setError("Please connect your wallet first");
      setSuccess(null);
      return;
    }

    if (!isOnThisNetwork) {
      setError(`Please switch to ${networkName} network first`);
      setSuccess(null);
      return;
    }

    if (canWithdraw === false) {
      setError("You must wait until the cooldown period is over");
      setSuccess(null);
      return;
    }

    setError(null);
    setSuccess(null);

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "requestETH",
      args: [],
    });
  };

  // Format time remaining
  const formatTimeRemaining = (seconds: bigint | undefined): string => {
    if (!seconds) return "0s";
    const totalSeconds = Number(seconds);
    if (totalSeconds === 0) return "Ready!";
    
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  // Format lock time
  const formatLockTime = (seconds: bigint | undefined): string => {
    if (!seconds) return "N/A";
    const totalSeconds = Number(seconds);
    
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return `${totalSeconds}s`;
  };

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-3 sm:p-4 md:p-5 border ${
      isOnThisNetwork 
        ? "border-blue-500/50 shadow-lg shadow-blue-500/10" 
        : "border-blue-500/20"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <span className="text-blue-400 font-mono text-sm sm:text-base shrink-0">💧</span>
          <h3 className="text-base sm:text-lg font-bold text-blue-400 font-mono truncate">
            {networkName.toLowerCase()}.faucet
          </h3>
        </div>
        {!isOnThisNetwork && isConnected && (
          <button
            onClick={handleSwitchNetwork}
            className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/40 border border-blue-500/50 text-blue-400 font-mono rounded transition-all shrink-0 touch-manipulation"
          >
            switch
          </button>
        )}
        {isOnThisNetwork && (
          <span className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-blue-500/20 border border-blue-500/50 text-blue-400 font-mono rounded flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            active
          </span>
        )}
      </div>

      {/* Contract Info */}
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-500/5 border border-blue-500/20 rounded font-mono text-[10px] sm:text-xs">
        <div className="space-y-1 sm:space-y-1.5">
          <div className="flex justify-between gap-2">
            <span className="text-zinc-500 shrink-0">withdrawal:</span>
            <span className="text-blue-400 text-right truncate">
              {isLoadingAmount ? "..." : withdrawalAmount ? `${formatEther(withdrawalAmount as bigint)} ETH` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-500 shrink-0">lock_period:</span>
            <span className="text-blue-400 text-right">
              {isLoadingLockTime ? "..." : lockTime ? formatLockTime(lockTime as bigint) : "N/A"}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-zinc-500 shrink-0">balance:</span>
            <span className="text-blue-400 text-right truncate">
              {isLoadingBalance ? "..." : faucetBalance ? `${Number(formatEther(faucetBalance as bigint)).toFixed(6)} ETH` : "N/A"}
            </span>
          </div>
        </div>
        <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-blue-500/20 text-[9px] sm:text-[10px] text-zinc-600 break-all leading-relaxed">
          {contractAddress}
        </div>
      </div>

      {/* User Stats */}
      {address && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-500/5 border border-blue-500/20 rounded">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <span className="text-blue-400 font-mono text-[10px] sm:text-xs">$</span>
            <h4 className="font-mono text-blue-400 text-[10px] sm:text-xs">status.user</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px] sm:text-xs">
            <div>
              <div className="text-zinc-500 text-[9px] sm:text-[10px] mb-0.5">can_withdraw</div>
              <div className={`font-semibold ${canWithdraw ? "text-blue-400" : "text-red-400"}`}>
                {isLoadingCanWithdraw ? "..." : canWithdraw ? "yes" : "no"}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-[9px] sm:text-[10px] mb-0.5">next_in</div>
              <div className="text-blue-400 font-semibold truncate">
                {isLoadingTimeUntil ? "..." : formatTimeRemaining(timeUntilNext as bigint)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request ETH Form */}
      {!isConnected ? (
        <div className="p-2 sm:p-3 bg-yellow-500/10 border border-yellow-500/30 rounded font-mono text-[10px] sm:text-xs text-center text-yellow-400">
          <span className="text-yellow-500">⚠</span> wallet.connect() required
        </div>
      ) : !isOnThisNetwork ? (
        <div className="p-2 sm:p-3 bg-blue-500/10 border border-blue-500/30 rounded font-mono text-[10px] sm:text-xs text-center text-blue-400">
          <span className="text-blue-500">→</span> switch to {networkName.toLowerCase()}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/30 rounded font-mono text-[10px] sm:text-xs text-red-400 break-words">
              <span className="text-red-500">✗</span> {error}
            </div>
          )}

          {success && (
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded font-mono text-[10px] sm:text-xs text-blue-400 break-words">
              <span className="text-blue-500">✓</span> {success}
            </div>
          )}

          <button
            onClick={requestETH}
            disabled={isSending || isConfirming || isLoadingCanWithdraw || (canWithdraw === false)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-blue-600/20 hover:bg-blue-600/30 active:bg-blue-600/40 border border-blue-500/50 hover:border-blue-500 disabled:bg-zinc-800/50 disabled:border-zinc-700 disabled:cursor-not-allowed disabled:text-zinc-600 text-blue-400 font-mono rounded transition-all touch-manipulation min-h-[44px]"
          >
            {(isSending || isConfirming)
              ? "Processing..."
              : isLoadingCanWithdraw
              ? "⌛ loading..."
              : canWithdraw === false
              ? `⏸ cooldown: ${formatTimeRemaining(timeUntilNext as bigint)}`
              : withdrawalAmount
              ? `💧 Request ${formatEther(withdrawalAmount as bigint)} ETH`
              : "💧 Request ETH"}
          </button>
        </div>
      )}
    </div>
  );
}

