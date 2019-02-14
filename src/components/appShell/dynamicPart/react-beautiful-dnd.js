import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Loader from "../../UI/loader/loader";

const DyanamicShell = props => {
  if (!props.isLoadedFlag) {
    return <Loader />;
  }

  return (
    <DragDropContext
      onDragEnd={result => {
        // handleing only within-list reordering
        console.log(result);
        if (result.destination) {
          props.handleReactDndReorder(
            result,
            props.currentDataArchive[result.source.droppableId].children,
            props.currentDataArchive[result.destination.droppableId].children,
            props.containerId,
            props.currentDataArchive[result.draggableId],
            props.currentDataArchive[result.destination.droppableId]
          );
        }
      }}
    >
      {props.currentStructure &&
        Object.keys(props.currentStructure).map(list => {
          return (
            <React.Fragment>
              <div
                style={{
                  width: "200px",
                  background: "rgba(0,0,0,0.3)",
                  padding: "5px"
                }}
              >
                {props.currentStructure[list].parentTag ||
                  props.currentDataArchive[list].title}
              </div>
              <Droppable droppableId={list} key={list}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{
                      background: "salmon",
                      width: "200px",
                      minHeight: "100px",
                      display: "inline-block",
                      marginRight: "5px",
                      marginBottom: "5px",
                      borderRadius: "5px"
                    }}
                  >
                    {props.currentDataArchive[list] &&
                      props.currentDataArchive[list].children &&
                      Object.keys(props.currentDataArchive[list].children).map(
                        (card, index) => {
                          // if info of this card is not in the archive, then ommit it
                          // DO THIS LATER LATER
                          return (
                            <Draggable
                              key={card + list}
                              draggableId={card + list}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div
                                    style={{
                                      background: "rgba(0,0,0,0.1)",
                                      width: "90%",
                                      minHeight: "25px",
                                      margin: "0 0 0 0",
                                      padding: "5px",
                                      borderRadius: "3px"
                                    }}
                                  >
                                    {props.currentDataArchive[
                                      props.currentDataArchive[list].children[
                                        card
                                      ]
                                    ] &&
                                      props.currentDataArchive[
                                        props.currentDataArchive[list].children[
                                          card
                                        ]
                                      ].title}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        }
                      )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </React.Fragment>
          );
        })}
    </DragDropContext>
  );
};
export default DyanamicShell;
