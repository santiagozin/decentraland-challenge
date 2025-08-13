import { SiweMessage } from "siwe";

export async function login(
    address: string,
    chainId: number,
    isConnected: boolean,
    signMessageAsync: (args: { account: `0x${string}`; message: string }) => Promise<`0x${string}`>
) {
    if (!isConnected || !address || !chainId) return;
    const nonce = await fetch("/siwe/nonce", { credentials: "include" }).then(
      (r) => r.text()
    );

    const message = new SiweMessage({
      domain: window.location.host,
      address,
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    });
    const signature = await signMessageAsync({
      account: address as `0x${string}`,
      message: message.prepareMessage(),
    });
    const ok = await fetch("/siwe/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message, signature }),
    }).then((r) => r.ok);
    if (ok) alert("Sesión iniciada");
  }
