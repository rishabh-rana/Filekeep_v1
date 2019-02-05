import { firestore } from "../../../config/firebase";

//build the query from the sent options and input
export const buildQueryFromInput = async (
  queriesOriginal,
  containerId,
  cached_list,
  parentinfo,
  dispatch
) => {
  // one query to add the current node, one to update the children array on the parent
  // and one to update cachedlist
  var firestoreQuery = [
    firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes"),
    firestore.collection("containers").doc(containerId),
    firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes")
  ];

  //extract first query, only one add query is allowed at a time
  var newTitle;
  var location;
  var groupTags;
  Object.keys(queriesOriginal[0]).forEach(primeTag => {
    newTitle = primeTag;
    location = queriesOriginal[0][primeTag].in;
    groupTags = queriesOriginal[0][primeTag].with;
  });

  // we use array for parent info as multiple parents may exist
  var parentInfoMain = [parentinfo];
  // if parentinfo is not passed in, get the required details
  if (!parentinfo) {
    // build a query and retrieve parent info
    var getParents = firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes");

    if (location && location.length > 0) {
      location.forEach((parentTag, i) => {
        getParents = getParents.where("tag." + parentTag, "==", i + 1);
      });
    } else {
      var appName = "App";
      getParents = getParents.where("app", "==", appName);
    }

    // getParents query is ready!

    try {
      const snap = await getParents.get();
      parentInfoMain = [];

      snap.forEach((doc, i) => {
        parentInfoMain.push({});
        var operatingIndice = parentInfoMain.length - 1;

        var data = doc.data();

        var helper = {
          id: doc.id,
          tag: data.tag,
          tagid: data.tagids,
          title: data.title,
          children: data.children
        };
        parentInfoMain[operatingIndice] = helper;
      });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot get structure information, please try again",
          color: "red"
        }
      });
    }

    // parentInfoMain updated
  }

  console.log(parentInfoMain);

  // now we have parentinfo main irrespective of if it was entered in starting or not

  // deal case of one parent
  if (parentInfoMain.length === 1) {
    // mutatable vars
    var newtags = parentInfoMain[0].tag;
    var newtagids = parentInfoMain[0].tagid;
    console.log(newtagids);

    // loop over every tag and add one depth to it
    Object.keys(newtags).forEach(tag => {
      newtags[tag] = newtags[tag] + 1;
    });
    // add newtitle at depth one
    newtags[newTitle] = 1;
    // newtags are ready

    //currently, i am retaining all the tagids, change the code below if only 4 levels are needed
    if (newtagids) {
      // again loop and add one depth
      Object.keys(newtagids).forEach(tagid => {
        newtagids[tagid] = newtagids[tagid] + 1;
      });
      console.log(newtagids);
      // add the parent's id as well, at depth 2
      newtagids[parentInfoMain[0].id] = 2;
    } else {
      // if newtagids did not exist on parent (case of base addition)
      newtagids = {};
      newtagids[parentInfoMain[0].id] = 2;
    }
    // newtag ids ready

    // parse group tags to a map
    var newgroupTags = {};
    if (groupTags) {
      groupTags.forEach(gtag => {
        newgroupTags[gtag] = true;
      });
    } else {
      newgroupTags = null;
    }

    // newgrouptags ready

    // final request object
    var requestObj = {
      title: newTitle,
      tag: newtags,
      tagids: newtagids,
      gtag: newgroupTags,
      time: Date.now()
    };

    // handle cachelist addition
    var cchelst = [...cached_list];
    cchelst.forEach((struc, i) => {
      if (struc.t === parentInfoMain[0].title) {
        if (cchelst[i].c) {
          cchelst[i].c[newTitle] = true;
        } else {
          cchelst[i].c = {
            [newTitle]: true
          };
        }
      }
    });
    cchelst.push({
      t: newTitle,
      p: {
        [parentInfoMain[0].title]: true
      }
    });
    // cachedlist is mutated

    try {
      var docref = await firestoreQuery[0].add(requestObj);

      firestoreQuery[1].update({
        cached_taglist: cchelst
      });
      // prepared second query

      // handle children addition to parent
      var newChildren;
      if (parentInfoMain[0].children) {
        newChildren = parentInfoMain[0].children;
        newChildren.push(docref.id);
      } else {
        newChildren = [docref.id];
      }

      firestoreQuery[2].doc(parentInfoMain[0].id).update({
        children: newChildren
      });
    } catch (error) {
      dispatch({
        type: "throwerror",
        payload: {
          message: "Cannot create structure now, please try again",
          color: "red"
        }
      });
    }

    return true;
  } else {
    // when multiple parents need to be handled
    console.log("not supported yet");
    return false;
  }
};
