import React from "react";
import styled, { css } from "styled-components";

import Fuse from "fuse.js";

class QueryInput extends React.Component {
  state = {
    input: "",
    matchedRecords: [],
    stopInterval: null,
    turbo: false,
    inFocus: false
  };
  options = {
    threshold: 0.1,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: ["t", "a"]
  };
  fuse = null;
  numberofResults = 3;
  matchDelay = 100;

  handleFirstType = () => {
    this.setState({
      turbo: true,
      inFocus: true
    });
  };

  handleBlur = () => {
    this.setState({
      inFocus: false
    });
  };

  handleChange = e => {
    this.setState({
      input: e.target.value,
      turbo: false
    });
    if (this.state.stopInterval === null) {
      this.handleMatching();
    }
  };

  handleMatching = () => {
    var stopInterval = setTimeout(
      () => {
        var queryArray = this.state.input.split(" ");
        var query = queryArray[queryArray.length - 1];

        var match = this.fuse.search(query).slice(0, this.numberofResults);

        if (match && match[0] && match[0].t === query) {
          this.setState({
            matchedRecords: [],
            stopInterval: null
          });
          return;
        }

        if (match !== this.state.matchedRecords) {
          this.setState({
            matchedRecords: match,
            stopInterval: null
          });
        } else {
          this.setState({
            stopInterval: null
          });
        }
      },
      this.state.turbo ? 50 : this.matchDelay
    );

    this.setState({
      stopInterval: stopInterval
    });
  };

  stopMatching = () => {
    clearTimeout(this.state.stopInterval);
    this.setState({
      stopInterval: null
    });
  };

  handleTagSelection = tag => {
    var newinput = this.state.input.split(" ");
    newinput.pop();
    newinput.push(tag + " ");
    var updatedInput = newinput.join(" ");
    this.setState({
      input: updatedInput,
      matchedRecords: []
    });
  };

  componentDidUpdate(newProps) {
    if (newProps && newProps.cached_list !== this.props.cached_list) {
      this.fuse = new Fuse(this.props.cached_list, this.options);
    }
  }

  componentWillUnmount() {
    this.stopMatching();
  }

  sendQuery = () => {
    //query, {augmentors} //ALWAYS DISPATCH Augmentor>Properties >>properties is important

    //remove previou listeners
    if (this.props.removeEventListener) {
      this.props.removeEventListener.forEach(rmls => {
        rmls();
      });
    }

    this.props.flushArchives();

    this.props.sendQuery(this.state.input, {
      containerId: this.props.containerId,
      containerName: this.props.containerName,
      userDetails: this.props.userDetails,
      properties: {
        depth: 2,
        style: "list",
        structureBy: "tag"
      }
    });
  };

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div className="input-group">
          <input
            className="form-control"
            onChange={e => this.handleChange(e)}
            onFocus={this.handleFirstType}
            onBlur={this.handleBlur}
            value={this.state.input}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              onClick={this.sendQuery}
            >
              Search
            </button>
          </div>
        </div>
        <div
          style={{
            display: "block",
            position: "relative",
            width: "100%",
            zIndex: "1000"
          }}
        >
          {(this.state.inFocus || this.state.inFocusoverride) && (
            <DropDown
              main={this.state.matchedRecords}
              handleTagSelection={this.handleTagSelection}
              handleinFocusOverride={this.handleinFocusOverride}
            />
          )}
        </div>
      </div>
    );
  }
}
export default QueryInput;

//Dropdown Class

const DropItemTray = styled.div`
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  background: white;
  margin-top: 3px;
  border-radius: 0.25rem;
  height: auto;
  overflow: hidden;
`;

const DropItem = styled.div`
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  height: calc(2.25rem + 2px);
  cursor: pointer;

  ${props =>
    props.active &&
    css`
      background: lightblue;
    `}
`;

class DropDown extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.active !== nextState.active) {
      return true;
    }

    if (this.state.main.length !== nextProps.main.length) {
      return true;
    }

    if (this.state.main[0]) {
      let flag = false;
      for (var i in nextProps.main) {
        if (nextProps.main[i].t !== this.state.main[i].t) {
          flag = true;
        }
      }

      return flag;
    }

    if (nextProps.main[0]) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    if (this.state.main !== this.props.main) {
      this.setState({
        main: this.props.main,
        active: 0
      });
    }
  }

  state = {
    main: [],
    active: 0
  };

  handleKeyboardInput = e => {
    if (e.key === "ArrowDown" && this.state.active < 2) {
      e.preventDefault();
      this.setState({
        active: this.state.active + 1
      });
    } else if (e.key === "ArrowUp" && this.state.active > 0) {
      e.preventDefault();
      this.setState({
        active: this.state.active - 1
      });
    } else if (e.key === "Enter") {
      // e.preventDefault();
      if (this.state.main.length !== 0 && this.state.main[this.state.active]) {
        var myTag = this.state.main[this.state.active].t;
        this.props.handleTagSelection(myTag);
      }
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyboardInput);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyboardInput);
  }

  render() {
    return (
      <DropItemTray key={this.state.active}>
        {this.state.main.map((item, index) => {
          return (
            <DropItem key={item.t} active={index === this.state.active}>
              {item.t}
            </DropItem>
          );
        })}
      </DropItemTray>
    );
  }
}
