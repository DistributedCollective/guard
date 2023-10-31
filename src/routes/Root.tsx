import { Header } from "@sovryn/ui";
import { Link, Outlet } from "react-router-dom";
import { useSafe } from "../hooks/useSafe";
import { LinkAccountToExplorer } from "../components/LinkToExplorer/LinkToExplorer";
import { useAccount } from "../hooks/useAccount";
import { useMemo } from "react";

export const Root = () => {

  const { ready, threshold, owners } = useSafe();
  const { address } = useAccount(); 

  const isOwner = useMemo(() => owners.map(owner => owner.toLowerCase()).includes(address?.toLowerCase() ?? ''), [address, owners]);

  return (
    <>
      <Header menuItems={
        <ol>
          <li>
            <Link to="/">Propose</Link>
          </li>
          <li>
            <Link to="/sign">Sign</Link>
          </li>
        </ol>
      } secondaryContent={
        <ol>
          <li>
            <LinkAccountToExplorer value={address ?? '0x0'} />
            {!isOwner && <span className="text-error"> (not owner)</span>}
          </li>
          {ready && <li>Safe is ready ({threshold}/{owners.length} signatures)</li>}
        </ol>
      } />
      <div className="container my-8">
        <Outlet />
      </div>
    </>
  );
}