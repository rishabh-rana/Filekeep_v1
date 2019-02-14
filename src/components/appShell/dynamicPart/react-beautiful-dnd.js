import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

import Loader from "../../UI/loader/loader";

const ListInline = styled.div`
  display: inline-block;
  margin-right: 5px;
`;

const DyanamicShell = props => {
  if (!props.isLoadedFlag) {
    return <Loader />;
  }

  return (
    <DragDropContext
      onDragEnd={result => {
        // handleing only within-list reordering

        if (result.destination) {
          props.handleReactDndReorder(
            result,
            props.currentDataArchive[result.source.droppableId].children,
            props.currentDataArchive[result.destination.droppableId].children,
            props.containerId,
            props.currentDataArchive[result.draggableId.slice(0, 20)],
            props.currentDataArchive[result.destination.droppableId]
          );
        }
      }}
    >
      {props.currentStructure &&
        Object.keys(props.currentStructure).map(list => {
          return (
            <ListInline key={list}>
              <div
                style={{
                  width: "200px",
                  background: "rgba(250,128,114,0.7)",
                  padding: "5px",
                  verticalAlign: "top",
                  borderRadius: "2px 2px 0 0"
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
                      background: "rgba(250,128,114,0.5)",
                      width: "200px",
                      minHeight: "100px",
                      display: "inline-block",
                      borderRadius: "0 0 2px 2px",
                      padding: "4px 5px 5px 5px",
                      verticalAlign: "top"
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
                              draggableId={
                                props.currentDataArchive[list].children[card] +
                                list
                              }
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    background: "rgba(250,128,114,1)",
                                    width: "100%",
                                    minHeight: "25px",
                                    margin: "0 0 4px 0",
                                    padding: "5px",
                                    borderRadius: "3px",
                                    ...provided.draggableProps.style
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
                              )}
                            </Draggable>
                          );
                        }
                      )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </ListInline>
          );
        })}
    </DragDropContext>
  );
};
export default DyanamicShell;
