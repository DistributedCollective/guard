import setup, { Chain, ChainIds } from '@sovryn/ethers-provider';

export const CHAIN_ID = '0x' + Number(parseInt(process.env.REACT_APP_CHAIN_ID || '30')).toString(16);

export const IS_MAINNET = CHAIN_ID === ChainIds.RSK_MAINNET;

// @dev: temp solution for hardware wallets to connect to the correct chain
// good enough for now, but should be refactored when cross-chain support is needed
export const chains: Chain[] = [
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

setup(chains);
