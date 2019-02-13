import cloneDeep from "lodash/cloneDeep";

const reducer = (
  state = {
    stack: [],
    structure: {}
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

  if (action.type === "createStructureCache") {
    // console.log(state);
    const stacker = [...state.stack];
    if (action.payload.depth === 1) {
      stacker.push({
        instruction: action.payload.nodeMap,
        isDelete: action.payload.delete,
        parentTagHelper: action.payload.parentTagHelper
      });
      return {
        ...state,
        stack: stacker
      };
    }
  }

  if (action.type === "buildStructure") {
    var myTree = cloneDeep(state.structure);

    if (!action.payload.isDelete) {
      // console.log("hit this");

      if (action.payload.instruction.length === 1) {
        // only update if no node exist currently
        if (myTree.hasOwnProperty(action.payload.instruction[0]) === false) {
          myTree[action.payload.instruction[0]] = {
            parentTag: action.payload.parentTagHelper,
            child: {}
          };
        }
      } else if (action.payload.instruction.length === 2) {
        // only update if no node exist currently
        if (
          myTree[action.payload.instruction[0]].child.hasOwnProperty(
            action.payload.instruction[1]
          ) === false
        ) {
          myTree[action.payload.instruction[0]].child[
            action.payload.instruction[1]
          ] = {
            child: {}
          };
        }
      }
    } else {
      if (action.payload.instruction.length === 1) {
        delete myTree[action.payload.instruction[0]];
      } else if (action.payload.instruction.length === 2) {
        delete myTree[action.payload.instruction[0]].child[
          action.payload.instruction[1]
        ];
      }
    }

    return {
      ...state,
      structure: myTree
    };
  }

  if (action.type === "clearStack") {
    // console.log(state);
    return {
      ...state,
      stack: []
    };
  }

  return state;
};

export default reducer;
