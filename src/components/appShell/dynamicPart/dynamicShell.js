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
              {props.currentDataArchive[list] &&
                props.currentDataArchive[list].children &&
                Object.keys(props.currentDataArchive[list].children).map(
                  card => {
                    // if info of this card is not in the archive, then ommit it
                    // DO THIS LATER LATER
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
                        {props.currentDataArchive[
                          props.currentDataArchive[list].children[card]
                        ] &&
                          props.currentDataArchive[
                            props.currentDataArchive[list].children[card]
                          ].title}
                      </div>
                    );
                  }
                )}
            </div>
          );
        })}
    </React.Fragment>
  );
};
export default DyanamicShell;
