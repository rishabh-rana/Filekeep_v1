import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/error/errorHandler";

//a function to get the bootstrap class name from the color input in the dispatch
const getBootstrapClassForColor = color => {
  switch (color) {
    case "red":
      return "danger";
    case "yellow":
      return "warning";
    case "light":
      return "info";
    default:
      return "warning";
  }
};

//a functional component which handles when our stateful component will mount
const ErrorPopup = props => {
  return props.error ? (
    <Popup
      message={props.error.message}
      duration={props.error.duration}
      color={getBootstrapClassForColor(props.color)}
      code={props.code}
      moreinfo={props.moreinfo}
      resolveError={props.resolveError}
    />
  ) : (
    <React.Fragment />
  );
};

//Main Popup
class Popup extends React.Component {
  //Remove the popup after 'duration' miliseconds automatically
  componentDidMount() {
    setTimeout(() => {
      //calls dispatch(throwerror) witha null payload, setting error to null and removing the popup
      this.props.resolveError();
    }, this.props.duration);
  }

  render() {
    let { message, code, color, moreinfo } = this.props;

    //get the Bootstrap class to be put on the alert
    let bootstrapClassName = "mx-auto alert alert-" + color;

    //Return the popup to be shown when the state has an error != null
    return (
      <div
        className={bootstrapClassName}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)"
        }}
      >
        <strong>{code}</strong> {message}
      </div>
    );
  }
}

//redux setup
const mapstate = state => {
  return {
    error: state.error.error
  };
};
//default export
export default connect(
  mapstate,
  actions
)(ErrorPopup);
