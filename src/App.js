import React, { Component } from "react";

import * as auth from "./actions/auth";
import { connect } from "react-redux";

import Header from "./components/UI/header";

import { BrowserRouter, Route } from "react-router-dom";

import mixpanel from "./config/mixpanel";

class App extends Component {
  render() {
    mixpanel.track("test2");
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route path="/" component={Header} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  { ...auth }
)(App);
