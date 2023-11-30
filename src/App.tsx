import { FC, PropsWithChildren, useEffect } from 'react';
import { Button } from '@sovryn/ui';
import { useAccount } from './hooks/useAccount';
import { useSafe } from './hooks/useSafe';
import { OnboardProvider } from '@sovryn/onboard-react';

export const App: FC<PropsWithChildren> = ({ children }) => {
  const { init } = useSafe();
  const { address, connect } = useAccount();

  useEffect(() => {
    init();
  }, [init]);
  
  return (
    <>
      {address ? (<>{children}</>) : (<div className='w-full h-screen flex justify-center items-center'><Button text="Connect Wallet" onClick={connect} /></div>)}
      <OnboardProvider />
    </>
  );
}
