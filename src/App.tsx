import { FC } from 'react';
import { OnboardProvider } from '@sovryn/onboard-react';
import './App.css';
import { Button, Dialog } from '@sovryn/ui';

export const App: FC = () => (
  <>
    <p>learn react</p>
    <Button text="Act on it" />
    <Dialog isOpen={true}>
      <p>hey</p>
    </Dialog>
    <OnboardProvider />
  </>
);
