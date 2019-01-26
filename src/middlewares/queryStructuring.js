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

  // set structure

  if (action.payload.str_by === "tag") {
    const flippedMap = new Array();
    Object.keys(action.payload.data.tag).forEach(key => {
      flippedMap[action.payload.data.tag[key] - 1] = key;
    });
    // console.log(flippedMap);

    var nodeMap;

    switch (flippedMap.indexOf(action.payload.primeTag)) {
      case 0:
        nodeMap = [flippedMap[1]];
        break;

      case 1:
        nodeMap = [flippedMap[2], flippedMap[0]];
        break;

      case 2:
        //later
        nodeMap = [flippedMap[3], flippedMap[1], flippedMap[0]];
    }

    dispatch({
      type: "createStructure",
      payload: {
        nodeMap: nodeMap,
        id: action.payload.node_id,
        action: action.payload.type === "removed" ? false : true
      }
    });
  }

  return next(action);
};
