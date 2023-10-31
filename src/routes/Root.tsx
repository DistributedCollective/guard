import { Link, Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <div id="sidebar">
        <Link to="/">Propose</Link>
        <Link to="/sign">Sign</Link>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}