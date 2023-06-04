// Middleware that gives the user a message about the result of CRUD operations.
// The value of the message is retrieved from the session.
// The session is then cleared so that the message is only displayed once.
// The message is then passed to the view via res.local so that it is available via
// the variable 'message' in each of the .ejs files - there is no need to pass the
// the message variable on the render call.

const setMessage = (req, res, next) => {
  if (req.session.pendingMessage) {
    res.locals.message = req.session.pendingMessage;
  } else {
    res.locals.message = '';
  }
  req.session.pendingMessage = '';
  next();
};
module.exports = setMessage;
