import { FC } from "react";
import { PauserContract } from "../../config/pauser";
import { CHAIN_ID } from "../../config/network";
import { usePauserState } from "../../hooks/usePauserState";
import { LinkAccountToExplorer } from "../LinkToExplorer/LinkToExplorer";
import { Checkbox } from "@sovryn/ui";

type PauserGroupCardProps = {
  group: PauserContract;
};

export const PauserGroupCard: FC<PauserGroupCardProps> = ({ group }) => {
  const address = group.addresses[CHAIN_ID]!;

  const { loading, get, set, isDirty } = usePauserState(group.group);

  return (
    <div className="mb-2">
      <h2><LinkAccountToExplorer value={address} label={group.group} /></h2>
      {group.methods.map(item => <Checkbox key={item.read} className="ml-2" label={<>{item.name} {isDirty(item.name) ? ' (changed)' : ' (initial)'}</>} disabled={loading} checked={get(item.name)} onChangeValue={value => set(item.name, value)} />)}
    </div>
  );
};
