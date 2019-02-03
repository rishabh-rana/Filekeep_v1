import React from "react";

const Icon = props => {
  let fa = "fas fa-" + props.icon;

  return (
    <i
      className={fa}
      style={{
        fontSize: "18px",
        verticalAlign: "text-bottom",
        display: "inline-block",
        marginLeft: "15px"
      }}
    >
      {props.icon}
    </i>
  );
};
export default Icon;
