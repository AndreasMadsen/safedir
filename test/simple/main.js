/**
 * Copyright (c) 2012 Andreas Madsen
 * MIT License
 */

var vows = require('vows'),
    assert = require('assert'),
    safedir = require('../../safedir.js');

function unorderEqual(got, expected) {
  var copy = got.slice(0);

  var i = expected.length, index;
  while(i--) {
    index = copy.indexOf(expected[i]);
    if (index === -1) {
      throw new Error('missing item: ' + expected[i]);
    }
    copy.splice(index, 1);
  }

  if (copy.length !== 0) {
    throw new Error('to many times: ' + JSON.stringify(copy));
  }

  return copy;
}

vows.describe('testing safedir').addBatch({

  'when reading an directroy': {
    topic: function () {
      safedir('test/fixture/', this.callback);
    },

    'it returns a list of relative paths': function (error, list) {
      assert.ifError(error);

      unorderEqual(list, [
        '/file_1.txt',
        '/file_2.txt',
        '/deep/file_1.txt',
        '/deep/file_2.txt',
        '/deep/deep/file.txt'
      ]);
    }
  },

  'when reading an directroy and its hidden files': {
    topic: function () {
      safedir('test/fixture/', true, this.callback);
    },

    'it returns a list of relative paths': function (error, list) {
      assert.ifError(error);

      unorderEqual(list, [
        '/file_1.txt',
        '/file_2.txt',
        '/deep/file_1.txt',
        '/deep/file_2.txt',
        '/deep/deep/file.txt',
        '/deep/deep/.hidden.txt'
      ]);
    }
  }
}).exportTo(module);
