import { buildQueryFromInput } from "./buildAddQuery";

export const sendQueryFromButton = (
  query,
  containerId,
  cached_list,
  parentinfo
) => {
  return dispatch => {
    var isDone = buildQueryFromInput(
      query,
      containerId,
      cached_list,
      parentinfo,
      dispatch
    );
  };
};
