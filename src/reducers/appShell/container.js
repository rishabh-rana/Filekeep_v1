const reducer = (
  state = {
    unsubscribe: null
  },
  action
) => {
  //do something
  if (action.type === "syncContainer") {
    return {
      ...state,
      name: action.payload.name,
      teammates: action.payload.teammates,
      cached_list: action.payload.cached_list
    };
  }
  return state;
};

export default reducer;
