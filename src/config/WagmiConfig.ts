import { http, createConfig } from "wagmi";
import { Chain, sepolia } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [sepolia] as readonly [Chain, ...Chain[]],
  connectors: [metaMask(), injected()],
  ssr: false,
  transports: {
    [sepolia.id]: http(),
  },
});
