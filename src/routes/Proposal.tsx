import { useEffect } from "react";
import { PauserGroupCard } from "../components/PauserGroupCard/PauserGroupCard";
import { PAUSER_METHODS } from "../config/pauser";
import { Contract } from "ethers";
import { getProvider } from "@sovryn/ethers-provider";
import { CHAIN_ID } from "../config/network";
import { toPausedState } from "../utils";
import { state } from "../state/shared";
import { ProposalBuilder } from "../components/ProposalBuilder/ProposalBuilder";

export const Proposal = () => {

  useEffect(() => {
    const contracts = PAUSER_METHODS.map((item) => {
      const address = item.addresses[CHAIN_ID]!;
      const contract = new Contract(item.addresses[CHAIN_ID]!, item.abi, getProvider(CHAIN_ID));
      return { group: item.group, address, contract, methods: item.methods };
    });

    const methods = toPausedState(PAUSER_METHODS);

    const items = methods.map((item) => {
      const group = contracts.find((contract) => contract.group === item.group)!;
      const method = group.methods.find((method) => method.name === item.method)!.read;
      return group.contract[method]().then((value: boolean) => ({ group: item.group, method: item.method, value }));
    });

    Promise.all(items).then(state.actions.initPauserValues).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Propose</h1>

      {PAUSER_METHODS.map((method) => <PauserGroupCard key={method.group} group={method} />)}

      <ProposalBuilder />
    </div>
  );
}