import { firestore } from "../../config/firebase";

export const queryFirestore = () => {
  return dispatch => {
    //Construct Query Reference
    // let query = firestore.collection("containers").doc(groupId).collection("nodes");
    // let local_properties = firestore.collection("users").doc(userId).collection("groups").doc(groupId).collection("workspaces").doc(workspaceId)
    // dispatch({type: 'queryFirestore', payload:  })
  };
};
