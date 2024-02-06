import { ChainId, ChainIds } from "@sovryn/ethers-provider";
import { ContractInterface } from "ethers";
import { methodUid } from "../utils";

export type PauserContractBuilder = {
  group: string;
  abi: ContractInterface;
  addresses: Partial<Record<ChainId, string>>;
  methods: PauserMethodBuilder[];
};

export type PauserMethodBuilder = {
  name: string;
  read: string;
  toggle: string;
  unpause?: string;
  flag?: boolean;
  key?: string;
};

export type PauserContract = Omit<PauserContractBuilder, 'methods'> & {
  methods: PauserMethod[];
};

export type PauserMethod = PauserMethodBuilder & {
  uid: string;
};

const I_TOKEN_ABI = [
  'function checkPause(string) view returns (bool)',
  'function toggleFunctionPause(string,bool)',
];

const I_TOKEN_FUNCTIONS: Record<string, string> = {
  borrow: "borrow(bytes32,uint256,uint256,uint256,address,address,address,bytes)",
  marginTrade: "marginTrade(bytes32,uint256,uint256,uint256,address,address,uint256,bytes)",
}

const BRIDGE_ABI = [
  'function paused() view returns (bool)',
  'function pause()',
  'function unpause()',
  'function frozen() view returns (bool)',
  'function freeze()',
  'function unfreeze()',
];

const loanTokens: Record<string, Record<string, string>> = {
  iDOC: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0x74e00A8CeDdC752074aad367785bFae7034ed89f',
  },
  iUSDT: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0xd1f225BEAE98ccc51c468d1E92d0331c4f93e566',
  },
  iRBTC: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
  },
  iBRPO: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0x6226b4B3F29Ecb5f9EEC3eC3391488173418dD5d',
  },
  iXUSD: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0xE27428101550f8104A6d06D830e2E0a097e1d006',
  },
  iDLLR: {
    [ChainIds.RSK_MAINNET]: '0xd8D25f03EBbA94E15Df2eD4d6D38276B595593c1',
    [ChainIds.RSK_TESTNET]: '0x9125087A98BC975Fa3E912226165D5C7e9F669cc',
  },
};

// const bridges: Record<string, Record<string, string>> = {
//   'Bridge ETH-RSK, ETH Side': {
//     [ChainIds.RSK_MAINNET]: '0x33C0D33a0d4312562ad622F91d12B0AC47366EE1',
//     [ChainIds.RSK_TESTNET]: '0x2b456e230225C4670FBF10b9dA506C019a24cAC7',
//   },
//   'Bridge ETH-RSK, RSK Side': {
//     [ChainIds.RSK_MAINNET]: '0x1CcAd820B6d031B41C54f1F3dA11c0d48b399581',
//     [ChainIds.RSK_TESTNET]: '0xC0E7A7FfF4aBa5e7286D5d67dD016B719DCc9156',
//   },
//   'Bridge BSC-RSK, BSC Side': {
//     [ChainIds.RSK_MAINNET]: '0xdfc7127593c8af1a17146893f10e08528f4c2aa7',
//     [ChainIds.RSK_TESTNET]: '0x862e8aff917319594cc7faaae5350d21196c086f',
//   },
//   'Bridge BSC-RSK, RSK Side': {
//     [ChainIds.RSK_MAINNET]: '0x971b97c8cc82e7d27bc467c2dc3f219c6ee2e350',
//     [ChainIds.RSK_TESTNET]: '0x2b2bcad081fa773dc655361d1bb30577caa556f8',
//   },
// };

const pauserMethods: PauserContractBuilder[] = [{
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
    [ChainIds.RSK_MAINNET]: '0x5A0D867e0D70Fcc6Ade25C3F1B89d618b5B4Eaa7',
    [ChainIds.RSK_TESTNET]: '0x25380305f223B32FDB844152abD2E82BC5Ad99c3',
  },
  methods: [{
    name: 'Pause protocol',
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
    [ChainIds.RSK_MAINNET]: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
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
  group: 'Loan Token Logic WRBTC',
  abi: BRIDGE_ABI,
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
  group: 'Loan Token Logic LM',
  abi: BRIDGE_ABI,
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

for (const group in loanTokens) {
  pauserMethods.push({
    group: `${group} Loan Token`,
    addresses: loanTokens[group],
    abi: I_TOKEN_ABI, // todo: add actual abi
    methods: Object.keys(I_TOKEN_FUNCTIONS).map(name => ({
        name: `Pause: ${name}`,
        read: 'checkPause(string)',
        toggle: 'toggleFunctionPause(string,bool)',
        flag: true,
        key: I_TOKEN_FUNCTIONS[name],
    })),
  });
}

// for (const group in bridges) {
//   pauserMethods.push({
//     group: group,
//     addresses: bridges[group],
//     abi: BRIDGE_ABI,
//     methods: [{
//       name: 'Pause',
//       read: 'paused',
//       toggle: 'pause',
//       unpause: 'unpause',
//     }, {
//         name: 'Freeze',
//         read: 'frozen',
//         toggle: 'freeze',
//         unpause: 'unfreeze',
//     }],
//   });
// }

export const PAUSER_METHODS: PauserContract[] = pauserMethods.map(item => ({
  ...item,
  methods: item.methods.map(method => ({
    ...method,
    uid: methodUid(method),
  })),
}));
