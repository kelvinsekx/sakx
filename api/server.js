const fs = require("fs");
const express = require("express");

const { ApolloServer, UserInputError } = require("apollo-server-express");

const { GraphQLScalarType } = require("graphql");
const {Kind} = require("graphql/language")

require('dotenv').config()

const {MongoClient} = require("mongodb")

const url = process.env.DB_URL || "mongodb://localhost/issuetracking";

let db;

async function connectToDb(){
  const client = new MongoClient(url, {useNewUrlParser: true});
  await client.connect()
  console.log("Connected to MongoDB at ", url)
  db = client.db();
}
 //-------------------Mongodb handlers


let aboutMessage = 'Issue Tracker API v1.0.0';
const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  serialize(value){
    return value.toISOString();
  },
  parseValue(value){
    const dateValue = new Date(value)
    return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
  },
  parseLiteral(ast){
    if (ast.kind === Kind.STRING){
      const value = new Date(ast.value);
      return Number.isNaN(value.getTime()) ? undefined : value
    }
  }
})

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};


//_______
function validateIssue(issue){
  const errors = [];
  if(issue.title.length < 3){
    errors.push('Field "title" must be at least 3 characters long.')
  }
  if(issue.status == 'Assigned' && !issue.owner){
    errors.push('Field "owner" is required when status is "Assigned".')
  }
  if(errors.length > 0){
    throw new UserInputError("Invalid input(s)", {errors})
  }
}

//-----------------validate issues

/**
 * 
 * 
 * issue mutations
 */
function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function issueAdd(_, { issue }) {
  validateIssue(issue);
  issue.created = new Date();
  issue.id = Math.floor(Math.random()*192);

  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

// issue MUTATIONS ENDS HERE

//###
//##
//#
//-- initial return value to server
async function issueList(){
  const issues = await db.collection('issues').find({}).toArray()
    return issues;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"),
  resolvers,
  formatError: error => {
    console.log(error)
    return error
  }
});

const app = express();

const PORT = process.env.API_SERVER_PORT || 3000;

const enableCors = (process.env.ENABLE_CORS || 'true') === true
server.applyMiddleware({ app, path: "/___graphql",  cors: enableCors});

(async function (){
  try{
    await connectToDb()
    app.listen(PORT, function () {
      console.log(`>>Start: \n everything seems good, you can BREAK the web now \n App started on port http://localhost:${PORT}`);
    });
  }catch(e){
    console.log(e)
  }
}())

