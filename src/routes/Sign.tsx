import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { SafeTransaction } from '@safe-global/safe-core-sdk-types';
import { useSafe } from "../hooks/useSafe";
import { useSigner } from "../hooks/useSigner";
import SafeSignature from "@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature";
import { Button, ButtonSize, FormGroup, Input } from "@sovryn/ui";
import EthSignSignature from "@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature";
import { LinkAccountToExplorer, LinkHashToExplorer } from "../components/LinkToExplorer/LinkToExplorer";
import { distinctFilter } from "../utils";

export const Sign = () => {
  const { sdk, threshold, owners } = useSafe();
  const { approveTransaction, executeTransaction, account } = useSigner();

  const [preparing, setPreparing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();
 
  const [state, setState] = useState<SafeTransaction>();
  const [hash, setHash] = useState<string>();
  const [approvals, setApprovals] = useState<string[]>([]);

  const onReadLoad = useCallback(async (event: ProgressEvent<FileReader>) => {
    try {
      const { data, signatures } = JSON.parse(event.target?.result as string) as { data: string, signatures: [string, SafeSignature][] };

      if (sdk) {
        const tx = await sdk.copyTransaction({ data, signatures: [] } as any);
        const hash = await sdk.getTransactionHash(tx);

        signatures.forEach(([signer, signature]) => {
          tx.addSignature(new EthSignSignature(signature.signer, signature.data));
        });

        await sdk.getOwnersWhoApprovedTx(hash).then(setApprovals);

        setHash(hash);
        setState(tx);
      }
    } catch (error) {
      console.error(error);
    } finally { 
      setPreparing(false);
    }
  }, [sdk]);

  const handleProposalFile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPreparing(true);
    const reader = new FileReader();
    reader.onload = onReadLoad;
    reader.readAsText(event.target.files![0]);

    event.target.value = '';
  }, [onReadLoad]);

  const getApprovers = useCallback(async () => {
    setRefreshing(true);
    if (sdk && hash) {
      await sdk.getOwnersWhoApprovedTx(hash).then(setApprovals);
    } 
    setRefreshing(false);
  }, [hash, sdk]);

  const signers = useMemo(() => [...Array.from(state?.signatures.entries() || []).map(([signer]) => signer), ...approvals].map(item => item.toLowerCase()).filter(distinctFilter), [approvals, state?.signatures]);

  const didUserSign = useMemo(() => signers.includes((account || '').toLowerCase()), [account, signers]);
  const canExecute = useMemo(() => threshold <= signers.length, [signers, threshold]);
  const approveAndExecute = useMemo(() => signers.length + 1 >= threshold, [signers, threshold]);

  const handleApprove = useCallback(async () => {
    setLoading(true);
    try {
      if (sdk && hash) {
        const tx = await approveTransaction(hash);
        setTxHash(tx.hash);
        await tx.transactionResponse?.wait().then(() => getApprovers());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [approveTransaction, getApprovers, hash, sdk]);

  const handleExecute = useCallback(async () => {
    setLoading(true);
    try {
      if (sdk && state) {
        const tx = await executeTransaction(state);
        setTxHash(tx.hash);
        await tx.transactionResponse?.wait().then(() => getApprovers());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [executeTransaction, getApprovers, sdk, state]);

  const data = useMemo(() => {
    if (state) {
      const signatures = Array.from(state.signatures.entries());
  
      return JSON.stringify({
        data: state.data,
        signatures,
      }, null, 2);
    } return '{}';
  }, [state]);

  const isOwner = useMemo(() => owners.map(owner => owner.toLowerCase()).includes(account?.toLowerCase() ?? ''), [account, owners]);

  return (
    <>
      <h1>Approve Proposal</h1>

      {preparing && (<p>Preparing....</p>)}

      {!state && (<div>
        <h2>Upload proposal file:</h2>
        <input type="file" onChange={handleProposalFile} accept=".json" disabled={preparing} />
      </div>)}

      {state && (
        <>
          <FormGroup label="Transaction Hash" className="mt-4">
            <div className="flex justify-start space-x-4">
              <Input readOnly value={hash} />
              <Button onClick={() => navigator.clipboard.writeText(hash!)} text="Copy" />
            </div>
          </FormGroup>
          <FormGroup label="Transaction Content" className="mt-4 mb-4">
            <div className="flex justify-start space-x-4">
              <Input readOnly value={data} />
              <Button onClick={() => navigator.clipboard.writeText(data)} text="Copy" />
            </div>
          </FormGroup>

          {didUserSign && <p className="mb-3">You already signed.</p>}

          <div className="mb-3">
            {canExecute ? (
              <Button onClick={handleExecute} text="Execute" loading={loading} disabled={loading || !canExecute || !isOwner} />
            ) : (
              <Button onClick={approveAndExecute ? handleExecute : handleApprove} text={!approveAndExecute ? 'Approve' : 'Approve & Execute'} loading={loading} disabled={loading || (!canExecute && didUserSign) || !isOwner} />
            )}
          </div>

          {txHash && (
            <p>Submitted txHash: <LinkHashToExplorer value={txHash} /></p>
          )}

          <h2>Signers ({signers.length} / {threshold})</h2>
          {signers.map((signer) => <p key={signer}><LinkAccountToExplorer value={signer} /></p>)}
          <Button onClick={getApprovers} text="Refresh signers" loading={refreshing} disabled={refreshing} size={ButtonSize.small} />
        </>
      )}
    </>
  );
}