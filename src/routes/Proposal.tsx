import { useEffect } from "react";
import { PauserGroupCard } from "../components/PauserGroupCard/PauserGroupCard";
import { PAUSER_METHODS } from "../config/pauser";
import { toPausedState } from "../utils";
import { state } from "../state/shared";
import { ProposalBuilder } from "../components/ProposalBuilder/ProposalBuilder";
import { CONTRACTS } from "../config/contracts";

export const Proposal = () => {

  useEffect(() => {
    const methods = toPausedState(PAUSER_METHODS);

    const items = methods.map((item) => {
      const group = CONTRACTS.find((contract) => contract.group === item.group)!;
      const method = group.methods.find((method) => method.name === item.method)!.read;
      return group.contract[method]().then((value: boolean) => ({ group: item.group, method: item.method, value }));
    });

    Promise.all(items).then(state.actions.initPauserValues).catch(console.error);
  }, []);

  return (
    <>
      <h1 className="mb-8">Build a transaction:</h1>

      {PAUSER_METHODS.map((method) => <PauserGroupCard key={method.group} group={method} />)}

      <ProposalBuilder />
    </>
  );
}