const reducer = (state = {}, action) => {
  //do something
  if (action.type === "archiveDatafromRealtimeUpdate") {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === "flushArchives") {
    return {};
  }

  if (action.type === "reorderListItems") {
    console.log("hey");
    if (action.payload.parent2 === null) {
      // reorder within list
      return {
        ...state,
        [action.payload.parent]: {
          ...state[action.payload.parent],
          children: action.payload.children
        }
      };
    } else {
      // reorder between lists
      return {
        ...state,
        [action.payload.parent]: {
          ...state[action.payload.parent],
          children: action.payload.children[action.payload.parent]
        },
        [action.payload.parent2]: {
          ...state[action.payload.parent2],
          children: action.payload.children[action.payload.parent2]
        }
      };
    }
  }

  return state;
};

export default reducer;
