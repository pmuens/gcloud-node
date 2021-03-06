/**
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

'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire');

var fakeGrpcOperation = {};
var fakeGrpcService = {};
var fakeGrpcServiceObject = {};
var fakeService = {};
var fakeServiceObject = {};
var fakeStreamRouter = {};
var fakeUtil = {};

describe('common', function() {
  var common;

  before(function() {
    common = proxyquire('../src/index.js', {
      './grpc-operation.js': fakeGrpcOperation,
      './grpc-service.js': fakeGrpcService,
      './grpc-service-object.js': fakeGrpcServiceObject,
      './service.js': fakeService,
      './service-object.js': fakeServiceObject,
      './stream-router.js': fakeStreamRouter,
      './util.js': fakeUtil
    });
  });

  it('should correctly export the common modules', function() {
    assert.deepEqual(common, {
      GrpcOperation: fakeGrpcOperation,
      GrpcService: fakeGrpcService,
      GrpcServiceObject: fakeGrpcServiceObject,
      Service: fakeService,
      ServiceObject: fakeServiceObject,
      streamRouter: fakeStreamRouter,
      util: fakeUtil
    });
  });
});
