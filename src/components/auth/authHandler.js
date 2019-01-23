import React from "react";
import { connect } from "react-redux";

import "./auth.css";

import * as actions from "../../actions/auth/signin";

const Auth = props => {
  return (
    <div>
      <div className="authimg">
        <img
          alt="Sign-in with Google"
          src="./googleSigninButton.png"
          onClick={props.signin}
        />
        <div className="subtext">More options coming soon!</div>
      </div>
      <div className="backgrnd" />
    </div>
  );
};

// const mapstate = state => {
//   return {
//     main: state.auth
//   };
// };

export default connect(
  null,
  actions
)(Auth);
