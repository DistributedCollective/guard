import Onboard from '@sovryn/onboard-core';
import injectedModule from '@sovryn/onboard-injected';
import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

export const CHAIN_ID: string = '0x' + Number(parseInt(process.env.REACT_APP_CHAIN_ID || '30')).toString(16);

export const IS_MAINNET = CHAIN_ID === ChainIds.RSK_MAINNET;

const chains: Chain[] = [
  IS_MAINNET
    ? {
        id: ChainIds.RSK_MAINNET,
        label: 'Rootstock',
        token: 'RBTC',
        publicRpcUrl: 'https://mainnet.sovryn.app/rpc',
        rpcUrl: [
          'https://rsk-live.sovryn.app/rpc',
          'https://mainnet.sovryn.app/rpc',
          'https://public-node.rsk.co',
        ],
        blockExplorerUrl: 'https://explorer.rsk.co',
      }
    : {
        id: ChainIds.RSK_TESTNET,
        label: 'Rootstock testnet',
        token: 'tRBTC',
        publicRpcUrl: 'https://testnet.sovryn.app/rpc',
        rpcUrl: ['https://public-node.testnet.rsk.co', 'https://testnet.sovryn.app/rpc'],
        blockExplorerUrl: 'https://explorer.testnet.rsk.co',
      },
];

const injected = injectedModule();

export const onboard = Onboard({
  wallets: [injected],
  chains: chains.map(item => ({
    ...item,
    rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  })),
});

setup(chains);
