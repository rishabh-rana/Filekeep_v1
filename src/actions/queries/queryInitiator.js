import { parseInputToTags } from "./parseInput";
import { sendGetQuery } from "./get/getQueryHandler";
import { sendCreateQuery } from "./add/createQueryHandler";

export const sendQuery = (input, augmentors) => {
  return dispatch => {
    if (input[0] === "add") {
      // handle addition of data
    } else if (input[0] === "create") {
      // handle creating structure
      var removedCall = input.slice(1);

      var queries = parseInputToTags(removedCall);
      sendCreateQuery(queries, augmentors, dispatch);
    } else {
      var removedCall = [...input];
      if (input[0] === "get") removedCall = removedCall.slice(1);

      var queries = parseInputToTags(removedCall);
      sendGetQuery(queries, augmentors, dispatch);
    }
  };
};

/*
    DATABASE SCHEMA FOR A NODE

    {
        title : String,
        tag : {
            title : 1,
            parent : 2,
            g_parent : 3,
            g_g_parent : 4,
            ... // up till top of heirarchy
        },
        tag_id : {
            parent : parent_id,
            g_parent : g_parent_id,
            g_g_parent : g_g_parent_id // might be up till top also
        },
        children : [child_id1], // in specific order of display
        team : String,
        component : String,
        project : String, // might be removed later
        content : { <optional> use null for empty content
            description : String,
            checklist : {
                checklist_name : {
                    option : Boolean
                }
            },
            attachments : {
                name : attachment_id_from_storage
            },
            reference_nodes : [node_id], // make requests from middlewares to get references on demand
            summary_nodes : [
                query_to_be_executed // get latest node from this query using .order(timestamp).limit(1)
            ]
        },
        group_tags : {
            tag_1 : true
        },
        assigned_to : {
            name : true,
            id : true
        },
        comments : Boolean // if true, make another request (from middleware) to get recent comments on demand
        timestamp : Timestamp,
        real_parent_id : Timestamp, // for summary nodes
        custom_fields : {
            expenses : {
                exists : true,
                value : Number
            }
        }

    }

*/
