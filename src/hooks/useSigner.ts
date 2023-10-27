import { useCallback, useEffect, useState } from "react";
import { Signer, ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib"
import { state } from "../state/shared";

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
    }
    
  }, [makeAdapter]);

  // const makeSigner = useCallback(async () => {
  //   if (signer && sdk.current) {
  //     const safe = await sdk.current.connect({ ethAdapter: makeAdapter(signer) });
  //     setConnected(true);
  //     return safe as Safe;
  //   }
  // }, [makeAdapter, signer]);

  // useEffect(() => {
  //   if (signer && sdk.current && ready) {
  //     makeSigner();
  //   }
  // }, [signer, ready, makeSigner]);

//   const submitTransaction = useCallback(async () => {

//     if (!sdk.current) {
//       throw new Error('Safe SDK not initialized');
//     }

//     const signer = await makeSigner();
//     if (!signer) {
//       throw new Error('Failed to create signer');
//     }

//     const safeTransaction = await sdk.current.createTransaction({
//       // todo: pass actual values
//       safeTransactionData: {
//         to: ethers.constants.AddressZero,
//         value: '0',
//         data: '0x',
//       }
//     });

//     console.log('Transaction data', safeTransaction);

//     const txHash = await sdk.current.getTransactionHash(safeTransaction);

//     return {
//       safeTransaction,
//       txHash,
//     };

//   }, [makeSigner]);

//   const approveTransaction = useCallback(async (txHash: string) => {
//       if (!sdk.current) {
//         throw new Error('Safe SDK not initialized');
//       }
  
//       const signer = await makeSigner();
//       if (!signer) {
//         throw new Error('Failed to create signer');
//       }
  
//       const safeTransaction = await signer.approveTransactionHash(txHash);
  
//       console.log('Transaction approved', safeTransaction);
  
//       return safeTransaction;
//   }, [makeSigner]);

//   const executeTransaction = useCallback(async (safeTransaction: SafeTransaction) => {
//     if (!sdk.current) {
//       throw new Error('Safe SDK not initialized');
//     }

//     const signer = await makeSigner();
//     if (!signer) {
//       throw new Error('Failed to create signer');
//     }

//     const tx = await signer.executeTransaction(safeTransaction);

//     console.log('Transaction executing', tx);

//     return tx;
// }, [makeSigner]);

  useEffect(() => {
    const sub = state.select('safeSigner').subscribe(setValue);
    return () => sub.unsubscribe();
  }, []);

  return {
    connect,
    ...value,
  };
};
