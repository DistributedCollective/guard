// @ts-nocheck
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import { Button } from '@sovryn/ui';
import { SafeSignature } from '@safe-global/safe-core-sdk-types';
import './App.css';
import { useAccount } from './hooks/useAccount';
import { useSafe } from './hooks/useSafe';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const { account, connect } = useAccount();

  const { sdk, ready, connected, submitTransaction, approveTransaction, executeTransaction } = useSafe();

  const [txHash, setTxHash] = useState('');
  const [tx, setTx] = useState<any>();

  const handleSubmit = useCallback(async () => {
    if (!sdk) return;
    const transactionData = await submitTransaction();

    console.log(transactionData);

    setTxHash(transactionData.txHash);
    setTx(transactionData.safeTransaction);

  }, [sdk, submitTransaction]);

  const handleApprove = useCallback(async () => {
    if (!sdk) return;
    const txs = await approveTransaction(txHash);
    console.log(txs);

    const approvals1 = await sdk.getOwnersWhoApprovedTx(txHash);
    console.log(approvals1, tx);

    await txs.transactionResponse?.wait();

    const approvals = await sdk.getOwnersWhoApprovedTx(txHash);
    console.log(approvals, tx);

  }, [approveTransaction, sdk, txHash, tx]);

  const loadTx = useCallback(async () => {
    if (!sdk) return;
    const tx = await sdk.copyTransaction({
      data: {
        "to": "0x0000000000000000000000000000000000000000",
        "value": "0",
        "data": "0x",
        "operation": 0,
        "baseGas": 0,
        "gasPrice": 0,
        "gasToken": "0x0000000000000000000000000000000000000000",
        "refundReceiver": "0x0000000000000000000000000000000000000000",
        "nonce": 0,
        "safeTxGas": 0
      },
      // @ts-ignore
      signatures: new Map([]),
      addSignature: function (signature: SafeSignature): void {
        throw new Error('Function not implemented.');
      },
      encodedSignatures: function (): string {
        throw new Error('Function not implemented.');
      }
    });
    console.log(tx);
    const hash = await sdk.getTransactionHash(tx);
    setTxHash(hash);
    setTx(tx);
    console.log(hash);

    const approvals = await sdk.getOwnersWhoApprovedTx(hash);
    console.log(approvals, tx);

    const threshold = await sdk.getThreshold();
    console.log({ threshold });
    // const signers = await sdk.get

  }, [sdk]);

  const handleExecute = useCallback(async () => {
    if (!sdk) return;

    const approvals = await sdk.getOwnersWhoApprovedTx(txHash);
    console.log(approvals, tx);

    const txs = await executeTransaction(tx);
    console.log(txs, tx);
    await txs.transactionResponse?.wait();
    console.log('done', tx);
  }, [executeTransaction, sdk, tx, txHash]);
  
  return (
    <>
      <h1>guard</h1>
      {ready && <p>Safe is ready...</p>}
      {connected && <p>Signer is ready...</p>}
      {account ? (<>
        <p>Account: {account}</p>
        <Button text="Submit" onClick={handleSubmit} />
        <Button text="Load" onClick={loadTx} />
        <Button text="Approve" onClick={handleApprove} />
        <Button text="Execute" onClick={handleExecute} /><div><pre>{JSON.stringify(tx, null, 2)}</pre><br/>hash: {txHash}</div>
      </>) : (<Button text="Connect" onClick={connect} />)}
      {children}
    </>
  );
}
