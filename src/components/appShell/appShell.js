import React from "react";

//component Imports

import FixedShell from "./fixedPart/fixedShell";
import DynamicShell from "./dynamicPart/react-beautiful-dnd";

import * as syncContainers from "../../actions/syncinginfo/syncContainer";
import * as flushArchives from "../../actions/queries/flushDb";
import * as BuildStructure from "../../actions/structuring/build";
import * as handleReactDndReorder from "../../actions/reorder/reorder";

import { connect } from "react-redux";
import WorkspaceShell from "./dynamicPart/workspaceShell";

// pass the userid and container id as props to this component

class AppShell extends React.Component {
  state = {
    stopInterval: null
  };

  componentDidMount() {
    //get the cachedList from a container
    //get container info
    this.props.syncContainer(this.props.containerId);

    var stop = setInterval(() => {
      if (
        this.props.instructionStack &&
        this.props.instructionStack.length > 0
      ) {
        console.log("fired building");
        this.props.buildStructureFromInstructions(this.props.instructionStack);
      }
    }, 1);

    this.setState({
      stopInterval: stop
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.stopInterval);
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
            currentDataArchive={this.props.currentDataArchive}
            isLoadedFlag={this.props.container.name ? true : false}
            handleReactDndReorder={this.props.handleReactDndReorder}
            containerId={this.props.containerId}
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
    instructionStack: state.currentStructure.stack,
    currentStructure: state.currentStructure.structure,
    currentDataArchive: state.currentDataArchive,
    removeEventListener: state.removeListeners.removeEventListener || null
  };
};

export default connect(
  mapstate,
  {
    ...syncContainers,
    ...flushArchives,
    ...BuildStructure,
    ...handleReactDndReorder
  }
)(AppShell);
