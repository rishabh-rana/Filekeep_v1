const reducer = (state = {}, action) => {
  //do something

  if (action.type === "removeEventListener") {
    return {
      removeEventListener: action.payload
    };
  }

  if (action.type === "flushArchives") {
    return {};
  }

  return state;
};

export default reducer;
