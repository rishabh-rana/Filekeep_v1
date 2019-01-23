import { firestore } from "../config/firebase";
// import { auth } from "../config/firebase";

export const testfunc = ub => {
  return dispatch => {
    // console.log("query sent");
    if (ub) {
      // console.log("unsub");
      ub();
    }
    var fakeinput = [["tag.New", "==", true]];
    var query = firestore.collection("docs");

    for (var i in fakeinput) {
      query = query.where(fakeinput[i][0], fakeinput[i][1], fakeinput[i][2]);
    }

    var benchmark = Date.now();

    var unsubscribe = query.orderBy("static").onSnapshot(function(snap) {
      snap.docChanges().forEach(function(change) {
        console.log(change.doc.data());
      });
      var source = snap.metadata.fromCache ? "local cache" : "server";
      console.log(
        "response received in",
        Date.now() - benchmark,
        "ms from",
        source
      );
      dispatch({ type: "unsub", payload: unsubscribe });
    });
  };
};

export const writefunc = () => {
  return dispatch => {
    firestore.collection("docs").add({
      tag: {
        design: true
      },
      parent: {
        $$main: true
      },
      title: "Blog"
    });
  };
};
