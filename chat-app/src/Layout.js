import React from "react";

const Layout = ({ component: Component, ...rest }) => {
  return (
    <>
      <div style={{ marginLeft: "18%" }}>
        <div className="w3-container">
          <div className="row">
            <Component {...rest} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
