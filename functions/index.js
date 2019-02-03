const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

//complete zendesk one-way binding

exports.zendesk = functions.https.onRequest((req, res) => {
  //   check auth
  admin
    .database()
    .ref("/keys/" + req.body.username)
    .once("value", snap => {
      var pass = snap.val();
      if (pass !== req.body.password)
        return res.status(401).send({ message: "Unauthorized" });
    });

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
          return admin
            .firestore()
            .collection("containers")
            .doc(req.body.container)
            .collection("nodes")
            .doc(doc.id)
            .update(obj)
            .then(() => res.send({ message: "ok" }));
        } else {
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
