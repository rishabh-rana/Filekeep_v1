import { combineReducers } from "redux";

import ui from "./ui";
import test from "./test";
import error from "./error";

export default combineReducers({
  ui: ui,
  test: test,
  error: error
});
