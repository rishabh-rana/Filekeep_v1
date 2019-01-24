import { auth } from "../../config/firebase";
import { provider } from "../../config/firebase";
import { per } from "../../config/firebase";

// import mixpanel also
import { firestore } from "../../config/firebase";

export const signin = () => {
  return async dispatch => {
    await auth.setPersistence(per);
    var result = await auth.signInWithPopup(provider);
    //   console.log(result.user);
    //   mixpanel.identify(result.user.uid);
    //   mixpanel.people.set({
    //     $email: result.user.email,
    //     $name: result.user.displayName,
    //     $creationtime: result.user.metadata.creationTime
    //   });
    //   mixpanel.track("Signed In");

    var isreg = await firestore
      .collection("users")
      .doc(result.user.uid)
      .get();

    if (isreg.data()) {
      console.log("signedin again");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .update({
          lastSignin: Date.now()
        });
    } else {
      console.log("fresh signup");
      firestore
        .collection("users")
        .doc(result.user.uid)
        .set({
          name: result.user.displayName,
          email: result.user.email,
          lastSignin: Date.now(),
          signedUpon: Date.now()
        });
    }

    dispatch({ type: "syncusers", payload: result.user });
  };
};

export const signout = () => {
  return dispatch => {
    auth.signOut();
  };
};

export const syncusers = () => {
  return dispatch => {
    auth.onAuthStateChanged(function(user) {
      // console.log(user);
      if (user) {
        let usersmall = {
          displayName: user.displayName,
          uid: user.uid
        };
        dispatch({ type: "syncusers", payload: usersmall });
      } else {
        dispatch({ type: "syncusers", payload: null });
      }
    });
  };
};
