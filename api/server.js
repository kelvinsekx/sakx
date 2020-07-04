const express = require("express");
require('dotenv').config()

const {connectToDb} = require("./db.js")
const {installHandler} = require("./api_handler.js")




const app = express();

installHandler(app)

const PORT = process.env.API_SERVER_PORT || 3000;


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

