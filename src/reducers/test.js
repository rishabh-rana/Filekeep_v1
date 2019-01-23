const reducer = (
  state = {
    unsubscribe: null
  },
  action
) => {
  //do something
  if (action.type === "unsub") {
    return { ...state, unsubscribe: action.payload };
  }
  return state;
};

export default reducer;
