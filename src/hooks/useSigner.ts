import { useCallback, useEffect, useState } from "react";
import { Signer, ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib"
import { state } from "../state/shared";
import { MetaTransactionData, SafeTransactionDataPartial, SafeTransaction } from '@safe-global/safe-core-sdk-types';

export const useSigner = () => {
  const [value, setValue] = useState(state.get().safeSigner);

  const makeAdapter = useCallback((signerOrProvider: Signer | ethers.providers.Provider) => new EthersAdapter({
    // @ts-ignore
    ethers,
    signerOrProvider,
  }), []);

  const connect = useCallback(async () => {

    const sdk = state.get().safe.sdk;

    if (!state.get().safe.ready || !sdk) {
      throw new Error('Safe SDK not initialized');
    }
    if (!state.get().wallet.connected) {
      throw new Error('Wallet not connected');
    }

    const signer = state.get().wallet.signer;
    const account = state.get().wallet.address;
    if (state.get().wallet.address?.toLowerCase() === account?.toLowerCase()) {
      const safe = await sdk.connect({ ethAdapter: makeAdapter(signer!) });
      state.actions.connectSignerSdk(safe, account!);
      return safe;
    }

    return state.get().safeSigner.sdk;
  }, [makeAdapter]);

  const submitTransaction = useCallback(async (data: SafeTransactionDataPartial | MetaTransactionData[], sign: boolean = true) => {
    const sdk = await connect();

    if (!sdk) {
      throw new Error('Safe SDK not initialized');
    }

    let safeTransaction = await sdk.createTransaction({
      safeTransactionData: data,
    });

    if (sign) {
      safeTransaction = await sdk.signTransaction(safeTransaction);
    }

    const txHash = await sdk.getTransactionHash(safeTransaction);

    return {
      safeTransaction,
      txHash,
    };

  }, [connect]);

  const approveTransaction = useCallback(async (txHash: string) => {
      const sdk = await connect();

      if (!sdk) {
        throw new Error('Safe SDK not initialized');
      }
  
      const safeTransaction = await sdk.approveTransactionHash(txHash);
  
      return safeTransaction;
  }, [connect]);

  const executeTransaction = useCallback(async (safeTransaction: SafeTransaction) => {
    const sdk = await connect();

    if (!sdk) {
      throw new Error('Safe SDK not initialized');
    }

    const tx = await sdk.executeTransaction(safeTransaction);

    return tx;
}, [connect]);

  useEffect(() => {
    const sub = state.select('safeSigner').subscribe(setValue);
    return () => sub.unsubscribe();
  }, []);

  return {
    connect,
    submitTransaction,
    approveTransaction,
    executeTransaction,
    ...value,
  };
};
