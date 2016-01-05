"use strict";

const path = require('path');
const cw_utils = require(path.join(__dirname, '..', 'utils', 'connectwise'));

const _private = new WeakMap();

function apiClientFor(api) {
  return _private.get(api).get('api_client');
}

class CompanyApi {
  constructor(api_client) {
    const _private = new Map()
      .set('api_client', api_client.prefix('/company'));

    _private_data.set(this, _private);
  }

  companies() {
    return apiClientFor(this).getJson('/companies');
  }
}
