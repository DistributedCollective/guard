import { useCallback, useEffect, useState } from "react";
import { startWith } from "rxjs";
import { onboard } from "../config/network";

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

  return {
    account,
    provider: onboard.state.get().wallets[0]?.provider || null,
    connect,
  }
};
