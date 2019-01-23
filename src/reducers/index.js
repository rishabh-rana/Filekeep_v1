import { combineReducers } from "redux";

import ui from "./ui";
import test from "./test";

export default combineReducers({
  ui: ui,
  test: test
});
