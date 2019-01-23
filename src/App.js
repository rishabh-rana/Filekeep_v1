import React, { Component } from "react";

//actions import
import * as test from "./actions/test";

//redux setup
import { connect } from "react-redux";

//component Imports
import Test from "./components/test";

//router setup
import { BrowserRouter, Route } from "react-router-dom";

//Error Handlers
import ErrorPopup from "./components/ErrorHandler/ErrorPopup";

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
          <ErrorPopup />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

//redux setup
const mapstate = state => {
  return {
    unsubscribe: state.test.unsubscribe
  };
};
//default export
export default connect(
  mapstate,
  { ...test }
)(App);
