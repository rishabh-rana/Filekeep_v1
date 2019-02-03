import React from "react";
import TextEditor from "./richTextEditor/editor";

const Test = props => {
  return (
    <React.Fragment>
      <div className="container mt-5">
        <TextEditor />
      </div>
    </React.Fragment>
  );
};

export default Test;

// <span onClick={() => props.testfunc(props.unsubscribe)}>Get Data</span> ||
//       <span onClick={props.writefunc}>Write Data</span>
