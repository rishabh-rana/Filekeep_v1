import cloneDeep from "lodash/cloneDeep";

const reducer = (state = {}, action) => {
  if (action.type === "flushArchives") {
    return {};
  }

  //do something

  if (action.type === "createStructure") {
    const nodeMap = action.payload.nodeMap;
    const setMode = action.payload.action ? action.payload.id : null;
    let replacer = cloneDeep(state[nodeMap[0]]) || null;
    let newObj = {};

    if (action.payload.nodeMap.length === 1) {
      newObj[nodeMap[0]] = replacer;

      if (newObj[nodeMap[0]]) {
        newObj[nodeMap[0]].id = setMode;
      } else {
        newObj[nodeMap[0]] = {
          id: setMode
        };
      }
    } else if (action.payload.nodeMap.length === 2) {
      newObj[nodeMap[0]] = replacer;
      // console.log(newObj);
      if (
        newObj[nodeMap[0]] &&
        newObj[nodeMap[0]].child &&
        newObj[nodeMap[0]].child[nodeMap[1]]
      ) {
        newObj[nodeMap[0]].child[nodeMap[1]].id = setMode;
      } else if (newObj[nodeMap[0]] && newObj[nodeMap[0]].child) {
        newObj[nodeMap[0]].child[nodeMap[1]] = {
          id: setMode
        };
      } else if (newObj[nodeMap[0]]) {
        newObj[nodeMap[0]].child = {
          [nodeMap[1]]: {
            id: setMode
          }
        };
      } else {
        newObj[nodeMap[0]] = {
          child: {
            [nodeMap[1]]: {
              id: setMode
            }
          }
        };
      }
    }

    return {
      ...state,
      ...newObj
    };
  }

  return state;
};

export default reducer;
