import { useCallback, useEffect, useMemo, useState } from "react";
import { startWith } from "rxjs";
import { onboard } from "../config/network";
import { ethers } from "ethers";

export const useAccount = () => {
  const [account, setAccount] = useState<string | null>(null);

  const connect = useCallback(() => onboard.connectWallet(), []);
  
  useEffect(() => {
    onboard.state.select('wallets').pipe(startWith(onboard.state.get().wallets)).subscribe((wallets) => {
      if (wallets.length) {
        setAccount(wallets[0].accounts[0].address);
      } else {
        setAccount(null);
      }
    });
  }, []);

  const provider = useMemo(
    () =>
      onboard.state.get().wallets[0]?.provider
        ? new ethers.providers.Web3Provider(onboard.state.get().wallets[0]?.provider)
        : undefined,
    [],
  );
  const signer = useMemo(() => provider?.getSigner(), [provider]);

  return {
    account,
    provider,
    signer,
    connect,
  }
};
