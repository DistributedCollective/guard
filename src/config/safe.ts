import type { ContractNetworksConfig } from '@safe-global/safe-core-sdk'
import { ChainIds } from '@sovryn/ethers-provider';

export const contractNetworks: ContractNetworksConfig = {
  '30': {
    safeMasterCopyAddress: '0x3e5c63644e683549055b9be8653de26e0b4cd36e',
    safeProxyFactoryAddress: '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2',
    multiSendAddress: '0xa238cbeb142c10ef7ad8442c6d1f9e89e07e7761',
    multiSendCallOnlyAddress: '0x40a2accbd92bca938b02010e17a5b8929b49130d',
    fallbackHandlerAddress: '0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4',
    signMessageLibAddress: '0xa65387f16b013cf2af4605ad8aa5ec25a2cba3a2',
    createCallAddress: '0x7cbb62eaa69f79e6873cd1ecb2392971036cfaa4',
  },
  '31': {
    safeMasterCopyAddress: '0x3e5c63644e683549055b9be8653de26e0b4cd36e',
    safeProxyFactoryAddress: '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2',
    multiSendAddress: '0xa238cbeb142c10ef7ad8442c6d1f9e89e07e7761',
    multiSendCallOnlyAddress: '0x40a2accbd92bca938b02010e17a5b8929b49130d',
    fallbackHandlerAddress: '0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4',
    signMessageLibAddress: '0xa65387f16b013cf2af4605ad8aa5ec25a2cba3a2',
    createCallAddress: '0x7cbb62eaa69f79e6873cd1ecb2392971036cfaa4',
  },
};

export const safeContracts: Partial<Record<ChainIds, string>> = {
  [ChainIds.RSK_MAINNET]: '0xdd8e07a57560ada0a2d84a96c457a5e6ddd488b7',
  [ChainIds.RSK_TESTNET]: '0x92ad69a1adab3b2d67a18c17b517b73dd961dd5a', // testnet guardian safe
  // [ChainIds.RSK_TESTNET]: '0x5dbdc2260760188630a376d4ed20b952339806f1', // victor test safe
};
