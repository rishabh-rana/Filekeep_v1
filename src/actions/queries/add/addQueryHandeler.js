import { firestore } from "../../../config/firebase";

import { buildQueryFromInput } from "./buildAddQuery";

// main call
export const sendAddQuery = (queries, augmentors, dispatch) => {
  //refine augmentors : later
  //build query and execute it
  let isDone = buildQueryFromInput(
    queries,
    augmentors.containerId,
    augmentors.cached_list,
    null,
    dispatch
  );
};
