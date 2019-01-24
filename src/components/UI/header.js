import React from "react";

import { Link } from "react-router-dom";

import "./header.css";

const Header = props => {
  return (
    <React.Fragment>
      <nav className="navbar bg-light">
        <div className="container">
          <span className="nav-item" style={{}}>
            {props.displayName}
          </span>
          <Link to="/test" className="nav-item">
            Test
          </Link>
          <Link to="/" className="nav-item">
            App
          </Link>

          {/* <span className="nav-item abs-center-x">
            <img id="navbarlogo" src="./logo.png" alt="logo" />
          </span> */}

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
