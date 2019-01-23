import React, { Component } from "react";

//actions import
import * as test from "./actions/test";
import * as authActions from "./actions/auth/signin";

//redux setup
import { connect } from "react-redux";

//component Imports
import Test from "./components/test";
import Auth from "./components/auth/authHandler";
import Header from "./components/UI/header";

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
    this.props.syncusers();
  }
  render() {
    if (this.props.auth.uid === null) {
      return <Auth />;
    }

    return (
      <BrowserRouter>
        <React.Fragment>
          <Route
            path="/"
            component={() => (
              <Header
                signout={this.props.signout}
                displayName={this.props.auth.displayName}
              />
            )}
          />
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
    unsubscribe: state.test.unsubscribe,
    auth: state.auth
  };
};
//default export
export default connect(
  mapstate,
  { ...test, ...authActions }
)(App);
