import { formatUnits, parseUnits } from "viem";

export function normalizeAmountString(amount: string): string {
  return amount.replace(/,/g, ".");
}

export function isValidAmountString(amount: string): boolean {
  if (!amount) return false;
  const normalized = normalizeAmountString(amount);
  const num = Number(normalized);
  return !Number.isNaN(num) && num > 0;
}

export function parseAmountToUnits(amount: string, decimals: number): bigint {
  const normalized = normalizeAmountString(amount);
  return parseUnits(normalized, decimals);
}

export function formatTokenBalance(balance: bigint | undefined, decimals: number): string | undefined {
  if (typeof balance !== "bigint") return undefined;
  return formatUnits(balance, decimals);
}

export function willExceedBalance(
  amount: string,
  balance: bigint | undefined,
  decimals: number
): boolean {
  if (typeof balance !== "bigint") return false;
  try {
    const value = parseAmountToUnits(amount, decimals);
    return value > balance;
  } catch {
    return true;
  }
}
