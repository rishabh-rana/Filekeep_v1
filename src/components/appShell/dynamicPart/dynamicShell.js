import React from "react";

import Loader from "../../UI/loader/loader";

const DyanamicShell = props => {
  if (!props.isLoadedFlag) {
    return <Loader />;
  }

  return (
    <React.Fragment>{JSON.stringify(props.currentStructure)}</React.Fragment>
  );
};
export default DyanamicShell;
