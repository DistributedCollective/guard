import { Contract } from "ethers";
import { CHAIN_ID } from "./network";
import { PAUSER_METHODS } from "./pauser";
import { getProvider } from "@sovryn/ethers-provider";

export const CONTRACTS = PAUSER_METHODS.map((item) => {
  const address = item.addresses[CHAIN_ID]!;
  const contract = new Contract(item.addresses[CHAIN_ID]!, item.abi, getProvider(CHAIN_ID));
  return { group: item.group, address, contract, methods: item.methods };
});
