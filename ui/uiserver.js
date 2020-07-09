const express = require("express")


const app = express();
require("dotenv").config()
const { createProxyMiddleware } = require('http-proxy-middleware');

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true'

if(enableHMR && (process.env.ENABLE_HMR !== 'production')){
  console.log('Adding dev middleware, enabling HMR')
  /**eslint "global-require": "off" */
  /**eslint "import/no-extraneous-dependencies": "off" */

  const webpack = require('webpack');
  const devMiddleware = require("webpack-dev-middleware");
  const hotMiddleware = require("webpack-hot-middleware");

  const config = require('./webpack.config.js');
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config)
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler))
}

const fileServerMiddleware = express.static("public");


const apiProxyTarget = process.env.API_PROXY_TARGET;

if(apiProxyTarget){
  app.use("/___graphql", createProxyMiddleware({target: apiProxyTarget, changeOrigin: true}))
}
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || "http://localhost:3000/___graphql"


const env = {UI_API_ENDPOINT}

app.get("/env.js", function (req,res){
  res.send(`window.ENV = ${JSON.stringify(env)}`)
})

app.use(fileServerMiddleware);
app.get("/hello", (req, res) => {
  res.send("Hello WOrld");
});


const PORT = process.env.UI_SERVER_PORT || 8000;

app.listen(PORT, function(){
    console.log('UI started on port '+ PORT)
})