import React from "react";
import styled from "styled-components";
import { queryFunctions } from "../../../appData/queryFunctions";

const Clipper = styled.div`
  overflow: hidden;
`;

const Scrollable = styled.div`
  overflow-x: scroll;
  white-space: nowrap;
  overflow-y: hidden;
  height: calc(100% + 20px);
  cursor: text;
`;

const Word = styled.div`
  cursor: default;
  display: inline-block;
  margin-right: 5px;
  background: ${props =>
    props.color === "dodgerblue" ? "dodgerblue" : "salmon"};
`;

class MainBar extends React.Component {
  handleScrollableclick = () => {
    document.getElementById("lastscrollablecontenteditable").focus();
  };

  render() {
    return (
      <Clipper className="form-control">
        <Scrollable
          onClick={this.handleScrollableclick}
          id="mainScrollabledivtoscrolltoend"
        >
          {this.props.inputParser.map((word, index) => {
            var color = "dodgerblue";
            if (queryFunctions.indexOf(word) !== -1) color = "salmon";

            return (
              <Word key={index} className="badge" color={color}>
                {word}
              </Word>
            );
          })}
          <input
            id="lastscrollablecontenteditable"
            style={{
              display: "inline-block",
              border: "none",
              outline: "none",
              width: "125px"
            }}
            value={this.props.input}
            onChange={e => this.props.handleLastBoxChange(e)}
            onFocus={this.props.handleFirstType}
            onBlur={this.props.handleBlur}
            onKeyDown={e => this.props.handleKeyPress(e)}
          />
        </Scrollable>
      </Clipper>
    );
  }
}
export default MainBar;
