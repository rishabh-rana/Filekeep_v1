import React from "react";

const Test = props => {
  return (
    <React.Fragment>
      <span onClick={() => props.testfunc(props.unsubscribe)}>Get Data</span> ||
      <span onClick={props.writefunc}>Write Data</span>
    </React.Fragment>
  );
};

export default Test;
