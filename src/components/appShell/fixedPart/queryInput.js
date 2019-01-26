import React from "react";
import DropDown from "./dropdownResults";
import StyledDivDisplay from "./styledDivDisplay";

import styled from "styled-components";

import Fuse from "fuse.js";

import { queryFunctionsFuse } from "../../../appData/queryFunctions";

const DropList = styled.div`
  display: block;
  position: relative;
  width: 100%;
  z-index: 1000;
`;

class QueryInput extends React.Component {
  //constants and state

  //state description:
  // input holds the current input foe processing and to semd query
  // matchedRecords contain the records to be displayed in the dropdown, provided by fuse.js
  // stopInterval : if to stop the setTimeout call on the input in case of unmount, used to ensure too uch processing doesnt take place
  // turbo: set true by handleFirstType to get results of firt keystroke without any delay
  // inFocus: determines if the input is in focus to Mount/ Unmount the DropDown
  state = {
    input: "",
    inputParser: [],
    matchedRecords: [],
    stopInterval: null,
    turbo: false,
    inFocus: false,
    listeningToScroll: false
  };
  //fuse.js options
  options = {
    threshold: 0.1,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: ["t", "a"]
  };
  // the fuse object, initialised as public property
  fuse = null;
  //the number of results to be displayed in the dropdown
  numberofResults = 3;
  // the dealy before the dropdownkist updates, for performance upgrades only
  matchDelay = 100;

  // helper functions

  //handle initial quick results for first keystroke, while also rendering the Dropdown
  handleFirstType = () => {
    this.setState({
      turbo: true,
      inFocus: true
    });
  };

  //unmount DropDown by setting inFocus: false
  handleBlur = () => {
    this.setState({
      inFocus: false
    });
  };

  //update input on state, ensure matching takes placeonly if there is no 'stopInterval' propoerty
  //thus, while stopinterval exists on the tate, there is no new matches calculated
  handleChange = e => {
    var char = e.target.value.split(" ");

    this.setState({
      input: char[char.length - 1],
      turbo: false
    });
    if (this.state.stopInterval === null) {
      this.handleMatching();
    }
  };

  handleBackspace = e => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (this.state.input === "") {
        var newParser = [...this.state.inputParser];

        if (newParser.length !== 0) newParser.pop();

        this.setState({
          inputParser: newParser
        });
      } else {
        var newInput = this.state.input;
        newInput = newInput.slice(0, newInput.length - 1);
        this.setState({
          input: newInput
        });
        if (this.state.stopInterval === null) {
          this.handleMatching();
        }
      }
    }
  };

  handleSpacebar = e => {
    if (e.key === " ") {
      e.preventDefault();
      if (this.state.matchedRecords.length === 0) {
        this.setState({
          highlight: true
        });
      } else {
        this.setState({
          input: this.state.input + " "
        });
      }
    }
  };

  handleKeyPress = e => {
    this.handleAutoScroll();
  };

  //handle fuzzy search with fuse.js
  //stopInterval ensures that only after ;matchDelay' milliseconds, the dropdown is calculated
  handleMatching = () => {
    var stopInterval = setTimeout(
      () => {
        // split input by spaces
        // var queryArray = this.state.input.split(" ");
        // take last word
        // var query = queryArray[queryArray.length - 1];
        //get matches for the last word
        var match = this.fuse
          .search(this.state.input)
          .slice(0, this.numberofResults);

        //if match is an exact match, remove the dropdown results, without setting stopinterval for quick unmount
        if (match && match[0] && match[0].t === this.state.input) {
          var newinput = "";
          var newinputParser = [...this.state.inputParser, this.state.input];
          this.setState({
            matchedRecords: [],
            input: newinput,
            inputParser: newinputParser,
            stopInterval: null
          });
          // exits to prevent calling setState below
          return;
        }

        // if new matches are found, set them as new options, else just set stopInterval: null to ensure
        //another match query can be made on the next keystroke
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
      this.state.turbo ? 20 : this.matchDelay
    );
    //above ensure if turv=bo is on, only 20ms delay is done

    // set stopeInterval !== null to prevent more queries to match from keystrokes
    this.setState({
      stopInterval: stopInterval
    });
  };
  //stop matching current query
  stopMatching = () => {
    clearTimeout(this.state.stopInterval);
    this.setState({
      stopInterval: null
    });
  };

  //handle the tag selection from dropdown
  handleTagSelection = tag => {
    // split the input by spaces
    // var newinput = this.state.input;
    var newinputParser = [...this.state.inputParser];
    // remove last word
    // newinput.pop();
    //add the entire tag with a space
    // newinput.push(tag + " ");
    newinputParser.push(tag);
    // display results seperated by spaces
    // var updatedInput = newinput.join(" ");
    //update input for user, set matchedRecords to empty to unmount dropdown

    this.setState({
      input: "",
      inputParser: newinputParser,
      matchedRecords: []
    });
    //scroll input to end
    document.getElementById("realInvisibleInputItem").scrollLeft = 100000;
  };

  //send query to firestore
  sendQuery = () => {
    //IMPORTANT
    //query, {augmentors} //ALWAYS DISPATCH Augmentor>Properties >>properties is important

    //remove previous listeners, the removeEventListener is an array of functions to be called
    if (this.props.removeEventListener) {
      this.props.removeEventListener.forEach(rmls => {
        rmls();
      });
    }
    // flush current structure and data
    this.props.flushArchives();

    //send fresh query, get properties from a master state obtained from user properties later
    // also send across list of all hashtags used in current query
    this.props.sendQuery(this.state.inputParser, {
      containerId: this.props.containerId,
      containerName: this.props.containerName,
      userDetails: this.props.userDetails,
      hashtagsUsed: ["User Reviews", "Gantt Charts"],
      properties: {
        depth: 2,
        style: "list",
        structureBy: "tag"
      }
    });
  };

  handleAutoScroll = () => {
    if (
      document &&
      document.getElementById("realInvisibleInputItem") &&
      document.getElementById("realInvisibleInputItem").scrollLeft !== 0 &&
      this.state.listeningToScroll === false
    ) {
      const stopListen = setInterval(() => {
        document.getElementById(
          "styledDivScrollableElement"
        ).scrollLeft = document.getElementById(
          "realInvisibleInputItem"
        ).scrollLeft;
      }, 50);
      this.setState({
        listeningToScroll: stopListen
      });
    } else if (
      document &&
      document.getElementById("realInvisibleInputItem") &&
      document.getElementById("realInvisibleInputItem").scrollLeft === 0 &&
      this.state.listeningToScroll !== false
    ) {
      clearInterval(this.state.listeningToScroll);
      this.setState({
        listeningToScroll: false
      });
    }
  };

  //Lifecycle hooks

  //prepare new fuse if new cached-list is obtained from server, with updated data
  componentDidUpdate(newProps) {
    if (newProps && newProps.cached_list !== this.props.cached_list) {
      this.fuse = new Fuse(
        [...this.props.cached_list, ...queryFunctionsFuse],
        this.options
      );
    }
  }
  //stop matching and listening to scroll if unmounted
  componentWillUnmount() {
    this.stopMatching();
    clearInterval(this.state.listeningToScroll);
  }

  //render call
  render() {
    return (
      <div style={{ width: "100%", position: "relative" }}>
        <StyledDivDisplay
          display={this.state.inputParser}
          displayInput={this.state.input}
        />
        <div className="input-group">
          <input
            id="realInvisibleInputItem"
            className="form-control"
            style={{
              background: "transparent",
              zIndex: "2000",
              wordSpacing: "0.05rem",
              color: "transparent",
              caretColor: "black"
            }}
            onKeyDown={e => {
              this.handleBackspace(e);
              this.handleSpacebar(e);
              this.handleKeyPress(e);
            }}
            onChange={e => this.handleChange(e)}
            onFocus={this.handleFirstType}
            onBlur={this.handleBlur}
            value={this.state.inputParser.join(" ") + " " + this.state.input}
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
        <DropList>
          {(this.state.inFocus || this.state.inFocusoverride) && (
            <DropDown
              main={this.state.matchedRecords}
              handleTagSelection={this.handleTagSelection}
              handleinFocusOverride={this.handleinFocusOverride}
            />
          )}
        </DropList>
      </div>
    );
  }
}
export default QueryInput;
