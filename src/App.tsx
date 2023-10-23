import { FC } from 'react';
import { OnboardProvider } from '@sovryn/onboard-react';
import { Button } from '@sovryn/ui';
import './App.css';
import { useAccount } from './hooks/useAccount';

export const App: FC = () => {
  const { account, connect } = useAccount();

  return (
    <>
      <p>guard</p>
      {account && <p>Account: {account}</p>}
      <Button text="Act on it" onClick={connect} />
      <OnboardProvider />
    </>
  );
}
