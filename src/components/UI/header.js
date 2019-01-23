import React from "react";

import "./header.css";

const Header = props => {
  return (
    <React.Fragment>
      <nav className="navbar bg-light">
        <div className="container">
          <span className="nav-item" style={{}}>
            {props.displayName}
          </span>
          <span className="nav-item abs-center-x">
            <img id="navbarlogo" src="./logo.png" alt="logo" />
          </span>
          <a
            onClick={props.signout}
            className="nav-item"
            style={{ cursor: "pointer" }}
          >
            Signout
          </a>
        </div>
      </nav>
    </React.Fragment>
  );
};
export default Header;
