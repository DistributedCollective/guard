import Safe from "@safe-global/safe-core-sdk";
import { useCallback, useEffect, useState } from "react";
import { Signer, ethers } from "ethers";
import { getProvider } from "@sovryn/ethers-provider";
import EthersAdapter from "@safe-global/safe-ethers-lib"
import { safeContracts, contractNetworks } from "../config/safe";
import { CHAIN_ID } from "../config/network";
import { state } from "../state/shared";

export const useSafe = () => {
  const [value, setValue] = useState(state.get().safe);

  const makeAdapter = useCallback((signerOrProvider: Signer | ethers.providers.Provider) => new EthersAdapter({
    // @ts-ignore
    ethers,
    signerOrProvider,
  }), []);

  const init = useCallback(async () => {
    Safe.create({
      safeAddress: (safeContracts as any)[CHAIN_ID],
      contractNetworks,
      ethAdapter: makeAdapter(getProvider(CHAIN_ID)),
    }).then((safe) => {
      state.actions.connectSdk(safe);
      Promise.all([
        safe.getOwners().then(state.actions.saveOwners),
        safe.getThreshold().then(state.actions.saveThreshold),
      ]);
    }).catch((e) => {
      console.error('Failed to initialize Safe SDK', e);
      state.actions.disconnectSdk(e.toString());
    });
  }, [makeAdapter])

  useEffect(() => {
    const sub = state.select('safe').subscribe(setValue);
    return () => sub.unsubscribe();
  }, []);

  return {
    init,
    ...value,
  };
};
