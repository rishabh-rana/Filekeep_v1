import { firestore } from "../../config/firebase";
import cloneDeep from "lodash/cloneDeep";

export const handleReactDndReorder = (
  result,
  sourceItems,
  destinationItems,
  containerId,
  draggableData,
  newParentData
) => {
  return async dispatch => {
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
      var didItUpdate = await handleServerSync(
        containerId,
        result.source.droppableId,
        items,
        dispatch,
        null
      );
      // use didItUpdate to revert changes to order locally
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
      var didItUpdate = await handleServerSync(
        containerId,
        result.source.droppableId,
        newItems[result.source.droppableId],
        dispatch,
        draggableData,
        result.draggableId,
        newParentData
      );
      var didItUpdate2 = await handleServerSync(
        containerId,
        result.destination.droppableId,
        newItems[result.destination.droppableId],
        dispatch,
        null
      );
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

const handleServerSync = (
  containerId,
  docId,
  items,
  dispatch,
  draggableData,
  draggableId,
  newParentData
) => {
  try {
    firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes")
      .doc(docId)
      .update({
        children: items
      });

    if (draggableData) {
      var data = cloneDeep(newParentData);
      Object.keys(data.tag).forEach(tag => {
        data.tag[tag] = data.tag[tag] + 1;
      });
      // check if we need to add a tag with "1" as value
      var isStructural = true;
      var primeTag;
      Object.keys(draggableData.tag).forEach(tag => {
        if (draggableData.tag[tag] === 1) {
          isStructural = false;
          primeTag = tag;
        }
      });
      if (isStructural) {
        data.tag[primeTag] = 1;
      }
      // update tagids
      Object.keys(data.tagids).forEach(tagid => {
        data.tagids[tagid] = data.tagids[tagid] + 1;
      });
      // add parent tagid
      data.tagids[docId] = 2;

      firestore
        .collection("containers")
        .doc(containerId)
        .collection("nodes")
        .doc(draggableId)
        .update({
          tag: data.tag,
          tagids: data.tagids
        });
    }

    return true;
  } catch (err) {
    dispatch({
      type: "throwerror",
      payload: {
        message: "Cannot move the node now, please try again",
        color: "red"
      }
    });
    return false;
  }
};
