export const buildStructureFromInstructions = stack => {
  return dispatch => {
    var bench = Date.now();
    const myStack = [...stack];

    while (myStack.length > 0) {
      myStack.forEach((instruc, index) => {
        let err = null;
        try {
          // carry out instruction
          dispatch({ type: "buildStructure", payload: instruc });
          // if done, remove the instruction from stack
        } catch (error) {
          // continue loop
          console.log("we are throwing error as well");
          err = error;
        }
        // remove the successfull instruction from the stack
        if (err === null) {
          myStack.splice(index, 1);
        }
      });
    }
    console.log(Date.now() - bench);
    dispatch({ type: "clearStack" });
  };
};
