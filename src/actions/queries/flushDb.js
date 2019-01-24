export const flushArchives = () => {
  return dispatch => {
    dispatch({ type: "flushArchives", payload: null });
  };
};
