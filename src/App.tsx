import { FC, PropsWithChildren, useEffect } from 'react';
import { Button } from '@sovryn/ui';
import './App.css';
import { useAccount } from './hooks/useAccount';
import { useSafe } from './hooks/useSafe';
import { OnboardProvider } from '@sovryn/onboard-react';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const { init, ready } = useSafe();
  const { address, connect } = useAccount();

  useEffect(() => {
    init();
  }, [init]);
  
  return (
    <div>
      <div>
        {ready && <p>Safe is ready...</p>}
      </div>
      {address ? (<>
        <p>Account: {address}</p>
        {ready ? (<>{children}</>) : (<>Loading safe data...</>)}
      </>) : (<Button text="Connect" onClick={connect} />)}
      <OnboardProvider />
    </div>
  );
}
