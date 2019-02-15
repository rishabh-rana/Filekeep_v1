import { firestore } from "../../../config/firebase";

//build the query from the sent options and input
export const buildQueryFromInput = async (
  queriesOriginal,
  containerId,
  cached_list,
  parentinfo,
  dispatch
) => {
  //extract first query, only one add query is allowed at a time
  var newTitle;
  var location;
  var groupTags;
  // extract info from first query
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

    // try the database info exchange
    try {
      // get snap async
      const snap = await getParents.get();
      parentInfoMain = [];

      snap.forEach((doc, i) => {
        // for each parent, input a new object in the parentinfo array
        parentInfoMain.push({});
        // get last element
        var operatingIndice = parentInfoMain.length - 1;

        var data = doc.data();

        var helper = {
          id: doc.id,
          tag: data.tag,
          tagid: data.tagids,
          title: data.title,
          children: data.children
        };
        // extract all required info from each parent
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

  // now we have parent info irrespective of if it was entered in starting or not

  // for each parent, execute a create query

  parentInfoMain.forEach(info => {
    writeToaParent(
      info,
      newTitle,
      groupTags,
      containerId,
      cached_list,
      dispatch
    );
  });

  return true;
};

// create query
const writeToaParent = async (
  parentInfo,
  newTitle,
  groupTags,
  containerId,
  cached_list,
  dispatch
) => {
  // here node represent the document that we will create as a result of this query

  // mutatable vars

  // declare new tags for the node
  var newtags = parentInfo.tag;
  // declare new tag ids for the node
  var newtagids = parentInfo.tagid;

  // loop over every tag and add one depth to it (parent becoe grandparent and so on)
  Object.keys(newtags).forEach(tag => {
    newtags[tag] = newtags[tag] + 1;
  });
  // add newtitle at depth one (self tag)
  newtags[newTitle] = 1;
  // newtags are ready for the node

  //currently, i am retaining all the tagids, change the code below if only 4 levels are needed
  // if newtagids do not exist => main-level node being added
  if (newtagids) {
    // again loop and add one depth to each tagid
    Object.keys(newtagids).forEach(tagid => {
      newtagids[tagid] = newtagids[tagid] + 1;
    });

    // add the parent's id as well, at depth 2
    newtagids[parentInfo.id] = 2;
  } else {
    // if newtagids did not exist on parent (case of base addition)
    newtagids = {};
    newtagids[parentInfo.id] = 2;
  }
  // newtag ids ready for the node

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

  // final request object for creating node
  var requestObj = {
    title: newTitle,
    tag: newtags,
    tagids: newtagids,
    gtag: newgroupTags,
    time: Date.now()
  };

  // now prepare the new cached_list

  // handle cachelist addition

  // this flag deceiedes if we put a new entry in cachedlist or edit current one
  var shouldIPushNewEntryInCachedList = true;
  // copy current cachedlist to a mutatable one
  var cchelst = [...cached_list];

  cchelst.forEach((struc, i) => {
    // dont push a new entry in list if tag already exist
    if (struc.t === newTitle) {
      shouldIPushNewEntryInCachedList = false;
      // add parent tag to existing entry, instead of pushing a new entry
      struc.p[parentInfo.title] = true;
    }
    // handle the addition of 'c' tags in the list
    // check if currently looped tag is equal to tag of parent of our node
    if (struc.t === parentInfo.title) {
      // if another child existed on the parent
      if (cchelst[i].c) {
        cchelst[i].c[newTitle] = true;
      } else {
        cchelst[i].c = {
          [newTitle]: true
        };
      }
    }
  });

  // push new entry
  if (shouldIPushNewEntryInCachedList) {
    cchelst.push({
      t: newTitle,
      p: {
        [parentInfo.title]: true
      }
    });
  }

  // cachedlist is mutated and ready

  // execution of query
  try {
    // add new node
    var docref = firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes")
      .doc();

    docref.set(requestObj);

    // update cached_list
    firestore
      .collection("containers")
      .doc(containerId)
      .update({
        cached_taglist: cchelst
      });

    // handle children addition to parent (for ordering)
    // you can also use this opportunity to add something else to the parent in the future
    var newChildren;
    // if children exist, push the new one we just created
    if (parentInfo.children) {
      newChildren = parentInfo.children;
      newChildren.push(docref.id);
    } else {
      // create the first child
      newChildren = [docref.id];
    }

    // execute the addition query
    firestore
      .collection("containers")
      .doc(containerId)
      .collection("nodes")
      .doc(parentInfo.id)
      .update({
        children: newChildren
      });

    // all queries updated
  } catch (error) {
    // if any of the queries failed
    dispatch({
      type: "throwerror",
      payload: {
        message: "Cannot create structure now, please try again",
        color: "red"
      }
    });
    // later, we will reverse the effects on the db is any query fails
  }
};
