import React from "react";
import styled from "styled-components";

import { connect } from "react-redux";

import * as actions from "../../../actions/queries/add/addQueryFromButton";

const Button = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 5px;
  opacity: 0.7;
  background: salmon;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
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
        />
      );
    }
    return <Button onClick={this.handleClick}>{content}</Button>;
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
    ...actions
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

  prepareQuery = () => {
    var requiredParentInfo = {};
    requiredParentInfo.id = this.props.parentId;
    requiredParentInfo.tag = this.props.parentInfo.tag;
    requiredParentInfo.tagid = this.props.parentInfo.tagids;
    requiredParentInfo.title = this.props.parentInfo.title;
    requiredParentInfo.children = this.props.parentInfo.children;
    // constructed the parentinfo

    //contruct 'in' array

    var inArray = new Array();
    Object.keys(this.props.parentInfo.tag).forEach(tag => {
      inArray[this.props.parentInfo.tag[tag] - 1] = tag;
    });

    var query = {};
    query[this.state.text] = {
      in: inArray
    };

    this.props.sendQueryFromButton(
      [query],
      this.props.containerId,
      this.props.cached_list,
      requiredParentInfo
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
