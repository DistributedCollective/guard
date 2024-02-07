import { useCallback, useEffect, useState } from "react";
import { state } from "../state/shared";

export const usePauserState = (group: string) => {

  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [initialValue, setInitialValue] = useState(state.get().pauser.methods.filter(item => item.group === group));
  const [value, setCurrentValue] = useState(state.get().proposal.filter(item => item.group === group));

  useEffect(() => {
    const sub = state.select('pauser').subscribe(pauser => {
      setLoaded(pauser.loaded);
      setLoading(pauser.loading);
      setInitialValue(pauser.methods.filter(item => item.group === group));
    });

    return () => sub.unsubscribe();
  }, [group]);

  useEffect(() => {
    const sub = state.select('proposal').subscribe(pauser => {
      setCurrentValue(pauser.filter(item => item.group === group));
    });

    return () => sub.unsubscribe();
  }, [group]);

  const getInitialValue = useCallback((uid: string) => initialValue.find(item => item.uid === uid)?.value || false, [initialValue]);
  const getValue = useCallback((uid: string) => value.find(item => item.uid === uid)?.value || false, [value]);
  const setValue = useCallback((uid: string, value: boolean) => state.actions.setProposalValue(group, uid, value), [group]);
  const isDirty = useCallback((uid: string) => getInitialValue(uid) !== getValue(uid), [getInitialValue, getValue]);

  return {
    loading,
    loaded,
    initialValue,
    value,
    get: getValue,
    set: setValue,
    getInitialValue,
    isDirty,
  };
};
