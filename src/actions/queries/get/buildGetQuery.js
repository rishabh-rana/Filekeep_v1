import { firestore } from "../../../config/firebase";

//build the query from the sent options and input
export const buildQueryFromInput = (queriesOriginal, containerId, depth) => {
  // base query
  var queryBase = firestore
    .collection("containers")
    .doc(containerId)
    .collection("nodes");

  //get mutable copy of queries
  var queries = [...queriesOriginal];

  var firestoreQuery = [];
  // loop over queries array
  queries.forEach(query => {
    // loop over the instruction object, (one only) to get a single key, primetag
    Object.keys(query).map(primetag => {
      // primetag is "Client" in "Client in Frontend"
      // prepare empty object in firestore query array
      firestoreQuery.push({});
      // get the last index in the array, we will mutate only from this index
      // leavinf past queries undisturbed
      var operatingIndice = firestoreQuery.length - 1;
      // insert two operable base queries if depth is 2 otherwise three
      // we will query firestore i times for a depth of i, to get currentGen, children, grandchildren
      firestoreQuery[operatingIndice][primetag] =
        depth === 2
          ? [queryBase, queryBase]
          : [queryBase, queryBase, queryBase];
      // loop over once for each depth count
      for (var i = 0; i < depth; i++) {
        // mutate the base query to desired query of depth "i"
        firestoreQuery[operatingIndice][primetag][i] = firestoreQuery[
          operatingIndice
        ][primetag][i].where("tag." + primetag, "==", i + 1);

        // check if "in" command is present on the insruction
        if (query[primetag].hasOwnProperty("in")) {
          // loop over all the "in" commands in the array
          query[primetag].in.forEach((parentTag, parentindex) => {
            // mutate the ith depth query to include a "in" check
            firestoreQuery[operatingIndice][primetag][i] = firestoreQuery[
              operatingIndice
            ][primetag][i].where("tag." + parentTag, "==", i + 2 + parentindex);
          });
        }
      }
    });
  });
  // firestore queryArray is ready

  return firestoreQuery;
};
