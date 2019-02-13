export const handleReactDndReorder = (
  result,
  sourceItems,
  destinationItems
) => {
  return dispatch => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(sourceItems, source.index, destination.index);
      dispatch({
        type: "reorderListItems",
        payload: {
          children: items,
          parent: result.source.droppableId,
          parent2: null
        }
      });
    } else {
      const newItems = move(sourceItems, destinationItems, source, destination);

      dispatch({
        type: "reorderListItems",
        payload: {
          children: newItems,
          parent: result.source.droppableId,
          parent2: result.destination.droppableId
        }
      });
    }
  };
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
