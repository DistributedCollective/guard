import { useEffect, useState } from "react";
import { PausedState, state } from "../../state/shared";
import { findChanged } from "../../utils";

export const ProposalBuilder = () => {

  const [initial, setInitial] = useState(state.get().pauser.methods);
  const [current, setCurrent] = useState(state.get().proposal);
  const [changes, setChanges] = useState<PausedState[]>([]);

  useEffect(() => {
    const sub1 = state.select('pauser').subscribe(({ methods }) => setInitial(methods));
    const sub2 = state.select('proposal').subscribe(setCurrent);
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setChanges(findChanged(initial, current));
  }, [current, initial]);

  return (
    <div>
      <h1>ProposalBuilder</h1>
      <p>Changed {changes.length} states.</p>
    </div>
  );
};

