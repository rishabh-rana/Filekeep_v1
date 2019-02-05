export default ({ dispatch }) => next => action => {
  if (!action.payload || action.type !== "realtimeUpdate") {
    return next(action);
  }

  // set data
  if (action.payload.type !== "removed") {
    var parcel = {};
    parcel[action.payload.node_id] = action.payload.data;

    dispatch({ type: "archiveDatafromRealtimeUpdate", payload: parcel });
  }

  // find primeId

  var primeId, primeTagDepth;

  Object.keys(action.payload.data.tag).forEach(tag => {
    if (tag === action.payload.primeTag)
      primeTagDepth = action.payload.data.tag[tag];
  });
  console.log(primeTagDepth);

  // set structure

  if (action.payload.str_by === "tag") {
    const flippedMap = new Array();
    if (action.payload.data.hasOwnProperty("tagids")) {
      Object.keys(action.payload.data.tagids).forEach(nodeid => {
        if (action.payload.data.tagids[nodeid] === primeTagDepth)
          primeId = nodeid;
        flippedMap[action.payload.data.tagids[nodeid] - 1] = nodeid;
      });
    }
    flippedMap[0] = action.payload.node_id;

    // console.log(flippedMap);

    var nodeMap;

    switch (flippedMap.indexOf(primeId)) {
      case -1:
        nodeMap = [flippedMap[0]];
        break;

      case 1:
        nodeMap = [flippedMap[1], flippedMap[0]];
        break;

      case 2:
        //later
        nodeMap = [flippedMap[2], flippedMap[1], flippedMap[0]];
    }
    console.log(nodeMap);
    dispatch({
      type: "createStructureCache",
      payload: {
        nodeMap: nodeMap,
        delete: action.payload.type === "removed" ? false : true,
        id: action.payload.node_id
      }
    });
  }

  return next(action);
};
