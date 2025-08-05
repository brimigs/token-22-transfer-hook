"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { useParams } from "next/navigation";
import React from "react";
import { useAblTokenProgram, useGetToken } from "./abl-token-data-access";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSendTokens, useBulkSendTokens } from "../account/account-data-access";
import {
  AlertCircle,
  Upload,
  Send,
  Coins,
  Settings,
  Wallet,
  Flame,
} from "lucide-react";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

interface TokenInfo {
  address: string;
  name: string | undefined;
  symbol: string | undefined;
  uri: string | undefined;
  decimals: number;
  supply: number;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  permanentDelegate: PublicKey | null;
  mode: string | null;
  threshold: string | null;
  transferHookProgramId: PublicKey | null;
  isTransferHookEnabled: boolean;
  isTransferHookSet: boolean;
}

function TokenInfo({ tokenAddress }: { tokenAddress: string }) {
  const { attachToExistingToken } = useAblTokenProgram();
  const tokenInfo = useGetToken(new PublicKey(tokenAddress));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Token Information
        </CardTitle>
        <CardDescription>
          Details about your token and its configuration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tokenInfo ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Token Address
                  </Label>
                  <p className="font-mono text-sm break-all">{tokenAddress}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">Name</Label>
                  <p className="font-medium">{tokenInfo.data?.name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Symbol
                  </Label>
                  <p className="font-medium">
                    {tokenInfo.data?.symbol || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Decimals
                  </Label>
                  <p className="font-medium">{tokenInfo.data?.decimals}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Supply
                  </Label>
                  <p className="font-medium">
                    {tokenInfo.data?.supply?.toString() || "0"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Mint Authority
                  </Label>
                  <p className="font-mono text-xs break-all">
                    {tokenInfo.data?.mintAuthority?.toString() || "None"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Freeze Authority
                  </Label>
                  <p className="font-mono text-xs break-all">
                    {tokenInfo.data?.freezeAuthority?.toString() || "None"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                ABL Token Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-sm">Mode</Label>
                  <p className="font-medium">
                    {tokenInfo.data?.mode || "Not configured"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    Threshold
                  </Label>
                  <p className="font-medium">
                    {tokenInfo.data?.threshold?.toString() || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground text-sm">
                    Transfer Hook Status
                  </Label>
                  {tokenInfo.data?.isTransferHookEnabled ? (
                    tokenInfo.data?.isTransferHookSet ? (
                      <p className="text-green-600 font-medium mt-1">
                        ✓ Enabled and Set
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-yellow-600 font-medium">
                          Enabled but not set
                        </p>
                        <Button
                          size="sm"
                          onClick={() =>
                            attachToExistingToken
                              .mutateAsync({
                                mint: new PublicKey(tokenAddress),
                              })
                              .then()
                          }
                        >
                          Set Hook
                        </Button>
                      </div>
                    )
                  ) : (
                    <p className="text-muted-foreground font-medium mt-1">
                      Not enabled
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading token information...</p>
        )}
      </CardContent>
    </Card>
  );
}

function TokenManagement({ tokenInfo }: { tokenInfo: TokenInfo }) {
  const { publicKey } = useWallet();
  const { changeMode, mintTo, burnTokens } = useAblTokenProgram();
  const sendTokens = useSendTokens();
  const bulkSendTokens = useBulkSendTokens();
  const [mode, setMode] = React.useState<"Allow" | "Block" | "Mixed">(
    tokenInfo.mode as "Allow" | "Block" | "Mixed"
  );
  const [threshold, setThreshold] = React.useState<string | undefined>(
    tokenInfo.threshold ?? undefined
  );
  const [destinationWallet, setDestinationWallet] = React.useState("");
  const [sendRecipient, setSendRecipient] = React.useState("");
  const [sendAmount, setSendAmount] = React.useState("");
  const [sendMemo, setSendMemo] = React.useState("");
  const [bulkRecipients, setBulkRecipients] = React.useState<string[]>([]);
  const [bulkAmount, setBulkAmount] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sendProgress, setSendProgress] = React.useState({
    current: 0,
    total: 0,
  });
  const [burnWallet, setBurnWallet] = React.useState("");
  const [burnAmount, setBurnAmount] = React.useState("");

  const handleApplyChanges = async () => {
    if (!publicKey || !tokenInfo) return;

    try {
      await changeMode.mutateAsync({
        mode,
        threshold: threshold === undefined ? new BN(0) : new BN(threshold),
        mint: new PublicKey(tokenInfo.address),
      });
    } catch (err) {
      console.error("Failed to apply changes:", err);
    }
  };

  const [mintAmount, setMintAmount] = React.useState("0");

  const handleMint = async () => {
    if (!publicKey || !tokenInfo) return;

    try {
      await mintTo.mutateAsync({
        mint: new PublicKey(tokenInfo.address),
        amount: new BN(mintAmount),
        recipient: publicKey,
      });
      console.log("Minted successfully");
    } catch (err) {
      console.error("Failed to mint tokens:", err);
    }
  };

  const handleSendTokens = async () => {
    if (!publicKey || !tokenInfo || !sendRecipient || !sendAmount) return;

    try {
      const amount = parseFloat(sendAmount) * Math.pow(10, tokenInfo.decimals);
      await sendTokens.mutateAsync({
        mint: new PublicKey(tokenInfo.address),
        destination: new PublicKey(sendRecipient),
        amount: amount,
        memo: sendMemo || undefined,
      });
      console.log("Tokens sent successfully");
      setSendRecipient("");
      setSendAmount("");
      setSendMemo("");
    } catch (err) {
      console.error("Failed to send tokens:", err);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());

      const validWallets: string[] = [];
      for (const line of lines) {
        const wallet = line.trim();
        try {
          new PublicKey(wallet);
          validWallets.push(wallet);
        } catch {
          console.warn(`Invalid wallet address: ${wallet}`);
        }
      }

      setBulkRecipients(validWallets);
      console.log(`Loaded ${validWallets.length} valid wallet addresses`);
    };
    reader.readAsText(file);
  };

  const handleBulkSend = async () => {
    if (!publicKey || !tokenInfo || bulkRecipients.length === 0 || !bulkAmount)
      return;

    setIsSending(true);
    setSendProgress({ current: 0, total: bulkRecipients.length });

    const amount = parseFloat(bulkAmount) * Math.pow(10, tokenInfo.decimals);
    
    try {
      // Prepare recipients array for bulk transfer
      const recipients = bulkRecipients.map(wallet => ({
        destination: new PublicKey(wallet),
        amount: amount,
      }));

      // Send all transfers in a single transaction
      await bulkSendTokens.mutateAsync({
        mint: new PublicKey(tokenInfo.address),
        recipients: recipients,
      });

      console.log(
        `Successfully sent tokens to all ${bulkRecipients.length} wallets in a single transaction`
      );
      setSendProgress({ current: bulkRecipients.length, total: bulkRecipients.length });
    } catch (err) {
      console.error('Failed to send bulk transfers:', err);
    }

    setIsSending(false);
    setBulkRecipients([]);
    setBulkAmount("");
    setSendProgress({ current: 0, total: 0 });
  };

  const handleBurnTokens = async () => {
    if (!publicKey || !tokenInfo || !burnWallet || !burnAmount) return;

    try {
      // Burn the user-specified amount of tokens
      const burnAmountParsed = parseFloat(burnAmount) * Math.pow(10, tokenInfo.decimals);
      const ata = getAssociatedTokenAddressSync(
        new PublicKey(tokenInfo.address),
        new PublicKey(burnWallet),
        undefined,
        TOKEN_2022_PROGRAM_ID
      );

      await burnTokens.mutateAsync({
        mint: new PublicKey(tokenInfo.address),
        owner: new PublicKey(publicKey),
        amount: new BN(burnAmountParsed),
        ata,
      });
      console.log(`Successfully burned ${burnAmount} tokens`);
      setBurnWallet("");
      setBurnAmount("");
    } catch (err) {
      console.error("Failed to burn tokens:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Mint Tokens
          </CardTitle>
          <CardDescription>
            Create new tokens and add them to circulation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mint-destination">Destination Wallet</Label>
            <Input
              id="mint-destination"
              type="text"
              value={destinationWallet}
              onChange={(e) => setDestinationWallet(e.target.value)}
              placeholder="Enter destination wallet address"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="mint-amount">Amount to Mint</Label>
            <div className="flex gap-3 mt-2">
              <Input
                id="mint-amount"
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                min="0"
                placeholder="0.00"
              />
              <Button onClick={handleMint} className="shrink-0">
                <Coins className="h-4 w-4 mr-2" />
                Mint Tokens
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Tokens
          </CardTitle>
          <CardDescription>Transfer tokens to other wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4 pb-6 border-b">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Single Transfer
              </h4>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="send-recipient">Recipient Wallet</Label>
                  <Input
                    id="send-recipient"
                    type="text"
                    value={sendRecipient}
                    onChange={(e) => setSendRecipient(e.target.value)}
                    placeholder="Enter recipient wallet address"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="send-memo">Memo (Optional)</Label>
                  <Input
                    id="send-memo"
                    type="text"
                    value={sendMemo}
                    onChange={(e) => setSendMemo(e.target.value)}
                    placeholder="Add a memo to this transaction"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This memo will be recorded on the blockchain with your
                    transaction
                  </p>
                </div>
                <div>
                  <Label htmlFor="send-amount">Amount</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      id="send-amount"
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      min="0"
                      placeholder="0.00"
                    />
                    <Button
                      onClick={handleSendTokens}
                      disabled={
                        !sendRecipient ||
                        !sendAmount ||
                        parseFloat(sendAmount) <= 0
                      }
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Bulk Transfer
              </h4>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="csv-upload">Upload Wallet List</Label>
                  <div className="mt-2">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload a CSV or TXT file with one wallet address per line
                    </p>
                    {bulkRecipients.length > 0 && (
                      <div className="flex items-center gap-2 mt-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-green-600">
                          {bulkRecipients.length} valid wallet
                          {bulkRecipients.length !== 1 ? "s" : ""} loaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bulk-amount">Amount per Wallet</Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      id="bulk-amount"
                      type="number"
                      value={bulkAmount}
                      onChange={(e) => setBulkAmount(e.target.value)}
                      min="0"
                      placeholder="0.00"
                    />
                    <Button
                      onClick={handleBulkSend}
                      disabled={
                        bulkRecipients.length === 0 ||
                        !bulkAmount ||
                        parseFloat(bulkAmount) <= 0 ||
                        isSending
                      }
                      className="shrink-0"
                    >
                      {isSending ? (
                        <>
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send to {bulkRecipients.length} Wallets
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isSending && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {sendProgress.current} / {sendProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${(sendProgress.current / sendProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Burn Tokens
          </CardTitle>
          <CardDescription>
            Permanently remove tokens from circulation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium mb-1">
                ⚠️ Warning
              </p>
              <p className="text-sm text-muted-foreground">
                This action will permanently burn tokens from the specified
                wallet. This action cannot be undone.
              </p>
            </div>
            <div>
              <Label htmlFor="burn-wallet">Wallet Address</Label>
              <Input
                id="burn-wallet"
                type="text"
                value={burnWallet}
                onChange={(e) => setBurnWallet(e.target.value)}
                placeholder="Enter wallet address to burn from"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter the wallet address from which tokens will be burned
              </p>
            </div>
            <div>
              <Label htmlFor="burn-amount">Amount to Burn</Label>
              <Input
                id="burn-amount"
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Enter the amount of tokens to permanently burn
              </p>
            </div>
            <Button
              onClick={handleBurnTokens}
              disabled={!burnWallet || !burnAmount || parseFloat(burnAmount) <= 0}
              variant="destructive"
              className="w-full"
            >
              <Flame className="h-4 w-4 mr-2" />
              Burn {burnAmount || '0'} Tokens
            </Button>
          </div>
        </CardContent>
      </Card>

      {tokenInfo.isTransferHookSet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Transfer Settings
            </CardTitle>
            <CardDescription>
              Configure how transfers are handled for this token
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Transfer Mode
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <label
                  className={`relative flex cursor-pointer items-center justify-center rounded-lg border p-4 ${mode === "Allow" ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === "Allow"}
                    onChange={() => {
                      setMode("Allow");
                      setThreshold(tokenInfo.threshold ?? undefined);
                    }}
                    name="mode"
                  />
                  <div className="text-center">
                    <p className="font-medium">Allow</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All transfers allowed
                    </p>
                  </div>
                </label>
                <label
                  className={`relative flex cursor-pointer items-center justify-center rounded-lg border p-4 ${mode === "Block" ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === "Block"}
                    onChange={() => {
                      setMode("Block");
                      setThreshold(tokenInfo.threshold ?? undefined);
                    }}
                    name="mode"
                  />
                  <div className="text-center">
                    <p className="font-medium">Block</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All transfers blocked
                    </p>
                  </div>
                </label>
                <label
                  className={`relative flex cursor-pointer items-center justify-center rounded-lg border p-4 ${mode === "Mixed" ? "border-primary bg-primary/5" : "border-muted"}`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={mode === "Mixed"}
                    onChange={() => setMode("Mixed")}
                    name="mode"
                  />
                  <div className="text-center">
                    <p className="font-medium">Mixed</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Threshold-based
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {mode === "Mixed" && (
              <div>
                <Label htmlFor="threshold">Threshold Amount</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  min="0"
                  placeholder="Enter threshold amount"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Transfers above this amount will be handled differently
                </p>
              </div>
            )}

            <Button
              onClick={handleApplyChanges}
              disabled={
                mode === tokenInfo.mode &&
                (threshold === tokenInfo.threshold ||
                  (threshold === undefined && tokenInfo.threshold === null))
              }
              className="w-full"
            >
              Apply Changes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ManageTokenDetail() {
  const { publicKey } = useWallet();
  const params = useParams();
  const tokenAddress = params?.address as string;
  const tokenQuery = useGetToken(new PublicKey(tokenAddress));

  // Save token address to localStorage when accessed
  React.useEffect(() => {
    if (tokenAddress && typeof window !== "undefined") {
      localStorage.setItem("lastTokenAddress", tokenAddress);
    }
  }, [tokenAddress]);

  const tokenInfo = React.useMemo(() => {
    if (!tokenQuery?.data || !tokenAddress) return null;
    return {
      ...tokenQuery.data,
      address: tokenAddress,
      supply: 0, // TODO: Get supply from token account
    };
  }, [tokenQuery?.data, tokenAddress]);

  if (!publicKey) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Token Management</h1>
        <p className="text-muted-foreground">
          Manage your token settings, mint new tokens, and send tokens to
          wallets
        </p>
      </div>

      {tokenQuery?.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-muted-foreground">
                Loading token information...
              </p>
            </div>
          </CardContent>
        </Card>
      ) : tokenQuery?.isError ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-lg font-medium">Error loading token</p>
              <p className="text-muted-foreground">
                Please check the token address and try again
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tokenInfo && <TokenManagement tokenInfo={tokenInfo} />}
          <TokenInfo tokenAddress={tokenAddress} />
        </div>
      )}
    </div>
  );
}
