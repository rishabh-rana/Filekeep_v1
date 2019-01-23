const reducer = (
  state = {
    uid:
      localStorage.getItem("uid") === "null" ||
      localStorage.getItem("uid") === null
        ? null
        : localStorage.getItem("uid"),
    displayName: "User"
  },
  action
) => {
  if (action.type === "syncusers") {
    if (action.payload) {
      localStorage.setItem("uid", action.payload.uid);
      return {
        ...state,
        uid: action.payload.uid,
        displayName: action.payload.displayName
      };
    } else {
      localStorage.setItem("uid", null);
      return {
        ...state,
        uid: null,
        displayName: "User"
      };
    }
  }
  return state;
};

export default reducer;
