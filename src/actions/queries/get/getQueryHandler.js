import { firestore } from "../../../config/firebase";

import { buildQueryFromInput } from "./buildGetQuery";

// main call
export const sendGetQuery = (queries, augmentors, dispatch) => {
  //refine augmentors : later
  //build query
  let queryList = buildQueryFromInput(
    queries,
    augmentors.containerId,
    augmentors.properties.depth
  );

  // console.log(queryList);

  //execute query

  // prepare an array to detach listeners later
  const removeListener = new Array();

  // loop over each firestore query yay! finally :)
  queryList.forEach(queryObject => {
    // get last index of remove listener array, to keep track of
    // how much we have looped
    var operatingIndice = removeListener.length;
    // loop over one object to get a single key, primetag
    Object.keys(queryObject).forEach(primetag => {
      // look at individual queries to execute under the given primetag
      queryObject[primetag].forEach((query, i) => {
        // query => actual query to be executed
        // add callvack function to out array at last index
        removeListener[i + operatingIndice] = query.onSnapshot(snap => {
          // the snap object will betriggered at start and on every realtime update
          // console.log(snap);
          snap.docChanges().forEach(change => {
            // doc changes container only nodes that have changed

            // dispatch an update down to middlewares!
            // middlewares require the following:
            // data, type of change, structuring by which tag, primetag for a query, node's id

            dispatch({
              type: "realtimeUpdate",
              payload: {
                data: change.doc.data(),
                type: change.type,
                str_by: augmentors.properties.structureBy,
                primeTag: primetag,
                node_id: change.doc.id
              }
            });
          });
        });
      });
    });
  });
  // only executed on first time function call, dispatch the removeListeners array to be used later
  dispatch({ type: "removeEventListener", payload: removeListener });
};
