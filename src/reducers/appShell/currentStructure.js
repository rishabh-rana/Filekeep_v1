import cloneDeep from "lodash/cloneDeep";

const reducer = (
  state = {
    stack: [],
    structure: {},
    readyToParse: false,
    readyToParseHelper: null
  },
  action
) => {
  if (action.type === "flushArchives") {
    return {
      stack: [],
      structure: {},
      readyToParse: false,
      readyToParseHelper: null
    };
  }

  //do something

  if (action.type === "createStructure") {
    const nodeMap = action.payload.nodeMap;
    //tried deleting using this, not deleting structure, just adding 'null'
    // const setMode = action.payload.action ? action.payload.id : null;
    const setMode = action.payload.id;
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

  if (action.type === "createStructureCache") {
    if (state.readyToParseHelper) clearTimeout(state.readyToParseHelper);
    const helper = setTimeout(() => {
      console.log("timedOut");
      return {
        ...state,
        readyToParse: true,
        readyToParseHelper: null
      };
    }, 50);
    console.log(state);
    const stacker = [...state.stack];
    stacker.push({
      instruction: action.payload.nodeMap,
      isDelete: action.payload.delete
    });
    return {
      ...state,
      stack: stacker,
      readyToParseHelper: helper
    };
  }

  if (action.type === "buildStructure") {
    var myTree = cloneDeep(state.structure);
    if (action.payload.instruction.length === 1) {
      myTree[action.payload.instruction[0]] = {};
    } else if (action.payload.instruction.length === 2) {
      myTree[action.payload.instruction[0]][action.payload.instruction[1]] = {};
    }

    return {
      ...state,
      structure: myTree
    };
  }

  if (action.type === "clearStack") {
    console.log(state);
    return {
      ...state,
      readyToParse: false,
      stack: []
    };
  }

  return state;
};

export default reducer;
