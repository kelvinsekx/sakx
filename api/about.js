let aboutMessage = "Issue Tracker API v1.0.0";

function getMessage() {
  return aboutMessage;
}

function setMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

module.exports = {getMessage, setMessage}
