import React from "react";
import styled from "styled-components";

import { queryFunctions } from "../../../appData/queryFunctions";

const Word = styled.span`
  color: dodgerblue;
  font-weight: bold;
  word-spacing: 0.05rem;
`;

const Function = styled.span`
  color: salmon;
  font-weight: bold;
  word-spacing: 0.05rem;
`;

const Untagged = styled.span`
  color: black;
  word-spacing: 0.05rem;
`;

const Scrollable = styled.div`
  word-spacing: 0.05rem;
  overflow-x: scroll;
  white-space: nowrap;
  min-height: calc(100% + 20px);
`;

class StyledDivDisplay extends React.Component {
  render() {
    return (
      <div className="input-group" style={{ position: "absolute" }}>
        <div className="form-control" style={{ overflow: "hidden" }}>
          <Scrollable id="styledDivScrollableElement">
            {this.props.display.map((word, index) => {
              if (queryFunctions.indexOf(word) !== -1) {
                return <Function key={index}>{word} </Function>;
              } else {
                return <Word key={index}>{word} </Word>;
              }
            })}

            <Untagged>{this.props.displayInput}</Untagged>
          </Scrollable>
        </div>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary">Search</button>
        </div>
      </div>
    );
  }
}
export default StyledDivDisplay;
