import { ChainIds } from "@sovryn/ethers-provider";
import { CHAIN_ID } from "../../config/network";
import { FC } from "react";

const EXPLORERS: Record<string, string> = {
  [ChainIds.RSK_MAINNET]: 'https://explorer.rsk.co',
  [ChainIds.RSK_TESTNET]: 'https://explorer.testnet.rsk.co',
};

const EXPLORER = EXPLORERS[CHAIN_ID];

type Props = { value: string; label?: string; };

export const LinkHashToExplorer: FC<Props> = ({ value, label }) => <a href={`${EXPLORER}/tx/${value}`} target="_blank" rel="noreferrer">{label ?? value}</a>;
export const LinkAccountToExplorer: FC<Props> = ({ value, label }) => <a href={`${EXPLORER}/address/${value}`} target="_blank" rel="noreferrer">{label ?? value}</a>;
