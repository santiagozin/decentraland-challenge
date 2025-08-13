
import {
    createPublicClient,
    http
  } from "viem";
  import { base, Chain } from "viem/chains";


export const publicClient = createPublicClient({
    chain: base as Chain,
    transport: http(),
  });