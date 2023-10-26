import { ChainId, ChainIds } from "@sovryn/ethers-provider";

type PauserContract = {
  group: string;
  addresses: Partial<Record<ChainId, string>>;
  methods: PauserMethod[];
};

type PauserMethod = {
  name: string;
  read: string;
  toggle: string;
  unpause?: string;
  flag?: boolean;
};

export const PAUSER_METHODS: PauserContract[] = [{
  group: 'Protocol',
  addresses: {
    [ChainIds.RSK_MAINNET]: '',
    [ChainIds.RSK_TESTNET]: '',
  },
  methods: [{
    name: 'isProtocolPaused',
    read: 'isProtocolPaused()',
    toggle: 'togglePaused(bool)',
    flag: true,
  }],
}, {
  group: 'Staking',
  addresses: {
    [ChainIds.RSK_MAINNET]: '',
    [ChainIds.RSK_TESTNET]: '',
  },
  methods: [{
    name: 'paused',
    read: 'paused()',
    toggle: 'pauseUnpause(bool)',
    flag: true,
  }, {
    name: 'frozen',
    read: 'frozen()',
    toggle: 'freezeUnfreeze(bool)',
    flag: true,
  }],
}, {
  group: 'Loan Token Beacom #1', // todo: add for all loan tokens
  addresses: {
    [ChainIds.RSK_MAINNET]: '',
    [ChainIds.RSK_TESTNET]: '',
  },
  methods: [{
    name: 'Paused',
    read: 'paused()',
    toggle: 'pause()',
    unpause: 'unpause()',
  }],
}];
