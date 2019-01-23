Documentation for Using Reusable Portions of the Code:

> Error Handling

1.  From actions: call dispatch({type: "throwerror", payload: error});
    where error = {
    message: string,
    duration: number, //milliseconds to persist the popup
    code: string, //error code to be displayed
    color: string, //bg of popup
    moreinfo: string | null, // moreinfo if desired
    }

2.  From Components, call an action from ErrorHandler/ErrorPopup.js -> throwerror(error); error has same schema from above

3.  React Error Boundary: HOC <ErrorBoundary />
