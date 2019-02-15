import React from "react";
import styled, { css } from "styled-components";

import { connect } from "react-redux";

import * as action1 from "../../../actions/queries/add/addQueryFromButton";
import * as action2 from "../../../actions/queries/create/createQueryFromButton";

const Button = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 5px;
  opacity: 0.7;
  background: salmon;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;

  ${props =>
    props.structural &&
    css`
      background: yellowgreen;
    `}
`;

const InputAdder = styled.input`
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  padding-left: 10px;
`;

class AddButton extends React.Component {
  state = {
    open: false
  };

  handleClick = flag => {
    if (flag === "close") {
      this.setState({
        open: false
      });
      return;
    }

    this.setState({
      open: !this.state.open
    });
  };

  render() {
    let content = "+";
    if (this.state.open) {
      content = (
        <Input
          handleClick={this.handleClick}
          parentInfo={this.props.parentInfo}
          parentId={this.props.parentId}
          containerId={this.props.containerId}
          cached_list={this.props.cached_list}
          sendQueryFromButton={this.props.sendQueryFromButton}
          sendCreateQueryFromButton={this.props.sendCreateQueryFromButton}
          isStructural={this.props.isStructural}
        />
      );
    }
    return (
      <Button
        structural={this.props.isStructural || false}
        onClick={this.handleClick}
      >
        {content}
      </Button>
    );
  }
}

const mapstate = state => {
  return {
    cached_list: state.container.cached_list
  };
};

export default connect(
  mapstate,
  {
    ...action1,
    ...action2
  }
)(AddButton);

// helper component

class Input extends React.Component {
  state = {
    text: ""
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  prepareParentinfo = () => {
    var requiredParentInfo = {};
    requiredParentInfo.id = this.props.parentId;
    requiredParentInfo.tag = this.props.parentInfo.tag;
    requiredParentInfo.tagid = this.props.parentInfo.tagids;
    requiredParentInfo.title = this.props.parentInfo.title;
    requiredParentInfo.children = this.props.parentInfo.children;
    return requiredParentInfo;
  };

  prepareInArray = () => {
    var inArray = new Array();
    Object.keys(this.props.parentInfo.tag).forEach(tag => {
      inArray[this.props.parentInfo.tag[tag] - 1] = tag;
    });

    return inArray;
  };

  prepareQuery = () => {
    if (this.props.isStructural) {
      this.prepareCreateQuery();
    } else {
      this.prepareAddQuery();
    }
  };

  prepareCreateQuery = () => {
    var query = {};
    query[this.state.text] = {
      in: this.prepareInArray()
    };

    this.props.sendCreateQueryFromButton(
      [query],
      this.props.containerId,
      this.props.cached_list,
      this.prepareParentinfo()
    );
  };

  prepareAddQuery = () => {
    var query = {};
    query[this.state.text] = {
      in: this.prepareInArray()
    };

    this.props.sendAddQueryFromButton(
      [query],
      this.props.containerId,
      this.props.cached_list,
      this.prepareParentinfo()
    );
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      // send query
      this.prepareQuery();

      //   this.props.handleClick("close");
      this.setState({
        text: ""
      });
    }
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef.current.focus();
  }
  render() {
    return (
      <InputAdder
        ref={this.myRef}
        onBlur={this.props.handleClick}
        onChange={e => this.handleChange(e)}
        value={this.state.text}
        onKeyDown={e => this.handleKeyDown(e)}
      />
    );
  }
}
