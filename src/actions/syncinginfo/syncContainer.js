import { firestore } from "../../config/firebase";

export const syncContainer = containerId => {
  return async dispatch => {
    try {
      firestore
        .collection("containers")
        .doc(containerId)
        .onSnapshot(doc => {
          let { name, teammates, cached_taglist } = doc.data();
          dispatch({
            type: "syncContainer",
            payload: {
              name: name,
              teammates: teammates,
              cached_list: cached_taglist
            }
          });
        });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot retreive your Space, Please reload the page",
          color: "red",
          code: "404"
        }
      });
    }
  };
};
