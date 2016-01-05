"use strict";

const fetch = require('node-fetch');
const util = require('util');

function fetchJson(url, opts) {
  if (!url) throw new Error("Url missing");
  const method = (opts || {}).method || 'GET';
  const headers = Object.assign({}, (opts || {}).headers, {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  delete opts.headers;

  console.log(util.inspect({url, method, headers}));

  return fetch(url, Object.assign({}, opts, {headers, method}))
    .then(res => console.log(res) && res.json());
}

function getJson(url, headers) {
  return fetchJson(url, {
      method: 'GET'
    , headers
  });
}

function postJson(url, headers, body) {
  return fetchJson(url, {
      method: 'POST'
    , body
    , headers
  });
}

function patchJson(url, headers, body) {
  return fetchJson(url, {
      method: 'PATCH'
    , body
    , headers
  });
}

function putJson(url, headers, body) {
  return fetchJson(url, {
      method: 'PUT'
    , body
    , headers
  });
}

function deleteJson(url, headers) {
  return fetchJson(url, {
      method: 'DELETE'
    , headers
  });
}

exports.getJson = getJson;
exports.postJson = postJson;
exports.patchJson = patchJson;
exports.putJson = putJson;
exports.deleteJson = deleteJson;
