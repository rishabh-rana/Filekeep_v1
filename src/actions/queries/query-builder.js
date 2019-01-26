import { firestore } from "../../config/firebase";
import { queryFunctions } from "../../appData/queryFunctions";

// parse input fields data to tags with correct order, if enforced
const parseInputToTags = (input, hashtagsUsed) => {
  var mutatable = [...input];
  // queries to be executed, keys of queries object are the primeTags
  var queries = {};

  //break queries into seperate OR queries when "and" is followed by a parentTag
  //now while looping over queries object, "and" can be replaced with "with" tag

  while (mutatable.indexOf("and") !== -1) {
    mutatable.every((word, index) => {
      if (word === "and") {
        if (hashtagsUsed.indexOf(mutatable[index + 1]) === -1) {
          //set queries.primetag = query (except primetag)
          queries[mutatable[0]] = mutatable.slice(1, index);
          //remove query from mutatable
          mutatable = mutatable.slice(index + 1);
          return false;
        } else {
          //replace "and" tag with "with" tag if the word following and is a hashtag
          mutatable[index] = "with";
          return false;
        }
      } else {
        // continue every loop if word is not "and"
        return true;
      }
    });
  }
  //set last remaining query to object
  queries[mutatable[0]] = mutatable.slice(1);

  // console.log(queries);

  Object.keys(queries).forEach(primeTag => {
    var deStructure = {};
    queries[primeTag].forEach((word, index) => {
      if (queryFunctions.indexOf(word) !== -1) {
        deStructure[word] = deStructure.hasOwnProperty(word)
          ? [...deStructure[word], queries[primeTag][index + 1]]
          : [queries[primeTag][index + 1]];
      }
    });
    queries[primeTag] = deStructure;
  });

  // console.log(queries);

  return queries;
};

//build the query from the sent options and input
const buildQueryFromInput = (input, containerId, depth, hashtagsUsed) => {
  // base query
  var queryBase = firestore
    .collection("containers")
    .doc(containerId)
    .collection("nodes");

  //parse input to queries
  var queries = parseInputToTags(input, hashtagsUsed);

  //construct query
  // var query = [];

  //implementation for 1 tag, simple query
  // if (tags.length === 1) {
  //   primeTag = tags[0];
  //   query.push(queryBase);
  //   query.push(queryBase);
  //   for (var i = 0; i < depth; i++) {
  //     query[i] = query[i].where("tag." + tags[0], "==", i + 1);
  //   }

  //   return { queryList: query, primeTag: primeTag };
  // }

  var firestoreQuery = {};

  Object.keys(queries).forEach(primetag => {
    // if (queries[primetag] === {}) {
    //   var operatingIndice = firestoreQuery.length;
    //   firestoreQuery.push(queryBase);
    //   firestoreQuery.push(queryBase);

    //   for (var i=0; i < depth; i++) {
    //     firestoreQuery[i+operatingIndice] = firestoreQuery[i+operatingIndice].where("tag." + primetag, "==", i+1);
    //   }
    // }
    // var operatingIndice = firestoreQuery.length;
    //based on depth of query, depth of 2 => 2
    firestoreQuery[primetag] =
      depth === 2 ? [queryBase, queryBase] : [queryBase, queryBase, queryBase];

    for (var i = 0; i < depth; i++) {
      firestoreQuery[primetag][i] = firestoreQuery[primetag][i].where(
        "tag." + primetag,
        "==",
        i + 1
      );

      if (queries[primetag].hasOwnProperty("in")) {
        queries[primetag].in.forEach((parentTag, parentindex) => {
          firestoreQuery[primetag][i] = firestoreQuery[primetag][i].where(
            "tag." + parentTag,
            "==",
            i + 2 + parentindex
          );
        });
      }
    }
  });

  return firestoreQuery;
};

// main call
export const sendQuery = (input, augmentors) => {
  return dispatch => {
    //refine augmentors : later
    //build query
    let queryObject = buildQueryFromInput(
      input,
      augmentors.containerId,
      augmentors.properties.depth,
      augmentors.hashtagsUsed
    );

    //execute query
    const removeListener = new Array();

    Object.keys(queryObject).forEach(primetag => {
      var operatingIndice = removeListener.length;

      queryObject[primetag].forEach((query, i) => {
        console.log(query);
        removeListener[i + operatingIndice] = query.onSnapshot(snap => {
          snap.docChanges().forEach(change => {
            dispatch({
              type: "realtimeUpdate",
              payload: {
                data: change.doc.data(),
                type: change.type,
                str_by: augmentors.properties.structureBy,
                primeTag: primetag,
                node_id: change.doc.id
              }
            });
          });
        });
      });
    });

    dispatch({ type: "removeEventListener", payload: removeListener });

    // queryObject.queryList.forEach((query, i) => {
    //   removeListener[i] = query.onSnapshot(snap => {
    //     snap.docChanges().forEach(change => {
    //       // console.log(change.doc.data().tag);
    //       dispatch({
    //         type: "realtimeUpdate",
    //         payload: {
    //           data: change.doc.data(),
    //           type: change.type,
    //           str_by: augmentors.properties.structureBy,
    //           primeTag: queryObject.primeTag,
    //           node_id: change.doc.id
    //         }
    //       });
    //     });
    //   });
    // });
    // dispatch({ type: "removeEventListener", payload: removeListener });
  };
};
