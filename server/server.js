const express = require("express")
const app = express()

const PORT = 3000;

const fileServerMiddleware = express.static("public")

app.use(fileServerMiddleware)

app.listen(PORT, function(){
    console.log(`App started om port http://localhost:${PORT}`)
})