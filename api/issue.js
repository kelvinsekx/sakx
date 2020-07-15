const { getDb } = require("./db.js");
const { UserInputError } = require("apollo-server-express");

async function list(_, {status}) {
  const db = getDb();
  const filter = {}
  if (status) filter.status = status
  const issues = await db.collection("issues").find(filter).toArray();
  return issues;
}

function validate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status == "Assigned" && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned".');
  }
  if (errors.length > 0) {
    throw new UserInputError("Invalid input(s)", { errors });
  }
}

async function add(_, { issue }) {
  const db = getDb();
  validate(issue);
  issue.created = new Date();
  issue.id = Math.floor(Math.random() * 192);

  const result = await db.collection("issues").insertOne(issue);
  const savedIssue = await db
    .collection("issues")
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

module.exports = { list, add }
