import React from "react";
import DropDown from "./dropdownResults";
import StyledDivDisplay from "./styledDivDisplay";

import MainBar from "./mainBar";

import styled from "styled-components";

import Fuse from "fuse.js";

import {
  queryFunctionsFuse,
  queryFunctions,
  queryFunctionsStart
} from "../../../appData/queryFunctions";

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
  // stopDelayMatchingTimeout : if to stop the setTimeout call on the input in case of unmount, used to ensure too uch processing doesnt take place
  // turbo: set true by handleFirstType to get results of firt keystroke without any delay
  // inFocus: determines if the input is in focus to Mount/ Unmount the DropDown
  state = {
    input: "",
    inputParser: [],
    matchedRecords: [],
    stopDelayMatchingTimeout: null,
    turbo: false,
    inFocus: false,
    fuseOn: {
      cached_list: true,
      queryFunctionsStart: true
    }
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

  //update input on state, ensure matching takes placeonly if there is no 'stopDelayMatchingTimeout' propoerty
  //thus, while stopDelayMatchingTimeout exists on the tate, there is no new matches calculated
  handleChange = e => {
    var char = e.target.value;

    this.setState({
      input: char,
      turbo: false
    });
    if (this.state.stopDelayMatchingTimeout === null) {
      this.handleMatching();
    }
  };

  handleBackspace = e => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (this.state.input === "") {
        var newParser = [...this.state.inputParser];

        if (newParser.length !== 0) newParser.pop();

        if (newParser.length === 0) {
          this.handleFuserepair(null);
        } else {
          this.handleFuserepair(
            newParser[newParser.length - 1],
            newParser[newParser.length - 2]
          );
        }

        this.setState({
          inputParser: newParser
        });
      } else {
        var newInput = this.state.input;
        newInput = newInput.slice(0, newInput.length - 1);
        this.setState({
          input: newInput
        });
        if (this.state.stopDelayMatchingTimeout === null) {
          this.handleMatching();
        }
      }
    }
  };

  handleKeyPress = e => {
    this.handleBackspace(e);

    // handle sending the query using enter
    if (e.key === "Enter" && this.state.matchedRecords.length === 0)
      this.sendQuery();
  };

  //handle fuzzy search with fuse.js
  //stopDelayMatchingTimeout ensures that only after ;matchDelay' milliseconds, the dropdown is calculated
  handleMatching = () => {
    var stopDelayMatchingTimeout = setTimeout(
      () => {
        if (
          (this.state.inputParser[0] === "add" ||
            this.state.inputParser[0] === "create") &&
          this.state.input[0] === "'"
        ) {
          if (
            this.state.input.length > 2 &&
            this.state.input[this.state.input.length - 1] === "'"
          ) {
            var newParser = [...this.state.inputParser];
            var newinput = this.state.input.slice(1);
            newinput = newinput.slice(0, newinput.length - 1);
            newParser.push(newinput);
            this.handleFuserepair(newinput);
            this.setState({
              input: "",
              inputParser: newParser,
              stopDelayMatchingTimeout: null
            });
          } else {
            this.setState({
              stopDelayMatchingTimeout: null
            });
          }
          return;
        }

        // split input by spaces
        // var queryArray = this.state.input.split(" ");
        // take last word
        // var query = queryArray[queryArray.length - 1];
        //get matches for the last word
        var match = this.fuse
          .search(this.state.input)
          .slice(0, this.numberofResults);

        //if match is an exact match, remove the dropdown results, without setting stopDelayMatchingTimeout for quick unmount
        if (match && match[0] && match[0].t === this.state.input) {
          var newinput = "";
          if (this.state.input === "add" || this.state.input === "create")
            newinput = "'";
          var newinputParser = [...this.state.inputParser, this.state.input];
          this.handleFuserepair(this.state.input);
          this.setState({
            matchedRecords: [],
            input: newinput,
            inputParser: newinputParser,
            stopDelayMatchingTimeout: null
          });
          // exits to prevent calling setState below
          return;
        }

        // if new matches are found, set them as new options, else just set stopDelayMatchingTimeout: null to ensure
        //another match query can be made on the next keystroke
        if (match !== this.state.matchedRecords) {
          this.setState({
            matchedRecords: match,
            stopDelayMatchingTimeout: null
          });
        } else {
          this.setState({
            stopDelayMatchingTimeout: null
          });
        }
      },
      this.state.turbo ? 20 : this.matchDelay
    );
    //above ensure if turv=bo is on, only 20ms delay is done

    // set stopeInterval !== null to prevent more queries to match from keystrokes
    this.setState({
      stopDelayMatchingTimeout: stopDelayMatchingTimeout
    });
  };
  //stop matching current query
  stopMatching = () => {
    clearTimeout(this.state.stopDelayMatchingTimeout);
    this.setState({
      stopDelayMatchingTimeout: null
    });
  };

  repairFuse = (filter, filterOn) => {
    if (filterOn === "in") {
      var newOptions = this.props.cached_list.filter(
        obj => obj.hasOwnProperty("c") && obj.c[filter]
      );
      // store details
      this.setState({
        fuseOn: {
          cached_list: true,
          filter: filter
        }
      });
      this.fuse = new Fuse([...newOptions], this.options);
    } else if (filterOn === "all") {
      // store the fuse details
      this.setState({
        fuseOn: {
          cached_list: true,
          queryFunctionsFuse: true,
          queryFunctionsStart: true
        }
      });
      this.fuse = new Fuse(
        [
          ...this.props.cached_list,
          ...queryFunctionsFuse,
          ...queryFunctionsStart
        ],
        this.options
      );
    } else if (filterOn === "functionsOnly") {
      this.setState({
        fuseOn: {
          queryFunctionsFuse: true
        }
      });

      this.fuse = new Fuse([...queryFunctionsFuse], this.options);
    } else if (filterOn === "cachedListOnly") {
      this.setState({
        fuseOn: {
          queryFunctionsStart: true,
          cached_list: true
        }
      });

      this.fuse = new Fuse(
        [...this.props.cached_list, ...queryFunctionsStart],
        this.options
      );
    }
  };
  //call before setting this.setState, hence last element of inputParser should be previous tag
  handleFuserepair = (tag, optionalFilter) => {
    // pass empty string for everything
    if (tag === "") {
      this.repairFuse(null, "all");
    }
    //pass null to move to intitial fuse
    if (tag === null) {
      this.repairFuse(null, "cachedListOnly");
      return;
    }

    if (queryFunctions.indexOf(tag) === -1) {
      this.repairFuse(null, "functionsOnly");
    } else if (queryFunctions.indexOf(tag) !== -1 && tag !== "in") {
      this.repairFuse(null, "cachedListOnly");
    } else if (tag === "in") {
      // handle create and add mode i.e. ommit the filter
      if (
        this.state.inputParser[this.state.inputParser.length - 2] === "add" ||
        this.state.inputParser[this.state.inputParser.length - 2] === "create"
      ) {
        this.repairFuse(null, "cachedListOnly");
        return;
      }

      var filter = this.state.inputParser[this.state.inputParser.length - 1];
      if (optionalFilter) filter = optionalFilter;

      this.repairFuse(filter, "in");
    } else {
      this.repairFuse(null, "all");
    }
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
    this.handleFuserepair(tag);
    var newInput = "";
    if (tag === "add" || tag === "create") newInput = "'";
    this.setState({
      input: newInput,
      inputParser: newinputParser,
      matchedRecords: []
    });
  };

  //send query to firestore
  sendQuery = () => {
    //IMPORTANT
    //query, {augmentors} //ALWAYS DISPATCH Augmentor>Properties >>properties is important

    //remove previous listeners, the removeEventListener is an array of functions to be called

    // flush current structure and data

    if (
      this.state.inputParser[0] !== "add" &&
      this.state.inputParser[0] !== "create"
    ) {
      this.props.flushArchives();
      if (this.props.removeEventListener) {
        this.props.removeEventListener.forEach(rmls => {
          rmls();
        });
      }
    }

    //send fresh query, get properties from a master state obtained from user properties later
    // also send across list of all hashtags used in current query

    // sending cachedlist to all queries currently, edit to include only for create queries

    this.props.sendQuery(this.state.inputParser, {
      containerId: this.props.containerId,
      containerName: this.props.containerName,
      userDetails: this.props.userDetails,
      properties: {
        depth: 2,
        style: "list",
        structureBy: "tag"
      },
      cached_list: this.props.cached_list
    });
  };

  //Lifecycle hooks

  //prepare new fuse if new cached-list is obtained from server, with updated data
  componentDidUpdate(newProps) {
    if (newProps && newProps.cached_list) {
      var newopts = [];
      var opts = this.state.fuseOn;
      if (opts.cached_list === true && opts.hasOwnProperty("filter")) {
        // handle it
        var newOptions = newProps.cached_list.filter(
          obj => obj.hasOwnProperty("c") && obj.c[opts.filter]
        );
        newopts = [...newOptions];
      } else if (opts.cached_list === true) {
        newopts = [...newopts, ...newProps.cached_list];
      }
      if (opts.queryFunctionsStart === true) {
        newopts = [...newopts, ...queryFunctionsStart];
      }
      if (opts.queryFunctionsFuse === true) {
        newopts = [...newopts, ...queryFunctionsFuse];
      }

      this.fuse = new Fuse(newopts, this.options);
    }
  }
  //stop matching if unmounted
  componentWillUnmount() {
    this.stopMatching();
  }

  //render call
  render() {
    return (
      <div style={{ width: "100%", position: "relative" }}>
        <MainBar
          inputParser={this.state.inputParser}
          input={this.state.input}
          handleLastBoxChange={this.handleChange}
          handleFirstType={this.handleFirstType}
          handleBlur={this.handleBlur}
          handleKeyPress={this.handleKeyPress}
        />
        {(this.state.inFocus || this.state.inFocusoverride) && (
          <DropList>
            <DropDown
              main={this.state.matchedRecords}
              handleTagSelection={this.handleTagSelection}
              handleinFocusOverride={this.handleinFocusOverride}
            />
          </DropList>
        )}
      </div>
    );
  }
}
export default QueryInput;
