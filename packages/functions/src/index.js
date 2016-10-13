/*!
 * Copyright 2016 Google Inc. All Rights Reserved.
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
 * @module functions
 */

'use strict';

var common = require('@google-cloud/common');
var v1beta2 = require('./v1beta2');

/**
 * <p class="notice">
 *   **This is a Alpha release of Google Cloud Functions.** This API is
 *   not covered by any SLA or deprecation policy and may be subject to
 *   backward-incompatible changes.
 * </p>
 *
 * [Google Cloud Functions](https://cloud.google.com/functions/docs) provides a
 * a lightweight, event-based, asynchronous compute solution that allows you to
 * create small, single-purpose functions that respond to cloud events without
 * the need to manage a server or a runtime environment.
 *
 * @constructor
 * @alias module:functions
 *
 * @resource [Google Cloud Functions Documentation]{@link https://cloud.google.com/functions/docs}
 *
 * @param {object} options - [Configuration object](#/docs).
 */
function Functions(options) {
  if (!(this instanceof Functions)) {
    options = common.util.normalizeArguments(this, options);
    return new Functions(options);
  }

  this.api = {
    Functions: v1beta2(options).cloudFunctionsServiceApi(options)
  };
}

module.exports = Functions;
module.exports.v1beta2 = v1beta2;
