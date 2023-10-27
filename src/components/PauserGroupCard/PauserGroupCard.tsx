import { FC } from "react";
import { PauserContract } from "../../config/pauser";
import { CHAIN_ID } from "../../config/network";
import { usePauserState } from "../../hooks/usePauserState";

type PauserGroupCardProps = {
  group: PauserContract;
};

export const PauserGroupCard: FC<PauserGroupCardProps> = ({ group }) => {
  const address = group.addresses[CHAIN_ID]!;

  const { loading, get, set, isDirty } = usePauserState(group.group);

  return <div>
    <h2>{group.group} ({address})</h2>
    <div>{group.methods.map(item => <div key={item.read}><label>
      {item.name}
      <input type="checkbox" disabled={loading} checked={get(item.name)} onChange={(e) => set(item.name, e.target.checked)} />
      {isDirty(item.name) ? ' (changed)' : ' (initial)'}
    </label></div>)}</div>
  </div>
};
