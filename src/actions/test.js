import { firestore } from "../config/firebase";
// import { auth } from "../config/firebase";

export const testfunc = ub => {
  return dispatch => {
    // console.log("query sent");
    if (ub) {
      // console.log("unsub");
      ub();
    }

    var fakeinput = [["687", ">", 0]];
    var query = firestore.collection("trial");

    for (var i in fakeinput) {
      query = query.where(fakeinput[i][0], fakeinput[i][1], fakeinput[i][2]);
    }

    query = query.orderBy("687");

    var benchmark = Date.now();

    var unsubscribe = query.onSnapshot(function(snap) {
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

export const testfunc2 = () => {
  return dispatch => {
    firestore
      .collection("containers")
      .doc("wVVZdUYLCLHDC988MUMi")
      .collection("nodes")
      .where("id", "==", "8")
      .get()
      .then(snap => {
        snap.forEach(doc => {
          // console.log(doc.data());
        });
      });
  };
};

export const writefunc = () => {
  return async dispatch => {
    // create a new compartment
    const docref = await firestore.collection("containers").add({
      cached_taglist: [{ t: "App" }],
      name: "Trial Compartment"
    });
    // grab this id and put it in the app
    console.log(docref.id);
    // create a new node
    firestore
      .collection("containers")
      .doc(docref.id)
      .collection("nodes")
      .add({
        app: "App",
        tag: {
          App: 1
        },
        title: "App"
      });
  };
};
