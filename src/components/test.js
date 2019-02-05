import React from "react";
import TextEditor from "./richTextEditor/editor";

const Test = props => {
  return (
    <React.Fragment>
      <span onClick={() => props.testfunc(props.unsubscribe)}>Get Data</span> ||
      <span onClick={props.writefunc}>Create new container</span>
      <div className="container mt-5">
        <TextEditor />
      </div>
    </React.Fragment>
  );
};

export default Test;
