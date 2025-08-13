import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import TokenAbi from "@/contract/Token.abi.json";
import { useCallback, useState } from "react";
import type { Chain } from "viem/chains";

export function useTokenDecimals(
  tokenAddress: `0x${string}`,
  chainId?: number,
  enabled: boolean = true
) {
  return useReadContract({
    abi: TokenAbi,
    address: tokenAddress,
    functionName: "decimals",
    chainId,
    query: { enabled },
  });
}

export function useTokenSymbol(
  tokenAddress: `0x${string}`,
  chainId?: number,
  enabled: boolean = true
) {
  return useReadContract({
    abi: TokenAbi,
    address: tokenAddress,
    functionName: "symbol",
    chainId,
    query: { enabled },
  });
}

export function useTokenBalance(
  tokenAddress: `0x${string}`,
  accountAddress: `0x${string}` | undefined,
  chainId?: number,
  enabled: boolean = true
) {
  return useReadContract({
    abi: TokenAbi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: accountAddress ? [accountAddress] : undefined,
    chainId,
    query: {
      enabled: enabled && !!accountAddress,
    },
  });
}

export function useTokenTransfer(
  tokenAddress: `0x${string}`,
  chainId?: number
) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
    chainId,
  });

  const transfer = useCallback(
    async (
      params: {
        recipient: `0x${string}`;
        value: bigint;
        account: `0x${string}`;
        chain: Chain;
      }
    ) => {
      const txHash = await writeContractAsync({
        abi: TokenAbi,
        address: tokenAddress,
        functionName: "transfer",
        args: [params.recipient, params.value],
        account: params.account,
        chain: params.chain,
      });
      setHash(txHash);
      return txHash;
    },
    [tokenAddress, writeContractAsync]
  );

  return { transfer, isPending, isConfirming, isConfirmed, hash };
}
