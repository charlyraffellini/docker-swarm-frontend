const http = require('http');
const sleep = require('sleep');
const express = require('express');
const rp = require("request-promise");
const inspect = require("./inspect");

const LISTEN_HOSTNAME = process.env.MYWEB_LISTEN_HOSTNAME || '0.0.0.0';
const LISTEN_PORT = process.env.MYWEB_LISTEN_PORT || '3000';
const BACKEND_API = "http://" + (process.env.MY_BACKEND_API || "localhost:3000");

console.log(`Using BACKEND_API = ${BACKEND_API}`);
const app = express();

app.get('/balance/:id', function (req, res,next) {
  rp(`${BACKEND_API}/customer/${req.params.id}`)
    .then(function (custData) {
      const customer = JSON.parse(custData);
      res.set('Content-Type', 'text/html');
      const balance = Math.round(Math.random()*1000);
      res.send(`
          <b>Balance</b>: $${balance}<br/>
          <b>Name</b>: ${customer.last}, ${customer.first}<br/>
          <b>Account #</b>: ${customer.id}
          `);
      res.end();
    })
  .catch(function (err) {
    next(err);
  });
});

app.listen(LISTEN_PORT, LISTEN_HOSTNAME, function () {
  console.log(`Listening on ${LISTEN_HOSTNAME}:${LISTEN_PORT}`);
});
