/*
    Expected to call dispatch({type: "throwerror", payload: error}); on fail
    error: {
        message: string,
        duration: number, //miliseconds to persist the popup
        color: string,
        code: string,
        moreinfo: string | null
    }

*/

const reducer = (
  state = {
    error: null
  },
  action
) => {
  if (action.type === "throwerror") {
    if (action.payload) {
      let { message, duration, color, code, moreinfo } = action.payload;
      let msg = message ? message : "Oops something went wrong..";
      let dur = duration ? duration : 2500;
      let clr = color ? color : "yellow";
      let cde = code ? code : "404";
      let moreinf = moreinfo ? moreinfo : null;

      return {
        ...state,
        error: {
          message: msg,
          duration: dur,
          color: clr,
          code: cde,
          moreinfo: moreinf
        }
      };
    } else {
      return {
        ...state,
        error: null
      };
    }
  }
  return state;
};

export default reducer;
