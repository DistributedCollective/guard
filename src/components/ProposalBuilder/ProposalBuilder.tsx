import { useCallback, useEffect, useState } from "react";
import { PausedState, state } from "../../state/shared";
import { downloadAsJson, findChanged } from "../../utils";
import { Button } from "@sovryn/ui";
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { useSigner } from "../../hooks/useSigner";
import { CONTRACTS } from "../../config/contracts";

const makeTransactionData = (group: string, method: string, value: boolean): MetaTransactionData => {
  const _group = CONTRACTS.find((item) => item.group === group);
  const _method = _group?.methods.find((item) => item.name === method);

  if (!_group || !_method) {
    throw new Error(`Invalid group or method: ${group}.${method}`);
  }

  let data = '';
  if (_method.flag) {
    data = _group.contract.interface.encodeFunctionData(_method.toggle, [value]);
  } else {
    data = _group.contract.interface.encodeFunctionData(_method.unpause && !value ? _method.unpause : _method.toggle, []);
  }

  return { to: _group.contract.address, value: '0', data };
};

export const ProposalBuilder = () => {

  const [txData, setTxData] = useState<string>();
  const [txHash, setTxHash] = useState<string>();

  const { submitTransaction } = useSigner();

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

  const handleSubmit = useCallback(async () => {
    const value = await submitTransaction(changes.map(item => makeTransactionData(item.group, item.method, item.value)));

    const signatures = Array.from(value.safeTransaction.signatures.entries());

    setTxData(JSON.stringify({
      data: value.safeTransaction.data,
      signatures,
    }, null, 2));

    setTxHash(value.txHash);
  }, [changes, submitTransaction]);

  return (
    <div>
      <h1>ProposalBuilder</h1>
      <p>Changed {changes.length} states.</p>
      <Button onClick={handleSubmit} text="Propose & Approve" disabled={!changes.length} />
      <hr />
      {txData && <div>
        <textarea value={txData} readOnly />
        <Button onClick={() => downloadAsJson(txData)} text="Download" />
      <br/>Tx HasH: <input readOnly value={txHash} /></div>}
    </div>
  );
};
