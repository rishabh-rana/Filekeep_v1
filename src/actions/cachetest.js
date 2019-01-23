import { firestore } from "../config/firebase";

export const cachecall = () => {
  return dispatch => {
    var bench = Date.now();
    firestore
      .collection("users")
      .get({ source: "cache" })
      .then(function(doc) {
        console.log("FROM CACHE");
        doc.forEach(function(d) {
          console.log(d.data());
        });
        console.log("cache response received in", Date.now() - bench, "ms");
      });
  };
};

export const servercall = () => {
  return dispatch => {
    var bench = Date.now();
    firestore
      .collection("users")
      .get({ source: "server" })
      .then(function(doc) {
        console.log("FROM SERVER");
        doc.forEach(function(d) {
          console.log(d.data());
        });
        console.log("server response received in", Date.now() - bench, "ms");
      });
  };
};
