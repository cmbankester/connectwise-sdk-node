"use strict";

const request_utils = require(path.join(__dirname, 'utils', 'request'));

const private_data = new WeakMap();

class CwApiClient {
  constructor(username, password, opts) {
    const _private = new Map()
      .set('password', password)
      .set('username', username)
      .set('raw_auth', new Buffer(
        `${process.env.CW_COMPANY_NAME}+${process.env.CW_PUBLIC_KEY}:${process.env.CW_PRIVATE_KEY}`
      ).toString('base64'));

    private_data.set(this, _private);
  }

  // client is authenticated <=> expiration exists and is after now
  get authenticated() {
    return this.expiration && this.expiration > new Date() || false;
  }

  prefix(route_prefix) {
    // would be great to use a proxy here...
    return {
        getJson(url, headers) {
          return this.getJson(`${route_prefix}${url}`, headers);
        }
      , postJson(url, headers, body) {
          return this.postJson(`${route_prefix}${url}`, headers, body);
      }
      , patchJson(url, headers, body) {
          return this.patchJson(`${route_prefix}${url}`, headers, body);
      }
      , putJson(url, headers, body) {
          return this.putJson(`${route_prefix}${url}`, headers, body);
      }
      , deleteJson(url, headers) {
          return this.deleteJson(`${route_prefix}${url}`, headers);
      }
    };
  }

  getJson(url, headers) {
    const _private = private_data.get(this);
    return request_utils.getJson(`${process.env.CW_API_URL}${url}`, Object.assign({}, headers, {
      'Authentication': `Basic ${_private.get('raw_auth')}`
    }));
  }

  postJson(url, headers, body) {
    const _private = private_data.get(this);
    return request_utils.postJson(`${process.env.CW_API_URL}${url}`, Object.assign({}, headers, {
      'Authentication': `Basic ${_private.get('raw_auth')}`
    }), body);
  }
  patchJson(url, headers, body) {
    const _private = private_data.get(this);
    return request_utils.patchJson(`${process.env.CW_API_URL}${url}`, Object.assign({}, headers, {
      'Authentication': `Basic ${_private.get('raw_auth')}`
    }), body);
  }
  putJson(url, headers, body) {
    const _private = private_data.get(this);
    return request_utils.putJson(`${process.env.CW_API_URL}${url}`, Object.assign({}, headers, {
      'Authentication': `Basic ${_private.get('raw_auth')}`
    }), body);
  }
  deleteJson(url, headers) {
    const _private = private_data.get(this);
    return request_utils.deleteJson(`${process.env.CW_API_URL}${url}`, Object.assign({}, headers, {
      'Authentication': `Basic ${_private.get('raw_auth')}`
    }));
  }

  authenticate() {
    const _private = private_data.get(this);
    const username = _private.get('username');
    const password = _private.get('password');
    const auth = new Buffer(
      `${process.env.CW_COMPANY_NAME}+${username}:${password}`
    ).toString('base64');

    return request_utils.postJson(
      `${process.env.CW_API_URL}/system/members/${username}/tokens`
      , {'Authentication': `Basic ${auth}`, 'x-cw-usertype': 'integrator'}
      , {memberIdentifier: username}
    )
    .then(res => {
      _private.set('raw_auth', new Buffer(
        `${process.env.CW_COMPANY_NAME}+${res.publicKey}:${res.privateKey}`
      ).toString('base64'));
      this.expiration = new Date(res.expiration);
    });
  }
}

module.exports = CwApiClient;
