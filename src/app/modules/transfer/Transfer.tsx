import { useEffect, useMemo, useState } from "react";
import { Button, Field, Modal, ModalNavigation, Blockie } from "decentraland-ui";
import {
  useAccount,
} from "wagmi";
import { isAddress } from "viem";
import { useNavigate } from "react-router-dom";
import type { InputOnChangeData } from "semantic-ui-react";
import { Input, Label } from "semantic-ui-react";
import { sepolia } from "wagmi/chains";
import { getErrorMessage } from "@/app/utils/errorMessage";
import {
  useTokenBalance,
  useTokenDecimals,
  useTokenSymbol,
  useTokenTransfer,
} from "@/app/services/contractService";
import {
  formatTokenBalance,
  isValidAmountString,
  parseAmountToUnits,
  willExceedBalance,
} from "@/app/utils/formatAmount";

const token = import.meta.env.VITE_TOKEN_ADDRESS as `0x${string}`;

const Transfer = () => {
  const { address, chainId, isConnected } = useAccount();
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: decimals } = useTokenDecimals(token, chainId, isConnected);
  const { data: symbol } = useTokenSymbol(token, chainId, isConnected);
  const { data: balance } = useTokenBalance(token, address, chainId, isConnected);

  const { transfer, isPending, isConfirming, isConfirmed } = useTokenTransfer(token, chainId);

  useEffect(() => {
    if (isConfirmed) navigate(-1);
  }, [isConfirmed, navigate]);

  const decimalsNumber = typeof decimals === "number" ? decimals : 0;
  const availableFormatted = formatTokenBalance(balance as bigint | undefined, decimalsNumber);

  const isValidAddress = useMemo(
    () => isAddress(recipient as `0x${string}`),
    [recipient]
  );
  const isValidAmount = useMemo(() => isValidAmountString(amount), [amount]);

  const maxExceeded = useMemo(() => willExceedBalance(amount, balance as bigint | undefined, decimalsNumber), [amount, balance, decimalsNumber]);

  const canSubmit =
    isConnected &&
    typeof balance === "bigint" &&
    isValidAddress &&
    isValidAmount &&
    !maxExceeded &&
    !isPending &&
    !isConfirming;

  const onSubmit = async () => {
    try {
      setErrorMessage("");
      const value = parseAmountToUnits(amount, decimalsNumber);
      await transfer({
        recipient: recipient as `0x${string}`,
        value,
        account: address as `0x${string}`,
        chain: sepolia,
      });
    } catch (unknownError: unknown) {
      setErrorMessage(getErrorMessage(unknownError));
    }
  };

  return (
    <div className="container">
    <Modal size="small" open={open} onClose={() => setOpen(false)}>
      <ModalNavigation title="Transfer" onClose={() => setOpen(false)} />
      <Modal.Description className="description-modal">
        <p>Send tokens to an account</p>
      </Modal.Description>
      <Modal.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Field
            label={`Amount${typeof symbol === "string" ? ` (${symbol})` : ""}`}
            placeholder="0"
            value={amount}
            error={maxExceeded}
            message={
              maxExceeded
                ? `Insufficient balance${availableFormatted ? ` (available: ${availableFormatted})` : ""}`
                : undefined
            }
            onChange={(_, data: InputOnChangeData) =>
              setAmount(String(data.value || ""))
            }
          />

          <Field
            label="Address"
            error={recipient !== "" && !isValidAddress}
            message={
              recipient !== "" && !isValidAddress
                ? "Invalid address"
                : undefined
            }
          >
            <Input
              placeholder="0x..."
              value={recipient}
              label={isValidAddress ? <Label basic><Blockie className="blockie-icon" seed={recipient} shape="circle" /></Label> : undefined}
              labelPosition="right"
              onChange={(_, data: InputOnChangeData) =>
                setRecipient(String(data.value || ""))
              }
            />
          </Field>
          {errorMessage ? (
            <div className="message error">{errorMessage}</div>
          ) : null}
          {isConfirming ? (
            <div className="message confirmed">Confirming transaction...</div>
          ) : null}
          {isConfirmed ? (
            <div className="message confirmed">
              Transaction confirmed.
            </div>
          ) : null}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          onClick={onSubmit}
          loading={isPending || isConfirming}
          disabled={!canSubmit}
        >
          Send
        </Button>
      </Modal.Actions>
    </Modal>
    </div>
  );
};

export default Transfer;
