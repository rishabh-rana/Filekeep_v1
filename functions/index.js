const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

//complete zendesk one-way binding

exports.zendesk = functions.https.onRequest((req, res) => {
  //   check auth
  console.log(req);
  admin
    .database()
    .ref("/keys/" + req.body.username)
    .once("value", snap => {
      var pass = snap.val();
      if (pass !== req.body.password)
        return res.status(401).send({ message: "Unauthorized" });
    });
  console.log("authorized");
  const { title, description, id, url } = req.body;
  var obj = {
    title: title,
    description: description,
    id: String(id),
    url: url,
    tag: {
      $$main: 3,
      Zendesk: 2,
      [title]: 1
    }
  };
  console.log("Request Obj", obj);
  admin
    .firestore()
    .collection("containers")
    .doc(req.body.container)
    .collection("nodes")
    .where("id", "==", String(id))
    .get()
    .then(snap => {
      snap.forEach(doc => {
        if (doc.exists) {
          console.log("exists");
          return admin
            .firestore()
            .collection("containers")
            .doc(req.body.container)
            .collection("nodes")
            .doc(doc.id)
            .update(obj)
            .then(() => res.send({ message: "ok" }));
        } else {
          console.log("new");
          return admin
            .firestore()
            .collection("containers")
            .doc(req.body.container)
            .collection("nodes")
            .add(obj)
            .then(() => res.send({ message: "ok" }));
        }
      });
    });
});
