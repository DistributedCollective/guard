import { ChainId, ChainIds } from "@sovryn/ethers-provider";
import { ContractInterface } from "ethers";

export type PauserContract = {
  group: string;
  abi: ContractInterface;
  addresses: Partial<Record<ChainId, string>>;
  methods: PauserMethod[];
};

export type PauserMethod = {
  name: string;
  read: string;
  toggle: string;
  unpause?: string;
  flag?: boolean;
};

export const PAUSER_METHODS: PauserContract[] = [{
  group: 'Protocol',
  abi: [
    {
      "constant": true,
      "inputs": [],
      "name": "isProtocolPaused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "bool",
          "name": "paused",
          "type": "bool"
        }
      ],
      "name": "togglePaused",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
  ],
  addresses: {
    [ChainIds.RSK_MAINNET]: '',
    [ChainIds.RSK_TESTNET]: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
  },
  methods: [{
    name: 'isProtocolPaused',
    read: 'isProtocolPaused',
    toggle: 'togglePaused(bool)',
    flag: true,
  }],
}, {
  group: 'Staking',
  abi: [
    'function paused() view returns (bool)',
    'function togglePaused(bool)',
    'function frozen() view returns (bool)',
    'function freezeUnfreeze(bool)',
  ],
  addresses: {
    [ChainIds.RSK_MAINNET]: '',
    [ChainIds.RSK_TESTNET]: '0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3',
  },
  methods: [{
    name: 'paused',
    read: 'paused',
    toggle: 'togglePaused(bool)',
    flag: true,
  }, {
    name: 'frozen',
    read: 'frozen',
    toggle: 'freezeUnfreeze(bool)',
    flag: true,
  }],
}, {
  group: 'Loan Token Beacon WRBTC',
  abi: [
    {
      "constant": true,
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  addresses: {
    [ChainIds.RSK_MAINNET]: '0x845eF7Be59664899398282Ef42239634aBDd752C',
    [ChainIds.RSK_TESTNET]: '0x6EDEeC91f5C0A57248BF4D7dBce2c689c74F3c06',
  },
  methods: [{
    name: 'Paused',
    read: 'paused',
    toggle: 'pause',
    unpause: 'unpause',
  }],
}, {
  group: 'Loan Token Beacon LM',
  abi: [
    {
      "constant": true,
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  addresses: {
    [ChainIds.RSK_MAINNET]: '0x5b155ECcC1dC31Ea59F2c12d2F168C956Ac0FFAa',
    [ChainIds.RSK_TESTNET]: '0xb9f993E7Da03D8a21Cda6fa1925BAAE17C6932aE',
  },
  methods: [{
    name: 'Paused',
    read: 'paused',
    toggle: 'pause',
    unpause: 'unpause',
  }],
}];

if (process.env.NODE_ENV === 'development') {
  PAUSER_METHODS.push({
    group: 'SOV Token (test only)',
    addresses: {
      [ChainIds.RSK_TESTNET]: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
      [ChainIds.RSK_MAINNET]: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
    },
    abi: [
      'function symbol() view returns (string)',
    ],
    methods: [{
      name: 'symbol',
      read: 'symbol',
      toggle: 'symbol()',
    }],
  });
}
