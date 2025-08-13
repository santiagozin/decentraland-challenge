import { useConnect, useSignMessage } from "wagmi";
import { useAccount } from "wagmi";
import { Button } from "decentraland-ui";
import { login } from "./services/loginService";

const SignIn = () => {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connectAsync, connectors } = useConnect();

  async function handleSignIn() {
    try {
      if (!isConnected) {
        const metaMaskConnector =
          connectors.find((c) => c.id === "metaMask") ||
          connectors.find((c) => c.name === "MetaMask") ||
          connectors.find((c) => c.type === "injected");

        if (!metaMaskConnector) {
          alert("MetaMask is not available in this browser");
          return;
        }
        await connectAsync({ connector: metaMaskConnector });
      }
      await login(address, chainId, isConnected, signMessageAsync);
    } catch (err) {
      console.error("Error in connection/signature", err);
    }
  }

  return (
    <div className="container">
      <Button primary onClick={handleSignIn}>
        Connect
      </Button>
    </div>
  );
};

export default SignIn;
