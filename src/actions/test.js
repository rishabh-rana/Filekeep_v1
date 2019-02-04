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
          console.log(doc.data());
        });
      });
  };
};

export const writefunc = () => {
  return dispatch => {
    firestore
      .collection("containers")
      .doc("wVVZdUYLCLHDC988MUMi")
      .update({
        cached_taglist: [
          {
            t: "Frontend"
          },
          {
            t: "Backend"
          },
          {
            t: "Design"
          },
          {
            t: "Learning Resources"
          },
          {
            t: "Comments"
          },
          {
            t: "Client"
          },
          {
            t: "Website"
          },
          {
            t: "Blog"
          },
          {
            t: "Projects"
          },
          {
            t: "User Reviews"
          },
          {
            t: "Gantt Charts"
          },
          {
            t: "Graphical View"
          },
          {
            t: "toDo"
          }
        ]
      });
  };
};
