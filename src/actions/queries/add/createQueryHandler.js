import { firestore } from "../../../config/firebase";

import { buildQueryFromInput } from "./buildCreateQuery";

// main call
export const sendCreateQuery = (queries, augmentors, dispatch) => {
  //refine augmentors : later
  //build query and execute it
  let isDone = buildQueryFromInput(
    queries,
    augmentors.containerId,
    augmentors.cached_list,
    augmentors.parents,
    dispatch
  );
};
