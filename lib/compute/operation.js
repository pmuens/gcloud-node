/*!
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*!
 * @module compute/operation
 */

'use strict';

var extend = require('extend');
var is = require('is');
var nodeutil = require('util');

/**
 * @type {module:common/serviceObject}
 * @private
 */
var ServiceObject = require('../common/service-object.js');

/**
 * @type {module:common/util}
 * @private
 */
var util = require('../common/util.js');

/*! Developer Documentation
 *
 * @param {module:compute} scope - The scope of the operation: a `Compute`,
 *     `Zone`, or `Region` object.
 * @param {string} name - Operation name.
 */
/**
 * An Operation object allows you to interact with a Google Compute Engine
 * operation.
 *
 * An operation can be a
 * [GlobalOperation](https://cloud.google.com/compute/docs/reference/v1/globalOperations),
 * [RegionOperation](https://cloud.google.com/compute/docs/reference/v1/regionOperations),
 * or
 * [ZoneOperation](https://cloud.google.com/compute/docs/reference/v1/zoneOperations).
 *
 * @constructor
 * @alias module:compute/operation
 *
 * @example
 * var gcloud = require('gcloud')({
 *   keyFilename: '/path/to/keyfile.json',
 *   projectId: 'grape-spaceship-123'
 * });
 *
 * var gce = gcloud.compute();
 *
 * //-
 * // Reference a global operation.
 * //-
 * var operation = gce.operation('operation-id');
 *
 * //-
 * // Reference a region operation.
 * //-
 * var region = gce.region('us-central1');
 * var operation = region.operation('operation-id');
 *
 * //-
 * // Reference a zone operation.
 * //-
 * var zone = gce.zone('us-central1-a');
 * var operation = zone.operation('operation-id');
 */
function Operation(scope, name) {
  var isCompute = scope.constructor.name === 'Compute';

  var methods = {
    /**
     * Delete the operation.
     *
     * @resource [GlobalOperations: delete API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/globalOperations/delete}
     * @resource [RegionOperations: delete API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/regionOperations/delete}
     * @resource [ZoneOperations: delete API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/zoneOperations/delete}
     *
     * @param {function=} callback - The callback function.
     * @param {?error} callback.err - An error returned while making this
     *     request.
     * @param {object} callback.apiResponse - The full API response.
     *
     * @example
     * operation.delete(function(err, apiResponse) {});
     */
    delete: true,

    /**
     * Check if the operation exists.
     *
     * @param {function} callback - The callback function.
     * @param {?error} callback.err - An error returned while making this
     *     request.
     * @param {boolean} callback.exists - Whether the operation exists or not.
     *
     * @example
     * operation.exists(function(err, exists) {});
     */
    exists: true,

    /**
     * Get an operation if it exists.
     *
     * @example
     * operation.get(function(err, operation, apiResponse) {
     *   // `operation` is an Operation object.
     * });
     */
    get: true
  };

  ServiceObject.call(this, {
    parent: scope,
    baseUrl: isCompute ? '/global/operations' : '/operations',
    id: name,
    methods: methods
  });

  this.name = name;
}

nodeutil.inherits(Operation, ServiceObject);

/**
 * Get the operation's metadata. For a detailed description of metadata see
 * [Operation resource](https://goo.gl/sWm1rt).
 *
 * @resource [GlobalOperations: get API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/globalOperations/get}
 * @resource [RegionOperations: get API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/regionOperations/get}
 * @resource [ZoneOperations: get API Documentation]{@link https://cloud.google.com/compute/docs/reference/v1/zoneOperations/get}
 *
 * @param {function=} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request
 * @param {object} callback.metadata - The disk's metadata.
 * @param {object} callback.apiResponse - The full API response.
 *
 * @example
 * operation.getMetadata(function(err, metadata, apiResponse) {
 *   // `metadata.error`: Contains errors if the operation failed.
 *   // `metadata.warnings`: Contains warnings.
 * });
 */
Operation.prototype.getMetadata = function(callback) {
  var self = this;

  callback = callback || util.noop;

  ServiceObject.prototype.getMetadata.call(this, function(err, apiResponse) {
    // An Operation entity contains a property named `error`. This makes
    // `request` think the operation failed, and will return an ApiError to
    // this callback. We have to make sure this isn't a false error by seeing if
    // the response body contains a property that wouldn't exist on a failed API
    // request (`name`).
    var isActualError = err && (!apiResponse || apiResponse.name !== self.name);

    if (isActualError) {
      callback(err, null, apiResponse);
      return;
    }

    self.metadata = apiResponse;

    callback(null, self.metadata, apiResponse);
  });
};

/**
 * Register a callback for when the operation is complete.
 *
 * If the operation doesn't complete after the maximum number of attempts have
 * been made (see `options.maxAttempts` and `options.interval`), an error will
 * be provided to your callback with code: `OPERATION_INCOMPLETE`.
 *
 * @param {object=} options - Configuration object.
 * @param {number} options.maxAttempts - Maximum number of attempts to make an
 *     API request to check if the operation is complete. (Default: `10`)
 * @param {number} options.interval - Amount of time in milliseconds between
 *     each request. (Default: `3000`)
 * @param {function} callback - The callback function.
 * @param {?error} callback.err - An error returned while making this request.
 * @param {object} callback.metadata - The operation's metadata.
 *
 * @example
 * operation.onComplete(function(err, metadata) {
 *   if (err.code === 'OPERATION_INCOMPLETE') {
 *     // The operation is not complete yet. You may want to register another
 *     // `onComplete` listener or queue for later.
 *   }
 *
 *   if (!err) {
 *     // Operation complete!
 *   }
 * });
 */
Operation.prototype.onComplete = function(options, callback) {
  var self = this;

  if (is.fn(options)) {
    callback = options;
    options = {};
  }

  options = extend({
    maxAttempts: 10,
    interval: 3000
  }, options);

  var didNotCompleteError = new Error('Operation did not complete.');
  didNotCompleteError.code = 'OPERATION_INCOMPLETE';

  var numAttempts = 0;

  function checkMetadata() {
    numAttempts++;

    if (numAttempts > options.maxAttempts) {
      callback(didNotCompleteError, self.metadata);
      return;
    }

    setTimeout(function() {
      self.getMetadata(onMetadata);
    }, options.interval);
  }

  function onMetadata(err, metadata) {
    if (err) {
      callback(err, metadata);
      return;
    }

    if (metadata.status !== 'DONE') {
      checkMetadata();
      return;
    }

    // The operation is complete.
    callback(null, metadata);
  }

  checkMetadata();
};

module.exports = Operation;