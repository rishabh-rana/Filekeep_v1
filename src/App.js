import React, { Component } from "react";

import * as test from "./actions/test";
import { connect } from "react-redux";

import Test from "./components/test";

import { BrowserRouter, Route } from "react-router-dom";

import { firestore } from "./config/firebase";

class App extends Component {
  componentDidMount() {
    // console.log("establishing connection");
    // firestore.collection("users").onSnapshot(() => {}); connect to all the instances initially for ~5ms response time for all queries
    // firestore.collection("docs").onSnapshot(() => {});
    //grab cache for ~ 50% first print time reduction
    //grab real, updated response from server
  }
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Route
            path="/"
            component={() => (
              <Test
                testfunc={this.props.testfunc}
                writefunc={this.props.writefunc}
                unsubscribe={this.props.unsubscribe}
              />
            )}
          />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapstate = state => {
  return {
    unsubscribe: state.test.unsubscribe
  };
};

export default connect(
  mapstate,
  { ...test }
)(App);
