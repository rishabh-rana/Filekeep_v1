import { firestore } from "../../config/firebase";

const parseInputToTags = input => {
  var mutatable = input;
  mutatable = mutatable.split(" ");
  var tags = [];
  for (var i in mutatable) {
    if (mutatable[i] !== "") {
      tags.push(mutatable[i]);
    }
  }
  return tags;
};

const buildQueryFromInput = (input, containerId, depth) => {
  var queryBase = firestore
    .collection("containers")
    .doc(containerId)
    .collection("nodes");
  var primeTag;

  //parse input
  var tags = parseInputToTags(input);

  //construct query
  var query = [];

  if (tags.length === 1) {
    primeTag = tags[0];
    query.push(queryBase);
    query.push(queryBase);
    for (var i = 0; i < depth; i++) {
      query[i] = query[i].where("tag." + tags[0], "==", i + 1);
    }

    return { queryList: query, primeTag: primeTag };
  }
};

export const sendQuery = (input, augmentors) => {
  return dispatch => {
    //refine augmentors
    //build query
    let queryObject = buildQueryFromInput(
      input,
      augmentors.containerId,
      augmentors.properties.depth
    );

    //execute query
    const removeListener = new Array(queryObject.queryList.length);
    queryObject.queryList.forEach((query, i) => {
      removeListener[i] = query.onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          // console.log(change.doc.data().tag);
          dispatch({
            type: "realtimeUpdate",
            payload: {
              data: change.doc.data(),
              type: change.type,
              str_by: augmentors.properties.structureBy,
              primeTag: queryObject.primeTag,
              node_id: change.doc.id
            }
          });
        });
      });
    });
    dispatch({ type: "removeEventListener", payload: removeListener });
  };
};
