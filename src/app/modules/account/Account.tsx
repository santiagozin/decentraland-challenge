import { useAccount, useDisconnect } from "wagmi";
import { Button, Card } from "decentraland-ui";
import { useNavigate } from "react-router-dom";
import { formatMiddleEllipsis } from "@/helper/format";
import {
  useTokenBalance,
  useTokenDecimals,
  useTokenSymbol,
} from "@/app/services/contractService";
import { formatTokenBalance } from "@/app/utils/formatAmount";
import { Loader } from "semantic-ui-react";

const token = import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`;

const Account = () => {
  const { address, chainId, isConnected } = useAccount();

  const { disconnect } = useDisconnect();
  const enabled = Boolean(isConnected && address && chainId && token);
  const navigate = useNavigate();

  const { data: rawBalance } = useTokenBalance(
    token,
    address,
    chainId,
    enabled
  );
  const { data: decimals } = useTokenDecimals(token, chainId, enabled);
  const { data: symbol } = useTokenSymbol(token, chainId, enabled);

  const decimalsNumber = typeof decimals === "number" ? decimals : 0;
  const formatted =
    formatTokenBalance(rawBalance as bigint | undefined, decimalsNumber) || "";

  return (
    <div className="container">
      <Card className="primary fluid">
        <Card.Content>
          <Card.Header><span className="title">Wallet</span></Card.Header>
          <Card.Description>
            <div className="flex-card">
              <div className="flex-card-item">
                <span className="label">Address:</span>
                <span className="value">
                  {formatMiddleEllipsis(address as string)}
                </span>
              </div>
              <div className="flex-card-item">
                <span className="label">Balance:</span>
                <span className="value">
                  {formatted ? formatted : <Loader inline active size="small" />} {symbol as string}
                </span>
                <Button basic onClick={() => navigate("/transfer")}>
                  Transfer
                </Button>
              </div>
            </div>
          </Card.Description>
          <Button basic onClick={() => disconnect()}>
            Logout
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Account;
