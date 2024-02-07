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

  const { loading, get, set, getInitialValue } = usePauserState(group.group);

  return (
    <div className="mb-2">
      <h2><LinkAccountToExplorer value={address} label={group.group} /></h2>
      {group.methods.map(item => <Checkbox key={item.uid} className="ml-2" label={<>{item.name} <RenderValue value={get(item.uid)} initialValue={getInitialValue(item.uid)} /></>} disabled={loading} checked={get(item.uid)} onChangeValue={value => set(item.uid, value)} />)}
    </div>
  );
};

type RenderValueProps = {
  value: boolean;
  initialValue: boolean;
};
const RenderValue: FC<RenderValueProps> = ({ value, initialValue }) => {
  if (value !== initialValue) {
    if (value) return <span className="text-warning-75">(To be PAUSED)</span>;
    return <span className="text-warning-75">(To be <strong>UN</strong>PAUSED)</span>;
  }
};
