import { buildQueryFromInput } from "./buildCreateQuery";

export const sendCreateQueryFromButton = (
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
