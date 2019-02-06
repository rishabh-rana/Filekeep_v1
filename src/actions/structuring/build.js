export const buildStructureFromInstructions = stack => {
  return dispatch => {
    var bench = Date.now();
    const myStack = [...stack];
    var maxDepth = 1;
    while (myStack.length > 0 && maxDepth < 5) {
      maxDepth++;
      myStack.forEach((instruc, index) => {
        let err = null;
        try {
          // carry out instruction
          dispatch({ type: "buildStructure", payload: instruc });
          // if done, remove the instruction from stack
        } catch (error) {
          // continue loop
          console.log(error);
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
