const reducer = (state = {}, action) => {
  //do something
  if (action.type === "archiveDatafromRealtimeUpdate") {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === "removeEventListener") {
    return {
      ...state,
      removeEventListener: action.payload
    };
  }

  if (action.type === "flushArchives") {
    return {};
  }

  return state;
};

export default reducer;
