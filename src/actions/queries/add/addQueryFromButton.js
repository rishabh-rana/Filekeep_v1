import { buildQueryFromInput } from "./buildAddQuery";

export const sendAddQueryFromButton = (
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
