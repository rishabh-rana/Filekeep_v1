import React from "react";
import QueryInput from "./queryInput";

import * as SendQuery from "../../../actions/queries/queryInitiator";
import { connect } from "react-redux";

const FixedShell = props => {
  return (
    <React.Fragment>
      <QueryInput
        cached_list={props.cached_list}
        sendQuery={props.sendQuery}
        containerName={props.containerName}
        userDetails={props.userDetails}
        containerId={props.containerId}
        removeEventListener={props.removeEventListener}
        flushArchives={props.flushArchives}
      />
    </React.Fragment>
  );
};
export default connect(
  null,
  {
    ...SendQuery
  }
)(FixedShell);
