if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(target) {
        'use strict';
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object');
        }

        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];
          if (nextSource === undefined || nextSource === null) {
            continue;
          }
          nextSource = Object(nextSource);

          var keysArray = Object.keys(Object(nextSource));
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
        return to;
      }
    });
  }

  if (!String.prototype.endsWith) {
      String.prototype.endsWith = function(search, this_len) {
      if (this_len === undefined || this_len > this.length) {
          this_len = this.length;
      }
      return this.substring(this_len - search.length, this_len) === search;
      };
  }