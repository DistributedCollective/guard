import Onboard from '@sovryn/onboard-core';
import { Asset, BasePath } from '@sovryn/onboard-hw-common';
import injectedModule from '@sovryn/onboard-injected';
import ledgerModule from '@sovryn/onboard-ledger';
import trezorModule from '@sovryn/onboard-trezor';
import walletConnectModule from '@sovryn/onboard-walletconnect';
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

const basePaths: BasePath[] = [
  { label: 'RSK Mainnet', value: "m/44'/137'/0'/0" },
  { label: 'Ethereum Mainnet', value: "m/44'/60'/0'/0" },
];
const assets: Asset[] = [{ label: 'RBTC' }, { label: 'ETH' }];

const injected = injectedModule();
const ledger = ledgerModule({
  basePaths,
  assets,
});
const trezor = trezorModule({
  email: 'victor@sovryn.app',
  appUrl: 'https://sovryn.app',
  basePaths,
  assets,
});
const walletConnect = walletConnectModule({
  version: 2,
  projectId: 'd3483196fbaa8259ab4191347c67f973',
});

export const onboard = Onboard({
  wallets: [injected, walletConnect, ledger, trezor],
  chains: chains.map(item => ({
    ...item,
    rpcUrl: typeof item.rpcUrl === 'string' ? item.rpcUrl : item.rpcUrl[0],
  })),
});

setup(chains);
