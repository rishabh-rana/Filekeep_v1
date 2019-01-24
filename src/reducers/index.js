import { combineReducers } from "redux";

import ui from "./ui";
import test from "./test";
import error from "./error";
import auth from "./auth";
import container from "./appShell/container";
import currentStructure from "./appShell/currentStructure";
import currentDataArchive from "./appShell/currentDataArchive";

export default combineReducers({
  ui: ui,
  test: test,
  error: error,
  auth: auth,
  container: container,
  currentStructure: currentStructure,
  currentDataArchive: currentDataArchive
});
