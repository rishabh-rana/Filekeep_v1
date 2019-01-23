import React from "react";
import ErrorBoundaryTemplate from "./ErrorBoundaryTemplate";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  };
  //catch error from children
  componentDidCatch(error, info) {
    console.log("yp");
    this.setState({
      hasError: true
    });
  }
  render() {
    if (this.state.hasError) {
      //return a template for the error page if error [make a graphic for this]
      return <ErrorBoundaryTemplate />;
    } else {
      // return children if no error
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
