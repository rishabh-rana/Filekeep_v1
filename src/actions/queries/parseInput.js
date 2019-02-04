import { queryFunctions } from "../../appData/queryFunctions";

// parse input fields data to tags with correct order, if enforced
export const parseInputToTags = input => {
  var mutatable = [...input];
  // queries to be executed, keys of queries object are the primeTags
  var queries = [];

  // set a query helper
  var queryHelper = [];
  mutatable.forEach(word => {
    // check if word is "and"
    if (word !== "and") {
      // if not, add it to query helper
      queryHelper.push(word);
    } else {
      // if yes, add a query
      queries.push({});
      // [{Client: ["in", "frontend"]}] => this is the parsed input for "Client in Frontend"
      queries[queries.length - 1][queryHelper[0]] = queryHelper.slice(1);
      // clear helper
      queryHelper = [];
    }
  });
  // add the last query also to the main query list
  queries.push({});
  queries[queries.length - 1][queryHelper[0]] = queryHelper.slice(1);

  // queries array is ready!

  // parse the array to a more meaningfull format
  // loop over each instruction (i.e. seperated by an "and")
  queries.forEach(query => {
    // loop over each object aka one object only, to get its key
    Object.keys(query).map(primeTag => {
      // prime tag is the tag that we need to retrieve, rest all are
      // options for the instruction
      var deStructure = {};
      // get each instruction, word by word
      query[primeTag].forEach((word, index) => {
        // check if the word is a recognized command or a tag
        if (queryFunctions.indexOf(word) !== -1) {
          // if a recognized command, add options to the instruction under that command
          deStructure[word] = deStructure.hasOwnProperty(word)
            ? [...deStructure[word], query[primeTag][index + 1]]
            : [query[primeTag][index + 1]];
          // for "Client in Frontend in Design" => Client is primeTag, destructure=> {"in" : ["Frontend", "Design"]}
        }
      });
      query[primeTag] = deStructure;
      // query becomes: {"Client": {"in" : ["Frontend", "Backend"]}}
    });
  });

  // queries are ready and destrucutred!

  return queries;
};

/*

// curently i am using a simple version of querying, where and will imply vreakage always, 
// this will improve UX, if old bheaviout is desired, uncomment this and comment the one below this block

  //break queries into seperate OR queries when "and" is followed by a parentTag
  //now while looping over queries object, "and" can be replaced with "with" tag

  while (mutatable.indexOf("and") !== -1) {
    mutatable.every((word, index) => {
      if (word === "and") {
        if (hashtagsUsed.indexOf(mutatable[index + 1]) === -1) {
          //set queries.primetag = query (except primetag)
          queries.push({});
          queries[queries.length - 1][mutatable[0]] = mutatable.slice(1, index);
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
  queries.push({});
  queries[queries.length - 1][mutatable[0]] = mutatable.slice(1);
*/
