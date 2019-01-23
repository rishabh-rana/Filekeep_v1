import { combineReducers } from "redux";

import ui from "./ui";
import test from "./test";
import error from "./error";
import auth from "./auth";

export default combineReducers({
  ui: ui,
  test: test,
  error: error,
  auth: auth
});
