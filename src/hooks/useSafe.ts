import Safe from "@safe-global/safe-core-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import { safeContracts, contractNetworks } from "../config/safe";
import { CHAIN_ID } from "../config/network";
import { getProvider } from "@sovryn/ethers-provider";
import EthersAdapter from "@safe-global/safe-ethers-lib"
import { useAccount } from "./useAccount";

export const useSafe = () => {

  const { signer } = useAccount();

  const sdk = useRef<Safe>();
  const [connected, setConnected] = useState(false);

  useEffect(() => {

    const ethAdapter = new EthersAdapter({
      // @ts-ignore
      ethers,
      safeContracts,
      signerOrProvider: getProvider(CHAIN_ID),
    });

    Safe.create({
      safeAddress: (safeContracts as any)[CHAIN_ID],
      contractNetworks,
      ethAdapter,
    }).then((safe) => {
      sdk.current = safe;
      setConnected(true);
      console.log('Safe SDK initialized', safe);
    }).catch((e) => {
      console.error('Failed to initialize Safe SDK', e);
      setConnected(false);
    });

  }, []);

  const connect = useCallback(async () => {
    if (signer) {
      // @ts-ignore
      const safe = await sdk.current?.connect({ ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }) });
      console.log('Safe SDK connected', safe);
      return safe as Safe;
    }
    return sdk.current as Safe;
  }, [signer]);

  return {
    sdk: sdk.current,
    connected,
    connect,
  };

};
