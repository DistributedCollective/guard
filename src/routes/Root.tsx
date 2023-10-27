import { Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <>
      <div id="sidebar">
        <h1>Sidebar</h1>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}