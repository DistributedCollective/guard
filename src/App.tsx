import { FC, useCallback } from 'react';
import { OnboardProvider } from '@sovryn/onboard-react';
import { Button } from '@sovryn/ui';
import './App.css';
import { useAccount } from './hooks/useAccount';
import { useSafe } from './hooks/useSafe';

export const App: FC = () => {
  const { account, connect, provider } = useAccount();

  const { sdk, connected, connect: ct } = useSafe();

  const handleSubmit = useCallback(async () => {
    if (!sdk) return;
    const transactionData = await sdk.createTransaction({
      safeTransactionData: {
        to: account!,
        value: '0',
        data: '0x',
      }
    });

    console.log(transactionData);

    const cc = await ct();

    const signedOffline = await cc.signTransaction(transactionData);
    console.log(signedOffline);
  

  }, [account, ct, sdk]);
  const handleApprove = useCallback(() => {}, []);
  const handleExecute = useCallback(() => {}, []);
  
  return (
    <>
      <h1>guard</h1>
      {connected && <p>Safe is ready...</p>}
      {account ? (<>
        <p>Account: {account}</p>
        <Button text="Submit" onClick={handleSubmit} />
        <Button text="Approve" onClick={handleApprove} />
        <Button text="Execute" onClick={handleExecute} />
      </>) : (<Button text="Connect" onClick={connect} />)}
      <OnboardProvider />
    </>
  );
}
