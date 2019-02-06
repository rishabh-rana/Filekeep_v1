import React from "react";

import Loader from "../../UI/loader/loader";

const DyanamicShell = props => {
  if (!props.isLoadedFlag) {
    return <Loader />;
  }

  // console.log(props.currentStructure);
  return (
    <React.Fragment>
      {props.currentStructure &&
        Object.keys(props.currentStructure).map(list => {
          return (
            <div
              key={list}
              style={{
                background: "salmon",
                width: "200px",
                minHeight: "100px",
                display: "inline-block",
                marginRight: "5px",
                marginBottom: "5px",
                borderRadius: "5px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  display: "block",
                  background: "rgba(0,0,0,0.3)",
                  padding: "5px"
                }}
              >
                {props.currentStructure[list].parentTag ||
                  props.currentDataArchive[list].title}
              </div>
              {props.currentStructure[list] &&
                props.currentStructure[list].child &&
                Object.keys(props.currentStructure[list].child).map(card => {
                  return (
                    <div
                      style={{
                        background: "rgba(0,0,0,0.1)",
                        width: "90%",
                        minHeight: "25px",
                        margin: "5px auto",
                        padding: "5px",
                        borderRadius: "3px"
                      }}
                      key={card}
                    >
                      {props.currentDataArchive[card].title}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </React.Fragment>
  );
};
export default DyanamicShell;
