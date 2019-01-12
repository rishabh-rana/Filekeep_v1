import mixpanel from "mixpanel-browser";
import { Mixpanel } from "./keys";

mixpanel.init(Mixpanel.key);

export default mixpanel;
