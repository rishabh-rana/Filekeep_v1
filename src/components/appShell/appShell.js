import React from "react";

//component Imports

import FixedShell from "./fixedPart/fixedShell";
import DynamicShell from "./dynamicPart/dynamicShell";

import * as syncContainers from "../../actions/syncinginfo/syncContainer";
import * as flushArchives from "../../actions/queries/flushDb";

import { connect } from "react-redux";
import WorkspaceShell from "./dynamicPart/workspaceShell";

// pass the userid and container id as props to this component

class AppShell extends React.Component {
  componentDidMount() {
    //get the cachedList from a container
    //get container info
    this.props.syncContainer(this.props.containerId);
  }
  render() {
    return (
      <div className="row mt-4" style={{ maxWidth: "100%" }}>
        <div className="col-12">
          <div className="container">
            <FixedShell
              cached_list={this.props.container.cached_list}
              containerId={this.props.containerId}
              containerName={this.props.container.name}
              userDetails={this.props.user}
              removeEventListener={this.props.removeEventListener}
              flushArchives={this.props.flushArchives}
            />
          </div>
        </div>

        <div
          className="col-3 mt-2"
          style={{ background: "dodgerBlue", minHeight: "400px" }}
        >
          <div className="pl-3" style={{ height: "100%" }}>
            <WorkspaceShell />
          </div>
        </div>

        <div className="col-9 mt-2">
          <DynamicShell
            currentStructure={this.props.currentStructure}
            isLoadedFlag={this.props.container.name ? true : false}
          />
        </div>
      </div>
    );
  }
}

const mapstate = state => {
  return {
    container: state.container,
    user: state.auth,
    currentStructure: state.currentStructure,
    removeEventListener: state.currentDataArchive.removeEventListener || null
  };
};

export default connect(
  mapstate,
  {
    ...syncContainers,
    ...flushArchives
  }
)(AppShell);
