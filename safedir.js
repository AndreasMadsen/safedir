
var fs = require('fs');
var path = require('path');

module.exports = function directoryMap(dirname /*, showHidden, callback */) {

  // get arguments
  dirname = path.resolve(dirname);
  var callback = arguments[arguments.length - 1];
  var showHidden = arguments.length === 3 ? arguments[1] : false;

  // not yet resoled directory/files
  var query = [];

  // resolved filepaths
  var result = [];

  var called = false;
  function doCallback(error) {
    if (called) return;

    if (error || query.length === 0) {
      called = true;
      callback(error || null, result);
    }
  }

  resolveList([dirname], 3);
  function resolveList(list) {
    query.push.apply(query, list);
    list.forEach(function (filepath) {

      fs.stat(filepath, function (error, stat) {
        if (error) return doCallback(error);

        if (!stat.isDirectory()) {
          query.splice(query.indexOf(filepath), 1);
          result.push( filepath.slice(dirname.length) );
          return doCallback(null);
        }

        fs.readdir(filepath, function (error, files) {
          if (error) return doCallback(error);

          // remove hidden files
          if (showHidden === false) {
            files = files.filter(function (name) {
              return name[0] !== '.';
            });
          }

          // resolve filenames
          files = files.map(function (name) {
            return path.resolve(filepath, name);
          });

          // handle new directory content
          resolveList(files);

          query.splice(query.indexOf(filepath), 1);
          doCallback(null);
        });
      });
    });
  }
};
