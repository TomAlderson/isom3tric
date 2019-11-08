webpackJsonp([0],[
/* 0 */
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ 8);
var isBuffer = __webpack_require__(/*! is-buffer */ 25);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/*!*************************************************************!*\
  !*** ./node_modules/vue-loader/lib/component-normalizer.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 5 */
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ 0);
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ 27);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ 9);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ 9);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../process/browser.js */ 1)))

/***/ }),
/* 6 */
/*!******************************************!*\
  !*** ./node_modules/vue/dist/vue.esm.js ***!
  \******************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/*!
 * Vue.js v2.6.10
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false)
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var isUsingMicroTask = false;

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if (process.env.NODE_ENV !== 'production' && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (process.env.NODE_ENV !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.10';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
};

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && value !== '' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
  }
}

/*  */



/* eslint-disable no-unused-vars */
function baseWarn (msg, range) {
  console.error(("[Vue compiler]: " + msg));
}
/* eslint-enable no-unused-vars */

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value, range, dynamic) {
  (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
  el.plain = false;
}

function addAttr (el, name, value, range, dynamic) {
  var attrs = dynamic
    ? (el.dynamicAttrs || (el.dynamicAttrs = []))
    : (el.attrs || (el.attrs = []));
  attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
  el.plain = false;
}

// add a raw attr (use this in preTransforms)
function addRawAttr (el, name, value, range) {
  el.attrsMap[name] = value;
  el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  isDynamicArg,
  modifiers,
  range
) {
  (el.directives || (el.directives = [])).push(rangeSetItem({
    name: name,
    rawName: rawName,
    value: value,
    arg: arg,
    isDynamicArg: isDynamicArg,
    modifiers: modifiers
  }, range));
  el.plain = false;
}

function prependModifierMarker (symbol, name, dynamic) {
  return dynamic
    ? ("_p(" + name + ",\"" + symbol + "\")")
    : symbol + name // mark the event as captured
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn,
  range,
  dynamic
) {
  modifiers = modifiers || emptyObject;
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    process.env.NODE_ENV !== 'production' && warn &&
    modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.',
      range
    );
  }

  // normalize click.right and click.middle since they don't actually fire
  // this is technically browser-specific, but at least for now browsers are
  // the only target envs that have right/middle clicks.
  if (modifiers.right) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
    } else if (name === 'click') {
      name = 'contextmenu';
      delete modifiers.right;
    }
  } else if (modifiers.middle) {
    if (dynamic) {
      name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
    } else if (name === 'click') {
      name = 'mouseup';
    }
  }

  // check capture modifier
  if (modifiers.capture) {
    delete modifiers.capture;
    name = prependModifierMarker('!', name, dynamic);
  }
  if (modifiers.once) {
    delete modifiers.once;
    name = prependModifierMarker('~', name, dynamic);
  }
  /* istanbul ignore if */
  if (modifiers.passive) {
    delete modifiers.passive;
    name = prependModifierMarker('&', name, dynamic);
  }

  var events;
  if (modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }

  var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
  if (modifiers !== emptyObject) {
    newHandler.modifiers = modifiers;
  }

  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }

  el.plain = false;
}

function getRawBindingAttr (
  el,
  name
) {
  return el.rawAttrsMap[':' + name] ||
    el.rawAttrsMap['v-bind:' + name] ||
    el.rawAttrsMap[name]
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  if (removeFromMap) {
    delete el.attrsMap[name];
  }
  return val
}

function getAndRemoveAttrByRegex (
  el,
  name
) {
  var list = el.attrsList;
  for (var i = 0, l = list.length; i < l; i++) {
    var attr = list[i];
    if (name.test(attr.name)) {
      list.splice(i, 1);
      return attr
    }
  }
}

function rangeSetItem (
  item,
  range
) {
  if (range) {
    if (range.start != null) {
      item.start = range.start;
    }
    if (range.end != null) {
      item.end = range.end;
    }
  }
  return item
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
      "? " + baseValueExpression + ".trim()" +
      ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: JSON.stringify(value),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var res = parseModel(value);
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len, str, chr, index$1, expressionPos, expressionEndPos;



function parseModel (val) {
  // Fix https://github.com/vuejs/vue/pull/7730
  // allow v-model="obj.val " (trailing whitespace)
  val = val.trim();
  len = val.length;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    index$1 = val.lastIndexOf('.');
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      return {
        exp: val,
        key: null
      }
    }
  }

  str = val;
  index$1 = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (process.env.NODE_ENV !== 'production') {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead.",
        el.rawAttrsMap['v-model']
      );
    }
  }

  if (el.component) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (process.env.NODE_ENV !== 'production') {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.',
      el.rawAttrsMap['v-model']
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
    "?_i(" + value + "," + valueBinding + ")>-1" + (
      trueValueBinding === 'true'
        ? (":(" + value + ")")
        : (":_q(" + value + "," + trueValueBinding + ")")
    )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (process.env.NODE_ENV !== 'production') {
    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (value$1 && !typeBinding) {
      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
      warn$1(
        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
        'because the latter already expands to a value binding internally',
        el.rawAttrsMap[binding]
      );
    }
  }

  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1 (
  name,
  handler,
  capture,
  passive
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // bail for environments that have buggy event.timeStamp implementations
        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
        // #9681 QtWebEngine event.timeStamp is negative value
        e.timeStamp <= 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    };
  }
  target$1.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  name,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

var svgContainer;

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = '';
    }
  }

  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;
      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }
      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if (
      // skip the update if old and new VDOM state is the same.
      // `value` is handled separately because the DOM value may be temporarily
      // out of sync with VDOM state due to focus, composition and modifiers.
      // This  #4521 by skipping the unnecesarry `checked` update.
      cur !== oldProps[key]
    ) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    context = transitionNode.context;
    transitionNode = transitionNode.parent;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});



function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var rawTokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index, tokenValue;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      rawTokens.push(tokenValue = text.slice(lastIndex, index));
      tokens.push(JSON.stringify(tokenValue));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    rawTokens.push({ '@binding': exp });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    rawTokens.push(tokenValue = text.slice(lastIndex));
    tokens.push(JSON.stringify(tokenValue));
  }
  return {
    expression: tokens.join('+'),
    tokens: rawTokens
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (process.env.NODE_ENV !== 'production' && staticClass) {
    var res = parseText(staticClass, options.delimiters);
    if (res) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.',
        el.rawAttrsMap['class']
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      var res = parseText(staticStyle, options.delimiters);
      if (res) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.',
          el.rawAttrsMap['style']
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

/*  */

var decoder;

var he = {
  decode: function decode (html) {
    decoder = decoder || document.createElement('div');
    decoder.innerHTML = html;
    return decoder.textContent
  }
};

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

// Regular Expressions for parsing tags and attributes
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
var doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being pased as HTML comment when inlined in page
var comment = /^<!\--/;
var conditionalComment = /^<!\[/;

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n',
  '&#9;': '\t',
  '&#39;': "'"
};
var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

// #5992
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            if (options.shouldKeepComment) {
              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
            }
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
      }

      if (textEnd < 0) {
        text = html;
      }

      if (text) {
        advance(text.length);
      }

      if (options.chars && text) {
        options.chars(text, index - text.length, index);
      }
    } else {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) {
          text = text.slice(1);
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (process.env.NODE_ENV !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
        attr.start = index;
        advance(attr[0].length);
        attr.end = index;
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      var value = args[3] || args[4] || args[5] || '';
      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines;
      attrs[i] = {
        name: args[1],
        value: decodeAttr(value, shouldDecodeNewlines)
      };
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        attrs[i].start = args.start + args[0].match(/^\s*/).length;
        attrs[i].end = args.end;
      }
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    // Find the closest opened tag of the same type
    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (process.env.NODE_ENV !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag."),
            { start: stack[i].start, end: stack[i].end }
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
var stripParensRE = /^\(|\)$/g;
var dynamicArgRE = /^\[.*\]$/;

var argRE = /:(.*)$/;
var bindRE = /^:|^\.|^v-bind:/;
var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

var slotRE = /^v-slot(:|$)|^#/;

var lineBreakRE = /[\r\n]/;
var whitespaceRE$1 = /\s+/g;

var invalidAttributeRE = /[\s"'<>\/=]/;

var decodeHTMLCached = cached(he.decode);

var emptySlotScopeToken = "_empty_";

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;
var maybeComponent;

function createASTElement (
  tag,
  attrs,
  parent
) {
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    rawAttrsMap: {},
    parent: parent,
    children: []
  }
}

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;
  var isReservedTag = options.isReservedTag || no;
  maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };

  transforms = pluckModuleFunction(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var whitespaceOption = options.whitespace;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg, range) {
    if (!warned) {
      warned = true;
      warn$2(msg, range);
    }
  }

  function closeElement (element) {
    trimEndingWhitespace(element);
    if (!inVPre && !element.processed) {
      element = processElement(element, options);
    }
    // tree management
    if (!stack.length && element !== root) {
      // allow root elements with v-if, v-else-if and v-else
      if (root.if && (element.elseif || element.else)) {
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(element);
        }
        addIfCondition(root, {
          exp: element.elseif,
          block: element
        });
      } else if (process.env.NODE_ENV !== 'production') {
        warnOnce(
          "Component template should contain exactly one root element. " +
          "If you are using v-if on multiple elements, " +
          "use v-else-if to chain them instead.",
          { start: element.start }
        );
      }
    }
    if (currentParent && !element.forbidden) {
      if (element.elseif || element.else) {
        processIfConditions(element, currentParent);
      } else {
        if (element.slotScope) {
          // scoped slot
          // keep it in the children list so that v-else(-if) conditions can
          // find it as the prev node.
          var name = element.slotTarget || '"default"'
          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        }
        currentParent.children.push(element);
        element.parent = currentParent;
      }
    }

    // final children cleanup
    // filter out scoped slots
    element.children = element.children.filter(function (c) { return !(c).slotScope; });
    // remove trailing whitespace node again
    trimEndingWhitespace(element);

    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
    // apply post-transforms
    for (var i = 0; i < postTransforms.length; i++) {
      postTransforms[i](element, options);
    }
  }

  function trimEndingWhitespace (el) {
    // remove trailing whitespace node
    if (!inPre) {
      var lastNode;
      while (
        (lastNode = el.children[el.children.length - 1]) &&
        lastNode.type === 3 &&
        lastNode.text === ' '
      ) {
        el.children.pop();
      }
    }
  }

  function checkRootConstraints (el) {
    if (el.tag === 'slot' || el.tag === 'template') {
      warnOnce(
        "Cannot use <" + (el.tag) + "> as component root element because it may " +
        'contain multiple nodes.',
        { start: el.start }
      );
    }
    if (el.attrsMap.hasOwnProperty('v-for')) {
      warnOnce(
        'Cannot use v-for on stateful component root element because ' +
        'it renders multiple elements.',
        el.rawAttrsMap['v-for']
      );
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
    shouldKeepComment: options.comments,
    outputSourceRange: options.outputSourceRange,
    start: function start (tag, attrs, unary, start$1, end) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) {
        element.ns = ns;
      }

      if (process.env.NODE_ENV !== 'production') {
        if (options.outputSourceRange) {
          element.start = start$1;
          element.end = end;
          element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
            cumulated[attr.name] = attr;
            return cumulated
          }, {});
        }
        attrs.forEach(function (attr) {
          if (invalidAttributeRE.test(attr.name)) {
            warn$2(
              "Invalid dynamic argument expression: attribute names cannot contain " +
              "spaces, quotes, <, >, / or =.",
              {
                start: attr.start + attr.name.indexOf("["),
                end: attr.start + attr.name.length
              }
            );
          }
        });
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        process.env.NODE_ENV !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.',
          { start: element.start }
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else if (!element.processed) {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
      }

      if (!root) {
        root = element;
        if (process.env.NODE_ENV !== 'production') {
          checkRootConstraints(root);
        }
      }

      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        closeElement(element);
      }
    },

    end: function end (tag, start, end$1) {
      var element = stack[stack.length - 1];
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
        element.end = end$1;
      }
      closeElement(element);
    },

    chars: function chars (text, start, end) {
      if (!currentParent) {
        if (process.env.NODE_ENV !== 'production') {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.',
              { start: start }
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored."),
              { start: start }
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      if (inPre || text.trim()) {
        text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
      } else if (!children.length) {
        // remove the whitespace-only node right after an opening tag
        text = '';
      } else if (whitespaceOption) {
        if (whitespaceOption === 'condense') {
          // in condense mode, remove the whitespace node if it contains
          // line break, otherwise condense to a single space
          text = lineBreakRE.test(text) ? '' : ' ';
        } else {
          text = ' ';
        }
      } else {
        text = preserveWhitespace ? ' ' : '';
      }
      if (text) {
        if (!inPre && whitespaceOption === 'condense') {
          // condense consecutive whitespaces into single space
          text = text.replace(whitespaceRE$1, ' ');
        }
        var res;
        var child;
        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
          child = {
            type: 2,
            expression: res.expression,
            tokens: res.tokens,
            text: text
          };
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          child = {
            type: 3,
            text: text
          };
        }
        if (child) {
          if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          children.push(child);
        }
      }
    },
    comment: function comment (text, start, end) {
      // adding anyting as a sibling to the root node is forbidden
      // comments should still be allowed, but ignored
      if (currentParent) {
        var child = {
          type: 3,
          text: text,
          isComment: true
        };
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          child.start = start;
          child.end = end;
        }
        currentParent.children.push(child);
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var list = el.attrsList;
  var len = list.length;
  if (len) {
    var attrs = el.attrs = new Array(len);
    for (var i = 0; i < len; i++) {
      attrs[i] = {
        name: list[i].name,
        value: JSON.stringify(list[i].value)
      };
      if (list[i].start != null) {
        attrs[i].start = list[i].start;
        attrs[i].end = list[i].end;
      }
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processElement (
  element,
  options
) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = (
    !element.key &&
    !element.scopedSlots &&
    !element.attrsList.length
  );

  processRef(element);
  processSlotContent(element);
  processSlotOutlet(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
  return element
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (process.env.NODE_ENV !== 'production') {
      if (el.tag === 'template') {
        warn$2(
          "<template> cannot be keyed. Place the key on real elements instead.",
          getRawBindingAttr(el, 'key')
        );
      }
      if (el.for) {
        var iterator = el.iterator2 || el.iterator1;
        var parent = el.parent;
        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
          warn$2(
            "Do not use v-for index as key on <transition-group> children, " +
            "this is the same as not using keys.",
            getRawBindingAttr(el, 'key'),
            true /* tip */
          );
        }
      }
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var res = parseFor(exp);
    if (res) {
      extend(el, res);
    } else if (process.env.NODE_ENV !== 'production') {
      warn$2(
        ("Invalid v-for expression: " + exp),
        el.rawAttrsMap['v-for']
      );
    }
  }
}



function parseFor (exp) {
  var inMatch = exp.match(forAliasRE);
  if (!inMatch) { return }
  var res = {};
  res.for = inMatch[2].trim();
  var alias = inMatch[1].trim().replace(stripParensRE, '');
  var iteratorMatch = alias.match(forIteratorRE);
  if (iteratorMatch) {
    res.alias = alias.replace(forIteratorRE, '').trim();
    res.iterator1 = iteratorMatch[1].trim();
    if (iteratorMatch[2]) {
      res.iterator2 = iteratorMatch[2].trim();
    }
  } else {
    res.alias = alias;
  }
  return res
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (process.env.NODE_ENV !== 'production') {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if.",
      el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (process.env.NODE_ENV !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored.",
          children[i]
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

// handle content being passed to a component as slot,
// e.g. <template slot="xxx">, <div slot-scope="xxx">
function processSlotContent (el) {
  var slotScope;
  if (el.tag === 'template') {
    slotScope = getAndRemoveAttr(el, 'scope');
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && slotScope) {
      warn$2(
        "the \"scope\" attribute for scoped slots have been deprecated and " +
        "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
        "can also be used on plain elements in addition to <template> to " +
        "denote scoped slots.",
        el.rawAttrsMap['scope'],
        true
      );
    }
    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && el.attrsMap['v-for']) {
      warn$2(
        "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
        "(v-for takes higher priority). Use a wrapper <template> for the " +
        "scoped slot to make it clearer.",
        el.rawAttrsMap['slot-scope'],
        true
      );
    }
    el.slotScope = slotScope;
  }

  // slot="xxx"
  var slotTarget = getBindingAttr(el, 'slot');
  if (slotTarget) {
    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
    // preserve slot as an attribute for native shadow DOM compat
    // only for non-scoped slots.
    if (el.tag !== 'template' && !el.slotScope) {
      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
    }
  }

  // 2.6 v-slot syntax
  {
    if (el.tag === 'template') {
      // v-slot on <template>
      var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
      if (slotBinding) {
        if (process.env.NODE_ENV !== 'production') {
          if (el.slotTarget || el.slotScope) {
            warn$2(
              "Unexpected mixed usage of different slot syntaxes.",
              el
            );
          }
          if (el.parent && !maybeComponent(el.parent)) {
            warn$2(
              "<template v-slot> can only appear at the root level inside " +
              "the receiving the component",
              el
            );
          }
        }
        var ref = getSlotName(slotBinding);
        var name = ref.name;
        var dynamic = ref.dynamic;
        el.slotTarget = name;
        el.slotTargetDynamic = dynamic;
        el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
      }
    } else {
      // v-slot on component, denotes default slot
      var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
      if (slotBinding$1) {
        if (process.env.NODE_ENV !== 'production') {
          if (!maybeComponent(el)) {
            warn$2(
              "v-slot can only be used on components or <template>.",
              slotBinding$1
            );
          }
          if (el.slotScope || el.slotTarget) {
            warn$2(
              "Unexpected mixed usage of different slot syntaxes.",
              el
            );
          }
          if (el.scopedSlots) {
            warn$2(
              "To avoid scope ambiguity, the default slot should also use " +
              "<template> syntax when there are other named slots.",
              slotBinding$1
            );
          }
        }
        // add the component's children to its default slot
        var slots = el.scopedSlots || (el.scopedSlots = {});
        var ref$1 = getSlotName(slotBinding$1);
        var name$1 = ref$1.name;
        var dynamic$1 = ref$1.dynamic;
        var slotContainer = slots[name$1] = createASTElement('template', [], el);
        slotContainer.slotTarget = name$1;
        slotContainer.slotTargetDynamic = dynamic$1;
        slotContainer.children = el.children.filter(function (c) {
          if (!c.slotScope) {
            c.parent = slotContainer;
            return true
          }
        });
        slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
        // remove children as they are returned from scopedSlots now
        el.children = [];
        // mark el non-plain so data gets generated
        el.plain = false;
      }
    }
  }
}

function getSlotName (binding) {
  var name = binding.name.replace(slotRE, '');
  if (!name) {
    if (binding.name[0] !== '#') {
      name = 'default';
    } else if (process.env.NODE_ENV !== 'production') {
      warn$2(
        "v-slot shorthand syntax requires a slot name.",
        binding
      );
    }
  }
  return dynamicArgRE.test(name)
    // dynamic [name]
    ? { name: name.slice(1, -1), dynamic: true }
    // static name
    : { name: ("\"" + name + "\""), dynamic: false }
}

// handle <slot/> outlets
function processSlotOutlet (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (process.env.NODE_ENV !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead.",
        getRawBindingAttr(el, 'key')
      );
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name.replace(dirRE, ''));
      // support .foo shorthand syntax for the .prop modifier
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        if (
          process.env.NODE_ENV !== 'production' &&
          value.trim().length === 0
        ) {
          warn$2(
            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
          );
        }
        if (modifiers) {
          if (modifiers.prop && !isDynamic) {
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel && !isDynamic) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            syncGen = genAssignmentCode(value, "$event");
            if (!isDynamic) {
              addHandler(
                el,
                ("update:" + (camelize(name))),
                syncGen,
                null,
                false,
                warn$2,
                list[i]
              );
              if (hyphenate(name) !== camelize(name)) {
                addHandler(
                  el,
                  ("update:" + (hyphenate(name))),
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
              }
            } else {
              // handler w/ dynamic event name
              addHandler(
                el,
                ("\"update:\"+(" + name + ")"),
                syncGen,
                null,
                false,
                warn$2,
                list[i],
                true // dynamic
              );
            }
          }
        }
        if ((modifiers && modifiers.prop) || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp(el, name, value, list[i], isDynamic);
        } else {
          addAttr(el, name, value, list[i], isDynamic);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        isDynamic = dynamicArgRE.test(name);
        if (isDynamic) {
          name = name.slice(1, -1);
        }
        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        isDynamic = false;
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
          if (dynamicArgRE.test(arg)) {
            arg = arg.slice(1, -1);
            isDynamic = true;
          }
        }
        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
        if (process.env.NODE_ENV !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (process.env.NODE_ENV !== 'production') {
        var res = parseText(value, delimiters);
        if (res) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.',
            list[i]
          );
        }
      }
      addAttr(el, name, JSON.stringify(value), list[i]);
      // #6887 firefox doesn't update muted state if set via attribute
      // even immediately after element creation
      if (!el.component &&
          name === 'muted' &&
          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
        addProp(el, name, 'true', list[i]);
      }
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      process.env.NODE_ENV !== 'production' &&
      map[attrs[i].name] && !isIE && !isEdge
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead.",
        el.rawAttrsMap['v-model']
      );
    }
    _el = _el.parent;
  }
}

/*  */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (!map['v-model']) {
      return
    }

    var typeBinding;
    if (map[':type'] || map['v-bind:type']) {
      typeBinding = getBindingAttr(el, 'type');
    }
    if (!map.type && !typeBinding && map['v-bind']) {
      typeBinding = "(" + (map['v-bind']) + ").type";
    }

    if (typeBinding) {
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });

      if (hasElse) {
        branch0.else = true;
      } else if (elseIfCondition) {
        branch0.elseif = elseIfCondition;
      }

      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

var model$1 = {
  preTransformNode: preTransformNode
};

var modules$1 = [
  klass$1,
  style$1,
  model$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        markStatic$1(block);
        if (!block.static) {
          node.static = false;
        }
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/;
var fnInvokeRE = /\([^)]*?\);*$/;
var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

// KeyboardEvent.keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// KeyboardEvent.key aliases
var keyNames = {
  // #7880: IE11 and Edge use `Esc` for Escape key name.
  esc: ['Esc', 'Escape'],
  tab: 'Tab',
  enter: 'Enter',
  // #9112: IE11 uses `Spacebar` for Space key name.
  space: [' ', 'Spacebar'],
  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
  up: ['Up', 'ArrowUp'],
  left: ['Left', 'ArrowLeft'],
  right: ['Right', 'ArrowRight'],
  down: ['Down', 'ArrowDown'],
  // #9112: IE11 uses `Del` for Delete key name.
  'delete': ['Backspace', 'Delete', 'Del']
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative
) {
  var prefix = isNative ? 'nativeOn:' : 'on:';
  var staticHandlers = "";
  var dynamicHandlers = "";
  for (var name in events) {
    var handlerCode = genHandler(events[name]);
    if (events[name] && events[name].dynamic) {
      dynamicHandlers += name + "," + handlerCode + ",";
    } else {
      staticHandlers += "\"" + name + "\":" + handlerCode + ",";
    }
  }
  staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
  if (dynamicHandlers) {
    return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
  } else {
    return prefix + staticHandlers
  }
}

function genHandler (handler) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);
  var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

  if (!handler.modifiers) {
    if (isMethodPath || isFunctionExpression) {
      return handler.value
    }
    return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? ("return " + (handler.value) + "($event)")
      : isFunctionExpression
        ? ("return (" + (handler.value) + ")($event)")
        : isFunctionInvocation
          ? ("return " + (handler.value))
          : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return (
    // make sure the key filters only apply to KeyboardEvents
    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
    // key events that do not have keyCode property...
    "if(!$event.type.indexOf('key')&&" +
    (keys.map(genFilterCode).join('&&')) + ")return null;"
  )
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var keyCode = keyCodes[key];
  var keyName = keyNames[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(keyCode)) + "," +
    "$event.key," +
    "" + (JSON.stringify(keyName)) +
    ")"
  )
}

/*  */

function on (el, dir) {
  if (process.env.NODE_ENV !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */





var CodegenState = function CodegenState (options) {
  this.options = options;
  this.warn = options.warn || baseWarn;
  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
  this.pre = false;
};



function generate (
  ast,
  options
) {
  var state = new CodegenState(options);
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genElement (el, state) {
  if (el.parent) {
    el.pre = el.pre || el.parent.pre;
  }

  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el, state);
    } else {
      var data;
      if (!el.plain || (el.pre && state.maybeComponent(el))) {
        data = genData$2(el, state);
      }

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el, state) {
  el.staticProcessed = true;
  // Some elements (templates) need to behave differently inside of a v-pre
  // node.  All pre nodes are static roots, so we can use this as a location to
  // wrap a state change and reset it upon exiting the pre node.
  var originalPreState = state.pre;
  if (el.pre) {
    state.pre = el.pre;
  }
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  state.pre = originalPreState;
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el, state) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      process.env.NODE_ENV !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. ",
        el.rawAttrsMap['v-once']
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}

function genIf (
  el,
  state,
  altGen,
  altEmpty
) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) {
  if (!conditions.length) {
    return altEmpty || '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}

function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (process.env.NODE_ENV !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      el.rawAttrsMap['v-for'],
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}

function genData$2 (el, state) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:" + (genProps(el.attrs)) + ",";
  }
  // DOM props
  if (el.props) {
    data += "domProps:" + (genProps(el.props)) + ",";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind dynamic argument wrap
  // v-bind with dynamic arguments must be applied using the same v-bind object
  // merge helper so that class/style/mustUseProp attrs are handled correctly.
  if (el.dynamicAttrs) {
    data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
  }
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if (process.env.NODE_ENV !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn(
      'Inline-template components must have exactly one child element.',
      { start: el.start }
    );
  }
  if (ast && ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  el,
  slots,
  state
) {
  // by default scoped slots are considered "stable", this allows child
  // components with only scoped slots to skip forced updates from parent.
  // but in some cases we have to bail-out of this optimization
  // for example if the slot contains dynamic names, has v-if or v-for on them...
  var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
    var slot = slots[key];
    return (
      slot.slotTargetDynamic ||
      slot.if ||
      slot.for ||
      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
    )
  });

  // #9534: if a component with scoped slots is inside a conditional branch,
  // it's possible for the same component to be reused but with different
  // compiled slot content. To avoid that, we generate a unique key based on
  // the generated code of all the slot contents.
  var needsKey = !!el.if;

  // OR when it is inside another scoped slot or v-for (the reactivity may be
  // disconnected due to the intermediate scope variable)
  // #9438, #9506
  // TODO: this can be further optimized by properly analyzing in-scope bindings
  // and skip force updating ones that do not actually use scope variables.
  if (!needsForceUpdate) {
    var parent = el.parent;
    while (parent) {
      if (
        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
        parent.for
      ) {
        needsForceUpdate = true;
        break
      }
      if (parent.if) {
        needsKey = true;
      }
      parent = parent.parent;
    }
  }

  var generatedSlots = Object.keys(slots)
    .map(function (key) { return genScopedSlot(slots[key], state); })
    .join(',');

  return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
}

function hash(str) {
  var hash = 5381;
  var i = str.length;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0
}

function containsSlotChild (el) {
  if (el.type === 1) {
    if (el.tag === 'slot') {
      return true
    }
    return el.children.some(containsSlotChild)
  }
  return false
}

function genScopedSlot (
  el,
  state
) {
  var isLegacySyntax = el.attrsMap['slot-scope'];
  if (el.if && !el.ifProcessed && !isLegacySyntax) {
    return genIf(el, state, genScopedSlot, "null")
  }
  if (el.for && !el.forProcessed) {
    return genFor(el, state, genScopedSlot)
  }
  var slotScope = el.slotScope === emptySlotScopeToken
    ? ""
    : String(el.slotScope);
  var fn = "function(" + slotScope + "){" +
    "return " + (el.tag === 'template'
      ? el.if && isLegacySyntax
        ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  // reverse proxy v-slot without scope on this.$slots
  var reverseProxy = slotScope ? "" : ",proxy:true";
  return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      var normalizationType = checkSkip
        ? state.maybeComponent(el$1) ? ",1" : ",0"
        : "";
      return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
    }
    var normalizationType$1 = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}

function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs || el.dynamicAttrs
    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
        // slot props are camelized
        name: camelize(attr.name),
        value: attr.value,
        dynamic: attr.dynamic
      }); }))
    : null;
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (
  componentName,
  el,
  state
) {
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var staticProps = "";
  var dynamicProps = "";
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    var value = transformSpecialNewlines(prop.value);
    if (prop.dynamic) {
      dynamicProps += (prop.name) + "," + value + ",";
    } else {
      staticProps += "\"" + (prop.name) + "\":" + value + ",";
    }
  }
  staticProps = "{" + (staticProps.slice(0, -1)) + "}";
  if (dynamicProps) {
    return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
  } else {
    return staticProps
  }
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */



// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast, warn) {
  if (ast) {
    checkNode(ast, warn);
  }
}

function checkNode (node, warn) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          var range = node.rawAttrsMap[name];
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), warn, range);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), warn, range);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), warn, range);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], warn);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, warn, node);
  }
}

function checkEvent (exp, text, warn, range) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    warn(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
      range
    );
  }
  checkExpression(exp, text, warn, range);
}

function checkFor (node, text, warn, range) {
  checkExpression(node.for || '', text, warn, range);
  checkIdentifier(node.alias, 'v-for alias', text, warn, range);
  checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
  checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
}

function checkIdentifier (
  ident,
  type,
  text,
  warn,
  range
) {
  if (typeof ident === 'string') {
    try {
      new Function(("var " + ident + "=_"));
    } catch (e) {
      warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
    }
  }
}

function checkExpression (exp, text, warn, range) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      warn(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
        range
      );
    } else {
      warn(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n",
        range
      );
    }
  }
}

/*  */

var range = 2;

function generateCodeFrame (
  source,
  start,
  end
) {
  if ( start === void 0 ) start = 0;
  if ( end === void 0 ) end = source.length;

  var lines = source.split(/\r?\n/);
  var count = 0;
  var res = [];
  for (var i = 0; i < lines.length; i++) {
    count += lines[i].length + 1;
    if (count >= start) {
      for (var j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) { continue }
        res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
        var lineLength = lines[j].length;
        if (j === i) {
          // push underline
          var pad = start - (count - lineLength) + 1;
          var length = end > count ? lineLength - pad : end - start;
          res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
        } else if (j > i) {
          if (end > count) {
            var length$1 = Math.min(end - count, lineLength);
            res.push("   |  " + repeat$1("^", length$1));
          }
          count += lineLength + 1;
        }
      }
      break
    }
  }
  return res.join('\n')
}

function repeat$1 (str, n) {
  var result = '';
  if (n > 0) {
    while (true) { // eslint-disable-line
      if (n & 1) { result += str; }
      n >>>= 1;
      if (n <= 0) { break }
      str += str;
    }
  }
  return result
}

/*  */



function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompileToFunctionFn (compile) {
  var cache = Object.create(null);

  return function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = extend({}, options);
    var warn$$1 = options.warn || warn;
    delete options.warn;

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach(function (e) {
            warn$$1(
              "Error compiling template:\n\n" + (e.msg) + "\n\n" +
              generateCodeFrame(template, e.start, e.end),
              vm
            );
          });
        } else {
          warn$$1(
            "Error compiling template:\n\n" + template + "\n\n" +
            compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
            vm
          );
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
        } else {
          compiled.tips.forEach(function (msg) { return tip(msg, vm); });
        }
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) {
  return function createCompiler (baseOptions) {
    function compile (
      template,
      options
    ) {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];

      var warn = function (msg, range, tip) {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
          // $flow-disable-line
          var leadingSpaceLength = template.match(/^\s*/)[0].length;

          warn = function (msg, range, tip) {
            var data = { msg: msg };
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength;
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength;
              }
            }
            (tip ? tips : errors).push(data);
          };
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          );
        }
        // copy other options
        for (var key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      finalOptions.warn = warn;

      var compiled = baseCompile(template.trim(), finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn);
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  if (options.optimize !== false) {
    optimize(ast, options);
  }
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler(baseOptions);
var compile = ref$1.compile;
var compileToFunctions = ref$1.compileToFunctions;

/*  */

// check whether current browser encodes a char inside attribute values
var div;
function getShouldDecode (href) {
  div = div || document.createElement('div');
  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
  return div.innerHTML.indexOf('&#10;') > 0
}

// #3663: IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
// #6828: chrome encodes content in a[href]
var shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue.prototype.$mount;
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines: shouldDecodeNewlines,
        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions;

/* harmony default export */ __webpack_exports__["a"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../process/browser.js */ 1), __webpack_require__(/*! ./../../webpack/buildin/global.js */ 2), __webpack_require__(/*! ./../../timers-browserify/main.js */ 22).setImmediate))

/***/ }),
/* 7 */
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ 24);

/***/ }),
/* 8 */
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 9 */
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./../utils */ 0);
var settle = __webpack_require__(/*! ./../core/settle */ 28);
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ 30);
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ 31);
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ 32);
var createError = __webpack_require__(/*! ../core/createError */ 10);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ 33);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if (process.env.NODE_ENV !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ 34);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../../process/browser.js */ 1)))

/***/ }),
/* 10 */
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ 29);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 11 */
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 12 */
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 13 */
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/App.vue ***!
  \*******************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'app'
});

/***/ }),
/* 14 */
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/home/Home.vue ***!
  \************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  }
});

/***/ }),
/* 15 */
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/client/Client.vue ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game__ = __webpack_require__(/*! ../../game */ 54);
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'hotel-view',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  created() {
    window.game = new __WEBPACK_IMPORTED_MODULE_0__game__["a" /* default */]();
  },
  destroyed() {
    window.game.destroy();
  },
  methods: {}
});

/***/ }),
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/account/Register.vue ***!
  \*******************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'register',
  data() {
    return {
      data: {}
    };
  }
});

/***/ }),
/* 20 */
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib/selector.js?type=script&index=0!./src/components/account/Login.vue ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'login',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  }
});

/***/ }),
/* 21 */
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(/*! vue */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios__ = __webpack_require__(/*! axios */ 7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_axios__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_vue__ = __webpack_require__(/*! ./App.vue */ 42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__router__ = __webpack_require__(/*! ./router */ 49);





__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].config.productionTip = false;

/* eslint-disable no-new */
new __WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */]({
  el: '#app',
  router: __WEBPACK_IMPORTED_MODULE_3__router__["a" /* default */],
  template: '<App/>',
  components: { App: __WEBPACK_IMPORTED_MODULE_2__App_vue__["a" /* default */] }
});

/**
 * Example for axios interceptors.
 */
__WEBPACK_IMPORTED_MODULE_1_axios___default.a.interceptors.request.use(config => {
  console.log(`================ Fire end point: ${config.url}`);
  return config;
}, error => Promise.reject(error));

/***/ }),
/* 22 */
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 23);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 2)))

/***/ }),
/* 23 */
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 2), __webpack_require__(/*! ./../process/browser.js */ 1)))

/***/ }),
/* 24 */
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ 0);
var bind = __webpack_require__(/*! ./helpers/bind */ 8);
var Axios = __webpack_require__(/*! ./core/Axios */ 26);
var defaults = __webpack_require__(/*! ./defaults */ 5);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ 12);
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ 40);
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ 11);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ 41);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 25 */
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 26 */
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ 5);
var utils = __webpack_require__(/*! ./../utils */ 0);
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ 35);
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ 36);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 27 */
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ 0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 28 */
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ 10);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 29 */
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 30 */
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 31 */
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 32 */
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 33 */
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 34 */
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 35 */
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 36 */
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);
var transformData = __webpack_require__(/*! ./transformData */ 37);
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ 11);
var defaults = __webpack_require__(/*! ../defaults */ 5);
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ 38);
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ 39);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 37 */
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ 0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 38 */
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 39 */
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 40 */
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ 12);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 41 */
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 42 */
/*!*********************!*\
  !*** ./src/App.vue ***!
  \*********************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(/*! !babel-loader!../node_modules/vue-loader/lib/selector?type=script&index=0!./App.vue */ 13);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(/*! !../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-7ba5bd90","hasScoped":false,"buble":{"transforms":{}}}!../node_modules/vue-loader/lib/selector?type=template&index=0!./App.vue */ 48);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(/*! !vue-style-loader!css-loader!../node_modules/vue-loader/lib/style-compiler/index?{"vue":true,"id":"data-v-7ba5bd90","scoped":false,"hasInlineConfig":false}!sass-loader!../node_modules/vue-loader/lib/selector?type=styles&index=0!./App.vue */ 43)
}
var normalizeComponent = __webpack_require__(/*! ../node_modules/vue-loader/lib/component-normalizer */ 4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ba5bd90", Component.options)
  } else {
    hotAPI.reload("data-v-7ba5bd90", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 43 */
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-7ba5bd90","scoped":false,"hasInlineConfig":false}!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./src/App.vue ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../node_modules/css-loader!../node_modules/vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-7ba5bd90","scoped":false,"hasInlineConfig":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue */ 44);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(/*! ../node_modules/vue-style-loader/lib/addStylesClient.js */ 46)("1aea32e7", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/sass-loader/lib/loader.js!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/*!******************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/style-compiler?{"vue":true,"id":"data-v-7ba5bd90","scoped":false,"hasInlineConfig":false}!./node_modules/sass-loader/lib/loader.js!./node_modules/vue-loader/lib/selector.js?type=styles&index=0!./src/App.vue ***!
  \******************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../node_modules/css-loader/lib/css-base.js */ 45)(false);
// imports


// module
exports.push([module.i, "/*!\n * Bootstrap v4.3.1 (https://getbootstrap.com/)\n * Copyright 2011-2019 The Bootstrap Authors\n * Copyright 2011-2019 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n:root {\n  --blue: #007bff;\n  --indigo: #6610f2;\n  --purple: #6f42c1;\n  --pink: #e83e8c;\n  --red: #dc3545;\n  --orange: #fd7e14;\n  --yellow: #ffc107;\n  --green: #28a745;\n  --teal: #20c997;\n  --cyan: #17a2b8;\n  --white: #fff;\n  --gray: #6c757d;\n  --gray-dark: #343a40;\n  --primary: #007bff;\n  --secondary: #6c757d;\n  --success: #28a745;\n  --info: #17a2b8;\n  --warning: #ffc107;\n  --danger: #dc3545;\n  --light: #f8f9fa;\n  --dark: #343a40;\n  --breakpoint-xs: 0;\n  --breakpoint-sm: 576px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 992px;\n  --breakpoint-xl: 1200px;\n  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\nhtml {\n  font-family: sans-serif;\n  line-height: 1.15;\n  -webkit-text-size-adjust: 100%;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\narticle, aside, figcaption, figure, footer, header, hgroup, main, nav, section {\n  display: block;\n}\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #212529;\n  text-align: left;\n  background-color: #fff;\n}\n[tabindex=\"-1\"]:focus {\n  outline: 0 !important;\n}\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible;\n}\nh1, h2, h3, h4, h5, h6 {\n  margin-top: 0;\n  margin-bottom: 0.5rem;\n}\np {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\nabbr[title],\nabbr[data-original-title] {\n  text-decoration: underline;\n  text-decoration: underline dotted;\n  cursor: help;\n  border-bottom: 0;\n  text-decoration-skip-ink: none;\n}\naddress {\n  margin-bottom: 1rem;\n  font-style: normal;\n  line-height: inherit;\n}\nol,\nul,\ndl {\n  margin-top: 0;\n  margin-bottom: 1rem;\n}\nol ol,\nul ul,\nol ul,\nul ol {\n  margin-bottom: 0;\n}\ndt {\n  font-weight: 700;\n}\ndd {\n  margin-bottom: .5rem;\n  margin-left: 0;\n}\nblockquote {\n  margin: 0 0 1rem;\n}\nb,\nstrong {\n  font-weight: bolder;\n}\nsmall {\n  font-size: 80%;\n}\nsub,\nsup {\n  position: relative;\n  font-size: 75%;\n  line-height: 0;\n  vertical-align: baseline;\n}\nsub {\n  bottom: -.25em;\n}\nsup {\n  top: -.5em;\n}\na {\n  color: #007bff;\n  text-decoration: none;\n  background-color: transparent;\n}\na:hover {\n    color: #0056b3;\n    text-decoration: underline;\n}\na:not([href]):not([tabindex]) {\n  color: inherit;\n  text-decoration: none;\n}\na:not([href]):not([tabindex]):hover, a:not([href]):not([tabindex]):focus {\n    color: inherit;\n    text-decoration: none;\n}\na:not([href]):not([tabindex]):focus {\n    outline: 0;\n}\npre,\ncode,\nkbd,\nsamp {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n  font-size: 1em;\n}\npre {\n  margin-top: 0;\n  margin-bottom: 1rem;\n  overflow: auto;\n}\nfigure {\n  margin: 0 0 1rem;\n}\nimg {\n  vertical-align: middle;\n  border-style: none;\n}\nsvg {\n  overflow: hidden;\n  vertical-align: middle;\n}\ntable {\n  border-collapse: collapse;\n}\ncaption {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n  color: #6c757d;\n  text-align: left;\n  caption-side: bottom;\n}\nth {\n  text-align: inherit;\n}\nlabel {\n  display: inline-block;\n  margin-bottom: 0.5rem;\n}\nbutton {\n  border-radius: 0;\n}\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\ninput,\nbutton,\nselect,\noptgroup,\ntextarea {\n  margin: 0;\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\nbutton,\ninput {\n  overflow: visible;\n}\nbutton,\nselect {\n  text-transform: none;\n}\nselect {\n  word-wrap: normal;\n}\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\nbutton:not(:disabled),\n[type=\"button\"]:not(:disabled),\n[type=\"reset\"]:not(:disabled),\n[type=\"submit\"]:not(:disabled) {\n  cursor: pointer;\n}\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  padding: 0;\n  border-style: none;\n}\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\ninput[type=\"date\"],\ninput[type=\"time\"],\ninput[type=\"datetime-local\"],\ninput[type=\"month\"] {\n  -webkit-appearance: listbox;\n}\ntextarea {\n  overflow: auto;\n  resize: vertical;\n}\nfieldset {\n  min-width: 0;\n  padding: 0;\n  margin: 0;\n  border: 0;\n}\nlegend {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  padding: 0;\n  margin-bottom: .5rem;\n  font-size: 1.5rem;\n  line-height: inherit;\n  color: inherit;\n  white-space: normal;\n}\nprogress {\n  vertical-align: baseline;\n}\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n[type=\"search\"] {\n  outline-offset: -2px;\n  -webkit-appearance: none;\n}\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n::-webkit-file-upload-button {\n  font: inherit;\n  -webkit-appearance: button;\n}\noutput {\n  display: inline-block;\n}\nsummary {\n  display: list-item;\n  cursor: pointer;\n}\ntemplate {\n  display: none;\n}\n[hidden] {\n  display: none !important;\n}\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  margin-bottom: 0.5rem;\n  font-weight: 500;\n  line-height: 1.2;\n}\nh1, .h1 {\n  font-size: 2.5rem;\n}\nh2, .h2 {\n  font-size: 2rem;\n}\nh3, .h3 {\n  font-size: 1.75rem;\n}\nh4, .h4 {\n  font-size: 1.5rem;\n}\nh5, .h5 {\n  font-size: 1.25rem;\n}\nh6, .h6 {\n  font-size: 1rem;\n}\n.lead {\n  font-size: 1.25rem;\n  font-weight: 300;\n}\n.display-1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 1.2;\n}\n.display-2 {\n  font-size: 5.5rem;\n  font-weight: 300;\n  line-height: 1.2;\n}\n.display-3 {\n  font-size: 4.5rem;\n  font-weight: 300;\n  line-height: 1.2;\n}\n.display-4 {\n  font-size: 3.5rem;\n  font-weight: 300;\n  line-height: 1.2;\n}\nhr {\n  margin-top: 1rem;\n  margin-bottom: 1rem;\n  border: 0;\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n}\nsmall,\n.small {\n  font-size: 80%;\n  font-weight: 400;\n}\nmark,\n.mark {\n  padding: 0.2em;\n  background-color: #fcf8e3;\n}\n.list-unstyled {\n  padding-left: 0;\n  list-style: none;\n}\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n}\n.list-inline-item {\n  display: inline-block;\n}\n.list-inline-item:not(:last-child) {\n    margin-right: 0.5rem;\n}\n.initialism {\n  font-size: 90%;\n  text-transform: uppercase;\n}\n.blockquote {\n  margin-bottom: 1rem;\n  font-size: 1.25rem;\n}\n.blockquote-footer {\n  display: block;\n  font-size: 80%;\n  color: #6c757d;\n}\n.blockquote-footer::before {\n    content: \"\\2014\\A0\";\n}\n.img-fluid {\n  max-width: 100%;\n  height: auto;\n}\n.img-thumbnail {\n  padding: 0.25rem;\n  background-color: #fff;\n  border: 1px solid #dee2e6;\n  border-radius: 0.25rem;\n  max-width: 100%;\n  height: auto;\n}\n.figure {\n  display: inline-block;\n}\n.figure-img {\n  margin-bottom: 0.5rem;\n  line-height: 1;\n}\n.figure-caption {\n  font-size: 90%;\n  color: #6c757d;\n}\ncode {\n  font-size: 87.5%;\n  color: #e83e8c;\n  word-break: break-word;\n}\na > code {\n    color: inherit;\n}\nkbd {\n  padding: 0.2rem 0.4rem;\n  font-size: 87.5%;\n  color: #fff;\n  background-color: #212529;\n  border-radius: 0.2rem;\n}\nkbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: 700;\n}\npre {\n  display: block;\n  font-size: 87.5%;\n  color: #212529;\n}\npre code {\n    font-size: inherit;\n    color: inherit;\n    word-break: normal;\n}\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll;\n}\n.container {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto;\n}\n@media (min-width: 576px) {\n.container {\n      max-width: 540px;\n}\n}\n@media (min-width: 768px) {\n.container {\n      max-width: 720px;\n}\n}\n@media (min-width: 992px) {\n.container {\n      max-width: 960px;\n}\n}\n@media (min-width: 1200px) {\n.container {\n      max-width: 1140px;\n}\n}\n.container-fluid {\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  margin-right: auto;\n  margin-left: auto;\n}\n.row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px;\n}\n.no-gutters {\n  margin-right: 0;\n  margin-left: 0;\n}\n.no-gutters > .col,\n  .no-gutters > [class*=\"col-\"] {\n    padding-right: 0;\n    padding-left: 0;\n}\n.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,\n.col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,\n.col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,\n.col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,\n.col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,\n.col-xl-auto {\n  position: relative;\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n}\n.col {\n  flex-basis: 0;\n  flex-grow: 1;\n  max-width: 100%;\n}\n.col-auto {\n  flex: 0 0 auto;\n  width: auto;\n  max-width: 100%;\n}\n.col-1 {\n  flex: 0 0 8.33333%;\n  max-width: 8.33333%;\n}\n.col-2 {\n  flex: 0 0 16.66667%;\n  max-width: 16.66667%;\n}\n.col-3 {\n  flex: 0 0 25%;\n  max-width: 25%;\n}\n.col-4 {\n  flex: 0 0 33.33333%;\n  max-width: 33.33333%;\n}\n.col-5 {\n  flex: 0 0 41.66667%;\n  max-width: 41.66667%;\n}\n.col-6 {\n  flex: 0 0 50%;\n  max-width: 50%;\n}\n.col-7 {\n  flex: 0 0 58.33333%;\n  max-width: 58.33333%;\n}\n.col-8 {\n  flex: 0 0 66.66667%;\n  max-width: 66.66667%;\n}\n.col-9 {\n  flex: 0 0 75%;\n  max-width: 75%;\n}\n.col-10 {\n  flex: 0 0 83.33333%;\n  max-width: 83.33333%;\n}\n.col-11 {\n  flex: 0 0 91.66667%;\n  max-width: 91.66667%;\n}\n.col-12 {\n  flex: 0 0 100%;\n  max-width: 100%;\n}\n.order-first {\n  order: -1;\n}\n.order-last {\n  order: 13;\n}\n.order-0 {\n  order: 0;\n}\n.order-1 {\n  order: 1;\n}\n.order-2 {\n  order: 2;\n}\n.order-3 {\n  order: 3;\n}\n.order-4 {\n  order: 4;\n}\n.order-5 {\n  order: 5;\n}\n.order-6 {\n  order: 6;\n}\n.order-7 {\n  order: 7;\n}\n.order-8 {\n  order: 8;\n}\n.order-9 {\n  order: 9;\n}\n.order-10 {\n  order: 10;\n}\n.order-11 {\n  order: 11;\n}\n.order-12 {\n  order: 12;\n}\n.offset-1 {\n  margin-left: 8.33333%;\n}\n.offset-2 {\n  margin-left: 16.66667%;\n}\n.offset-3 {\n  margin-left: 25%;\n}\n.offset-4 {\n  margin-left: 33.33333%;\n}\n.offset-5 {\n  margin-left: 41.66667%;\n}\n.offset-6 {\n  margin-left: 50%;\n}\n.offset-7 {\n  margin-left: 58.33333%;\n}\n.offset-8 {\n  margin-left: 66.66667%;\n}\n.offset-9 {\n  margin-left: 75%;\n}\n.offset-10 {\n  margin-left: 83.33333%;\n}\n.offset-11 {\n  margin-left: 91.66667%;\n}\n@media (min-width: 576px) {\n.col-sm {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n}\n.col-sm-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: 100%;\n}\n.col-sm-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%;\n}\n.col-sm-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%;\n}\n.col-sm-3 {\n    flex: 0 0 25%;\n    max-width: 25%;\n}\n.col-sm-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%;\n}\n.col-sm-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%;\n}\n.col-sm-6 {\n    flex: 0 0 50%;\n    max-width: 50%;\n}\n.col-sm-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%;\n}\n.col-sm-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%;\n}\n.col-sm-9 {\n    flex: 0 0 75%;\n    max-width: 75%;\n}\n.col-sm-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%;\n}\n.col-sm-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%;\n}\n.col-sm-12 {\n    flex: 0 0 100%;\n    max-width: 100%;\n}\n.order-sm-first {\n    order: -1;\n}\n.order-sm-last {\n    order: 13;\n}\n.order-sm-0 {\n    order: 0;\n}\n.order-sm-1 {\n    order: 1;\n}\n.order-sm-2 {\n    order: 2;\n}\n.order-sm-3 {\n    order: 3;\n}\n.order-sm-4 {\n    order: 4;\n}\n.order-sm-5 {\n    order: 5;\n}\n.order-sm-6 {\n    order: 6;\n}\n.order-sm-7 {\n    order: 7;\n}\n.order-sm-8 {\n    order: 8;\n}\n.order-sm-9 {\n    order: 9;\n}\n.order-sm-10 {\n    order: 10;\n}\n.order-sm-11 {\n    order: 11;\n}\n.order-sm-12 {\n    order: 12;\n}\n.offset-sm-0 {\n    margin-left: 0;\n}\n.offset-sm-1 {\n    margin-left: 8.33333%;\n}\n.offset-sm-2 {\n    margin-left: 16.66667%;\n}\n.offset-sm-3 {\n    margin-left: 25%;\n}\n.offset-sm-4 {\n    margin-left: 33.33333%;\n}\n.offset-sm-5 {\n    margin-left: 41.66667%;\n}\n.offset-sm-6 {\n    margin-left: 50%;\n}\n.offset-sm-7 {\n    margin-left: 58.33333%;\n}\n.offset-sm-8 {\n    margin-left: 66.66667%;\n}\n.offset-sm-9 {\n    margin-left: 75%;\n}\n.offset-sm-10 {\n    margin-left: 83.33333%;\n}\n.offset-sm-11 {\n    margin-left: 91.66667%;\n}\n}\n@media (min-width: 768px) {\n.col-md {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n}\n.col-md-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: 100%;\n}\n.col-md-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%;\n}\n.col-md-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%;\n}\n.col-md-3 {\n    flex: 0 0 25%;\n    max-width: 25%;\n}\n.col-md-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%;\n}\n.col-md-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%;\n}\n.col-md-6 {\n    flex: 0 0 50%;\n    max-width: 50%;\n}\n.col-md-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%;\n}\n.col-md-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%;\n}\n.col-md-9 {\n    flex: 0 0 75%;\n    max-width: 75%;\n}\n.col-md-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%;\n}\n.col-md-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%;\n}\n.col-md-12 {\n    flex: 0 0 100%;\n    max-width: 100%;\n}\n.order-md-first {\n    order: -1;\n}\n.order-md-last {\n    order: 13;\n}\n.order-md-0 {\n    order: 0;\n}\n.order-md-1 {\n    order: 1;\n}\n.order-md-2 {\n    order: 2;\n}\n.order-md-3 {\n    order: 3;\n}\n.order-md-4 {\n    order: 4;\n}\n.order-md-5 {\n    order: 5;\n}\n.order-md-6 {\n    order: 6;\n}\n.order-md-7 {\n    order: 7;\n}\n.order-md-8 {\n    order: 8;\n}\n.order-md-9 {\n    order: 9;\n}\n.order-md-10 {\n    order: 10;\n}\n.order-md-11 {\n    order: 11;\n}\n.order-md-12 {\n    order: 12;\n}\n.offset-md-0 {\n    margin-left: 0;\n}\n.offset-md-1 {\n    margin-left: 8.33333%;\n}\n.offset-md-2 {\n    margin-left: 16.66667%;\n}\n.offset-md-3 {\n    margin-left: 25%;\n}\n.offset-md-4 {\n    margin-left: 33.33333%;\n}\n.offset-md-5 {\n    margin-left: 41.66667%;\n}\n.offset-md-6 {\n    margin-left: 50%;\n}\n.offset-md-7 {\n    margin-left: 58.33333%;\n}\n.offset-md-8 {\n    margin-left: 66.66667%;\n}\n.offset-md-9 {\n    margin-left: 75%;\n}\n.offset-md-10 {\n    margin-left: 83.33333%;\n}\n.offset-md-11 {\n    margin-left: 91.66667%;\n}\n}\n@media (min-width: 992px) {\n.col-lg {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n}\n.col-lg-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: 100%;\n}\n.col-lg-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%;\n}\n.col-lg-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%;\n}\n.col-lg-3 {\n    flex: 0 0 25%;\n    max-width: 25%;\n}\n.col-lg-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%;\n}\n.col-lg-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%;\n}\n.col-lg-6 {\n    flex: 0 0 50%;\n    max-width: 50%;\n}\n.col-lg-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%;\n}\n.col-lg-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%;\n}\n.col-lg-9 {\n    flex: 0 0 75%;\n    max-width: 75%;\n}\n.col-lg-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%;\n}\n.col-lg-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%;\n}\n.col-lg-12 {\n    flex: 0 0 100%;\n    max-width: 100%;\n}\n.order-lg-first {\n    order: -1;\n}\n.order-lg-last {\n    order: 13;\n}\n.order-lg-0 {\n    order: 0;\n}\n.order-lg-1 {\n    order: 1;\n}\n.order-lg-2 {\n    order: 2;\n}\n.order-lg-3 {\n    order: 3;\n}\n.order-lg-4 {\n    order: 4;\n}\n.order-lg-5 {\n    order: 5;\n}\n.order-lg-6 {\n    order: 6;\n}\n.order-lg-7 {\n    order: 7;\n}\n.order-lg-8 {\n    order: 8;\n}\n.order-lg-9 {\n    order: 9;\n}\n.order-lg-10 {\n    order: 10;\n}\n.order-lg-11 {\n    order: 11;\n}\n.order-lg-12 {\n    order: 12;\n}\n.offset-lg-0 {\n    margin-left: 0;\n}\n.offset-lg-1 {\n    margin-left: 8.33333%;\n}\n.offset-lg-2 {\n    margin-left: 16.66667%;\n}\n.offset-lg-3 {\n    margin-left: 25%;\n}\n.offset-lg-4 {\n    margin-left: 33.33333%;\n}\n.offset-lg-5 {\n    margin-left: 41.66667%;\n}\n.offset-lg-6 {\n    margin-left: 50%;\n}\n.offset-lg-7 {\n    margin-left: 58.33333%;\n}\n.offset-lg-8 {\n    margin-left: 66.66667%;\n}\n.offset-lg-9 {\n    margin-left: 75%;\n}\n.offset-lg-10 {\n    margin-left: 83.33333%;\n}\n.offset-lg-11 {\n    margin-left: 91.66667%;\n}\n}\n@media (min-width: 1200px) {\n.col-xl {\n    flex-basis: 0;\n    flex-grow: 1;\n    max-width: 100%;\n}\n.col-xl-auto {\n    flex: 0 0 auto;\n    width: auto;\n    max-width: 100%;\n}\n.col-xl-1 {\n    flex: 0 0 8.33333%;\n    max-width: 8.33333%;\n}\n.col-xl-2 {\n    flex: 0 0 16.66667%;\n    max-width: 16.66667%;\n}\n.col-xl-3 {\n    flex: 0 0 25%;\n    max-width: 25%;\n}\n.col-xl-4 {\n    flex: 0 0 33.33333%;\n    max-width: 33.33333%;\n}\n.col-xl-5 {\n    flex: 0 0 41.66667%;\n    max-width: 41.66667%;\n}\n.col-xl-6 {\n    flex: 0 0 50%;\n    max-width: 50%;\n}\n.col-xl-7 {\n    flex: 0 0 58.33333%;\n    max-width: 58.33333%;\n}\n.col-xl-8 {\n    flex: 0 0 66.66667%;\n    max-width: 66.66667%;\n}\n.col-xl-9 {\n    flex: 0 0 75%;\n    max-width: 75%;\n}\n.col-xl-10 {\n    flex: 0 0 83.33333%;\n    max-width: 83.33333%;\n}\n.col-xl-11 {\n    flex: 0 0 91.66667%;\n    max-width: 91.66667%;\n}\n.col-xl-12 {\n    flex: 0 0 100%;\n    max-width: 100%;\n}\n.order-xl-first {\n    order: -1;\n}\n.order-xl-last {\n    order: 13;\n}\n.order-xl-0 {\n    order: 0;\n}\n.order-xl-1 {\n    order: 1;\n}\n.order-xl-2 {\n    order: 2;\n}\n.order-xl-3 {\n    order: 3;\n}\n.order-xl-4 {\n    order: 4;\n}\n.order-xl-5 {\n    order: 5;\n}\n.order-xl-6 {\n    order: 6;\n}\n.order-xl-7 {\n    order: 7;\n}\n.order-xl-8 {\n    order: 8;\n}\n.order-xl-9 {\n    order: 9;\n}\n.order-xl-10 {\n    order: 10;\n}\n.order-xl-11 {\n    order: 11;\n}\n.order-xl-12 {\n    order: 12;\n}\n.offset-xl-0 {\n    margin-left: 0;\n}\n.offset-xl-1 {\n    margin-left: 8.33333%;\n}\n.offset-xl-2 {\n    margin-left: 16.66667%;\n}\n.offset-xl-3 {\n    margin-left: 25%;\n}\n.offset-xl-4 {\n    margin-left: 33.33333%;\n}\n.offset-xl-5 {\n    margin-left: 41.66667%;\n}\n.offset-xl-6 {\n    margin-left: 50%;\n}\n.offset-xl-7 {\n    margin-left: 58.33333%;\n}\n.offset-xl-8 {\n    margin-left: 66.66667%;\n}\n.offset-xl-9 {\n    margin-left: 75%;\n}\n.offset-xl-10 {\n    margin-left: 83.33333%;\n}\n.offset-xl-11 {\n    margin-left: 91.66667%;\n}\n}\n.table {\n  width: 100%;\n  margin-bottom: 1rem;\n  color: #212529;\n}\n.table th,\n  .table td {\n    padding: 0.75rem;\n    vertical-align: top;\n    border-top: 1px solid #dee2e6;\n}\n.table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n}\n.table tbody + tbody {\n    border-top: 2px solid #dee2e6;\n}\n.table-sm th,\n.table-sm td {\n  padding: 0.3rem;\n}\n.table-bordered {\n  border: 1px solid #dee2e6;\n}\n.table-bordered th,\n  .table-bordered td {\n    border: 1px solid #dee2e6;\n}\n.table-bordered thead th,\n  .table-bordered thead td {\n    border-bottom-width: 2px;\n}\n.table-borderless th,\n.table-borderless td,\n.table-borderless thead th,\n.table-borderless tbody + tbody {\n  border: 0;\n}\n.table-striped tbody tr:nth-of-type(odd) {\n  background-color: rgba(0, 0, 0, 0.05);\n}\n.table-hover tbody tr:hover {\n  color: #212529;\n  background-color: rgba(0, 0, 0, 0.075);\n}\n.table-primary,\n.table-primary > th,\n.table-primary > td {\n  background-color: #b8daff;\n}\n.table-primary th,\n.table-primary td,\n.table-primary thead th,\n.table-primary tbody + tbody {\n  border-color: #7abaff;\n}\n.table-hover .table-primary:hover {\n  background-color: #9fcdff;\n}\n.table-hover .table-primary:hover > td,\n  .table-hover .table-primary:hover > th {\n    background-color: #9fcdff;\n}\n.table-secondary,\n.table-secondary > th,\n.table-secondary > td {\n  background-color: #d6d8db;\n}\n.table-secondary th,\n.table-secondary td,\n.table-secondary thead th,\n.table-secondary tbody + tbody {\n  border-color: #b3b7bb;\n}\n.table-hover .table-secondary:hover {\n  background-color: #c8cbcf;\n}\n.table-hover .table-secondary:hover > td,\n  .table-hover .table-secondary:hover > th {\n    background-color: #c8cbcf;\n}\n.table-success,\n.table-success > th,\n.table-success > td {\n  background-color: #c3e6cb;\n}\n.table-success th,\n.table-success td,\n.table-success thead th,\n.table-success tbody + tbody {\n  border-color: #8fd19e;\n}\n.table-hover .table-success:hover {\n  background-color: #b1dfbb;\n}\n.table-hover .table-success:hover > td,\n  .table-hover .table-success:hover > th {\n    background-color: #b1dfbb;\n}\n.table-info,\n.table-info > th,\n.table-info > td {\n  background-color: #bee5eb;\n}\n.table-info th,\n.table-info td,\n.table-info thead th,\n.table-info tbody + tbody {\n  border-color: #86cfda;\n}\n.table-hover .table-info:hover {\n  background-color: #abdde5;\n}\n.table-hover .table-info:hover > td,\n  .table-hover .table-info:hover > th {\n    background-color: #abdde5;\n}\n.table-warning,\n.table-warning > th,\n.table-warning > td {\n  background-color: #ffeeba;\n}\n.table-warning th,\n.table-warning td,\n.table-warning thead th,\n.table-warning tbody + tbody {\n  border-color: #ffdf7e;\n}\n.table-hover .table-warning:hover {\n  background-color: #ffe8a1;\n}\n.table-hover .table-warning:hover > td,\n  .table-hover .table-warning:hover > th {\n    background-color: #ffe8a1;\n}\n.table-danger,\n.table-danger > th,\n.table-danger > td {\n  background-color: #f5c6cb;\n}\n.table-danger th,\n.table-danger td,\n.table-danger thead th,\n.table-danger tbody + tbody {\n  border-color: #ed969e;\n}\n.table-hover .table-danger:hover {\n  background-color: #f1b0b7;\n}\n.table-hover .table-danger:hover > td,\n  .table-hover .table-danger:hover > th {\n    background-color: #f1b0b7;\n}\n.table-light,\n.table-light > th,\n.table-light > td {\n  background-color: #fdfdfe;\n}\n.table-light th,\n.table-light td,\n.table-light thead th,\n.table-light tbody + tbody {\n  border-color: #fbfcfc;\n}\n.table-hover .table-light:hover {\n  background-color: #ececf6;\n}\n.table-hover .table-light:hover > td,\n  .table-hover .table-light:hover > th {\n    background-color: #ececf6;\n}\n.table-dark,\n.table-dark > th,\n.table-dark > td {\n  background-color: #c6c8ca;\n}\n.table-dark th,\n.table-dark td,\n.table-dark thead th,\n.table-dark tbody + tbody {\n  border-color: #95999c;\n}\n.table-hover .table-dark:hover {\n  background-color: #b9bbbe;\n}\n.table-hover .table-dark:hover > td,\n  .table-hover .table-dark:hover > th {\n    background-color: #b9bbbe;\n}\n.table-active,\n.table-active > th,\n.table-active > td {\n  background-color: rgba(0, 0, 0, 0.075);\n}\n.table-hover .table-active:hover {\n  background-color: rgba(0, 0, 0, 0.075);\n}\n.table-hover .table-active:hover > td,\n  .table-hover .table-active:hover > th {\n    background-color: rgba(0, 0, 0, 0.075);\n}\n.table .thead-dark th {\n  color: #fff;\n  background-color: #343a40;\n  border-color: #454d55;\n}\n.table .thead-light th {\n  color: #495057;\n  background-color: #e9ecef;\n  border-color: #dee2e6;\n}\n.table-dark {\n  color: #fff;\n  background-color: #343a40;\n}\n.table-dark th,\n  .table-dark td,\n  .table-dark thead th {\n    border-color: #454d55;\n}\n.table-dark.table-bordered {\n    border: 0;\n}\n.table-dark.table-striped tbody tr:nth-of-type(odd) {\n    background-color: rgba(255, 255, 255, 0.05);\n}\n.table-dark.table-hover tbody tr:hover {\n    color: #fff;\n    background-color: rgba(255, 255, 255, 0.075);\n}\n@media (max-width: 575.98px) {\n.table-responsive-sm {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n}\n.table-responsive-sm > .table-bordered {\n      border: 0;\n}\n}\n@media (max-width: 767.98px) {\n.table-responsive-md {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n}\n.table-responsive-md > .table-bordered {\n      border: 0;\n}\n}\n@media (max-width: 991.98px) {\n.table-responsive-lg {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n}\n.table-responsive-lg > .table-bordered {\n      border: 0;\n}\n}\n@media (max-width: 1199.98px) {\n.table-responsive-xl {\n    display: block;\n    width: 100%;\n    overflow-x: auto;\n    -webkit-overflow-scrolling: touch;\n}\n.table-responsive-xl > .table-bordered {\n      border: 0;\n}\n}\n.table-responsive {\n  display: block;\n  width: 100%;\n  overflow-x: auto;\n  -webkit-overflow-scrolling: touch;\n}\n.table-responsive > .table-bordered {\n    border: 0;\n}\n.form-control {\n  display: block;\n  width: 100%;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.form-control {\n      transition: none;\n}\n}\n.form-control::-ms-expand {\n    background-color: transparent;\n    border: 0;\n}\n.form-control:focus {\n    color: #495057;\n    background-color: #fff;\n    border-color: #80bdff;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.form-control::placeholder {\n    color: #6c757d;\n    opacity: 1;\n}\n.form-control:disabled, .form-control[readonly] {\n    background-color: #e9ecef;\n    opacity: 1;\n}\nselect.form-control:focus::-ms-value {\n  color: #495057;\n  background-color: #fff;\n}\n.form-control-file,\n.form-control-range {\n  display: block;\n  width: 100%;\n}\n.col-form-label {\n  padding-top: calc(0.375rem + 1px);\n  padding-bottom: calc(0.375rem + 1px);\n  margin-bottom: 0;\n  font-size: inherit;\n  line-height: 1.5;\n}\n.col-form-label-lg {\n  padding-top: calc(0.5rem + 1px);\n  padding-bottom: calc(0.5rem + 1px);\n  font-size: 1.25rem;\n  line-height: 1.5;\n}\n.col-form-label-sm {\n  padding-top: calc(0.25rem + 1px);\n  padding-bottom: calc(0.25rem + 1px);\n  font-size: 0.875rem;\n  line-height: 1.5;\n}\n.form-control-plaintext {\n  display: block;\n  width: 100%;\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n  margin-bottom: 0;\n  line-height: 1.5;\n  color: #212529;\n  background-color: transparent;\n  border: solid transparent;\n  border-width: 1px 0;\n}\n.form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg {\n    padding-right: 0;\n    padding-left: 0;\n}\n.form-control-sm {\n  height: calc(1.5em + 0.5rem + 2px);\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem;\n}\n.form-control-lg {\n  height: calc(1.5em + 1rem + 2px);\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem;\n}\nselect.form-control[size], select.form-control[multiple] {\n  height: auto;\n}\ntextarea.form-control {\n  height: auto;\n}\n.form-group {\n  margin-bottom: 1rem;\n}\n.form-text {\n  display: block;\n  margin-top: 0.25rem;\n}\n.form-row {\n  display: flex;\n  flex-wrap: wrap;\n  margin-right: -5px;\n  margin-left: -5px;\n}\n.form-row > .col,\n  .form-row > [class*=\"col-\"] {\n    padding-right: 5px;\n    padding-left: 5px;\n}\n.form-check {\n  position: relative;\n  display: block;\n  padding-left: 1.25rem;\n}\n.form-check-input {\n  position: absolute;\n  margin-top: 0.3rem;\n  margin-left: -1.25rem;\n}\n.form-check-input:disabled ~ .form-check-label {\n    color: #6c757d;\n}\n.form-check-label {\n  margin-bottom: 0;\n}\n.form-check-inline {\n  display: inline-flex;\n  align-items: center;\n  padding-left: 0;\n  margin-right: 0.75rem;\n}\n.form-check-inline .form-check-input {\n    position: static;\n    margin-top: 0;\n    margin-right: 0.3125rem;\n    margin-left: 0;\n}\n.valid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #28a745;\n}\n.valid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(40, 167, 69, 0.9);\n  border-radius: 0.25rem;\n}\n.was-validated .form-control:valid, .form-control.is-valid {\n  border-color: #28a745;\n  padding-right: calc(1.5em + 0.75rem);\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\");\n  background-repeat: no-repeat;\n  background-position: center right calc(0.375em + 0.1875rem);\n  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-control:valid:focus, .form-control.is-valid:focus {\n    border-color: #28a745;\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);\n}\n.was-validated .form-control:valid ~ .valid-feedback,\n  .was-validated .form-control:valid ~ .valid-tooltip, .form-control.is-valid ~ .valid-feedback,\n  .form-control.is-valid ~ .valid-tooltip {\n    display: block;\n}\n.was-validated textarea.form-control:valid, textarea.form-control.is-valid {\n  padding-right: calc(1.5em + 0.75rem);\n  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);\n}\n.was-validated .custom-select:valid, .custom-select.is-valid {\n  border-color: #28a745;\n  padding-right: calc((1em + 0.75rem) * 3 / 4 + 1.75rem);\n  background: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") no-repeat right 0.75rem center/8px 10px, url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\") #fff no-repeat center right 1.75rem/calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .custom-select:valid:focus, .custom-select.is-valid:focus {\n    border-color: #28a745;\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);\n}\n.was-validated .custom-select:valid ~ .valid-feedback,\n  .was-validated .custom-select:valid ~ .valid-tooltip, .custom-select.is-valid ~ .valid-feedback,\n  .custom-select.is-valid ~ .valid-tooltip {\n    display: block;\n}\n.was-validated .form-control-file:valid ~ .valid-feedback,\n.was-validated .form-control-file:valid ~ .valid-tooltip, .form-control-file.is-valid ~ .valid-feedback,\n.form-control-file.is-valid ~ .valid-tooltip {\n  display: block;\n}\n.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label {\n  color: #28a745;\n}\n.was-validated .form-check-input:valid ~ .valid-feedback,\n.was-validated .form-check-input:valid ~ .valid-tooltip, .form-check-input.is-valid ~ .valid-feedback,\n.form-check-input.is-valid ~ .valid-tooltip {\n  display: block;\n}\n.was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {\n  color: #28a745;\n}\n.was-validated .custom-control-input:valid ~ .custom-control-label::before, .custom-control-input.is-valid ~ .custom-control-label::before {\n    border-color: #28a745;\n}\n.was-validated .custom-control-input:valid ~ .valid-feedback,\n.was-validated .custom-control-input:valid ~ .valid-tooltip, .custom-control-input.is-valid ~ .valid-feedback,\n.custom-control-input.is-valid ~ .valid-tooltip {\n  display: block;\n}\n.was-validated .custom-control-input:valid:checked ~ .custom-control-label::before, .custom-control-input.is-valid:checked ~ .custom-control-label::before {\n  border-color: #34ce57;\n  background-color: #34ce57;\n}\n.was-validated .custom-control-input:valid:focus ~ .custom-control-label::before, .custom-control-input.is-valid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);\n}\n.was-validated .custom-control-input:valid:focus:not(:checked) ~ .custom-control-label::before, .custom-control-input.is-valid:focus:not(:checked) ~ .custom-control-label::before {\n  border-color: #28a745;\n}\n.was-validated .custom-file-input:valid ~ .custom-file-label, .custom-file-input.is-valid ~ .custom-file-label {\n  border-color: #28a745;\n}\n.was-validated .custom-file-input:valid ~ .valid-feedback,\n.was-validated .custom-file-input:valid ~ .valid-tooltip, .custom-file-input.is-valid ~ .valid-feedback,\n.custom-file-input.is-valid ~ .valid-tooltip {\n  display: block;\n}\n.was-validated .custom-file-input:valid:focus ~ .custom-file-label, .custom-file-input.is-valid:focus ~ .custom-file-label {\n  border-color: #28a745;\n  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);\n}\n.invalid-feedback {\n  display: none;\n  width: 100%;\n  margin-top: 0.25rem;\n  font-size: 80%;\n  color: #dc3545;\n}\n.invalid-tooltip {\n  position: absolute;\n  top: 100%;\n  z-index: 5;\n  display: none;\n  max-width: 100%;\n  padding: 0.25rem 0.5rem;\n  margin-top: .1rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  color: #fff;\n  background-color: rgba(220, 53, 69, 0.9);\n  border-radius: 0.25rem;\n}\n.was-validated .form-control:invalid, .form-control.is-invalid {\n  border-color: #dc3545;\n  padding-right: calc(1.5em + 0.75rem);\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E\");\n  background-repeat: no-repeat;\n  background-position: center right calc(0.375em + 0.1875rem);\n  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .form-control:invalid:focus, .form-control.is-invalid:focus {\n    border-color: #dc3545;\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);\n}\n.was-validated .form-control:invalid ~ .invalid-feedback,\n  .was-validated .form-control:invalid ~ .invalid-tooltip, .form-control.is-invalid ~ .invalid-feedback,\n  .form-control.is-invalid ~ .invalid-tooltip {\n    display: block;\n}\n.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid {\n  padding-right: calc(1.5em + 0.75rem);\n  background-position: top calc(0.375em + 0.1875rem) right calc(0.375em + 0.1875rem);\n}\n.was-validated .custom-select:invalid, .custom-select.is-invalid {\n  border-color: #dc3545;\n  padding-right: calc((1em + 0.75rem) * 3 / 4 + 1.75rem);\n  background: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") no-repeat right 0.75rem center/8px 10px, url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23dc3545' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23dc3545' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E\") #fff no-repeat center right 1.75rem/calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);\n}\n.was-validated .custom-select:invalid:focus, .custom-select.is-invalid:focus {\n    border-color: #dc3545;\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);\n}\n.was-validated .custom-select:invalid ~ .invalid-feedback,\n  .was-validated .custom-select:invalid ~ .invalid-tooltip, .custom-select.is-invalid ~ .invalid-feedback,\n  .custom-select.is-invalid ~ .invalid-tooltip {\n    display: block;\n}\n.was-validated .form-control-file:invalid ~ .invalid-feedback,\n.was-validated .form-control-file:invalid ~ .invalid-tooltip, .form-control-file.is-invalid ~ .invalid-feedback,\n.form-control-file.is-invalid ~ .invalid-tooltip {\n  display: block;\n}\n.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label {\n  color: #dc3545;\n}\n.was-validated .form-check-input:invalid ~ .invalid-feedback,\n.was-validated .form-check-input:invalid ~ .invalid-tooltip, .form-check-input.is-invalid ~ .invalid-feedback,\n.form-check-input.is-invalid ~ .invalid-tooltip {\n  display: block;\n}\n.was-validated .custom-control-input:invalid ~ .custom-control-label, .custom-control-input.is-invalid ~ .custom-control-label {\n  color: #dc3545;\n}\n.was-validated .custom-control-input:invalid ~ .custom-control-label::before, .custom-control-input.is-invalid ~ .custom-control-label::before {\n    border-color: #dc3545;\n}\n.was-validated .custom-control-input:invalid ~ .invalid-feedback,\n.was-validated .custom-control-input:invalid ~ .invalid-tooltip, .custom-control-input.is-invalid ~ .invalid-feedback,\n.custom-control-input.is-invalid ~ .invalid-tooltip {\n  display: block;\n}\n.was-validated .custom-control-input:invalid:checked ~ .custom-control-label::before, .custom-control-input.is-invalid:checked ~ .custom-control-label::before {\n  border-color: #e4606d;\n  background-color: #e4606d;\n}\n.was-validated .custom-control-input:invalid:focus ~ .custom-control-label::before, .custom-control-input.is-invalid:focus ~ .custom-control-label::before {\n  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);\n}\n.was-validated .custom-control-input:invalid:focus:not(:checked) ~ .custom-control-label::before, .custom-control-input.is-invalid:focus:not(:checked) ~ .custom-control-label::before {\n  border-color: #dc3545;\n}\n.was-validated .custom-file-input:invalid ~ .custom-file-label, .custom-file-input.is-invalid ~ .custom-file-label {\n  border-color: #dc3545;\n}\n.was-validated .custom-file-input:invalid ~ .invalid-feedback,\n.was-validated .custom-file-input:invalid ~ .invalid-tooltip, .custom-file-input.is-invalid ~ .invalid-feedback,\n.custom-file-input.is-invalid ~ .invalid-tooltip {\n  display: block;\n}\n.was-validated .custom-file-input:invalid:focus ~ .custom-file-label, .custom-file-input.is-invalid:focus ~ .custom-file-label {\n  border-color: #dc3545;\n  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);\n}\n.form-inline {\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n}\n.form-inline .form-check {\n    width: 100%;\n}\n@media (min-width: 576px) {\n.form-inline label {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-bottom: 0;\n}\n.form-inline .form-group {\n      display: flex;\n      flex: 0 0 auto;\n      flex-flow: row wrap;\n      align-items: center;\n      margin-bottom: 0;\n}\n.form-inline .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle;\n}\n.form-inline .form-control-plaintext {\n      display: inline-block;\n}\n.form-inline .input-group,\n    .form-inline .custom-select {\n      width: auto;\n}\n.form-inline .form-check {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: auto;\n      padding-left: 0;\n}\n.form-inline .form-check-input {\n      position: relative;\n      flex-shrink: 0;\n      margin-top: 0;\n      margin-right: 0.25rem;\n      margin-left: 0;\n}\n.form-inline .custom-control {\n      align-items: center;\n      justify-content: center;\n}\n.form-inline .custom-control-label {\n      margin-bottom: 0;\n}\n}\n.btn {\n  display: inline-block;\n  font-weight: 400;\n  color: #212529;\n  text-align: center;\n  vertical-align: middle;\n  user-select: none;\n  background-color: transparent;\n  border: 1px solid transparent;\n  padding: 0.375rem 0.75rem;\n  font-size: 1rem;\n  line-height: 1.5;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.btn {\n      transition: none;\n}\n}\n.btn:hover {\n    color: #212529;\n    text-decoration: none;\n}\n.btn:focus, .btn.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.btn.disabled, .btn:disabled {\n    opacity: 0.65;\n}\na.btn.disabled,\nfieldset:disabled a.btn {\n  pointer-events: none;\n}\n.btn-primary {\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff;\n}\n.btn-primary:hover {\n    color: #fff;\n    background-color: #0069d9;\n    border-color: #0062cc;\n}\n.btn-primary:focus, .btn-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);\n}\n.btn-primary.disabled, .btn-primary:disabled {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff;\n}\n.btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #0062cc;\n    border-color: #005cbf;\n}\n.btn-primary:not(:disabled):not(.disabled):active:focus, .btn-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);\n}\n.btn-secondary {\n  color: #fff;\n  background-color: #6c757d;\n  border-color: #6c757d;\n}\n.btn-secondary:hover {\n    color: #fff;\n    background-color: #5a6268;\n    border-color: #545b62;\n}\n.btn-secondary:focus, .btn-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);\n}\n.btn-secondary.disabled, .btn-secondary:disabled {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d;\n}\n.btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #545b62;\n    border-color: #4e555b;\n}\n.btn-secondary:not(:disabled):not(.disabled):active:focus, .btn-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(130, 138, 145, 0.5);\n}\n.btn-success {\n  color: #fff;\n  background-color: #28a745;\n  border-color: #28a745;\n}\n.btn-success:hover {\n    color: #fff;\n    background-color: #218838;\n    border-color: #1e7e34;\n}\n.btn-success:focus, .btn-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);\n}\n.btn-success.disabled, .btn-success:disabled {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745;\n}\n.btn-success:not(:disabled):not(.disabled):active, .btn-success:not(:disabled):not(.disabled).active,\n  .show > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #1e7e34;\n    border-color: #1c7430;\n}\n.btn-success:not(:disabled):not(.disabled):active:focus, .btn-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(72, 180, 97, 0.5);\n}\n.btn-info {\n  color: #fff;\n  background-color: #17a2b8;\n  border-color: #17a2b8;\n}\n.btn-info:hover {\n    color: #fff;\n    background-color: #138496;\n    border-color: #117a8b;\n}\n.btn-info:focus, .btn-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);\n}\n.btn-info.disabled, .btn-info:disabled {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8;\n}\n.btn-info:not(:disabled):not(.disabled):active, .btn-info:not(:disabled):not(.disabled).active,\n  .show > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #117a8b;\n    border-color: #10707f;\n}\n.btn-info:not(:disabled):not(.disabled):active:focus, .btn-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(58, 176, 195, 0.5);\n}\n.btn-warning {\n  color: #212529;\n  background-color: #ffc107;\n  border-color: #ffc107;\n}\n.btn-warning:hover {\n    color: #212529;\n    background-color: #e0a800;\n    border-color: #d39e00;\n}\n.btn-warning:focus, .btn-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);\n}\n.btn-warning.disabled, .btn-warning:disabled {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107;\n}\n.btn-warning:not(:disabled):not(.disabled):active, .btn-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #d39e00;\n    border-color: #c69500;\n}\n.btn-warning:not(:disabled):not(.disabled):active:focus, .btn-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(222, 170, 12, 0.5);\n}\n.btn-danger {\n  color: #fff;\n  background-color: #dc3545;\n  border-color: #dc3545;\n}\n.btn-danger:hover {\n    color: #fff;\n    background-color: #c82333;\n    border-color: #bd2130;\n}\n.btn-danger:focus, .btn-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);\n}\n.btn-danger.disabled, .btn-danger:disabled {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545;\n}\n.btn-danger:not(:disabled):not(.disabled):active, .btn-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #bd2130;\n    border-color: #b21f2d;\n}\n.btn-danger:not(:disabled):not(.disabled):active:focus, .btn-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(225, 83, 97, 0.5);\n}\n.btn-light {\n  color: #212529;\n  background-color: #f8f9fa;\n  border-color: #f8f9fa;\n}\n.btn-light:hover {\n    color: #212529;\n    background-color: #e2e6ea;\n    border-color: #dae0e5;\n}\n.btn-light:focus, .btn-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);\n}\n.btn-light.disabled, .btn-light:disabled {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa;\n}\n.btn-light:not(:disabled):not(.disabled):active, .btn-light:not(:disabled):not(.disabled).active,\n  .show > .btn-light.dropdown-toggle {\n    color: #212529;\n    background-color: #dae0e5;\n    border-color: #d3d9df;\n}\n.btn-light:not(:disabled):not(.disabled):active:focus, .btn-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(216, 217, 219, 0.5);\n}\n.btn-dark {\n  color: #fff;\n  background-color: #343a40;\n  border-color: #343a40;\n}\n.btn-dark:hover {\n    color: #fff;\n    background-color: #23272b;\n    border-color: #1d2124;\n}\n.btn-dark:focus, .btn-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);\n}\n.btn-dark.disabled, .btn-dark:disabled {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40;\n}\n.btn-dark:not(:disabled):not(.disabled):active, .btn-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #1d2124;\n    border-color: #171a1d;\n}\n.btn-dark:not(:disabled):not(.disabled):active:focus, .btn-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(82, 88, 93, 0.5);\n}\n.btn-outline-primary {\n  color: #007bff;\n  border-color: #007bff;\n}\n.btn-outline-primary:hover {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff;\n}\n.btn-outline-primary:focus, .btn-outline-primary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);\n}\n.btn-outline-primary.disabled, .btn-outline-primary:disabled {\n    color: #007bff;\n    background-color: transparent;\n}\n.btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff;\n}\n.btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-primary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);\n}\n.btn-outline-secondary {\n  color: #6c757d;\n  border-color: #6c757d;\n}\n.btn-outline-secondary:hover {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d;\n}\n.btn-outline-secondary:focus, .btn-outline-secondary.focus {\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);\n}\n.btn-outline-secondary.disabled, .btn-outline-secondary:disabled {\n    color: #6c757d;\n    background-color: transparent;\n}\n.btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-secondary.dropdown-toggle {\n    color: #fff;\n    background-color: #6c757d;\n    border-color: #6c757d;\n}\n.btn-outline-secondary:not(:disabled):not(.disabled):active:focus, .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-secondary.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);\n}\n.btn-outline-success {\n  color: #28a745;\n  border-color: #28a745;\n}\n.btn-outline-success:hover {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745;\n}\n.btn-outline-success:focus, .btn-outline-success.focus {\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);\n}\n.btn-outline-success.disabled, .btn-outline-success:disabled {\n    color: #28a745;\n    background-color: transparent;\n}\n.btn-outline-success:not(:disabled):not(.disabled):active, .btn-outline-success:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-success.dropdown-toggle {\n    color: #fff;\n    background-color: #28a745;\n    border-color: #28a745;\n}\n.btn-outline-success:not(:disabled):not(.disabled):active:focus, .btn-outline-success:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-success.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);\n}\n.btn-outline-info {\n  color: #17a2b8;\n  border-color: #17a2b8;\n}\n.btn-outline-info:hover {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8;\n}\n.btn-outline-info:focus, .btn-outline-info.focus {\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);\n}\n.btn-outline-info.disabled, .btn-outline-info:disabled {\n    color: #17a2b8;\n    background-color: transparent;\n}\n.btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-info.dropdown-toggle {\n    color: #fff;\n    background-color: #17a2b8;\n    border-color: #17a2b8;\n}\n.btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-info.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);\n}\n.btn-outline-warning {\n  color: #ffc107;\n  border-color: #ffc107;\n}\n.btn-outline-warning:hover {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107;\n}\n.btn-outline-warning:focus, .btn-outline-warning.focus {\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);\n}\n.btn-outline-warning.disabled, .btn-outline-warning:disabled {\n    color: #ffc107;\n    background-color: transparent;\n}\n.btn-outline-warning:not(:disabled):not(.disabled):active, .btn-outline-warning:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-warning.dropdown-toggle {\n    color: #212529;\n    background-color: #ffc107;\n    border-color: #ffc107;\n}\n.btn-outline-warning:not(:disabled):not(.disabled):active:focus, .btn-outline-warning:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-warning.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);\n}\n.btn-outline-danger {\n  color: #dc3545;\n  border-color: #dc3545;\n}\n.btn-outline-danger:hover {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545;\n}\n.btn-outline-danger:focus, .btn-outline-danger.focus {\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);\n}\n.btn-outline-danger.disabled, .btn-outline-danger:disabled {\n    color: #dc3545;\n    background-color: transparent;\n}\n.btn-outline-danger:not(:disabled):not(.disabled):active, .btn-outline-danger:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #dc3545;\n    border-color: #dc3545;\n}\n.btn-outline-danger:not(:disabled):not(.disabled):active:focus, .btn-outline-danger:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-danger.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);\n}\n.btn-outline-light {\n  color: #f8f9fa;\n  border-color: #f8f9fa;\n}\n.btn-outline-light:hover {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa;\n}\n.btn-outline-light:focus, .btn-outline-light.focus {\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);\n}\n.btn-outline-light.disabled, .btn-outline-light:disabled {\n    color: #f8f9fa;\n    background-color: transparent;\n}\n.btn-outline-light:not(:disabled):not(.disabled):active, .btn-outline-light:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-light.dropdown-toggle {\n    color: #212529;\n    background-color: #f8f9fa;\n    border-color: #f8f9fa;\n}\n.btn-outline-light:not(:disabled):not(.disabled):active:focus, .btn-outline-light:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-light.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);\n}\n.btn-outline-dark {\n  color: #343a40;\n  border-color: #343a40;\n}\n.btn-outline-dark:hover {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40;\n}\n.btn-outline-dark:focus, .btn-outline-dark.focus {\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);\n}\n.btn-outline-dark.disabled, .btn-outline-dark:disabled {\n    color: #343a40;\n    background-color: transparent;\n}\n.btn-outline-dark:not(:disabled):not(.disabled):active, .btn-outline-dark:not(:disabled):not(.disabled).active,\n  .show > .btn-outline-dark.dropdown-toggle {\n    color: #fff;\n    background-color: #343a40;\n    border-color: #343a40;\n}\n.btn-outline-dark:not(:disabled):not(.disabled):active:focus, .btn-outline-dark:not(:disabled):not(.disabled).active:focus,\n    .show > .btn-outline-dark.dropdown-toggle:focus {\n      box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);\n}\n.btn-link {\n  font-weight: 400;\n  color: #007bff;\n  text-decoration: none;\n}\n.btn-link:hover {\n    color: #0056b3;\n    text-decoration: underline;\n}\n.btn-link:focus, .btn-link.focus {\n    text-decoration: underline;\n    box-shadow: none;\n}\n.btn-link:disabled, .btn-link.disabled {\n    color: #6c757d;\n    pointer-events: none;\n}\n.btn-lg, .btn-group-lg > .btn {\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem;\n}\n.btn-sm, .btn-group-sm > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem;\n}\n.btn-block {\n  display: block;\n  width: 100%;\n}\n.btn-block + .btn-block {\n    margin-top: 0.5rem;\n}\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%;\n}\n.fade {\n  transition: opacity 0.15s linear;\n}\n@media (prefers-reduced-motion: reduce) {\n.fade {\n      transition: none;\n}\n}\n.fade:not(.show) {\n    opacity: 0;\n}\n.collapse:not(.show) {\n  display: none;\n}\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  transition: height 0.35s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n.collapsing {\n      transition: none;\n}\n}\n.dropup,\n.dropright,\n.dropdown,\n.dropleft {\n  position: relative;\n}\n.dropdown-toggle {\n  white-space: nowrap;\n}\n.dropdown-toggle::after {\n    display: inline-block;\n    margin-left: 0.255em;\n    vertical-align: 0.255em;\n    content: \"\";\n    border-top: 0.3em solid;\n    border-right: 0.3em solid transparent;\n    border-bottom: 0;\n    border-left: 0.3em solid transparent;\n}\n.dropdown-toggle:empty::after {\n    margin-left: 0;\n}\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 10rem;\n  padding: 0.5rem 0;\n  margin: 0.125rem 0 0;\n  font-size: 1rem;\n  color: #212529;\n  text-align: left;\n  list-style: none;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 0.25rem;\n}\n.dropdown-menu-left {\n  right: auto;\n  left: 0;\n}\n.dropdown-menu-right {\n  right: 0;\n  left: auto;\n}\n@media (min-width: 576px) {\n.dropdown-menu-sm-left {\n    right: auto;\n    left: 0;\n}\n.dropdown-menu-sm-right {\n    right: 0;\n    left: auto;\n}\n}\n@media (min-width: 768px) {\n.dropdown-menu-md-left {\n    right: auto;\n    left: 0;\n}\n.dropdown-menu-md-right {\n    right: 0;\n    left: auto;\n}\n}\n@media (min-width: 992px) {\n.dropdown-menu-lg-left {\n    right: auto;\n    left: 0;\n}\n.dropdown-menu-lg-right {\n    right: 0;\n    left: auto;\n}\n}\n@media (min-width: 1200px) {\n.dropdown-menu-xl-left {\n    right: auto;\n    left: 0;\n}\n.dropdown-menu-xl-right {\n    right: 0;\n    left: auto;\n}\n}\n.dropup .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-top: 0;\n  margin-bottom: 0.125rem;\n}\n.dropup .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0;\n  border-right: 0.3em solid transparent;\n  border-bottom: 0.3em solid;\n  border-left: 0.3em solid transparent;\n}\n.dropup .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n.dropright .dropdown-menu {\n  top: 0;\n  right: auto;\n  left: 100%;\n  margin-top: 0;\n  margin-left: 0.125rem;\n}\n.dropright .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0;\n  border-bottom: 0.3em solid transparent;\n  border-left: 0.3em solid;\n}\n.dropright .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n.dropright .dropdown-toggle::after {\n  vertical-align: 0;\n}\n.dropleft .dropdown-menu {\n  top: 0;\n  right: 100%;\n  left: auto;\n  margin-top: 0;\n  margin-right: 0.125rem;\n}\n.dropleft .dropdown-toggle::after {\n  display: inline-block;\n  margin-left: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n}\n.dropleft .dropdown-toggle::after {\n  display: none;\n}\n.dropleft .dropdown-toggle::before {\n  display: inline-block;\n  margin-right: 0.255em;\n  vertical-align: 0.255em;\n  content: \"\";\n  border-top: 0.3em solid transparent;\n  border-right: 0.3em solid;\n  border-bottom: 0.3em solid transparent;\n}\n.dropleft .dropdown-toggle:empty::after {\n  margin-left: 0;\n}\n.dropleft .dropdown-toggle::before {\n  vertical-align: 0;\n}\n.dropdown-menu[x-placement^=\"top\"], .dropdown-menu[x-placement^=\"right\"], .dropdown-menu[x-placement^=\"bottom\"], .dropdown-menu[x-placement^=\"left\"] {\n  right: auto;\n  bottom: auto;\n}\n.dropdown-divider {\n  height: 0;\n  margin: 0.5rem 0;\n  overflow: hidden;\n  border-top: 1px solid #e9ecef;\n}\n.dropdown-item {\n  display: block;\n  width: 100%;\n  padding: 0.25rem 1.5rem;\n  clear: both;\n  font-weight: 400;\n  color: #212529;\n  text-align: inherit;\n  white-space: nowrap;\n  background-color: transparent;\n  border: 0;\n}\n.dropdown-item:hover, .dropdown-item:focus {\n    color: #16181b;\n    text-decoration: none;\n    background-color: #f8f9fa;\n}\n.dropdown-item.active, .dropdown-item:active {\n    color: #fff;\n    text-decoration: none;\n    background-color: #007bff;\n}\n.dropdown-item.disabled, .dropdown-item:disabled {\n    color: #6c757d;\n    pointer-events: none;\n    background-color: transparent;\n}\n.dropdown-menu.show {\n  display: block;\n}\n.dropdown-header {\n  display: block;\n  padding: 0.5rem 1.5rem;\n  margin-bottom: 0;\n  font-size: 0.875rem;\n  color: #6c757d;\n  white-space: nowrap;\n}\n.dropdown-item-text {\n  display: block;\n  padding: 0.25rem 1.5rem;\n  color: #212529;\n}\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-flex;\n  vertical-align: middle;\n}\n.btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    flex: 1 1 auto;\n}\n.btn-group > .btn:hover,\n    .btn-group-vertical > .btn:hover {\n      z-index: 1;\n}\n.btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 1;\n}\n.btn-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n}\n.btn-toolbar .input-group {\n    width: auto;\n}\n.btn-group > .btn:not(:first-child),\n.btn-group > .btn-group:not(:first-child) {\n  margin-left: -1px;\n}\n.btn-group > .btn:not(:last-child):not(.dropdown-toggle),\n.btn-group > .btn-group:not(:last-child) > .btn {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.btn-group > .btn:not(:first-child),\n.btn-group > .btn-group:not(:first-child) > .btn {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.dropdown-toggle-split {\n  padding-right: 0.5625rem;\n  padding-left: 0.5625rem;\n}\n.dropdown-toggle-split::after,\n  .dropup .dropdown-toggle-split::after,\n  .dropright .dropdown-toggle-split::after {\n    margin-left: 0;\n}\n.dropleft .dropdown-toggle-split::before {\n    margin-right: 0;\n}\n.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {\n  padding-right: 0.375rem;\n  padding-left: 0.375rem;\n}\n.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {\n  padding-right: 0.75rem;\n  padding-left: 0.75rem;\n}\n.btn-group-vertical {\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: center;\n}\n.btn-group-vertical > .btn,\n  .btn-group-vertical > .btn-group {\n    width: 100%;\n}\n.btn-group-vertical > .btn:not(:first-child),\n  .btn-group-vertical > .btn-group:not(:first-child) {\n    margin-top: -1px;\n}\n.btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),\n  .btn-group-vertical > .btn-group:not(:last-child) > .btn {\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.btn-group-vertical > .btn:not(:first-child),\n  .btn-group-vertical > .btn-group:not(:first-child) > .btn {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n}\n.btn-group-toggle > .btn,\n.btn-group-toggle > .btn-group > .btn {\n  margin-bottom: 0;\n}\n.btn-group-toggle > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn input[type=\"checkbox\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"radio\"],\n  .btn-group-toggle > .btn-group > .btn input[type=\"checkbox\"] {\n    position: absolute;\n    clip: rect(0, 0, 0, 0);\n    pointer-events: none;\n}\n.input-group {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: stretch;\n  width: 100%;\n}\n.input-group > .form-control,\n  .input-group > .form-control-plaintext,\n  .input-group > .custom-select,\n  .input-group > .custom-file {\n    position: relative;\n    flex: 1 1 auto;\n    width: 1%;\n    margin-bottom: 0;\n}\n.input-group > .form-control + .form-control,\n    .input-group > .form-control + .custom-select,\n    .input-group > .form-control + .custom-file,\n    .input-group > .form-control-plaintext + .form-control,\n    .input-group > .form-control-plaintext + .custom-select,\n    .input-group > .form-control-plaintext + .custom-file,\n    .input-group > .custom-select + .form-control,\n    .input-group > .custom-select + .custom-select,\n    .input-group > .custom-select + .custom-file,\n    .input-group > .custom-file + .form-control,\n    .input-group > .custom-file + .custom-select,\n    .input-group > .custom-file + .custom-file {\n      margin-left: -1px;\n}\n.input-group > .form-control:focus,\n  .input-group > .custom-select:focus,\n  .input-group > .custom-file .custom-file-input:focus ~ .custom-file-label {\n    z-index: 3;\n}\n.input-group > .custom-file .custom-file-input:focus {\n    z-index: 4;\n}\n.input-group > .form-control:not(:last-child),\n  .input-group > .custom-select:not(:last-child) {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0;\n}\n.input-group > .form-control:not(:first-child),\n  .input-group > .custom-select:not(:first-child) {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.input-group > .custom-file {\n    display: flex;\n    align-items: center;\n}\n.input-group > .custom-file:not(:last-child) .custom-file-label,\n    .input-group > .custom-file:not(:last-child) .custom-file-label::after {\n      border-top-right-radius: 0;\n      border-bottom-right-radius: 0;\n}\n.input-group > .custom-file:not(:first-child) .custom-file-label {\n      border-top-left-radius: 0;\n      border-bottom-left-radius: 0;\n}\n.input-group-prepend,\n.input-group-append {\n  display: flex;\n}\n.input-group-prepend .btn,\n  .input-group-append .btn {\n    position: relative;\n    z-index: 2;\n}\n.input-group-prepend .btn:focus,\n    .input-group-append .btn:focus {\n      z-index: 3;\n}\n.input-group-prepend .btn + .btn,\n  .input-group-prepend .btn + .input-group-text,\n  .input-group-prepend .input-group-text + .input-group-text,\n  .input-group-prepend .input-group-text + .btn,\n  .input-group-append .btn + .btn,\n  .input-group-append .btn + .input-group-text,\n  .input-group-append .input-group-text + .input-group-text,\n  .input-group-append .input-group-text + .btn {\n    margin-left: -1px;\n}\n.input-group-prepend {\n  margin-right: -1px;\n}\n.input-group-append {\n  margin-left: -1px;\n}\n.input-group-text {\n  display: flex;\n  align-items: center;\n  padding: 0.375rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #e9ecef;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n}\n.input-group-text input[type=\"radio\"],\n  .input-group-text input[type=\"checkbox\"] {\n    margin-top: 0;\n}\n.input-group-lg > .form-control:not(textarea),\n.input-group-lg > .custom-select {\n  height: calc(1.5em + 1rem + 2px);\n}\n.input-group-lg > .form-control,\n.input-group-lg > .custom-select,\n.input-group-lg > .input-group-prepend > .input-group-text,\n.input-group-lg > .input-group-append > .input-group-text,\n.input-group-lg > .input-group-prepend > .btn,\n.input-group-lg > .input-group-append > .btn {\n  padding: 0.5rem 1rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n  border-radius: 0.3rem;\n}\n.input-group-sm > .form-control:not(textarea),\n.input-group-sm > .custom-select {\n  height: calc(1.5em + 0.5rem + 2px);\n}\n.input-group-sm > .form-control,\n.input-group-sm > .custom-select,\n.input-group-sm > .input-group-prepend > .input-group-text,\n.input-group-sm > .input-group-append > .input-group-text,\n.input-group-sm > .input-group-prepend > .btn,\n.input-group-sm > .input-group-append > .btn {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n  border-radius: 0.2rem;\n}\n.input-group-lg > .custom-select,\n.input-group-sm > .custom-select {\n  padding-right: 1.75rem;\n}\n.input-group > .input-group-prepend > .btn,\n.input-group > .input-group-prepend > .input-group-text,\n.input-group > .input-group-append:not(:last-child) > .btn,\n.input-group > .input-group-append:not(:last-child) > .input-group-text,\n.input-group > .input-group-append:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group > .input-group-append:last-child > .input-group-text:not(:last-child) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.input-group > .input-group-append > .btn,\n.input-group > .input-group-append > .input-group-text,\n.input-group > .input-group-prepend:not(:first-child) > .btn,\n.input-group > .input-group-prepend:not(:first-child) > .input-group-text,\n.input-group > .input-group-prepend:first-child > .btn:not(:first-child),\n.input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.custom-control {\n  position: relative;\n  display: block;\n  min-height: 1.5rem;\n  padding-left: 1.5rem;\n}\n.custom-control-inline {\n  display: inline-flex;\n  margin-right: 1rem;\n}\n.custom-control-input {\n  position: absolute;\n  z-index: -1;\n  opacity: 0;\n}\n.custom-control-input:checked ~ .custom-control-label::before {\n    color: #fff;\n    border-color: #007bff;\n    background-color: #007bff;\n}\n.custom-control-input:focus ~ .custom-control-label::before {\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-control-input:focus:not(:checked) ~ .custom-control-label::before {\n    border-color: #80bdff;\n}\n.custom-control-input:not(:disabled):active ~ .custom-control-label::before {\n    color: #fff;\n    background-color: #b3d7ff;\n    border-color: #b3d7ff;\n}\n.custom-control-input:disabled ~ .custom-control-label {\n    color: #6c757d;\n}\n.custom-control-input:disabled ~ .custom-control-label::before {\n      background-color: #e9ecef;\n}\n.custom-control-label {\n  position: relative;\n  margin-bottom: 0;\n  vertical-align: top;\n}\n.custom-control-label::before {\n    position: absolute;\n    top: 0.25rem;\n    left: -1.5rem;\n    display: block;\n    width: 1rem;\n    height: 1rem;\n    pointer-events: none;\n    content: \"\";\n    background-color: #fff;\n    border: #adb5bd solid 1px;\n}\n.custom-control-label::after {\n    position: absolute;\n    top: 0.25rem;\n    left: -1.5rem;\n    display: block;\n    width: 1rem;\n    height: 1rem;\n    content: \"\";\n    background: no-repeat 50% / 50% 50%;\n}\n.custom-checkbox .custom-control-label::before {\n  border-radius: 0.25rem;\n}\n.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e\");\n}\n.custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::before {\n  border-color: #007bff;\n  background-color: #007bff;\n}\n.custom-checkbox .custom-control-input:indeterminate ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3e%3cpath stroke='%23fff' d='M0 2h4'/%3e%3c/svg%3e\");\n}\n.custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5);\n}\n.custom-checkbox .custom-control-input:disabled:indeterminate ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5);\n}\n.custom-radio .custom-control-label::before {\n  border-radius: 50%;\n}\n.custom-radio .custom-control-input:checked ~ .custom-control-label::after {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e\");\n}\n.custom-radio .custom-control-input:disabled:checked ~ .custom-control-label::before {\n  background-color: rgba(0, 123, 255, 0.5);\n}\n.custom-switch {\n  padding-left: 2.25rem;\n}\n.custom-switch .custom-control-label::before {\n    left: -2.25rem;\n    width: 1.75rem;\n    pointer-events: all;\n    border-radius: 0.5rem;\n}\n.custom-switch .custom-control-label::after {\n    top: calc(0.25rem + 2px);\n    left: calc(-2.25rem + 2px);\n    width: calc(1rem - 4px);\n    height: calc(1rem - 4px);\n    background-color: #adb5bd;\n    border-radius: 0.5rem;\n    transition: transform 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.custom-switch .custom-control-label::after {\n        transition: none;\n}\n}\n.custom-switch .custom-control-input:checked ~ .custom-control-label::after {\n    background-color: #fff;\n    transform: translateX(0.75rem);\n}\n.custom-switch .custom-control-input:disabled:checked ~ .custom-control-label::before {\n    background-color: rgba(0, 123, 255, 0.5);\n}\n.custom-select {\n  display: inline-block;\n  width: 100%;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem 1.75rem 0.375rem 0.75rem;\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  vertical-align: middle;\n  background: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") no-repeat right 0.75rem center/8px 10px;\n  background-color: #fff;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n  appearance: none;\n}\n.custom-select:focus {\n    border-color: #80bdff;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-select:focus::-ms-value {\n      color: #495057;\n      background-color: #fff;\n}\n.custom-select[multiple], .custom-select[size]:not([size=\"1\"]) {\n    height: auto;\n    padding-right: 0.75rem;\n    background-image: none;\n}\n.custom-select:disabled {\n    color: #6c757d;\n    background-color: #e9ecef;\n}\n.custom-select::-ms-expand {\n    display: none;\n}\n.custom-select-sm {\n  height: calc(1.5em + 0.5rem + 2px);\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n  padding-left: 0.5rem;\n  font-size: 0.875rem;\n}\n.custom-select-lg {\n  height: calc(1.5em + 1rem + 2px);\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-left: 1rem;\n  font-size: 1.25rem;\n}\n.custom-file {\n  position: relative;\n  display: inline-block;\n  width: 100%;\n  height: calc(1.5em + 0.75rem + 2px);\n  margin-bottom: 0;\n}\n.custom-file-input {\n  position: relative;\n  z-index: 2;\n  width: 100%;\n  height: calc(1.5em + 0.75rem + 2px);\n  margin: 0;\n  opacity: 0;\n}\n.custom-file-input:focus ~ .custom-file-label {\n    border-color: #80bdff;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-file-input:disabled ~ .custom-file-label {\n    background-color: #e9ecef;\n}\n.custom-file-input:lang(en) ~ .custom-file-label::after {\n    content: \"Browse\";\n}\n.custom-file-input ~ .custom-file-label[data-browse]::after {\n    content: attr(data-browse);\n}\n.custom-file-label {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1;\n  height: calc(1.5em + 0.75rem + 2px);\n  padding: 0.375rem 0.75rem;\n  font-weight: 400;\n  line-height: 1.5;\n  color: #495057;\n  background-color: #fff;\n  border: 1px solid #ced4da;\n  border-radius: 0.25rem;\n}\n.custom-file-label::after {\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 3;\n    display: block;\n    height: calc(1.5em + 0.75rem);\n    padding: 0.375rem 0.75rem;\n    line-height: 1.5;\n    color: #495057;\n    content: \"Browse\";\n    background-color: #e9ecef;\n    border-left: inherit;\n    border-radius: 0 0.25rem 0.25rem 0;\n}\n.custom-range {\n  width: 100%;\n  height: calc(1rem + 0.4rem);\n  padding: 0;\n  background-color: transparent;\n  appearance: none;\n}\n.custom-range:focus {\n    outline: none;\n}\n.custom-range:focus::-webkit-slider-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-range:focus::-moz-range-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-range:focus::-ms-thumb {\n      box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.custom-range::-moz-focus-outer {\n    border: 0;\n}\n.custom-range::-webkit-slider-thumb {\n    width: 1rem;\n    height: 1rem;\n    margin-top: -0.25rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n.custom-range::-webkit-slider-thumb {\n        transition: none;\n}\n}\n.custom-range::-webkit-slider-thumb:active {\n      background-color: #b3d7ff;\n}\n.custom-range::-webkit-slider-runnable-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: #dee2e6;\n    border-color: transparent;\n    border-radius: 1rem;\n}\n.custom-range::-moz-range-thumb {\n    width: 1rem;\n    height: 1rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n.custom-range::-moz-range-thumb {\n        transition: none;\n}\n}\n.custom-range::-moz-range-thumb:active {\n      background-color: #b3d7ff;\n}\n.custom-range::-moz-range-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: #dee2e6;\n    border-color: transparent;\n    border-radius: 1rem;\n}\n.custom-range::-ms-thumb {\n    width: 1rem;\n    height: 1rem;\n    margin-top: 0;\n    margin-right: 0.2rem;\n    margin-left: 0.2rem;\n    background-color: #007bff;\n    border: 0;\n    border-radius: 1rem;\n    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n    appearance: none;\n}\n@media (prefers-reduced-motion: reduce) {\n.custom-range::-ms-thumb {\n        transition: none;\n}\n}\n.custom-range::-ms-thumb:active {\n      background-color: #b3d7ff;\n}\n.custom-range::-ms-track {\n    width: 100%;\n    height: 0.5rem;\n    color: transparent;\n    cursor: pointer;\n    background-color: transparent;\n    border-color: transparent;\n    border-width: 0.5rem;\n}\n.custom-range::-ms-fill-lower {\n    background-color: #dee2e6;\n    border-radius: 1rem;\n}\n.custom-range::-ms-fill-upper {\n    margin-right: 15px;\n    background-color: #dee2e6;\n    border-radius: 1rem;\n}\n.custom-range:disabled::-webkit-slider-thumb {\n    background-color: #adb5bd;\n}\n.custom-range:disabled::-webkit-slider-runnable-track {\n    cursor: default;\n}\n.custom-range:disabled::-moz-range-thumb {\n    background-color: #adb5bd;\n}\n.custom-range:disabled::-moz-range-track {\n    cursor: default;\n}\n.custom-range:disabled::-ms-thumb {\n    background-color: #adb5bd;\n}\n.custom-control-label::before,\n.custom-file-label,\n.custom-select {\n  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.custom-control-label::before,\n    .custom-file-label,\n    .custom-select {\n      transition: none;\n}\n}\n.nav {\n  display: flex;\n  flex-wrap: wrap;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n.nav-link {\n  display: block;\n  padding: 0.5rem 1rem;\n}\n.nav-link:hover, .nav-link:focus {\n    text-decoration: none;\n}\n.nav-link.disabled {\n    color: #6c757d;\n    pointer-events: none;\n    cursor: default;\n}\n.nav-tabs {\n  border-bottom: 1px solid #dee2e6;\n}\n.nav-tabs .nav-item {\n    margin-bottom: -1px;\n}\n.nav-tabs .nav-link {\n    border: 1px solid transparent;\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem;\n}\n.nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {\n      border-color: #e9ecef #e9ecef #dee2e6;\n}\n.nav-tabs .nav-link.disabled {\n      color: #6c757d;\n      background-color: transparent;\n      border-color: transparent;\n}\n.nav-tabs .nav-link.active,\n  .nav-tabs .nav-item.show .nav-link {\n    color: #495057;\n    background-color: #fff;\n    border-color: #dee2e6 #dee2e6 #fff;\n}\n.nav-tabs .dropdown-menu {\n    margin-top: -1px;\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n}\n.nav-pills .nav-link {\n  border-radius: 0.25rem;\n}\n.nav-pills .nav-link.active,\n.nav-pills .show > .nav-link {\n  color: #fff;\n  background-color: #007bff;\n}\n.nav-fill .nav-item {\n  flex: 1 1 auto;\n  text-align: center;\n}\n.nav-justified .nav-item {\n  flex-basis: 0;\n  flex-grow: 1;\n  text-align: center;\n}\n.tab-content > .tab-pane {\n  display: none;\n}\n.tab-content > .active {\n  display: block;\n}\n.navbar {\n  position: relative;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.5rem 1rem;\n}\n.navbar > .container,\n  .navbar > .container-fluid {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: space-between;\n}\n.navbar-brand {\n  display: inline-block;\n  padding-top: 0.3125rem;\n  padding-bottom: 0.3125rem;\n  margin-right: 1rem;\n  font-size: 1.25rem;\n  line-height: inherit;\n  white-space: nowrap;\n}\n.navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none;\n}\n.navbar-nav {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n  list-style: none;\n}\n.navbar-nav .nav-link {\n    padding-right: 0;\n    padding-left: 0;\n}\n.navbar-nav .dropdown-menu {\n    position: static;\n    float: none;\n}\n.navbar-text {\n  display: inline-block;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.navbar-collapse {\n  flex-basis: 100%;\n  flex-grow: 1;\n  align-items: center;\n}\n.navbar-toggler {\n  padding: 0.25rem 0.75rem;\n  font-size: 1.25rem;\n  line-height: 1;\n  background-color: transparent;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.navbar-toggler:hover, .navbar-toggler:focus {\n    text-decoration: none;\n}\n.navbar-toggler-icon {\n  display: inline-block;\n  width: 1.5em;\n  height: 1.5em;\n  vertical-align: middle;\n  content: \"\";\n  background: no-repeat center center;\n  background-size: 100% 100%;\n}\n@media (max-width: 575.98px) {\n.navbar-expand-sm > .container,\n  .navbar-expand-sm > .container-fluid {\n    padding-right: 0;\n    padding-left: 0;\n}\n}\n@media (min-width: 576px) {\n.navbar-expand-sm {\n    flex-flow: row nowrap;\n    justify-content: flex-start;\n}\n.navbar-expand-sm .navbar-nav {\n      flex-direction: row;\n}\n.navbar-expand-sm .navbar-nav .dropdown-menu {\n        position: absolute;\n}\n.navbar-expand-sm .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem;\n}\n.navbar-expand-sm > .container,\n    .navbar-expand-sm > .container-fluid {\n      flex-wrap: nowrap;\n}\n.navbar-expand-sm .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto;\n}\n.navbar-expand-sm .navbar-toggler {\n      display: none;\n}\n}\n@media (max-width: 767.98px) {\n.navbar-expand-md > .container,\n  .navbar-expand-md > .container-fluid {\n    padding-right: 0;\n    padding-left: 0;\n}\n}\n@media (min-width: 768px) {\n.navbar-expand-md {\n    flex-flow: row nowrap;\n    justify-content: flex-start;\n}\n.navbar-expand-md .navbar-nav {\n      flex-direction: row;\n}\n.navbar-expand-md .navbar-nav .dropdown-menu {\n        position: absolute;\n}\n.navbar-expand-md .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem;\n}\n.navbar-expand-md > .container,\n    .navbar-expand-md > .container-fluid {\n      flex-wrap: nowrap;\n}\n.navbar-expand-md .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto;\n}\n.navbar-expand-md .navbar-toggler {\n      display: none;\n}\n}\n@media (max-width: 991.98px) {\n.navbar-expand-lg > .container,\n  .navbar-expand-lg > .container-fluid {\n    padding-right: 0;\n    padding-left: 0;\n}\n}\n@media (min-width: 992px) {\n.navbar-expand-lg {\n    flex-flow: row nowrap;\n    justify-content: flex-start;\n}\n.navbar-expand-lg .navbar-nav {\n      flex-direction: row;\n}\n.navbar-expand-lg .navbar-nav .dropdown-menu {\n        position: absolute;\n}\n.navbar-expand-lg .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem;\n}\n.navbar-expand-lg > .container,\n    .navbar-expand-lg > .container-fluid {\n      flex-wrap: nowrap;\n}\n.navbar-expand-lg .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto;\n}\n.navbar-expand-lg .navbar-toggler {\n      display: none;\n}\n}\n@media (max-width: 1199.98px) {\n.navbar-expand-xl > .container,\n  .navbar-expand-xl > .container-fluid {\n    padding-right: 0;\n    padding-left: 0;\n}\n}\n@media (min-width: 1200px) {\n.navbar-expand-xl {\n    flex-flow: row nowrap;\n    justify-content: flex-start;\n}\n.navbar-expand-xl .navbar-nav {\n      flex-direction: row;\n}\n.navbar-expand-xl .navbar-nav .dropdown-menu {\n        position: absolute;\n}\n.navbar-expand-xl .navbar-nav .nav-link {\n        padding-right: 0.5rem;\n        padding-left: 0.5rem;\n}\n.navbar-expand-xl > .container,\n    .navbar-expand-xl > .container-fluid {\n      flex-wrap: nowrap;\n}\n.navbar-expand-xl .navbar-collapse {\n      display: flex !important;\n      flex-basis: auto;\n}\n.navbar-expand-xl .navbar-toggler {\n      display: none;\n}\n}\n.navbar-expand {\n  flex-flow: row nowrap;\n  justify-content: flex-start;\n}\n.navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    padding-right: 0;\n    padding-left: 0;\n}\n.navbar-expand .navbar-nav {\n    flex-direction: row;\n}\n.navbar-expand .navbar-nav .dropdown-menu {\n      position: absolute;\n}\n.navbar-expand .navbar-nav .nav-link {\n      padding-right: 0.5rem;\n      padding-left: 0.5rem;\n}\n.navbar-expand > .container,\n  .navbar-expand > .container-fluid {\n    flex-wrap: nowrap;\n}\n.navbar-expand .navbar-collapse {\n    display: flex !important;\n    flex-basis: auto;\n}\n.navbar-expand .navbar-toggler {\n    display: none;\n}\n.navbar-light .navbar-brand {\n  color: rgba(0, 0, 0, 0.9);\n}\n.navbar-light .navbar-brand:hover, .navbar-light .navbar-brand:focus {\n    color: rgba(0, 0, 0, 0.9);\n}\n.navbar-light .navbar-nav .nav-link {\n  color: rgba(0, 0, 0, 0.5);\n}\n.navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus {\n    color: rgba(0, 0, 0, 0.7);\n}\n.navbar-light .navbar-nav .nav-link.disabled {\n    color: rgba(0, 0, 0, 0.3);\n}\n.navbar-light .navbar-nav .show > .nav-link,\n.navbar-light .navbar-nav .active > .nav-link,\n.navbar-light .navbar-nav .nav-link.show,\n.navbar-light .navbar-nav .nav-link.active {\n  color: rgba(0, 0, 0, 0.9);\n}\n.navbar-light .navbar-toggler {\n  color: rgba(0, 0, 0, 0.5);\n  border-color: rgba(0, 0, 0, 0.1);\n}\n.navbar-light .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(0, 0, 0, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\");\n}\n.navbar-light .navbar-text {\n  color: rgba(0, 0, 0, 0.5);\n}\n.navbar-light .navbar-text a {\n    color: rgba(0, 0, 0, 0.9);\n}\n.navbar-light .navbar-text a:hover, .navbar-light .navbar-text a:focus {\n      color: rgba(0, 0, 0, 0.9);\n}\n.navbar-dark .navbar-brand {\n  color: #fff;\n}\n.navbar-dark .navbar-brand:hover, .navbar-dark .navbar-brand:focus {\n    color: #fff;\n}\n.navbar-dark .navbar-nav .nav-link {\n  color: rgba(255, 255, 255, 0.5);\n}\n.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {\n    color: rgba(255, 255, 255, 0.75);\n}\n.navbar-dark .navbar-nav .nav-link.disabled {\n    color: rgba(255, 255, 255, 0.25);\n}\n.navbar-dark .navbar-nav .show > .nav-link,\n.navbar-dark .navbar-nav .active > .nav-link,\n.navbar-dark .navbar-nav .nav-link.show,\n.navbar-dark .navbar-nav .nav-link.active {\n  color: #fff;\n}\n.navbar-dark .navbar-toggler {\n  color: rgba(255, 255, 255, 0.5);\n  border-color: rgba(255, 255, 255, 0.1);\n}\n.navbar-dark .navbar-toggler-icon {\n  background-image: url(\"data:image/svg+xml,%3csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3e%3cpath stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\");\n}\n.navbar-dark .navbar-text {\n  color: rgba(255, 255, 255, 0.5);\n}\n.navbar-dark .navbar-text a {\n    color: #fff;\n}\n.navbar-dark .navbar-text a:hover, .navbar-dark .navbar-text a:focus {\n      color: #fff;\n}\n.card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: border-box;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n  border-radius: 0.25rem;\n}\n.card > hr {\n    margin-right: 0;\n    margin-left: 0;\n}\n.card > .list-group:first-child .list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem;\n}\n.card > .list-group:last-child .list-group-item:last-child {\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem;\n}\n.card-body {\n  flex: 1 1 auto;\n  padding: 1.25rem;\n}\n.card-title {\n  margin-bottom: 0.75rem;\n}\n.card-subtitle {\n  margin-top: -0.375rem;\n  margin-bottom: 0;\n}\n.card-text:last-child {\n  margin-bottom: 0;\n}\n.card-link:hover {\n  text-decoration: none;\n}\n.card-link + .card-link {\n  margin-left: 1.25rem;\n}\n.card-header {\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 0;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n}\n.card-header:first-child {\n    border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;\n}\n.card-header + .list-group .list-group-item:first-child {\n    border-top: 0;\n}\n.card-footer {\n  padding: 0.75rem 1.25rem;\n  background-color: rgba(0, 0, 0, 0.03);\n  border-top: 1px solid rgba(0, 0, 0, 0.125);\n}\n.card-footer:last-child {\n    border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);\n}\n.card-header-tabs {\n  margin-right: -0.625rem;\n  margin-bottom: -0.75rem;\n  margin-left: -0.625rem;\n  border-bottom: 0;\n}\n.card-header-pills {\n  margin-right: -0.625rem;\n  margin-left: -0.625rem;\n}\n.card-img-overlay {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 1.25rem;\n}\n.card-img {\n  width: 100%;\n  border-radius: calc(0.25rem - 1px);\n}\n.card-img-top {\n  width: 100%;\n  border-top-left-radius: calc(0.25rem - 1px);\n  border-top-right-radius: calc(0.25rem - 1px);\n}\n.card-img-bottom {\n  width: 100%;\n  border-bottom-right-radius: calc(0.25rem - 1px);\n  border-bottom-left-radius: calc(0.25rem - 1px);\n}\n.card-deck {\n  display: flex;\n  flex-direction: column;\n}\n.card-deck .card {\n    margin-bottom: 15px;\n}\n@media (min-width: 576px) {\n.card-deck {\n      flex-flow: row wrap;\n      margin-right: -15px;\n      margin-left: -15px;\n}\n.card-deck .card {\n        display: flex;\n        flex: 1 0 0%;\n        flex-direction: column;\n        margin-right: 15px;\n        margin-bottom: 0;\n        margin-left: 15px;\n}\n}\n.card-group {\n  display: flex;\n  flex-direction: column;\n}\n.card-group > .card {\n    margin-bottom: 15px;\n}\n@media (min-width: 576px) {\n.card-group {\n      flex-flow: row wrap;\n}\n.card-group > .card {\n        flex: 1 0 0%;\n        margin-bottom: 0;\n}\n.card-group > .card + .card {\n          margin-left: 0;\n          border-left: 0;\n}\n.card-group > .card:not(:last-child) {\n          border-top-right-radius: 0;\n          border-bottom-right-radius: 0;\n}\n.card-group > .card:not(:last-child) .card-img-top,\n          .card-group > .card:not(:last-child) .card-header {\n            border-top-right-radius: 0;\n}\n.card-group > .card:not(:last-child) .card-img-bottom,\n          .card-group > .card:not(:last-child) .card-footer {\n            border-bottom-right-radius: 0;\n}\n.card-group > .card:not(:first-child) {\n          border-top-left-radius: 0;\n          border-bottom-left-radius: 0;\n}\n.card-group > .card:not(:first-child) .card-img-top,\n          .card-group > .card:not(:first-child) .card-header {\n            border-top-left-radius: 0;\n}\n.card-group > .card:not(:first-child) .card-img-bottom,\n          .card-group > .card:not(:first-child) .card-footer {\n            border-bottom-left-radius: 0;\n}\n}\n.card-columns .card {\n  margin-bottom: 0.75rem;\n}\n@media (min-width: 576px) {\n.card-columns {\n    column-count: 3;\n    column-gap: 1.25rem;\n    orphans: 1;\n    widows: 1;\n}\n.card-columns .card {\n      display: inline-block;\n      width: 100%;\n}\n}\n.accordion > .card {\n  overflow: hidden;\n}\n.accordion > .card:not(:first-of-type) .card-header:first-child {\n    border-radius: 0;\n}\n.accordion > .card:not(:first-of-type):not(:last-of-type) {\n    border-bottom: 0;\n    border-radius: 0;\n}\n.accordion > .card:first-of-type {\n    border-bottom: 0;\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0;\n}\n.accordion > .card:last-of-type {\n    border-top-left-radius: 0;\n    border-top-right-radius: 0;\n}\n.accordion > .card .card-header {\n    margin-bottom: -1px;\n}\n.breadcrumb {\n  display: flex;\n  flex-wrap: wrap;\n  padding: 0.75rem 1rem;\n  margin-bottom: 1rem;\n  list-style: none;\n  background-color: #e9ecef;\n  border-radius: 0.25rem;\n}\n.breadcrumb-item + .breadcrumb-item {\n  padding-left: 0.5rem;\n}\n.breadcrumb-item + .breadcrumb-item::before {\n    display: inline-block;\n    padding-right: 0.5rem;\n    color: #6c757d;\n    content: \"/\";\n}\n.breadcrumb-item + .breadcrumb-item:hover::before {\n  text-decoration: underline;\n}\n.breadcrumb-item + .breadcrumb-item:hover::before {\n  text-decoration: none;\n}\n.breadcrumb-item.active {\n  color: #6c757d;\n}\n.pagination {\n  display: flex;\n  padding-left: 0;\n  list-style: none;\n  border-radius: 0.25rem;\n}\n.page-link {\n  position: relative;\n  display: block;\n  padding: 0.5rem 0.75rem;\n  margin-left: -1px;\n  line-height: 1.25;\n  color: #007bff;\n  background-color: #fff;\n  border: 1px solid #dee2e6;\n}\n.page-link:hover {\n    z-index: 2;\n    color: #0056b3;\n    text-decoration: none;\n    background-color: #e9ecef;\n    border-color: #dee2e6;\n}\n.page-link:focus {\n    z-index: 2;\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);\n}\n.page-item:first-child .page-link {\n  margin-left: 0;\n  border-top-left-radius: 0.25rem;\n  border-bottom-left-radius: 0.25rem;\n}\n.page-item:last-child .page-link {\n  border-top-right-radius: 0.25rem;\n  border-bottom-right-radius: 0.25rem;\n}\n.page-item.active .page-link {\n  z-index: 1;\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff;\n}\n.page-item.disabled .page-link {\n  color: #6c757d;\n  pointer-events: none;\n  cursor: auto;\n  background-color: #fff;\n  border-color: #dee2e6;\n}\n.pagination-lg .page-link {\n  padding: 0.75rem 1.5rem;\n  font-size: 1.25rem;\n  line-height: 1.5;\n}\n.pagination-lg .page-item:first-child .page-link {\n  border-top-left-radius: 0.3rem;\n  border-bottom-left-radius: 0.3rem;\n}\n.pagination-lg .page-item:last-child .page-link {\n  border-top-right-radius: 0.3rem;\n  border-bottom-right-radius: 0.3rem;\n}\n.pagination-sm .page-link {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.875rem;\n  line-height: 1.5;\n}\n.pagination-sm .page-item:first-child .page-link {\n  border-top-left-radius: 0.2rem;\n  border-bottom-left-radius: 0.2rem;\n}\n.pagination-sm .page-item:last-child .page-link {\n  border-top-right-radius: 0.2rem;\n  border-bottom-right-radius: 0.2rem;\n}\n.badge {\n  display: inline-block;\n  padding: 0.25em 0.4em;\n  font-size: 75%;\n  font-weight: 700;\n  line-height: 1;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: 0.25rem;\n  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.badge {\n      transition: none;\n}\n}\na.badge:hover, a.badge:focus {\n    text-decoration: none;\n}\n.badge:empty {\n    display: none;\n}\n.btn .badge {\n  position: relative;\n  top: -1px;\n}\n.badge-pill {\n  padding-right: 0.6em;\n  padding-left: 0.6em;\n  border-radius: 10rem;\n}\n.badge-primary {\n  color: #fff;\n  background-color: #007bff;\n}\na.badge-primary:hover, a.badge-primary:focus {\n    color: #fff;\n    background-color: #0062cc;\n}\na.badge-primary:focus, a.badge-primary.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);\n}\n.badge-secondary {\n  color: #fff;\n  background-color: #6c757d;\n}\na.badge-secondary:hover, a.badge-secondary:focus {\n    color: #fff;\n    background-color: #545b62;\n}\na.badge-secondary:focus, a.badge-secondary.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.5);\n}\n.badge-success {\n  color: #fff;\n  background-color: #28a745;\n}\na.badge-success:hover, a.badge-success:focus {\n    color: #fff;\n    background-color: #1e7e34;\n}\na.badge-success:focus, a.badge-success.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);\n}\n.badge-info {\n  color: #fff;\n  background-color: #17a2b8;\n}\na.badge-info:hover, a.badge-info:focus {\n    color: #fff;\n    background-color: #117a8b;\n}\na.badge-info:focus, a.badge-info.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(23, 162, 184, 0.5);\n}\n.badge-warning {\n  color: #212529;\n  background-color: #ffc107;\n}\na.badge-warning:hover, a.badge-warning:focus {\n    color: #212529;\n    background-color: #d39e00;\n}\na.badge-warning:focus, a.badge-warning.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.5);\n}\n.badge-danger {\n  color: #fff;\n  background-color: #dc3545;\n}\na.badge-danger:hover, a.badge-danger:focus {\n    color: #fff;\n    background-color: #bd2130;\n}\na.badge-danger:focus, a.badge-danger.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);\n}\n.badge-light {\n  color: #212529;\n  background-color: #f8f9fa;\n}\na.badge-light:hover, a.badge-light:focus {\n    color: #212529;\n    background-color: #dae0e5;\n}\na.badge-light:focus, a.badge-light.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(248, 249, 250, 0.5);\n}\n.badge-dark {\n  color: #fff;\n  background-color: #343a40;\n}\na.badge-dark:hover, a.badge-dark:focus {\n    color: #fff;\n    background-color: #1d2124;\n}\na.badge-dark:focus, a.badge-dark.focus {\n    outline: 0;\n    box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.5);\n}\n.jumbotron {\n  padding: 2rem 1rem;\n  margin-bottom: 2rem;\n  background-color: #e9ecef;\n  border-radius: 0.3rem;\n}\n@media (min-width: 576px) {\n.jumbotron {\n      padding: 4rem 2rem;\n}\n}\n.jumbotron-fluid {\n  padding-right: 0;\n  padding-left: 0;\n  border-radius: 0;\n}\n.alert {\n  position: relative;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: 0.25rem;\n}\n.alert-heading {\n  color: inherit;\n}\n.alert-link {\n  font-weight: 700;\n}\n.alert-dismissible {\n  padding-right: 4rem;\n}\n.alert-dismissible .close {\n    position: absolute;\n    top: 0;\n    right: 0;\n    padding: 0.75rem 1.25rem;\n    color: inherit;\n}\n.alert-primary {\n  color: #004085;\n  background-color: #cce5ff;\n  border-color: #b8daff;\n}\n.alert-primary hr {\n    border-top-color: #9fcdff;\n}\n.alert-primary .alert-link {\n    color: #002752;\n}\n.alert-secondary {\n  color: #383d41;\n  background-color: #e2e3e5;\n  border-color: #d6d8db;\n}\n.alert-secondary hr {\n    border-top-color: #c8cbcf;\n}\n.alert-secondary .alert-link {\n    color: #202326;\n}\n.alert-success {\n  color: #155724;\n  background-color: #d4edda;\n  border-color: #c3e6cb;\n}\n.alert-success hr {\n    border-top-color: #b1dfbb;\n}\n.alert-success .alert-link {\n    color: #0b2e13;\n}\n.alert-info {\n  color: #0c5460;\n  background-color: #d1ecf1;\n  border-color: #bee5eb;\n}\n.alert-info hr {\n    border-top-color: #abdde5;\n}\n.alert-info .alert-link {\n    color: #062c33;\n}\n.alert-warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba;\n}\n.alert-warning hr {\n    border-top-color: #ffe8a1;\n}\n.alert-warning .alert-link {\n    color: #533f03;\n}\n.alert-danger {\n  color: #721c24;\n  background-color: #f8d7da;\n  border-color: #f5c6cb;\n}\n.alert-danger hr {\n    border-top-color: #f1b0b7;\n}\n.alert-danger .alert-link {\n    color: #491217;\n}\n.alert-light {\n  color: #818182;\n  background-color: #fefefe;\n  border-color: #fdfdfe;\n}\n.alert-light hr {\n    border-top-color: #ececf6;\n}\n.alert-light .alert-link {\n    color: #686868;\n}\n.alert-dark {\n  color: #1b1e21;\n  background-color: #d6d8d9;\n  border-color: #c6c8ca;\n}\n.alert-dark hr {\n    border-top-color: #b9bbbe;\n}\n.alert-dark .alert-link {\n    color: #040505;\n}\n@keyframes progress-bar-stripes {\nfrom {\n    background-position: 1rem 0;\n}\nto {\n    background-position: 0 0;\n}\n}\n.progress {\n  display: flex;\n  height: 1rem;\n  overflow: hidden;\n  font-size: 0.75rem;\n  background-color: #e9ecef;\n  border-radius: 0.25rem;\n}\n.progress-bar {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  background-color: #007bff;\n  transition: width 0.6s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n.progress-bar {\n      transition: none;\n}\n}\n.progress-bar-striped {\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 1rem 1rem;\n}\n.progress-bar-animated {\n  animation: progress-bar-stripes 1s linear infinite;\n}\n@media (prefers-reduced-motion: reduce) {\n.progress-bar-animated {\n      animation: none;\n}\n}\n.media {\n  display: flex;\n  align-items: flex-start;\n}\n.media-body {\n  flex: 1;\n}\n.list-group {\n  display: flex;\n  flex-direction: column;\n  padding-left: 0;\n  margin-bottom: 0;\n}\n.list-group-item-action {\n  width: 100%;\n  color: #495057;\n  text-align: inherit;\n}\n.list-group-item-action:hover, .list-group-item-action:focus {\n    z-index: 1;\n    color: #495057;\n    text-decoration: none;\n    background-color: #f8f9fa;\n}\n.list-group-item-action:active {\n    color: #212529;\n    background-color: #e9ecef;\n}\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 0.75rem 1.25rem;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid rgba(0, 0, 0, 0.125);\n}\n.list-group-item:first-child {\n    border-top-left-radius: 0.25rem;\n    border-top-right-radius: 0.25rem;\n}\n.list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 0.25rem;\n    border-bottom-left-radius: 0.25rem;\n}\n.list-group-item.disabled, .list-group-item:disabled {\n    color: #6c757d;\n    pointer-events: none;\n    background-color: #fff;\n}\n.list-group-item.active {\n    z-index: 2;\n    color: #fff;\n    background-color: #007bff;\n    border-color: #007bff;\n}\n.list-group-horizontal {\n  flex-direction: row;\n}\n.list-group-horizontal .list-group-item {\n    margin-right: -1px;\n    margin-bottom: 0;\n}\n.list-group-horizontal .list-group-item:first-child {\n      border-top-left-radius: 0.25rem;\n      border-bottom-left-radius: 0.25rem;\n      border-top-right-radius: 0;\n}\n.list-group-horizontal .list-group-item:last-child {\n      margin-right: 0;\n      border-top-right-radius: 0.25rem;\n      border-bottom-right-radius: 0.25rem;\n      border-bottom-left-radius: 0;\n}\n@media (min-width: 576px) {\n.list-group-horizontal-sm {\n    flex-direction: row;\n}\n.list-group-horizontal-sm .list-group-item {\n      margin-right: -1px;\n      margin-bottom: 0;\n}\n.list-group-horizontal-sm .list-group-item:first-child {\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n        border-top-right-radius: 0;\n}\n.list-group-horizontal-sm .list-group-item:last-child {\n        margin-right: 0;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n        border-bottom-left-radius: 0;\n}\n}\n@media (min-width: 768px) {\n.list-group-horizontal-md {\n    flex-direction: row;\n}\n.list-group-horizontal-md .list-group-item {\n      margin-right: -1px;\n      margin-bottom: 0;\n}\n.list-group-horizontal-md .list-group-item:first-child {\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n        border-top-right-radius: 0;\n}\n.list-group-horizontal-md .list-group-item:last-child {\n        margin-right: 0;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n        border-bottom-left-radius: 0;\n}\n}\n@media (min-width: 992px) {\n.list-group-horizontal-lg {\n    flex-direction: row;\n}\n.list-group-horizontal-lg .list-group-item {\n      margin-right: -1px;\n      margin-bottom: 0;\n}\n.list-group-horizontal-lg .list-group-item:first-child {\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n        border-top-right-radius: 0;\n}\n.list-group-horizontal-lg .list-group-item:last-child {\n        margin-right: 0;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n        border-bottom-left-radius: 0;\n}\n}\n@media (min-width: 1200px) {\n.list-group-horizontal-xl {\n    flex-direction: row;\n}\n.list-group-horizontal-xl .list-group-item {\n      margin-right: -1px;\n      margin-bottom: 0;\n}\n.list-group-horizontal-xl .list-group-item:first-child {\n        border-top-left-radius: 0.25rem;\n        border-bottom-left-radius: 0.25rem;\n        border-top-right-radius: 0;\n}\n.list-group-horizontal-xl .list-group-item:last-child {\n        margin-right: 0;\n        border-top-right-radius: 0.25rem;\n        border-bottom-right-radius: 0.25rem;\n        border-bottom-left-radius: 0;\n}\n}\n.list-group-flush .list-group-item {\n  border-right: 0;\n  border-left: 0;\n  border-radius: 0;\n}\n.list-group-flush .list-group-item:last-child {\n    margin-bottom: -1px;\n}\n.list-group-flush:first-child .list-group-item:first-child {\n  border-top: 0;\n}\n.list-group-flush:last-child .list-group-item:last-child {\n  margin-bottom: 0;\n  border-bottom: 0;\n}\n.list-group-item-primary {\n  color: #004085;\n  background-color: #b8daff;\n}\n.list-group-item-primary.list-group-item-action:hover, .list-group-item-primary.list-group-item-action:focus {\n    color: #004085;\n    background-color: #9fcdff;\n}\n.list-group-item-primary.list-group-item-action.active {\n    color: #fff;\n    background-color: #004085;\n    border-color: #004085;\n}\n.list-group-item-secondary {\n  color: #383d41;\n  background-color: #d6d8db;\n}\n.list-group-item-secondary.list-group-item-action:hover, .list-group-item-secondary.list-group-item-action:focus {\n    color: #383d41;\n    background-color: #c8cbcf;\n}\n.list-group-item-secondary.list-group-item-action.active {\n    color: #fff;\n    background-color: #383d41;\n    border-color: #383d41;\n}\n.list-group-item-success {\n  color: #155724;\n  background-color: #c3e6cb;\n}\n.list-group-item-success.list-group-item-action:hover, .list-group-item-success.list-group-item-action:focus {\n    color: #155724;\n    background-color: #b1dfbb;\n}\n.list-group-item-success.list-group-item-action.active {\n    color: #fff;\n    background-color: #155724;\n    border-color: #155724;\n}\n.list-group-item-info {\n  color: #0c5460;\n  background-color: #bee5eb;\n}\n.list-group-item-info.list-group-item-action:hover, .list-group-item-info.list-group-item-action:focus {\n    color: #0c5460;\n    background-color: #abdde5;\n}\n.list-group-item-info.list-group-item-action.active {\n    color: #fff;\n    background-color: #0c5460;\n    border-color: #0c5460;\n}\n.list-group-item-warning {\n  color: #856404;\n  background-color: #ffeeba;\n}\n.list-group-item-warning.list-group-item-action:hover, .list-group-item-warning.list-group-item-action:focus {\n    color: #856404;\n    background-color: #ffe8a1;\n}\n.list-group-item-warning.list-group-item-action.active {\n    color: #fff;\n    background-color: #856404;\n    border-color: #856404;\n}\n.list-group-item-danger {\n  color: #721c24;\n  background-color: #f5c6cb;\n}\n.list-group-item-danger.list-group-item-action:hover, .list-group-item-danger.list-group-item-action:focus {\n    color: #721c24;\n    background-color: #f1b0b7;\n}\n.list-group-item-danger.list-group-item-action.active {\n    color: #fff;\n    background-color: #721c24;\n    border-color: #721c24;\n}\n.list-group-item-light {\n  color: #818182;\n  background-color: #fdfdfe;\n}\n.list-group-item-light.list-group-item-action:hover, .list-group-item-light.list-group-item-action:focus {\n    color: #818182;\n    background-color: #ececf6;\n}\n.list-group-item-light.list-group-item-action.active {\n    color: #fff;\n    background-color: #818182;\n    border-color: #818182;\n}\n.list-group-item-dark {\n  color: #1b1e21;\n  background-color: #c6c8ca;\n}\n.list-group-item-dark.list-group-item-action:hover, .list-group-item-dark.list-group-item-action:focus {\n    color: #1b1e21;\n    background-color: #b9bbbe;\n}\n.list-group-item-dark.list-group-item-action.active {\n    color: #fff;\n    background-color: #1b1e21;\n    border-color: #1b1e21;\n}\n.close {\n  float: right;\n  font-size: 1.5rem;\n  font-weight: 700;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: .5;\n}\n.close:hover {\n    color: #000;\n    text-decoration: none;\n}\n.close:not(:disabled):not(.disabled):hover, .close:not(:disabled):not(.disabled):focus {\n    opacity: .75;\n}\nbutton.close {\n  padding: 0;\n  background-color: transparent;\n  border: 0;\n  appearance: none;\n}\na.close.disabled {\n  pointer-events: none;\n}\n.toast {\n  max-width: 350px;\n  overflow: hidden;\n  font-size: 0.875rem;\n  background-color: rgba(255, 255, 255, 0.85);\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);\n  backdrop-filter: blur(10px);\n  opacity: 0;\n  border-radius: 0.25rem;\n}\n.toast:not(:last-child) {\n    margin-bottom: 0.75rem;\n}\n.toast.showing {\n    opacity: 1;\n}\n.toast.show {\n    display: block;\n    opacity: 1;\n}\n.toast.hide {\n    display: none;\n}\n.toast-header {\n  display: flex;\n  align-items: center;\n  padding: 0.25rem 0.75rem;\n  color: #6c757d;\n  background-color: rgba(255, 255, 255, 0.85);\n  background-clip: padding-box;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.05);\n}\n.toast-body {\n  padding: 0.75rem;\n}\n.modal-open {\n  overflow: hidden;\n}\n.modal-open .modal {\n    overflow-x: hidden;\n    overflow-y: auto;\n}\n.modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1050;\n  display: none;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  outline: 0;\n}\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 0.5rem;\n  pointer-events: none;\n}\n.modal.fade .modal-dialog {\n    transition: transform 0.3s ease-out;\n    transform: translate(0, -50px);\n}\n@media (prefers-reduced-motion: reduce) {\n.modal.fade .modal-dialog {\n        transition: none;\n}\n}\n.modal.show .modal-dialog {\n    transform: none;\n}\n.modal-dialog-scrollable {\n  display: flex;\n  max-height: calc(100% - 1rem);\n}\n.modal-dialog-scrollable .modal-content {\n    max-height: calc(100vh - 1rem);\n    overflow: hidden;\n}\n.modal-dialog-scrollable .modal-header,\n  .modal-dialog-scrollable .modal-footer {\n    flex-shrink: 0;\n}\n.modal-dialog-scrollable .modal-body {\n    overflow-y: auto;\n}\n.modal-dialog-centered {\n  display: flex;\n  align-items: center;\n  min-height: calc(100% - 1rem);\n}\n.modal-dialog-centered::before {\n    display: block;\n    height: calc(100vh - 1rem);\n    content: \"\";\n}\n.modal-dialog-centered.modal-dialog-scrollable {\n    flex-direction: column;\n    justify-content: center;\n    height: 100%;\n}\n.modal-dialog-centered.modal-dialog-scrollable .modal-content {\n      max-height: none;\n}\n.modal-dialog-centered.modal-dialog-scrollable::before {\n      content: none;\n}\n.modal-content {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  pointer-events: auto;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n  outline: 0;\n}\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1040;\n  width: 100vw;\n  height: 100vh;\n  background-color: #000;\n}\n.modal-backdrop.fade {\n    opacity: 0;\n}\n.modal-backdrop.show {\n    opacity: 0.5;\n}\n.modal-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  padding: 1rem 1rem;\n  border-bottom: 1px solid #dee2e6;\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem;\n}\n.modal-header .close {\n    padding: 1rem 1rem;\n    margin: -1rem -1rem -1rem auto;\n}\n.modal-title {\n  margin-bottom: 0;\n  line-height: 1.5;\n}\n.modal-body {\n  position: relative;\n  flex: 1 1 auto;\n  padding: 1rem;\n}\n.modal-footer {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 1rem;\n  border-top: 1px solid #dee2e6;\n  border-bottom-right-radius: 0.3rem;\n  border-bottom-left-radius: 0.3rem;\n}\n.modal-footer > :not(:first-child) {\n    margin-left: .25rem;\n}\n.modal-footer > :not(:last-child) {\n    margin-right: .25rem;\n}\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll;\n}\n@media (min-width: 576px) {\n.modal-dialog {\n    max-width: 500px;\n    margin: 1.75rem auto;\n}\n.modal-dialog-scrollable {\n    max-height: calc(100% - 3.5rem);\n}\n.modal-dialog-scrollable .modal-content {\n      max-height: calc(100vh - 3.5rem);\n}\n.modal-dialog-centered {\n    min-height: calc(100% - 3.5rem);\n}\n.modal-dialog-centered::before {\n      height: calc(100vh - 3.5rem);\n}\n.modal-sm {\n    max-width: 300px;\n}\n}\n@media (min-width: 992px) {\n.modal-lg,\n  .modal-xl {\n    max-width: 800px;\n}\n}\n@media (min-width: 1200px) {\n.modal-xl {\n    max-width: 1140px;\n}\n}\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  opacity: 0;\n}\n.tooltip.show {\n    opacity: 0.9;\n}\n.tooltip .arrow {\n    position: absolute;\n    display: block;\n    width: 0.8rem;\n    height: 0.4rem;\n}\n.tooltip .arrow::before {\n      position: absolute;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid;\n}\n.bs-tooltip-top, .bs-tooltip-auto[x-placement^=\"top\"] {\n  padding: 0.4rem 0;\n}\n.bs-tooltip-top .arrow, .bs-tooltip-auto[x-placement^=\"top\"] .arrow {\n    bottom: 0;\n}\n.bs-tooltip-top .arrow::before, .bs-tooltip-auto[x-placement^=\"top\"] .arrow::before {\n      top: 0;\n      border-width: 0.4rem 0.4rem 0;\n      border-top-color: #000;\n}\n.bs-tooltip-right, .bs-tooltip-auto[x-placement^=\"right\"] {\n  padding: 0 0.4rem;\n}\n.bs-tooltip-right .arrow, .bs-tooltip-auto[x-placement^=\"right\"] .arrow {\n    left: 0;\n    width: 0.4rem;\n    height: 0.8rem;\n}\n.bs-tooltip-right .arrow::before, .bs-tooltip-auto[x-placement^=\"right\"] .arrow::before {\n      right: 0;\n      border-width: 0.4rem 0.4rem 0.4rem 0;\n      border-right-color: #000;\n}\n.bs-tooltip-bottom, .bs-tooltip-auto[x-placement^=\"bottom\"] {\n  padding: 0.4rem 0;\n}\n.bs-tooltip-bottom .arrow, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow {\n    top: 0;\n}\n.bs-tooltip-bottom .arrow::before, .bs-tooltip-auto[x-placement^=\"bottom\"] .arrow::before {\n      bottom: 0;\n      border-width: 0 0.4rem 0.4rem;\n      border-bottom-color: #000;\n}\n.bs-tooltip-left, .bs-tooltip-auto[x-placement^=\"left\"] {\n  padding: 0 0.4rem;\n}\n.bs-tooltip-left .arrow, .bs-tooltip-auto[x-placement^=\"left\"] .arrow {\n    right: 0;\n    width: 0.4rem;\n    height: 0.8rem;\n}\n.bs-tooltip-left .arrow::before, .bs-tooltip-auto[x-placement^=\"left\"] .arrow::before {\n      left: 0;\n      border-width: 0.4rem 0 0.4rem 0.4rem;\n      border-left-color: #000;\n}\n.tooltip-inner {\n  max-width: 200px;\n  padding: 0.25rem 0.5rem;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 0.25rem;\n}\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: block;\n  max-width: 276px;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";\n  font-style: normal;\n  font-weight: 400;\n  line-height: 1.5;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  letter-spacing: normal;\n  word-break: normal;\n  word-spacing: normal;\n  white-space: normal;\n  line-break: auto;\n  font-size: 0.875rem;\n  word-wrap: break-word;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 0.3rem;\n}\n.popover .arrow {\n    position: absolute;\n    display: block;\n    width: 1rem;\n    height: 0.5rem;\n    margin: 0 0.3rem;\n}\n.popover .arrow::before, .popover .arrow::after {\n      position: absolute;\n      display: block;\n      content: \"\";\n      border-color: transparent;\n      border-style: solid;\n}\n.bs-popover-top, .bs-popover-auto[x-placement^=\"top\"] {\n  margin-bottom: 0.5rem;\n}\n.bs-popover-top > .arrow, .bs-popover-auto[x-placement^=\"top\"] > .arrow {\n    bottom: calc((0.5rem + 1px) * -1);\n}\n.bs-popover-top > .arrow::before, .bs-popover-auto[x-placement^=\"top\"] > .arrow::before {\n      bottom: 0;\n      border-width: 0.5rem 0.5rem 0;\n      border-top-color: rgba(0, 0, 0, 0.25);\n}\n.bs-popover-top > .arrow::after, .bs-popover-auto[x-placement^=\"top\"] > .arrow::after {\n      bottom: 1px;\n      border-width: 0.5rem 0.5rem 0;\n      border-top-color: #fff;\n}\n.bs-popover-right, .bs-popover-auto[x-placement^=\"right\"] {\n  margin-left: 0.5rem;\n}\n.bs-popover-right > .arrow, .bs-popover-auto[x-placement^=\"right\"] > .arrow {\n    left: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0;\n}\n.bs-popover-right > .arrow::before, .bs-popover-auto[x-placement^=\"right\"] > .arrow::before {\n      left: 0;\n      border-width: 0.5rem 0.5rem 0.5rem 0;\n      border-right-color: rgba(0, 0, 0, 0.25);\n}\n.bs-popover-right > .arrow::after, .bs-popover-auto[x-placement^=\"right\"] > .arrow::after {\n      left: 1px;\n      border-width: 0.5rem 0.5rem 0.5rem 0;\n      border-right-color: #fff;\n}\n.bs-popover-bottom, .bs-popover-auto[x-placement^=\"bottom\"] {\n  margin-top: 0.5rem;\n}\n.bs-popover-bottom > .arrow, .bs-popover-auto[x-placement^=\"bottom\"] > .arrow {\n    top: calc((0.5rem + 1px) * -1);\n}\n.bs-popover-bottom > .arrow::before, .bs-popover-auto[x-placement^=\"bottom\"] > .arrow::before {\n      top: 0;\n      border-width: 0 0.5rem 0.5rem 0.5rem;\n      border-bottom-color: rgba(0, 0, 0, 0.25);\n}\n.bs-popover-bottom > .arrow::after, .bs-popover-auto[x-placement^=\"bottom\"] > .arrow::after {\n      top: 1px;\n      border-width: 0 0.5rem 0.5rem 0.5rem;\n      border-bottom-color: #fff;\n}\n.bs-popover-bottom .popover-header::before, .bs-popover-auto[x-placement^=\"bottom\"] .popover-header::before {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    display: block;\n    width: 1rem;\n    margin-left: -0.5rem;\n    content: \"\";\n    border-bottom: 1px solid #f7f7f7;\n}\n.bs-popover-left, .bs-popover-auto[x-placement^=\"left\"] {\n  margin-right: 0.5rem;\n}\n.bs-popover-left > .arrow, .bs-popover-auto[x-placement^=\"left\"] > .arrow {\n    right: calc((0.5rem + 1px) * -1);\n    width: 0.5rem;\n    height: 1rem;\n    margin: 0.3rem 0;\n}\n.bs-popover-left > .arrow::before, .bs-popover-auto[x-placement^=\"left\"] > .arrow::before {\n      right: 0;\n      border-width: 0.5rem 0 0.5rem 0.5rem;\n      border-left-color: rgba(0, 0, 0, 0.25);\n}\n.bs-popover-left > .arrow::after, .bs-popover-auto[x-placement^=\"left\"] > .arrow::after {\n      right: 1px;\n      border-width: 0.5rem 0 0.5rem 0.5rem;\n      border-left-color: #fff;\n}\n.popover-header {\n  padding: 0.5rem 0.75rem;\n  margin-bottom: 0;\n  font-size: 1rem;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-top-left-radius: calc(0.3rem - 1px);\n  border-top-right-radius: calc(0.3rem - 1px);\n}\n.popover-header:empty {\n    display: none;\n}\n.popover-body {\n  padding: 0.5rem 0.75rem;\n  color: #212529;\n}\n.carousel {\n  position: relative;\n}\n.carousel.pointer-event {\n  touch-action: pan-y;\n}\n.carousel-inner {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n}\n.carousel-inner::after {\n    display: block;\n    clear: both;\n    content: \"\";\n}\n.carousel-item {\n  position: relative;\n  display: none;\n  float: left;\n  width: 100%;\n  margin-right: -100%;\n  backface-visibility: hidden;\n  transition: transform 0.6s ease-in-out;\n}\n@media (prefers-reduced-motion: reduce) {\n.carousel-item {\n      transition: none;\n}\n}\n.carousel-item.active,\n.carousel-item-next,\n.carousel-item-prev {\n  display: block;\n}\n.carousel-item-next:not(.carousel-item-left),\n.active.carousel-item-right {\n  transform: translateX(100%);\n}\n.carousel-item-prev:not(.carousel-item-right),\n.active.carousel-item-left {\n  transform: translateX(-100%);\n}\n.carousel-fade .carousel-item {\n  opacity: 0;\n  transition-property: opacity;\n  transform: none;\n}\n.carousel-fade .carousel-item.active,\n.carousel-fade .carousel-item-next.carousel-item-left,\n.carousel-fade .carousel-item-prev.carousel-item-right {\n  z-index: 1;\n  opacity: 1;\n}\n.carousel-fade .active.carousel-item-left,\n.carousel-fade .active.carousel-item-right {\n  z-index: 0;\n  opacity: 0;\n  transition: 0s 0.6s opacity;\n}\n@media (prefers-reduced-motion: reduce) {\n.carousel-fade .active.carousel-item-left,\n    .carousel-fade .active.carousel-item-right {\n      transition: none;\n}\n}\n.carousel-control-prev,\n.carousel-control-next {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 15%;\n  color: #fff;\n  text-align: center;\n  opacity: 0.5;\n  transition: opacity 0.15s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n.carousel-control-prev,\n    .carousel-control-next {\n      transition: none;\n}\n}\n.carousel-control-prev:hover, .carousel-control-prev:focus,\n  .carousel-control-next:hover,\n  .carousel-control-next:focus {\n    color: #fff;\n    text-decoration: none;\n    outline: 0;\n    opacity: 0.9;\n}\n.carousel-control-prev {\n  left: 0;\n}\n.carousel-control-next {\n  right: 0;\n}\n.carousel-control-prev-icon,\n.carousel-control-next-icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  background: no-repeat 50% / 100% 100%;\n}\n.carousel-control-prev-icon {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3e%3cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3e%3c/svg%3e\");\n}\n.carousel-control-next-icon {\n  background-image: url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 8 8'%3e%3cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3e%3c/svg%3e\");\n}\n.carousel-indicators {\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 15;\n  display: flex;\n  justify-content: center;\n  padding-left: 0;\n  margin-right: 15%;\n  margin-left: 15%;\n  list-style: none;\n}\n.carousel-indicators li {\n    box-sizing: content-box;\n    flex: 0 1 auto;\n    width: 30px;\n    height: 3px;\n    margin-right: 3px;\n    margin-left: 3px;\n    text-indent: -999px;\n    cursor: pointer;\n    background-color: #fff;\n    background-clip: padding-box;\n    border-top: 10px solid transparent;\n    border-bottom: 10px solid transparent;\n    opacity: .5;\n    transition: opacity 0.6s ease;\n}\n@media (prefers-reduced-motion: reduce) {\n.carousel-indicators li {\n        transition: none;\n}\n}\n.carousel-indicators .active {\n    opacity: 1;\n}\n.carousel-caption {\n  position: absolute;\n  right: 15%;\n  bottom: 20px;\n  left: 15%;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n}\n@keyframes spinner-border {\nto {\n    transform: rotate(360deg);\n}\n}\n.spinner-border {\n  display: inline-block;\n  width: 2rem;\n  height: 2rem;\n  vertical-align: text-bottom;\n  border: 0.25em solid currentColor;\n  border-right-color: transparent;\n  border-radius: 50%;\n  animation: spinner-border .75s linear infinite;\n}\n.spinner-border-sm {\n  width: 1rem;\n  height: 1rem;\n  border-width: 0.2em;\n}\n@keyframes spinner-grow {\n0% {\n    transform: scale(0);\n}\n50% {\n    opacity: 1;\n}\n}\n.spinner-grow {\n  display: inline-block;\n  width: 2rem;\n  height: 2rem;\n  vertical-align: text-bottom;\n  background-color: currentColor;\n  border-radius: 50%;\n  opacity: 0;\n  animation: spinner-grow .75s linear infinite;\n}\n.spinner-grow-sm {\n  width: 1rem;\n  height: 1rem;\n}\n.align-baseline {\n  vertical-align: baseline !important;\n}\n.align-top {\n  vertical-align: top !important;\n}\n.align-middle {\n  vertical-align: middle !important;\n}\n.align-bottom {\n  vertical-align: bottom !important;\n}\n.align-text-bottom {\n  vertical-align: text-bottom !important;\n}\n.align-text-top {\n  vertical-align: text-top !important;\n}\n.bg-primary {\n  background-color: #007bff !important;\n}\na.bg-primary:hover, a.bg-primary:focus,\nbutton.bg-primary:hover,\nbutton.bg-primary:focus {\n  background-color: #0062cc !important;\n}\n.bg-secondary {\n  background-color: #6c757d !important;\n}\na.bg-secondary:hover, a.bg-secondary:focus,\nbutton.bg-secondary:hover,\nbutton.bg-secondary:focus {\n  background-color: #545b62 !important;\n}\n.bg-success {\n  background-color: #28a745 !important;\n}\na.bg-success:hover, a.bg-success:focus,\nbutton.bg-success:hover,\nbutton.bg-success:focus {\n  background-color: #1e7e34 !important;\n}\n.bg-info {\n  background-color: #17a2b8 !important;\n}\na.bg-info:hover, a.bg-info:focus,\nbutton.bg-info:hover,\nbutton.bg-info:focus {\n  background-color: #117a8b !important;\n}\n.bg-warning {\n  background-color: #ffc107 !important;\n}\na.bg-warning:hover, a.bg-warning:focus,\nbutton.bg-warning:hover,\nbutton.bg-warning:focus {\n  background-color: #d39e00 !important;\n}\n.bg-danger {\n  background-color: #dc3545 !important;\n}\na.bg-danger:hover, a.bg-danger:focus,\nbutton.bg-danger:hover,\nbutton.bg-danger:focus {\n  background-color: #bd2130 !important;\n}\n.bg-light {\n  background-color: #f8f9fa !important;\n}\na.bg-light:hover, a.bg-light:focus,\nbutton.bg-light:hover,\nbutton.bg-light:focus {\n  background-color: #dae0e5 !important;\n}\n.bg-dark {\n  background-color: #343a40 !important;\n}\na.bg-dark:hover, a.bg-dark:focus,\nbutton.bg-dark:hover,\nbutton.bg-dark:focus {\n  background-color: #1d2124 !important;\n}\n.bg-white {\n  background-color: #fff !important;\n}\n.bg-transparent {\n  background-color: transparent !important;\n}\n.border {\n  border: 1px solid #dee2e6 !important;\n}\n.border-top {\n  border-top: 1px solid #dee2e6 !important;\n}\n.border-right {\n  border-right: 1px solid #dee2e6 !important;\n}\n.border-bottom {\n  border-bottom: 1px solid #dee2e6 !important;\n}\n.border-left {\n  border-left: 1px solid #dee2e6 !important;\n}\n.border-0 {\n  border: 0 !important;\n}\n.border-top-0 {\n  border-top: 0 !important;\n}\n.border-right-0 {\n  border-right: 0 !important;\n}\n.border-bottom-0 {\n  border-bottom: 0 !important;\n}\n.border-left-0 {\n  border-left: 0 !important;\n}\n.border-primary {\n  border-color: #007bff !important;\n}\n.border-secondary {\n  border-color: #6c757d !important;\n}\n.border-success {\n  border-color: #28a745 !important;\n}\n.border-info {\n  border-color: #17a2b8 !important;\n}\n.border-warning {\n  border-color: #ffc107 !important;\n}\n.border-danger {\n  border-color: #dc3545 !important;\n}\n.border-light {\n  border-color: #f8f9fa !important;\n}\n.border-dark {\n  border-color: #343a40 !important;\n}\n.border-white {\n  border-color: #fff !important;\n}\n.rounded-sm {\n  border-radius: 0.2rem !important;\n}\n.rounded {\n  border-radius: 0.25rem !important;\n}\n.rounded-top {\n  border-top-left-radius: 0.25rem !important;\n  border-top-right-radius: 0.25rem !important;\n}\n.rounded-right {\n  border-top-right-radius: 0.25rem !important;\n  border-bottom-right-radius: 0.25rem !important;\n}\n.rounded-bottom {\n  border-bottom-right-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important;\n}\n.rounded-left {\n  border-top-left-radius: 0.25rem !important;\n  border-bottom-left-radius: 0.25rem !important;\n}\n.rounded-lg {\n  border-radius: 0.3rem !important;\n}\n.rounded-circle {\n  border-radius: 50% !important;\n}\n.rounded-pill {\n  border-radius: 50rem !important;\n}\n.rounded-0 {\n  border-radius: 0 !important;\n}\n.clearfix::after {\n  display: block;\n  clear: both;\n  content: \"\";\n}\n.d-none {\n  display: none !important;\n}\n.d-inline {\n  display: inline !important;\n}\n.d-inline-block {\n  display: inline-block !important;\n}\n.d-block {\n  display: block !important;\n}\n.d-table {\n  display: table !important;\n}\n.d-table-row {\n  display: table-row !important;\n}\n.d-table-cell {\n  display: table-cell !important;\n}\n.d-flex {\n  display: flex !important;\n}\n.d-inline-flex {\n  display: inline-flex !important;\n}\n@media (min-width: 576px) {\n.d-sm-none {\n    display: none !important;\n}\n.d-sm-inline {\n    display: inline !important;\n}\n.d-sm-inline-block {\n    display: inline-block !important;\n}\n.d-sm-block {\n    display: block !important;\n}\n.d-sm-table {\n    display: table !important;\n}\n.d-sm-table-row {\n    display: table-row !important;\n}\n.d-sm-table-cell {\n    display: table-cell !important;\n}\n.d-sm-flex {\n    display: flex !important;\n}\n.d-sm-inline-flex {\n    display: inline-flex !important;\n}\n}\n@media (min-width: 768px) {\n.d-md-none {\n    display: none !important;\n}\n.d-md-inline {\n    display: inline !important;\n}\n.d-md-inline-block {\n    display: inline-block !important;\n}\n.d-md-block {\n    display: block !important;\n}\n.d-md-table {\n    display: table !important;\n}\n.d-md-table-row {\n    display: table-row !important;\n}\n.d-md-table-cell {\n    display: table-cell !important;\n}\n.d-md-flex {\n    display: flex !important;\n}\n.d-md-inline-flex {\n    display: inline-flex !important;\n}\n}\n@media (min-width: 992px) {\n.d-lg-none {\n    display: none !important;\n}\n.d-lg-inline {\n    display: inline !important;\n}\n.d-lg-inline-block {\n    display: inline-block !important;\n}\n.d-lg-block {\n    display: block !important;\n}\n.d-lg-table {\n    display: table !important;\n}\n.d-lg-table-row {\n    display: table-row !important;\n}\n.d-lg-table-cell {\n    display: table-cell !important;\n}\n.d-lg-flex {\n    display: flex !important;\n}\n.d-lg-inline-flex {\n    display: inline-flex !important;\n}\n}\n@media (min-width: 1200px) {\n.d-xl-none {\n    display: none !important;\n}\n.d-xl-inline {\n    display: inline !important;\n}\n.d-xl-inline-block {\n    display: inline-block !important;\n}\n.d-xl-block {\n    display: block !important;\n}\n.d-xl-table {\n    display: table !important;\n}\n.d-xl-table-row {\n    display: table-row !important;\n}\n.d-xl-table-cell {\n    display: table-cell !important;\n}\n.d-xl-flex {\n    display: flex !important;\n}\n.d-xl-inline-flex {\n    display: inline-flex !important;\n}\n}\n@media print {\n.d-print-none {\n    display: none !important;\n}\n.d-print-inline {\n    display: inline !important;\n}\n.d-print-inline-block {\n    display: inline-block !important;\n}\n.d-print-block {\n    display: block !important;\n}\n.d-print-table {\n    display: table !important;\n}\n.d-print-table-row {\n    display: table-row !important;\n}\n.d-print-table-cell {\n    display: table-cell !important;\n}\n.d-print-flex {\n    display: flex !important;\n}\n.d-print-inline-flex {\n    display: inline-flex !important;\n}\n}\n.embed-responsive {\n  position: relative;\n  display: block;\n  width: 100%;\n  padding: 0;\n  overflow: hidden;\n}\n.embed-responsive::before {\n    display: block;\n    content: \"\";\n}\n.embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    border: 0;\n}\n.embed-responsive-21by9::before {\n  padding-top: 42.85714%;\n}\n.embed-responsive-16by9::before {\n  padding-top: 56.25%;\n}\n.embed-responsive-4by3::before {\n  padding-top: 75%;\n}\n.embed-responsive-1by1::before {\n  padding-top: 100%;\n}\n.flex-row {\n  flex-direction: row !important;\n}\n.flex-column {\n  flex-direction: column !important;\n}\n.flex-row-reverse {\n  flex-direction: row-reverse !important;\n}\n.flex-column-reverse {\n  flex-direction: column-reverse !important;\n}\n.flex-wrap {\n  flex-wrap: wrap !important;\n}\n.flex-nowrap {\n  flex-wrap: nowrap !important;\n}\n.flex-wrap-reverse {\n  flex-wrap: wrap-reverse !important;\n}\n.flex-fill {\n  flex: 1 1 auto !important;\n}\n.flex-grow-0 {\n  flex-grow: 0 !important;\n}\n.flex-grow-1 {\n  flex-grow: 1 !important;\n}\n.flex-shrink-0 {\n  flex-shrink: 0 !important;\n}\n.flex-shrink-1 {\n  flex-shrink: 1 !important;\n}\n.justify-content-start {\n  justify-content: flex-start !important;\n}\n.justify-content-end {\n  justify-content: flex-end !important;\n}\n.justify-content-center {\n  justify-content: center !important;\n}\n.justify-content-between {\n  justify-content: space-between !important;\n}\n.justify-content-around {\n  justify-content: space-around !important;\n}\n.align-items-start {\n  align-items: flex-start !important;\n}\n.align-items-end {\n  align-items: flex-end !important;\n}\n.align-items-center {\n  align-items: center !important;\n}\n.align-items-baseline {\n  align-items: baseline !important;\n}\n.align-items-stretch {\n  align-items: stretch !important;\n}\n.align-content-start {\n  align-content: flex-start !important;\n}\n.align-content-end {\n  align-content: flex-end !important;\n}\n.align-content-center {\n  align-content: center !important;\n}\n.align-content-between {\n  align-content: space-between !important;\n}\n.align-content-around {\n  align-content: space-around !important;\n}\n.align-content-stretch {\n  align-content: stretch !important;\n}\n.align-self-auto {\n  align-self: auto !important;\n}\n.align-self-start {\n  align-self: flex-start !important;\n}\n.align-self-end {\n  align-self: flex-end !important;\n}\n.align-self-center {\n  align-self: center !important;\n}\n.align-self-baseline {\n  align-self: baseline !important;\n}\n.align-self-stretch {\n  align-self: stretch !important;\n}\n@media (min-width: 576px) {\n.flex-sm-row {\n    flex-direction: row !important;\n}\n.flex-sm-column {\n    flex-direction: column !important;\n}\n.flex-sm-row-reverse {\n    flex-direction: row-reverse !important;\n}\n.flex-sm-column-reverse {\n    flex-direction: column-reverse !important;\n}\n.flex-sm-wrap {\n    flex-wrap: wrap !important;\n}\n.flex-sm-nowrap {\n    flex-wrap: nowrap !important;\n}\n.flex-sm-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n}\n.flex-sm-fill {\n    flex: 1 1 auto !important;\n}\n.flex-sm-grow-0 {\n    flex-grow: 0 !important;\n}\n.flex-sm-grow-1 {\n    flex-grow: 1 !important;\n}\n.flex-sm-shrink-0 {\n    flex-shrink: 0 !important;\n}\n.flex-sm-shrink-1 {\n    flex-shrink: 1 !important;\n}\n.justify-content-sm-start {\n    justify-content: flex-start !important;\n}\n.justify-content-sm-end {\n    justify-content: flex-end !important;\n}\n.justify-content-sm-center {\n    justify-content: center !important;\n}\n.justify-content-sm-between {\n    justify-content: space-between !important;\n}\n.justify-content-sm-around {\n    justify-content: space-around !important;\n}\n.align-items-sm-start {\n    align-items: flex-start !important;\n}\n.align-items-sm-end {\n    align-items: flex-end !important;\n}\n.align-items-sm-center {\n    align-items: center !important;\n}\n.align-items-sm-baseline {\n    align-items: baseline !important;\n}\n.align-items-sm-stretch {\n    align-items: stretch !important;\n}\n.align-content-sm-start {\n    align-content: flex-start !important;\n}\n.align-content-sm-end {\n    align-content: flex-end !important;\n}\n.align-content-sm-center {\n    align-content: center !important;\n}\n.align-content-sm-between {\n    align-content: space-between !important;\n}\n.align-content-sm-around {\n    align-content: space-around !important;\n}\n.align-content-sm-stretch {\n    align-content: stretch !important;\n}\n.align-self-sm-auto {\n    align-self: auto !important;\n}\n.align-self-sm-start {\n    align-self: flex-start !important;\n}\n.align-self-sm-end {\n    align-self: flex-end !important;\n}\n.align-self-sm-center {\n    align-self: center !important;\n}\n.align-self-sm-baseline {\n    align-self: baseline !important;\n}\n.align-self-sm-stretch {\n    align-self: stretch !important;\n}\n}\n@media (min-width: 768px) {\n.flex-md-row {\n    flex-direction: row !important;\n}\n.flex-md-column {\n    flex-direction: column !important;\n}\n.flex-md-row-reverse {\n    flex-direction: row-reverse !important;\n}\n.flex-md-column-reverse {\n    flex-direction: column-reverse !important;\n}\n.flex-md-wrap {\n    flex-wrap: wrap !important;\n}\n.flex-md-nowrap {\n    flex-wrap: nowrap !important;\n}\n.flex-md-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n}\n.flex-md-fill {\n    flex: 1 1 auto !important;\n}\n.flex-md-grow-0 {\n    flex-grow: 0 !important;\n}\n.flex-md-grow-1 {\n    flex-grow: 1 !important;\n}\n.flex-md-shrink-0 {\n    flex-shrink: 0 !important;\n}\n.flex-md-shrink-1 {\n    flex-shrink: 1 !important;\n}\n.justify-content-md-start {\n    justify-content: flex-start !important;\n}\n.justify-content-md-end {\n    justify-content: flex-end !important;\n}\n.justify-content-md-center {\n    justify-content: center !important;\n}\n.justify-content-md-between {\n    justify-content: space-between !important;\n}\n.justify-content-md-around {\n    justify-content: space-around !important;\n}\n.align-items-md-start {\n    align-items: flex-start !important;\n}\n.align-items-md-end {\n    align-items: flex-end !important;\n}\n.align-items-md-center {\n    align-items: center !important;\n}\n.align-items-md-baseline {\n    align-items: baseline !important;\n}\n.align-items-md-stretch {\n    align-items: stretch !important;\n}\n.align-content-md-start {\n    align-content: flex-start !important;\n}\n.align-content-md-end {\n    align-content: flex-end !important;\n}\n.align-content-md-center {\n    align-content: center !important;\n}\n.align-content-md-between {\n    align-content: space-between !important;\n}\n.align-content-md-around {\n    align-content: space-around !important;\n}\n.align-content-md-stretch {\n    align-content: stretch !important;\n}\n.align-self-md-auto {\n    align-self: auto !important;\n}\n.align-self-md-start {\n    align-self: flex-start !important;\n}\n.align-self-md-end {\n    align-self: flex-end !important;\n}\n.align-self-md-center {\n    align-self: center !important;\n}\n.align-self-md-baseline {\n    align-self: baseline !important;\n}\n.align-self-md-stretch {\n    align-self: stretch !important;\n}\n}\n@media (min-width: 992px) {\n.flex-lg-row {\n    flex-direction: row !important;\n}\n.flex-lg-column {\n    flex-direction: column !important;\n}\n.flex-lg-row-reverse {\n    flex-direction: row-reverse !important;\n}\n.flex-lg-column-reverse {\n    flex-direction: column-reverse !important;\n}\n.flex-lg-wrap {\n    flex-wrap: wrap !important;\n}\n.flex-lg-nowrap {\n    flex-wrap: nowrap !important;\n}\n.flex-lg-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n}\n.flex-lg-fill {\n    flex: 1 1 auto !important;\n}\n.flex-lg-grow-0 {\n    flex-grow: 0 !important;\n}\n.flex-lg-grow-1 {\n    flex-grow: 1 !important;\n}\n.flex-lg-shrink-0 {\n    flex-shrink: 0 !important;\n}\n.flex-lg-shrink-1 {\n    flex-shrink: 1 !important;\n}\n.justify-content-lg-start {\n    justify-content: flex-start !important;\n}\n.justify-content-lg-end {\n    justify-content: flex-end !important;\n}\n.justify-content-lg-center {\n    justify-content: center !important;\n}\n.justify-content-lg-between {\n    justify-content: space-between !important;\n}\n.justify-content-lg-around {\n    justify-content: space-around !important;\n}\n.align-items-lg-start {\n    align-items: flex-start !important;\n}\n.align-items-lg-end {\n    align-items: flex-end !important;\n}\n.align-items-lg-center {\n    align-items: center !important;\n}\n.align-items-lg-baseline {\n    align-items: baseline !important;\n}\n.align-items-lg-stretch {\n    align-items: stretch !important;\n}\n.align-content-lg-start {\n    align-content: flex-start !important;\n}\n.align-content-lg-end {\n    align-content: flex-end !important;\n}\n.align-content-lg-center {\n    align-content: center !important;\n}\n.align-content-lg-between {\n    align-content: space-between !important;\n}\n.align-content-lg-around {\n    align-content: space-around !important;\n}\n.align-content-lg-stretch {\n    align-content: stretch !important;\n}\n.align-self-lg-auto {\n    align-self: auto !important;\n}\n.align-self-lg-start {\n    align-self: flex-start !important;\n}\n.align-self-lg-end {\n    align-self: flex-end !important;\n}\n.align-self-lg-center {\n    align-self: center !important;\n}\n.align-self-lg-baseline {\n    align-self: baseline !important;\n}\n.align-self-lg-stretch {\n    align-self: stretch !important;\n}\n}\n@media (min-width: 1200px) {\n.flex-xl-row {\n    flex-direction: row !important;\n}\n.flex-xl-column {\n    flex-direction: column !important;\n}\n.flex-xl-row-reverse {\n    flex-direction: row-reverse !important;\n}\n.flex-xl-column-reverse {\n    flex-direction: column-reverse !important;\n}\n.flex-xl-wrap {\n    flex-wrap: wrap !important;\n}\n.flex-xl-nowrap {\n    flex-wrap: nowrap !important;\n}\n.flex-xl-wrap-reverse {\n    flex-wrap: wrap-reverse !important;\n}\n.flex-xl-fill {\n    flex: 1 1 auto !important;\n}\n.flex-xl-grow-0 {\n    flex-grow: 0 !important;\n}\n.flex-xl-grow-1 {\n    flex-grow: 1 !important;\n}\n.flex-xl-shrink-0 {\n    flex-shrink: 0 !important;\n}\n.flex-xl-shrink-1 {\n    flex-shrink: 1 !important;\n}\n.justify-content-xl-start {\n    justify-content: flex-start !important;\n}\n.justify-content-xl-end {\n    justify-content: flex-end !important;\n}\n.justify-content-xl-center {\n    justify-content: center !important;\n}\n.justify-content-xl-between {\n    justify-content: space-between !important;\n}\n.justify-content-xl-around {\n    justify-content: space-around !important;\n}\n.align-items-xl-start {\n    align-items: flex-start !important;\n}\n.align-items-xl-end {\n    align-items: flex-end !important;\n}\n.align-items-xl-center {\n    align-items: center !important;\n}\n.align-items-xl-baseline {\n    align-items: baseline !important;\n}\n.align-items-xl-stretch {\n    align-items: stretch !important;\n}\n.align-content-xl-start {\n    align-content: flex-start !important;\n}\n.align-content-xl-end {\n    align-content: flex-end !important;\n}\n.align-content-xl-center {\n    align-content: center !important;\n}\n.align-content-xl-between {\n    align-content: space-between !important;\n}\n.align-content-xl-around {\n    align-content: space-around !important;\n}\n.align-content-xl-stretch {\n    align-content: stretch !important;\n}\n.align-self-xl-auto {\n    align-self: auto !important;\n}\n.align-self-xl-start {\n    align-self: flex-start !important;\n}\n.align-self-xl-end {\n    align-self: flex-end !important;\n}\n.align-self-xl-center {\n    align-self: center !important;\n}\n.align-self-xl-baseline {\n    align-self: baseline !important;\n}\n.align-self-xl-stretch {\n    align-self: stretch !important;\n}\n}\n.float-left {\n  float: left !important;\n}\n.float-right {\n  float: right !important;\n}\n.float-none {\n  float: none !important;\n}\n@media (min-width: 576px) {\n.float-sm-left {\n    float: left !important;\n}\n.float-sm-right {\n    float: right !important;\n}\n.float-sm-none {\n    float: none !important;\n}\n}\n@media (min-width: 768px) {\n.float-md-left {\n    float: left !important;\n}\n.float-md-right {\n    float: right !important;\n}\n.float-md-none {\n    float: none !important;\n}\n}\n@media (min-width: 992px) {\n.float-lg-left {\n    float: left !important;\n}\n.float-lg-right {\n    float: right !important;\n}\n.float-lg-none {\n    float: none !important;\n}\n}\n@media (min-width: 1200px) {\n.float-xl-left {\n    float: left !important;\n}\n.float-xl-right {\n    float: right !important;\n}\n.float-xl-none {\n    float: none !important;\n}\n}\n.overflow-auto {\n  overflow: auto !important;\n}\n.overflow-hidden {\n  overflow: hidden !important;\n}\n.position-static {\n  position: static !important;\n}\n.position-relative {\n  position: relative !important;\n}\n.position-absolute {\n  position: absolute !important;\n}\n.position-fixed {\n  position: fixed !important;\n}\n.position-sticky {\n  position: sticky !important;\n}\n.fixed-top {\n  position: fixed;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 1030;\n}\n.fixed-bottom {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1030;\n}\n@supports (position: sticky) {\n.sticky-top {\n    position: sticky;\n    top: 0;\n    z-index: 1020;\n}\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  overflow: visible;\n  clip: auto;\n  white-space: normal;\n}\n.shadow-sm {\n  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;\n}\n.shadow {\n  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;\n}\n.shadow-lg {\n  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;\n}\n.shadow-none {\n  box-shadow: none !important;\n}\n.w-25 {\n  width: 25% !important;\n}\n.w-50 {\n  width: 50% !important;\n}\n.w-75 {\n  width: 75% !important;\n}\n.w-100 {\n  width: 100% !important;\n}\n.w-auto {\n  width: auto !important;\n}\n.h-25 {\n  height: 25% !important;\n}\n.h-50 {\n  height: 50% !important;\n}\n.h-75 {\n  height: 75% !important;\n}\n.h-100 {\n  height: 100% !important;\n}\n.h-auto {\n  height: auto !important;\n}\n.mw-100 {\n  max-width: 100% !important;\n}\n.mh-100 {\n  max-height: 100% !important;\n}\n.min-vw-100 {\n  min-width: 100vw !important;\n}\n.min-vh-100 {\n  min-height: 100vh !important;\n}\n.vw-100 {\n  width: 100vw !important;\n}\n.vh-100 {\n  height: 100vh !important;\n}\n.stretched-link::after {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1;\n  pointer-events: auto;\n  content: \"\";\n  background-color: rgba(0, 0, 0, 0);\n}\n.m-0 {\n  margin: 0 !important;\n}\n.mt-0,\n.my-0 {\n  margin-top: 0 !important;\n}\n.mr-0,\n.mx-0 {\n  margin-right: 0 !important;\n}\n.mb-0,\n.my-0 {\n  margin-bottom: 0 !important;\n}\n.ml-0,\n.mx-0 {\n  margin-left: 0 !important;\n}\n.m-1 {\n  margin: 0.25rem !important;\n}\n.mt-1,\n.my-1 {\n  margin-top: 0.25rem !important;\n}\n.mr-1,\n.mx-1 {\n  margin-right: 0.25rem !important;\n}\n.mb-1,\n.my-1 {\n  margin-bottom: 0.25rem !important;\n}\n.ml-1,\n.mx-1 {\n  margin-left: 0.25rem !important;\n}\n.m-2 {\n  margin: 0.5rem !important;\n}\n.mt-2,\n.my-2 {\n  margin-top: 0.5rem !important;\n}\n.mr-2,\n.mx-2 {\n  margin-right: 0.5rem !important;\n}\n.mb-2,\n.my-2 {\n  margin-bottom: 0.5rem !important;\n}\n.ml-2,\n.mx-2 {\n  margin-left: 0.5rem !important;\n}\n.m-3 {\n  margin: 1rem !important;\n}\n.mt-3,\n.my-3 {\n  margin-top: 1rem !important;\n}\n.mr-3,\n.mx-3 {\n  margin-right: 1rem !important;\n}\n.mb-3,\n.my-3 {\n  margin-bottom: 1rem !important;\n}\n.ml-3,\n.mx-3 {\n  margin-left: 1rem !important;\n}\n.m-4 {\n  margin: 1.5rem !important;\n}\n.mt-4,\n.my-4 {\n  margin-top: 1.5rem !important;\n}\n.mr-4,\n.mx-4 {\n  margin-right: 1.5rem !important;\n}\n.mb-4,\n.my-4 {\n  margin-bottom: 1.5rem !important;\n}\n.ml-4,\n.mx-4 {\n  margin-left: 1.5rem !important;\n}\n.m-5 {\n  margin: 3rem !important;\n}\n.mt-5,\n.my-5 {\n  margin-top: 3rem !important;\n}\n.mr-5,\n.mx-5 {\n  margin-right: 3rem !important;\n}\n.mb-5,\n.my-5 {\n  margin-bottom: 3rem !important;\n}\n.ml-5,\n.mx-5 {\n  margin-left: 3rem !important;\n}\n.p-0 {\n  padding: 0 !important;\n}\n.pt-0,\n.py-0 {\n  padding-top: 0 !important;\n}\n.pr-0,\n.px-0 {\n  padding-right: 0 !important;\n}\n.pb-0,\n.py-0 {\n  padding-bottom: 0 !important;\n}\n.pl-0,\n.px-0 {\n  padding-left: 0 !important;\n}\n.p-1 {\n  padding: 0.25rem !important;\n}\n.pt-1,\n.py-1 {\n  padding-top: 0.25rem !important;\n}\n.pr-1,\n.px-1 {\n  padding-right: 0.25rem !important;\n}\n.pb-1,\n.py-1 {\n  padding-bottom: 0.25rem !important;\n}\n.pl-1,\n.px-1 {\n  padding-left: 0.25rem !important;\n}\n.p-2 {\n  padding: 0.5rem !important;\n}\n.pt-2,\n.py-2 {\n  padding-top: 0.5rem !important;\n}\n.pr-2,\n.px-2 {\n  padding-right: 0.5rem !important;\n}\n.pb-2,\n.py-2 {\n  padding-bottom: 0.5rem !important;\n}\n.pl-2,\n.px-2 {\n  padding-left: 0.5rem !important;\n}\n.p-3 {\n  padding: 1rem !important;\n}\n.pt-3,\n.py-3 {\n  padding-top: 1rem !important;\n}\n.pr-3,\n.px-3 {\n  padding-right: 1rem !important;\n}\n.pb-3,\n.py-3 {\n  padding-bottom: 1rem !important;\n}\n.pl-3,\n.px-3 {\n  padding-left: 1rem !important;\n}\n.p-4 {\n  padding: 1.5rem !important;\n}\n.pt-4,\n.py-4 {\n  padding-top: 1.5rem !important;\n}\n.pr-4,\n.px-4 {\n  padding-right: 1.5rem !important;\n}\n.pb-4,\n.py-4 {\n  padding-bottom: 1.5rem !important;\n}\n.pl-4,\n.px-4 {\n  padding-left: 1.5rem !important;\n}\n.p-5 {\n  padding: 3rem !important;\n}\n.pt-5,\n.py-5 {\n  padding-top: 3rem !important;\n}\n.pr-5,\n.px-5 {\n  padding-right: 3rem !important;\n}\n.pb-5,\n.py-5 {\n  padding-bottom: 3rem !important;\n}\n.pl-5,\n.px-5 {\n  padding-left: 3rem !important;\n}\n.m-n1 {\n  margin: -0.25rem !important;\n}\n.mt-n1,\n.my-n1 {\n  margin-top: -0.25rem !important;\n}\n.mr-n1,\n.mx-n1 {\n  margin-right: -0.25rem !important;\n}\n.mb-n1,\n.my-n1 {\n  margin-bottom: -0.25rem !important;\n}\n.ml-n1,\n.mx-n1 {\n  margin-left: -0.25rem !important;\n}\n.m-n2 {\n  margin: -0.5rem !important;\n}\n.mt-n2,\n.my-n2 {\n  margin-top: -0.5rem !important;\n}\n.mr-n2,\n.mx-n2 {\n  margin-right: -0.5rem !important;\n}\n.mb-n2,\n.my-n2 {\n  margin-bottom: -0.5rem !important;\n}\n.ml-n2,\n.mx-n2 {\n  margin-left: -0.5rem !important;\n}\n.m-n3 {\n  margin: -1rem !important;\n}\n.mt-n3,\n.my-n3 {\n  margin-top: -1rem !important;\n}\n.mr-n3,\n.mx-n3 {\n  margin-right: -1rem !important;\n}\n.mb-n3,\n.my-n3 {\n  margin-bottom: -1rem !important;\n}\n.ml-n3,\n.mx-n3 {\n  margin-left: -1rem !important;\n}\n.m-n4 {\n  margin: -1.5rem !important;\n}\n.mt-n4,\n.my-n4 {\n  margin-top: -1.5rem !important;\n}\n.mr-n4,\n.mx-n4 {\n  margin-right: -1.5rem !important;\n}\n.mb-n4,\n.my-n4 {\n  margin-bottom: -1.5rem !important;\n}\n.ml-n4,\n.mx-n4 {\n  margin-left: -1.5rem !important;\n}\n.m-n5 {\n  margin: -3rem !important;\n}\n.mt-n5,\n.my-n5 {\n  margin-top: -3rem !important;\n}\n.mr-n5,\n.mx-n5 {\n  margin-right: -3rem !important;\n}\n.mb-n5,\n.my-n5 {\n  margin-bottom: -3rem !important;\n}\n.ml-n5,\n.mx-n5 {\n  margin-left: -3rem !important;\n}\n.m-auto {\n  margin: auto !important;\n}\n.mt-auto,\n.my-auto {\n  margin-top: auto !important;\n}\n.mr-auto,\n.mx-auto {\n  margin-right: auto !important;\n}\n.mb-auto,\n.my-auto {\n  margin-bottom: auto !important;\n}\n.ml-auto,\n.mx-auto {\n  margin-left: auto !important;\n}\n@media (min-width: 576px) {\n.m-sm-0 {\n    margin: 0 !important;\n}\n.mt-sm-0,\n  .my-sm-0 {\n    margin-top: 0 !important;\n}\n.mr-sm-0,\n  .mx-sm-0 {\n    margin-right: 0 !important;\n}\n.mb-sm-0,\n  .my-sm-0 {\n    margin-bottom: 0 !important;\n}\n.ml-sm-0,\n  .mx-sm-0 {\n    margin-left: 0 !important;\n}\n.m-sm-1 {\n    margin: 0.25rem !important;\n}\n.mt-sm-1,\n  .my-sm-1 {\n    margin-top: 0.25rem !important;\n}\n.mr-sm-1,\n  .mx-sm-1 {\n    margin-right: 0.25rem !important;\n}\n.mb-sm-1,\n  .my-sm-1 {\n    margin-bottom: 0.25rem !important;\n}\n.ml-sm-1,\n  .mx-sm-1 {\n    margin-left: 0.25rem !important;\n}\n.m-sm-2 {\n    margin: 0.5rem !important;\n}\n.mt-sm-2,\n  .my-sm-2 {\n    margin-top: 0.5rem !important;\n}\n.mr-sm-2,\n  .mx-sm-2 {\n    margin-right: 0.5rem !important;\n}\n.mb-sm-2,\n  .my-sm-2 {\n    margin-bottom: 0.5rem !important;\n}\n.ml-sm-2,\n  .mx-sm-2 {\n    margin-left: 0.5rem !important;\n}\n.m-sm-3 {\n    margin: 1rem !important;\n}\n.mt-sm-3,\n  .my-sm-3 {\n    margin-top: 1rem !important;\n}\n.mr-sm-3,\n  .mx-sm-3 {\n    margin-right: 1rem !important;\n}\n.mb-sm-3,\n  .my-sm-3 {\n    margin-bottom: 1rem !important;\n}\n.ml-sm-3,\n  .mx-sm-3 {\n    margin-left: 1rem !important;\n}\n.m-sm-4 {\n    margin: 1.5rem !important;\n}\n.mt-sm-4,\n  .my-sm-4 {\n    margin-top: 1.5rem !important;\n}\n.mr-sm-4,\n  .mx-sm-4 {\n    margin-right: 1.5rem !important;\n}\n.mb-sm-4,\n  .my-sm-4 {\n    margin-bottom: 1.5rem !important;\n}\n.ml-sm-4,\n  .mx-sm-4 {\n    margin-left: 1.5rem !important;\n}\n.m-sm-5 {\n    margin: 3rem !important;\n}\n.mt-sm-5,\n  .my-sm-5 {\n    margin-top: 3rem !important;\n}\n.mr-sm-5,\n  .mx-sm-5 {\n    margin-right: 3rem !important;\n}\n.mb-sm-5,\n  .my-sm-5 {\n    margin-bottom: 3rem !important;\n}\n.ml-sm-5,\n  .mx-sm-5 {\n    margin-left: 3rem !important;\n}\n.p-sm-0 {\n    padding: 0 !important;\n}\n.pt-sm-0,\n  .py-sm-0 {\n    padding-top: 0 !important;\n}\n.pr-sm-0,\n  .px-sm-0 {\n    padding-right: 0 !important;\n}\n.pb-sm-0,\n  .py-sm-0 {\n    padding-bottom: 0 !important;\n}\n.pl-sm-0,\n  .px-sm-0 {\n    padding-left: 0 !important;\n}\n.p-sm-1 {\n    padding: 0.25rem !important;\n}\n.pt-sm-1,\n  .py-sm-1 {\n    padding-top: 0.25rem !important;\n}\n.pr-sm-1,\n  .px-sm-1 {\n    padding-right: 0.25rem !important;\n}\n.pb-sm-1,\n  .py-sm-1 {\n    padding-bottom: 0.25rem !important;\n}\n.pl-sm-1,\n  .px-sm-1 {\n    padding-left: 0.25rem !important;\n}\n.p-sm-2 {\n    padding: 0.5rem !important;\n}\n.pt-sm-2,\n  .py-sm-2 {\n    padding-top: 0.5rem !important;\n}\n.pr-sm-2,\n  .px-sm-2 {\n    padding-right: 0.5rem !important;\n}\n.pb-sm-2,\n  .py-sm-2 {\n    padding-bottom: 0.5rem !important;\n}\n.pl-sm-2,\n  .px-sm-2 {\n    padding-left: 0.5rem !important;\n}\n.p-sm-3 {\n    padding: 1rem !important;\n}\n.pt-sm-3,\n  .py-sm-3 {\n    padding-top: 1rem !important;\n}\n.pr-sm-3,\n  .px-sm-3 {\n    padding-right: 1rem !important;\n}\n.pb-sm-3,\n  .py-sm-3 {\n    padding-bottom: 1rem !important;\n}\n.pl-sm-3,\n  .px-sm-3 {\n    padding-left: 1rem !important;\n}\n.p-sm-4 {\n    padding: 1.5rem !important;\n}\n.pt-sm-4,\n  .py-sm-4 {\n    padding-top: 1.5rem !important;\n}\n.pr-sm-4,\n  .px-sm-4 {\n    padding-right: 1.5rem !important;\n}\n.pb-sm-4,\n  .py-sm-4 {\n    padding-bottom: 1.5rem !important;\n}\n.pl-sm-4,\n  .px-sm-4 {\n    padding-left: 1.5rem !important;\n}\n.p-sm-5 {\n    padding: 3rem !important;\n}\n.pt-sm-5,\n  .py-sm-5 {\n    padding-top: 3rem !important;\n}\n.pr-sm-5,\n  .px-sm-5 {\n    padding-right: 3rem !important;\n}\n.pb-sm-5,\n  .py-sm-5 {\n    padding-bottom: 3rem !important;\n}\n.pl-sm-5,\n  .px-sm-5 {\n    padding-left: 3rem !important;\n}\n.m-sm-n1 {\n    margin: -0.25rem !important;\n}\n.mt-sm-n1,\n  .my-sm-n1 {\n    margin-top: -0.25rem !important;\n}\n.mr-sm-n1,\n  .mx-sm-n1 {\n    margin-right: -0.25rem !important;\n}\n.mb-sm-n1,\n  .my-sm-n1 {\n    margin-bottom: -0.25rem !important;\n}\n.ml-sm-n1,\n  .mx-sm-n1 {\n    margin-left: -0.25rem !important;\n}\n.m-sm-n2 {\n    margin: -0.5rem !important;\n}\n.mt-sm-n2,\n  .my-sm-n2 {\n    margin-top: -0.5rem !important;\n}\n.mr-sm-n2,\n  .mx-sm-n2 {\n    margin-right: -0.5rem !important;\n}\n.mb-sm-n2,\n  .my-sm-n2 {\n    margin-bottom: -0.5rem !important;\n}\n.ml-sm-n2,\n  .mx-sm-n2 {\n    margin-left: -0.5rem !important;\n}\n.m-sm-n3 {\n    margin: -1rem !important;\n}\n.mt-sm-n3,\n  .my-sm-n3 {\n    margin-top: -1rem !important;\n}\n.mr-sm-n3,\n  .mx-sm-n3 {\n    margin-right: -1rem !important;\n}\n.mb-sm-n3,\n  .my-sm-n3 {\n    margin-bottom: -1rem !important;\n}\n.ml-sm-n3,\n  .mx-sm-n3 {\n    margin-left: -1rem !important;\n}\n.m-sm-n4 {\n    margin: -1.5rem !important;\n}\n.mt-sm-n4,\n  .my-sm-n4 {\n    margin-top: -1.5rem !important;\n}\n.mr-sm-n4,\n  .mx-sm-n4 {\n    margin-right: -1.5rem !important;\n}\n.mb-sm-n4,\n  .my-sm-n4 {\n    margin-bottom: -1.5rem !important;\n}\n.ml-sm-n4,\n  .mx-sm-n4 {\n    margin-left: -1.5rem !important;\n}\n.m-sm-n5 {\n    margin: -3rem !important;\n}\n.mt-sm-n5,\n  .my-sm-n5 {\n    margin-top: -3rem !important;\n}\n.mr-sm-n5,\n  .mx-sm-n5 {\n    margin-right: -3rem !important;\n}\n.mb-sm-n5,\n  .my-sm-n5 {\n    margin-bottom: -3rem !important;\n}\n.ml-sm-n5,\n  .mx-sm-n5 {\n    margin-left: -3rem !important;\n}\n.m-sm-auto {\n    margin: auto !important;\n}\n.mt-sm-auto,\n  .my-sm-auto {\n    margin-top: auto !important;\n}\n.mr-sm-auto,\n  .mx-sm-auto {\n    margin-right: auto !important;\n}\n.mb-sm-auto,\n  .my-sm-auto {\n    margin-bottom: auto !important;\n}\n.ml-sm-auto,\n  .mx-sm-auto {\n    margin-left: auto !important;\n}\n}\n@media (min-width: 768px) {\n.m-md-0 {\n    margin: 0 !important;\n}\n.mt-md-0,\n  .my-md-0 {\n    margin-top: 0 !important;\n}\n.mr-md-0,\n  .mx-md-0 {\n    margin-right: 0 !important;\n}\n.mb-md-0,\n  .my-md-0 {\n    margin-bottom: 0 !important;\n}\n.ml-md-0,\n  .mx-md-0 {\n    margin-left: 0 !important;\n}\n.m-md-1 {\n    margin: 0.25rem !important;\n}\n.mt-md-1,\n  .my-md-1 {\n    margin-top: 0.25rem !important;\n}\n.mr-md-1,\n  .mx-md-1 {\n    margin-right: 0.25rem !important;\n}\n.mb-md-1,\n  .my-md-1 {\n    margin-bottom: 0.25rem !important;\n}\n.ml-md-1,\n  .mx-md-1 {\n    margin-left: 0.25rem !important;\n}\n.m-md-2 {\n    margin: 0.5rem !important;\n}\n.mt-md-2,\n  .my-md-2 {\n    margin-top: 0.5rem !important;\n}\n.mr-md-2,\n  .mx-md-2 {\n    margin-right: 0.5rem !important;\n}\n.mb-md-2,\n  .my-md-2 {\n    margin-bottom: 0.5rem !important;\n}\n.ml-md-2,\n  .mx-md-2 {\n    margin-left: 0.5rem !important;\n}\n.m-md-3 {\n    margin: 1rem !important;\n}\n.mt-md-3,\n  .my-md-3 {\n    margin-top: 1rem !important;\n}\n.mr-md-3,\n  .mx-md-3 {\n    margin-right: 1rem !important;\n}\n.mb-md-3,\n  .my-md-3 {\n    margin-bottom: 1rem !important;\n}\n.ml-md-3,\n  .mx-md-3 {\n    margin-left: 1rem !important;\n}\n.m-md-4 {\n    margin: 1.5rem !important;\n}\n.mt-md-4,\n  .my-md-4 {\n    margin-top: 1.5rem !important;\n}\n.mr-md-4,\n  .mx-md-4 {\n    margin-right: 1.5rem !important;\n}\n.mb-md-4,\n  .my-md-4 {\n    margin-bottom: 1.5rem !important;\n}\n.ml-md-4,\n  .mx-md-4 {\n    margin-left: 1.5rem !important;\n}\n.m-md-5 {\n    margin: 3rem !important;\n}\n.mt-md-5,\n  .my-md-5 {\n    margin-top: 3rem !important;\n}\n.mr-md-5,\n  .mx-md-5 {\n    margin-right: 3rem !important;\n}\n.mb-md-5,\n  .my-md-5 {\n    margin-bottom: 3rem !important;\n}\n.ml-md-5,\n  .mx-md-5 {\n    margin-left: 3rem !important;\n}\n.p-md-0 {\n    padding: 0 !important;\n}\n.pt-md-0,\n  .py-md-0 {\n    padding-top: 0 !important;\n}\n.pr-md-0,\n  .px-md-0 {\n    padding-right: 0 !important;\n}\n.pb-md-0,\n  .py-md-0 {\n    padding-bottom: 0 !important;\n}\n.pl-md-0,\n  .px-md-0 {\n    padding-left: 0 !important;\n}\n.p-md-1 {\n    padding: 0.25rem !important;\n}\n.pt-md-1,\n  .py-md-1 {\n    padding-top: 0.25rem !important;\n}\n.pr-md-1,\n  .px-md-1 {\n    padding-right: 0.25rem !important;\n}\n.pb-md-1,\n  .py-md-1 {\n    padding-bottom: 0.25rem !important;\n}\n.pl-md-1,\n  .px-md-1 {\n    padding-left: 0.25rem !important;\n}\n.p-md-2 {\n    padding: 0.5rem !important;\n}\n.pt-md-2,\n  .py-md-2 {\n    padding-top: 0.5rem !important;\n}\n.pr-md-2,\n  .px-md-2 {\n    padding-right: 0.5rem !important;\n}\n.pb-md-2,\n  .py-md-2 {\n    padding-bottom: 0.5rem !important;\n}\n.pl-md-2,\n  .px-md-2 {\n    padding-left: 0.5rem !important;\n}\n.p-md-3 {\n    padding: 1rem !important;\n}\n.pt-md-3,\n  .py-md-3 {\n    padding-top: 1rem !important;\n}\n.pr-md-3,\n  .px-md-3 {\n    padding-right: 1rem !important;\n}\n.pb-md-3,\n  .py-md-3 {\n    padding-bottom: 1rem !important;\n}\n.pl-md-3,\n  .px-md-3 {\n    padding-left: 1rem !important;\n}\n.p-md-4 {\n    padding: 1.5rem !important;\n}\n.pt-md-4,\n  .py-md-4 {\n    padding-top: 1.5rem !important;\n}\n.pr-md-4,\n  .px-md-4 {\n    padding-right: 1.5rem !important;\n}\n.pb-md-4,\n  .py-md-4 {\n    padding-bottom: 1.5rem !important;\n}\n.pl-md-4,\n  .px-md-4 {\n    padding-left: 1.5rem !important;\n}\n.p-md-5 {\n    padding: 3rem !important;\n}\n.pt-md-5,\n  .py-md-5 {\n    padding-top: 3rem !important;\n}\n.pr-md-5,\n  .px-md-5 {\n    padding-right: 3rem !important;\n}\n.pb-md-5,\n  .py-md-5 {\n    padding-bottom: 3rem !important;\n}\n.pl-md-5,\n  .px-md-5 {\n    padding-left: 3rem !important;\n}\n.m-md-n1 {\n    margin: -0.25rem !important;\n}\n.mt-md-n1,\n  .my-md-n1 {\n    margin-top: -0.25rem !important;\n}\n.mr-md-n1,\n  .mx-md-n1 {\n    margin-right: -0.25rem !important;\n}\n.mb-md-n1,\n  .my-md-n1 {\n    margin-bottom: -0.25rem !important;\n}\n.ml-md-n1,\n  .mx-md-n1 {\n    margin-left: -0.25rem !important;\n}\n.m-md-n2 {\n    margin: -0.5rem !important;\n}\n.mt-md-n2,\n  .my-md-n2 {\n    margin-top: -0.5rem !important;\n}\n.mr-md-n2,\n  .mx-md-n2 {\n    margin-right: -0.5rem !important;\n}\n.mb-md-n2,\n  .my-md-n2 {\n    margin-bottom: -0.5rem !important;\n}\n.ml-md-n2,\n  .mx-md-n2 {\n    margin-left: -0.5rem !important;\n}\n.m-md-n3 {\n    margin: -1rem !important;\n}\n.mt-md-n3,\n  .my-md-n3 {\n    margin-top: -1rem !important;\n}\n.mr-md-n3,\n  .mx-md-n3 {\n    margin-right: -1rem !important;\n}\n.mb-md-n3,\n  .my-md-n3 {\n    margin-bottom: -1rem !important;\n}\n.ml-md-n3,\n  .mx-md-n3 {\n    margin-left: -1rem !important;\n}\n.m-md-n4 {\n    margin: -1.5rem !important;\n}\n.mt-md-n4,\n  .my-md-n4 {\n    margin-top: -1.5rem !important;\n}\n.mr-md-n4,\n  .mx-md-n4 {\n    margin-right: -1.5rem !important;\n}\n.mb-md-n4,\n  .my-md-n4 {\n    margin-bottom: -1.5rem !important;\n}\n.ml-md-n4,\n  .mx-md-n4 {\n    margin-left: -1.5rem !important;\n}\n.m-md-n5 {\n    margin: -3rem !important;\n}\n.mt-md-n5,\n  .my-md-n5 {\n    margin-top: -3rem !important;\n}\n.mr-md-n5,\n  .mx-md-n5 {\n    margin-right: -3rem !important;\n}\n.mb-md-n5,\n  .my-md-n5 {\n    margin-bottom: -3rem !important;\n}\n.ml-md-n5,\n  .mx-md-n5 {\n    margin-left: -3rem !important;\n}\n.m-md-auto {\n    margin: auto !important;\n}\n.mt-md-auto,\n  .my-md-auto {\n    margin-top: auto !important;\n}\n.mr-md-auto,\n  .mx-md-auto {\n    margin-right: auto !important;\n}\n.mb-md-auto,\n  .my-md-auto {\n    margin-bottom: auto !important;\n}\n.ml-md-auto,\n  .mx-md-auto {\n    margin-left: auto !important;\n}\n}\n@media (min-width: 992px) {\n.m-lg-0 {\n    margin: 0 !important;\n}\n.mt-lg-0,\n  .my-lg-0 {\n    margin-top: 0 !important;\n}\n.mr-lg-0,\n  .mx-lg-0 {\n    margin-right: 0 !important;\n}\n.mb-lg-0,\n  .my-lg-0 {\n    margin-bottom: 0 !important;\n}\n.ml-lg-0,\n  .mx-lg-0 {\n    margin-left: 0 !important;\n}\n.m-lg-1 {\n    margin: 0.25rem !important;\n}\n.mt-lg-1,\n  .my-lg-1 {\n    margin-top: 0.25rem !important;\n}\n.mr-lg-1,\n  .mx-lg-1 {\n    margin-right: 0.25rem !important;\n}\n.mb-lg-1,\n  .my-lg-1 {\n    margin-bottom: 0.25rem !important;\n}\n.ml-lg-1,\n  .mx-lg-1 {\n    margin-left: 0.25rem !important;\n}\n.m-lg-2 {\n    margin: 0.5rem !important;\n}\n.mt-lg-2,\n  .my-lg-2 {\n    margin-top: 0.5rem !important;\n}\n.mr-lg-2,\n  .mx-lg-2 {\n    margin-right: 0.5rem !important;\n}\n.mb-lg-2,\n  .my-lg-2 {\n    margin-bottom: 0.5rem !important;\n}\n.ml-lg-2,\n  .mx-lg-2 {\n    margin-left: 0.5rem !important;\n}\n.m-lg-3 {\n    margin: 1rem !important;\n}\n.mt-lg-3,\n  .my-lg-3 {\n    margin-top: 1rem !important;\n}\n.mr-lg-3,\n  .mx-lg-3 {\n    margin-right: 1rem !important;\n}\n.mb-lg-3,\n  .my-lg-3 {\n    margin-bottom: 1rem !important;\n}\n.ml-lg-3,\n  .mx-lg-3 {\n    margin-left: 1rem !important;\n}\n.m-lg-4 {\n    margin: 1.5rem !important;\n}\n.mt-lg-4,\n  .my-lg-4 {\n    margin-top: 1.5rem !important;\n}\n.mr-lg-4,\n  .mx-lg-4 {\n    margin-right: 1.5rem !important;\n}\n.mb-lg-4,\n  .my-lg-4 {\n    margin-bottom: 1.5rem !important;\n}\n.ml-lg-4,\n  .mx-lg-4 {\n    margin-left: 1.5rem !important;\n}\n.m-lg-5 {\n    margin: 3rem !important;\n}\n.mt-lg-5,\n  .my-lg-5 {\n    margin-top: 3rem !important;\n}\n.mr-lg-5,\n  .mx-lg-5 {\n    margin-right: 3rem !important;\n}\n.mb-lg-5,\n  .my-lg-5 {\n    margin-bottom: 3rem !important;\n}\n.ml-lg-5,\n  .mx-lg-5 {\n    margin-left: 3rem !important;\n}\n.p-lg-0 {\n    padding: 0 !important;\n}\n.pt-lg-0,\n  .py-lg-0 {\n    padding-top: 0 !important;\n}\n.pr-lg-0,\n  .px-lg-0 {\n    padding-right: 0 !important;\n}\n.pb-lg-0,\n  .py-lg-0 {\n    padding-bottom: 0 !important;\n}\n.pl-lg-0,\n  .px-lg-0 {\n    padding-left: 0 !important;\n}\n.p-lg-1 {\n    padding: 0.25rem !important;\n}\n.pt-lg-1,\n  .py-lg-1 {\n    padding-top: 0.25rem !important;\n}\n.pr-lg-1,\n  .px-lg-1 {\n    padding-right: 0.25rem !important;\n}\n.pb-lg-1,\n  .py-lg-1 {\n    padding-bottom: 0.25rem !important;\n}\n.pl-lg-1,\n  .px-lg-1 {\n    padding-left: 0.25rem !important;\n}\n.p-lg-2 {\n    padding: 0.5rem !important;\n}\n.pt-lg-2,\n  .py-lg-2 {\n    padding-top: 0.5rem !important;\n}\n.pr-lg-2,\n  .px-lg-2 {\n    padding-right: 0.5rem !important;\n}\n.pb-lg-2,\n  .py-lg-2 {\n    padding-bottom: 0.5rem !important;\n}\n.pl-lg-2,\n  .px-lg-2 {\n    padding-left: 0.5rem !important;\n}\n.p-lg-3 {\n    padding: 1rem !important;\n}\n.pt-lg-3,\n  .py-lg-3 {\n    padding-top: 1rem !important;\n}\n.pr-lg-3,\n  .px-lg-3 {\n    padding-right: 1rem !important;\n}\n.pb-lg-3,\n  .py-lg-3 {\n    padding-bottom: 1rem !important;\n}\n.pl-lg-3,\n  .px-lg-3 {\n    padding-left: 1rem !important;\n}\n.p-lg-4 {\n    padding: 1.5rem !important;\n}\n.pt-lg-4,\n  .py-lg-4 {\n    padding-top: 1.5rem !important;\n}\n.pr-lg-4,\n  .px-lg-4 {\n    padding-right: 1.5rem !important;\n}\n.pb-lg-4,\n  .py-lg-4 {\n    padding-bottom: 1.5rem !important;\n}\n.pl-lg-4,\n  .px-lg-4 {\n    padding-left: 1.5rem !important;\n}\n.p-lg-5 {\n    padding: 3rem !important;\n}\n.pt-lg-5,\n  .py-lg-5 {\n    padding-top: 3rem !important;\n}\n.pr-lg-5,\n  .px-lg-5 {\n    padding-right: 3rem !important;\n}\n.pb-lg-5,\n  .py-lg-5 {\n    padding-bottom: 3rem !important;\n}\n.pl-lg-5,\n  .px-lg-5 {\n    padding-left: 3rem !important;\n}\n.m-lg-n1 {\n    margin: -0.25rem !important;\n}\n.mt-lg-n1,\n  .my-lg-n1 {\n    margin-top: -0.25rem !important;\n}\n.mr-lg-n1,\n  .mx-lg-n1 {\n    margin-right: -0.25rem !important;\n}\n.mb-lg-n1,\n  .my-lg-n1 {\n    margin-bottom: -0.25rem !important;\n}\n.ml-lg-n1,\n  .mx-lg-n1 {\n    margin-left: -0.25rem !important;\n}\n.m-lg-n2 {\n    margin: -0.5rem !important;\n}\n.mt-lg-n2,\n  .my-lg-n2 {\n    margin-top: -0.5rem !important;\n}\n.mr-lg-n2,\n  .mx-lg-n2 {\n    margin-right: -0.5rem !important;\n}\n.mb-lg-n2,\n  .my-lg-n2 {\n    margin-bottom: -0.5rem !important;\n}\n.ml-lg-n2,\n  .mx-lg-n2 {\n    margin-left: -0.5rem !important;\n}\n.m-lg-n3 {\n    margin: -1rem !important;\n}\n.mt-lg-n3,\n  .my-lg-n3 {\n    margin-top: -1rem !important;\n}\n.mr-lg-n3,\n  .mx-lg-n3 {\n    margin-right: -1rem !important;\n}\n.mb-lg-n3,\n  .my-lg-n3 {\n    margin-bottom: -1rem !important;\n}\n.ml-lg-n3,\n  .mx-lg-n3 {\n    margin-left: -1rem !important;\n}\n.m-lg-n4 {\n    margin: -1.5rem !important;\n}\n.mt-lg-n4,\n  .my-lg-n4 {\n    margin-top: -1.5rem !important;\n}\n.mr-lg-n4,\n  .mx-lg-n4 {\n    margin-right: -1.5rem !important;\n}\n.mb-lg-n4,\n  .my-lg-n4 {\n    margin-bottom: -1.5rem !important;\n}\n.ml-lg-n4,\n  .mx-lg-n4 {\n    margin-left: -1.5rem !important;\n}\n.m-lg-n5 {\n    margin: -3rem !important;\n}\n.mt-lg-n5,\n  .my-lg-n5 {\n    margin-top: -3rem !important;\n}\n.mr-lg-n5,\n  .mx-lg-n5 {\n    margin-right: -3rem !important;\n}\n.mb-lg-n5,\n  .my-lg-n5 {\n    margin-bottom: -3rem !important;\n}\n.ml-lg-n5,\n  .mx-lg-n5 {\n    margin-left: -3rem !important;\n}\n.m-lg-auto {\n    margin: auto !important;\n}\n.mt-lg-auto,\n  .my-lg-auto {\n    margin-top: auto !important;\n}\n.mr-lg-auto,\n  .mx-lg-auto {\n    margin-right: auto !important;\n}\n.mb-lg-auto,\n  .my-lg-auto {\n    margin-bottom: auto !important;\n}\n.ml-lg-auto,\n  .mx-lg-auto {\n    margin-left: auto !important;\n}\n}\n@media (min-width: 1200px) {\n.m-xl-0 {\n    margin: 0 !important;\n}\n.mt-xl-0,\n  .my-xl-0 {\n    margin-top: 0 !important;\n}\n.mr-xl-0,\n  .mx-xl-0 {\n    margin-right: 0 !important;\n}\n.mb-xl-0,\n  .my-xl-0 {\n    margin-bottom: 0 !important;\n}\n.ml-xl-0,\n  .mx-xl-0 {\n    margin-left: 0 !important;\n}\n.m-xl-1 {\n    margin: 0.25rem !important;\n}\n.mt-xl-1,\n  .my-xl-1 {\n    margin-top: 0.25rem !important;\n}\n.mr-xl-1,\n  .mx-xl-1 {\n    margin-right: 0.25rem !important;\n}\n.mb-xl-1,\n  .my-xl-1 {\n    margin-bottom: 0.25rem !important;\n}\n.ml-xl-1,\n  .mx-xl-1 {\n    margin-left: 0.25rem !important;\n}\n.m-xl-2 {\n    margin: 0.5rem !important;\n}\n.mt-xl-2,\n  .my-xl-2 {\n    margin-top: 0.5rem !important;\n}\n.mr-xl-2,\n  .mx-xl-2 {\n    margin-right: 0.5rem !important;\n}\n.mb-xl-2,\n  .my-xl-2 {\n    margin-bottom: 0.5rem !important;\n}\n.ml-xl-2,\n  .mx-xl-2 {\n    margin-left: 0.5rem !important;\n}\n.m-xl-3 {\n    margin: 1rem !important;\n}\n.mt-xl-3,\n  .my-xl-3 {\n    margin-top: 1rem !important;\n}\n.mr-xl-3,\n  .mx-xl-3 {\n    margin-right: 1rem !important;\n}\n.mb-xl-3,\n  .my-xl-3 {\n    margin-bottom: 1rem !important;\n}\n.ml-xl-3,\n  .mx-xl-3 {\n    margin-left: 1rem !important;\n}\n.m-xl-4 {\n    margin: 1.5rem !important;\n}\n.mt-xl-4,\n  .my-xl-4 {\n    margin-top: 1.5rem !important;\n}\n.mr-xl-4,\n  .mx-xl-4 {\n    margin-right: 1.5rem !important;\n}\n.mb-xl-4,\n  .my-xl-4 {\n    margin-bottom: 1.5rem !important;\n}\n.ml-xl-4,\n  .mx-xl-4 {\n    margin-left: 1.5rem !important;\n}\n.m-xl-5 {\n    margin: 3rem !important;\n}\n.mt-xl-5,\n  .my-xl-5 {\n    margin-top: 3rem !important;\n}\n.mr-xl-5,\n  .mx-xl-5 {\n    margin-right: 3rem !important;\n}\n.mb-xl-5,\n  .my-xl-5 {\n    margin-bottom: 3rem !important;\n}\n.ml-xl-5,\n  .mx-xl-5 {\n    margin-left: 3rem !important;\n}\n.p-xl-0 {\n    padding: 0 !important;\n}\n.pt-xl-0,\n  .py-xl-0 {\n    padding-top: 0 !important;\n}\n.pr-xl-0,\n  .px-xl-0 {\n    padding-right: 0 !important;\n}\n.pb-xl-0,\n  .py-xl-0 {\n    padding-bottom: 0 !important;\n}\n.pl-xl-0,\n  .px-xl-0 {\n    padding-left: 0 !important;\n}\n.p-xl-1 {\n    padding: 0.25rem !important;\n}\n.pt-xl-1,\n  .py-xl-1 {\n    padding-top: 0.25rem !important;\n}\n.pr-xl-1,\n  .px-xl-1 {\n    padding-right: 0.25rem !important;\n}\n.pb-xl-1,\n  .py-xl-1 {\n    padding-bottom: 0.25rem !important;\n}\n.pl-xl-1,\n  .px-xl-1 {\n    padding-left: 0.25rem !important;\n}\n.p-xl-2 {\n    padding: 0.5rem !important;\n}\n.pt-xl-2,\n  .py-xl-2 {\n    padding-top: 0.5rem !important;\n}\n.pr-xl-2,\n  .px-xl-2 {\n    padding-right: 0.5rem !important;\n}\n.pb-xl-2,\n  .py-xl-2 {\n    padding-bottom: 0.5rem !important;\n}\n.pl-xl-2,\n  .px-xl-2 {\n    padding-left: 0.5rem !important;\n}\n.p-xl-3 {\n    padding: 1rem !important;\n}\n.pt-xl-3,\n  .py-xl-3 {\n    padding-top: 1rem !important;\n}\n.pr-xl-3,\n  .px-xl-3 {\n    padding-right: 1rem !important;\n}\n.pb-xl-3,\n  .py-xl-3 {\n    padding-bottom: 1rem !important;\n}\n.pl-xl-3,\n  .px-xl-3 {\n    padding-left: 1rem !important;\n}\n.p-xl-4 {\n    padding: 1.5rem !important;\n}\n.pt-xl-4,\n  .py-xl-4 {\n    padding-top: 1.5rem !important;\n}\n.pr-xl-4,\n  .px-xl-4 {\n    padding-right: 1.5rem !important;\n}\n.pb-xl-4,\n  .py-xl-4 {\n    padding-bottom: 1.5rem !important;\n}\n.pl-xl-4,\n  .px-xl-4 {\n    padding-left: 1.5rem !important;\n}\n.p-xl-5 {\n    padding: 3rem !important;\n}\n.pt-xl-5,\n  .py-xl-5 {\n    padding-top: 3rem !important;\n}\n.pr-xl-5,\n  .px-xl-5 {\n    padding-right: 3rem !important;\n}\n.pb-xl-5,\n  .py-xl-5 {\n    padding-bottom: 3rem !important;\n}\n.pl-xl-5,\n  .px-xl-5 {\n    padding-left: 3rem !important;\n}\n.m-xl-n1 {\n    margin: -0.25rem !important;\n}\n.mt-xl-n1,\n  .my-xl-n1 {\n    margin-top: -0.25rem !important;\n}\n.mr-xl-n1,\n  .mx-xl-n1 {\n    margin-right: -0.25rem !important;\n}\n.mb-xl-n1,\n  .my-xl-n1 {\n    margin-bottom: -0.25rem !important;\n}\n.ml-xl-n1,\n  .mx-xl-n1 {\n    margin-left: -0.25rem !important;\n}\n.m-xl-n2 {\n    margin: -0.5rem !important;\n}\n.mt-xl-n2,\n  .my-xl-n2 {\n    margin-top: -0.5rem !important;\n}\n.mr-xl-n2,\n  .mx-xl-n2 {\n    margin-right: -0.5rem !important;\n}\n.mb-xl-n2,\n  .my-xl-n2 {\n    margin-bottom: -0.5rem !important;\n}\n.ml-xl-n2,\n  .mx-xl-n2 {\n    margin-left: -0.5rem !important;\n}\n.m-xl-n3 {\n    margin: -1rem !important;\n}\n.mt-xl-n3,\n  .my-xl-n3 {\n    margin-top: -1rem !important;\n}\n.mr-xl-n3,\n  .mx-xl-n3 {\n    margin-right: -1rem !important;\n}\n.mb-xl-n3,\n  .my-xl-n3 {\n    margin-bottom: -1rem !important;\n}\n.ml-xl-n3,\n  .mx-xl-n3 {\n    margin-left: -1rem !important;\n}\n.m-xl-n4 {\n    margin: -1.5rem !important;\n}\n.mt-xl-n4,\n  .my-xl-n4 {\n    margin-top: -1.5rem !important;\n}\n.mr-xl-n4,\n  .mx-xl-n4 {\n    margin-right: -1.5rem !important;\n}\n.mb-xl-n4,\n  .my-xl-n4 {\n    margin-bottom: -1.5rem !important;\n}\n.ml-xl-n4,\n  .mx-xl-n4 {\n    margin-left: -1.5rem !important;\n}\n.m-xl-n5 {\n    margin: -3rem !important;\n}\n.mt-xl-n5,\n  .my-xl-n5 {\n    margin-top: -3rem !important;\n}\n.mr-xl-n5,\n  .mx-xl-n5 {\n    margin-right: -3rem !important;\n}\n.mb-xl-n5,\n  .my-xl-n5 {\n    margin-bottom: -3rem !important;\n}\n.ml-xl-n5,\n  .mx-xl-n5 {\n    margin-left: -3rem !important;\n}\n.m-xl-auto {\n    margin: auto !important;\n}\n.mt-xl-auto,\n  .my-xl-auto {\n    margin-top: auto !important;\n}\n.mr-xl-auto,\n  .mx-xl-auto {\n    margin-right: auto !important;\n}\n.mb-xl-auto,\n  .my-xl-auto {\n    margin-bottom: auto !important;\n}\n.ml-xl-auto,\n  .mx-xl-auto {\n    margin-left: auto !important;\n}\n}\n.text-monospace {\n  font-family: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace !important;\n}\n.text-justify {\n  text-align: justify !important;\n}\n.text-wrap {\n  white-space: normal !important;\n}\n.text-nowrap {\n  white-space: nowrap !important;\n}\n.text-truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.text-left {\n  text-align: left !important;\n}\n.text-right {\n  text-align: right !important;\n}\n.text-center {\n  text-align: center !important;\n}\n@media (min-width: 576px) {\n.text-sm-left {\n    text-align: left !important;\n}\n.text-sm-right {\n    text-align: right !important;\n}\n.text-sm-center {\n    text-align: center !important;\n}\n}\n@media (min-width: 768px) {\n.text-md-left {\n    text-align: left !important;\n}\n.text-md-right {\n    text-align: right !important;\n}\n.text-md-center {\n    text-align: center !important;\n}\n}\n@media (min-width: 992px) {\n.text-lg-left {\n    text-align: left !important;\n}\n.text-lg-right {\n    text-align: right !important;\n}\n.text-lg-center {\n    text-align: center !important;\n}\n}\n@media (min-width: 1200px) {\n.text-xl-left {\n    text-align: left !important;\n}\n.text-xl-right {\n    text-align: right !important;\n}\n.text-xl-center {\n    text-align: center !important;\n}\n}\n.text-lowercase {\n  text-transform: lowercase !important;\n}\n.text-uppercase {\n  text-transform: uppercase !important;\n}\n.text-capitalize {\n  text-transform: capitalize !important;\n}\n.font-weight-light {\n  font-weight: 300 !important;\n}\n.font-weight-lighter {\n  font-weight: lighter !important;\n}\n.font-weight-normal {\n  font-weight: 400 !important;\n}\n.font-weight-bold {\n  font-weight: 700 !important;\n}\n.font-weight-bolder {\n  font-weight: bolder !important;\n}\n.font-italic {\n  font-style: italic !important;\n}\n.text-white {\n  color: #fff !important;\n}\n.text-primary {\n  color: #007bff !important;\n}\na.text-primary:hover, a.text-primary:focus {\n  color: #0056b3 !important;\n}\n.text-secondary {\n  color: #6c757d !important;\n}\na.text-secondary:hover, a.text-secondary:focus {\n  color: #494f54 !important;\n}\n.text-success {\n  color: #28a745 !important;\n}\na.text-success:hover, a.text-success:focus {\n  color: #19692c !important;\n}\n.text-info {\n  color: #17a2b8 !important;\n}\na.text-info:hover, a.text-info:focus {\n  color: #0f6674 !important;\n}\n.text-warning {\n  color: #ffc107 !important;\n}\na.text-warning:hover, a.text-warning:focus {\n  color: #ba8b00 !important;\n}\n.text-danger {\n  color: #dc3545 !important;\n}\na.text-danger:hover, a.text-danger:focus {\n  color: #a71d2a !important;\n}\n.text-light {\n  color: #f8f9fa !important;\n}\na.text-light:hover, a.text-light:focus {\n  color: #cbd3da !important;\n}\n.text-dark {\n  color: #343a40 !important;\n}\na.text-dark:hover, a.text-dark:focus {\n  color: #121416 !important;\n}\n.text-body {\n  color: #212529 !important;\n}\n.text-muted {\n  color: #6c757d !important;\n}\n.text-black-50 {\n  color: rgba(0, 0, 0, 0.5) !important;\n}\n.text-white-50 {\n  color: rgba(255, 255, 255, 0.5) !important;\n}\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0;\n}\n.text-decoration-none {\n  text-decoration: none !important;\n}\n.text-break {\n  word-break: break-word !important;\n  overflow-wrap: break-word !important;\n}\n.text-reset {\n  color: inherit !important;\n}\n.visible {\n  visibility: visible !important;\n}\n.invisible {\n  visibility: hidden !important;\n}\n@media print {\n*,\n  *::before,\n  *::after {\n    text-shadow: none !important;\n    box-shadow: none !important;\n}\na:not(.btn) {\n    text-decoration: underline;\n}\nabbr[title]::after {\n    content: \" (\" attr(title) \")\";\n}\npre {\n    white-space: pre-wrap !important;\n}\npre,\n  blockquote {\n    border: 1px solid #adb5bd;\n    page-break-inside: avoid;\n}\nthead {\n    display: table-header-group;\n}\ntr,\n  img {\n    page-break-inside: avoid;\n}\np,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3;\n}\nh2,\n  h3 {\n    page-break-after: avoid;\n}\n@page {\n    size: a3;\n}\nbody {\n    min-width: 992px !important;\n}\n.container {\n    min-width: 992px !important;\n}\n.navbar {\n    display: none;\n}\n.badge {\n    border: 1px solid #000;\n}\n.table {\n    border-collapse: collapse !important;\n}\n.table td,\n    .table th {\n      background-color: #fff !important;\n}\n.table-bordered th,\n  .table-bordered td {\n    border: 1px solid #dee2e6 !important;\n}\n.table-dark {\n    color: inherit;\n}\n.table-dark th,\n    .table-dark td,\n    .table-dark thead th,\n    .table-dark tbody + tbody {\n      border-color: #dee2e6;\n}\n.table .thead-dark th {\n    color: inherit;\n    border-color: #dee2e6;\n}\n}\n.box-wrapper {\n  padding: 0 3px;\n}\n.box {\n  padding: 3px;\n  background: #fff;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 6px;\n}\n.box__wrapper {\n  background: #fff;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 2px;\n}\n.box__header {\n  padding: 4px 8px 3px;\n  font-weight: bold;\n  color: #fff;\n}\n.box--orange > .box__wrapper > .box__header {\n  position: relative;\n  background: #d75c03;\n  border-style: solid;\n  border-color: #a43700;\n  border-width: 1px;\n}\n.box--orange > .box__wrapper > .box__header::before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: #ee9800;\n  content: '';\n}\n.box--blue > .box__wrapper > .box__header {\n  position: relative;\n  background: #3f7692;\n  border-style: solid;\n  border-color: #385f79;\n  border-width: 1px;\n}\n.box--blue > .box__wrapper > .box__header::before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 2px;\n  background: #6a9dc2;\n  content: '';\n}\n.box__body {\n  padding: 8px;\n  background: #e3e3e3;\n  overflow: hidden;\n}\nh2 {\n  font-size: 11px;\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.box__body > p {\n  font-size: 11px;\n}\n.main-registration-header {\n  margin: 0 0 10px;\n}\n.main-registration-header--push {\n  margin: 40px 0 0;\n}\n.middle-registration-header {\n  margin: 10px auto;\n  display: block;\n  text-align: center;\n}\n.middle-registration-header--push {\n  margin: 40px auto 0;\n}\n.box__body > p {\n  margin: 0;\n}\n.image-right {\n  margin: 0 0 0 10px;\n}\n.right-link:link {\n  font-weight: bold;\n  text-decoration: underline;\n  color: #fff;\n}\n.right-link:active {\n  font-weight: bold;\n  text-decoration: underline;\n  color: #fff;\n}\n.right-link:hover {\n  font-weight: bold;\n  text-decoration: underline;\n  color: #fff;\n}\n.right-link:visited {\n  font-weight: bold;\n  text-decoration: underline;\n  color: #fff;\n}\n* {\n  box-sizing: border-box;\n}\nbody {\n  padding: 20px 0 0;\n  margin: 0;\n  background: url(\"/assets/images/habbo_pattern2.gif\");\n  font-family: Verdana;\n  font-size: 11px;\n  line-height: 1.2;\n  color: #000;\n}\n.wrapper {\n  width: 720px;\n  padding: 3px;\n  margin: 0 auto;\n  background: #fff;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 11px;\n}\n.wrapper__content {\n  background: #47839D;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 8px;\n  overflow: hidden;\n}\n.register > .register__top {\n  position: relative;\n  height: 74px;\n  background: url(\"/assets/images/registerTop.png\");\n  background-repeat: repeat-x;\n  background-position: top left;\n}\n.register > .register__top::before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 208px;\n  height: 74px;\n  background: url(\"/assets/images/registrationLogo.png\");\n  background-repeat: no-repeat;\n  background-position: top left;\n  content: '';\n}\n.register > .register__content {\n  padding: 7px;\n}\n.register__footer {\n  padding: 9px;\n  margin: 4px;\n  background: #0A4362;\n  font-size: 10px;\n  font-weight: bold;\n  color: #7295AA;\n  text-align: center;\n  border-radius: 8px;\n}\n.box__body > .date-of-birth-container {\n  margin: 40px 0 0;\n  padding: 5px 15px 14px;\n  background: #fff;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 10px;\n  text-align: center;\n}\n.box__body > .login-container {\n  margin: 20px 0 0;\n  padding: 10px;\n  background: #fff;\n  border-style: solid;\n  border-width: 1px;\n  border-color: #000;\n  border-radius: 10px;\n  overflow: hidden;\n  text-align: right;\n}\n.login-container__error {\n  margin: 0 0 15px;\n  color: red;\n  text-align: center;\n}\n.date-of-birth > .date-of-bith__input {\n  font-family: Arial;\n  font-size: 12px;\n}\n.date-of-birth__buttons > .date-of-bith__submit {\n  margin: 10px 0 0;\n}\n.box__body > .reasons-to-register {\n  margin: 20px 0 0;\n}\n#dobError {\n  display: block;\n  margin: 5px 0 0;\n  font-weight: bold;\n  color: red;\n}\n.checkbox-hidden {\n  position: absolute;\n  top: -9999px;\n  left: -9999px;\n}\n.register__steps {\n  position: absolute;\n  right: 0;\n  bottom: 4px;\n}\n.register__steps-step {\n  height: 26px;\n  width: 42px;\n  float: left;\n  margin: 0 5px;\n}\n.register__steps-step1 {\n  background: url(\"/assets/images/steps/1-deselected.png\");\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__top > .register__steps > .register__steps-step1 {\n  background: url(\"/assets/images/steps/1-selected.png\");\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step1 {\n  display: block;\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step2 {\n  display: none;\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step3 {\n  display: none;\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step4 {\n  display: none;\n}\n#registration-step1:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step5 {\n  display: none;\n}\n.register__steps-step2 {\n  background: url(\"/assets/images/steps/2-deselected.png\");\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__top > .register__steps > .register__steps-step2 {\n  background: url(\"/assets/images/steps/2-selected.png\");\n}\n.box__body-step2 {\n  display: none;\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step1 {\n  display: none;\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step2 {\n  display: block;\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step3 {\n  display: none;\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step4 {\n  display: none;\n}\n#registration-step2:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step5 {\n  display: none;\n}\n.register__steps-step3 {\n  background: url(\"/assets/images/steps/3-deselected.png\");\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__top > .register__steps > .register__steps-step3 {\n  background: url(\"/assets/images/steps/3-selected.png\");\n}\n.box__body-step3 {\n  display: none;\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step1 {\n  display: none;\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step2 {\n  display: none;\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step3 {\n  display: block;\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step4 {\n  display: none;\n}\n#registration-step3:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step5 {\n  display: none;\n}\n.register__steps-step4 {\n  background: url(\"/assets/images/steps/4-deselected.png\");\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__top > .register__steps > .register__steps-step4 {\n  background: url(\"/assets/images/steps/4-selected.png\");\n}\n.box__body-step4 {\n  display: none;\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step1 {\n  display: none;\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step2 {\n  display: none;\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step3 {\n  display: none;\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step4 {\n  display: block;\n}\n#registration-step4:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step5 {\n  display: none;\n}\n.register__steps-step5 {\n  background: url(\"/assets/images/steps/5-deselected.png\");\n  width: 30px;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__top > .register__steps > .register__steps-step5 {\n  background: url(\"/assets/images/steps/5-selected.png\");\n}\n.box__body-step5 {\n  display: none;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step1 {\n  display: none;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step2 {\n  display: none;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step3 {\n  display: none;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step4 {\n  display: none;\n}\n#registration-step5:checked ~ .wrapper > .wrapper__content > .register > .register__content > .container-fluid > .row > .box-wrapper > .box > .box__wrapper > .box__body > form > .box__body-step5 {\n  display: block;\n}\n.step__buttons {\n  position: absolute;\n  bottom: 8px;\n  right: 8px;\n  left: 8px;\n}\n.frank {\n  float: left;\n  width: 245px;\n}\n.frank > .frank__speech {\n  padding: 5px 10px 5px;\n  margin: 0 0 20px;\n  background: #fff;\n  border-color: #b93f1b;\n  border-style: solid;\n  border-width: 2px;\n  border-radius: 9px;\n}\n.frank > .frank__speech > p {\n  margin: 0;\n}\n.step-content {\n  position: relative;\n  float: left;\n  width: 409px;\n  padding: 8px 8px 40px;\n  margin: 0 0 10px 10px;\n  background: #fff;\n  border-style: solid;\n  border-color: #000;\n  border-width: 1px;\n  border-radius: 8px;\n}\n.step-content > h1 {\n  padding: 0;\n  margin: 0;\n  font-size: 11px;\n  font-weight: bold;\n  text-transform: uppercase;\n}\n.step-content > hr {\n  margin-top: 16px;\n  margin-bottom: 16px;\n  border-top: 1px solid #000;\n}\n.step-content > input[type=\"text\"] {\n  display: block;\n  width: 240px;\n}\n.step-content > input[type=\"password\"] {\n  display: block;\n  width: 240px;\n}\n.step-content > input[type=\"email\"] {\n  display: block;\n  width: 240px;\n}\n.step-content > label {\n  text-transform: uppercase;\n}\n.checkbox-label {\n  text-transform: none !important;\n  font-weight: normal;\n  margin: 3px 0px 0 3px;\n  display: block;\n  float: left;\n}\n#subscribe {\n  float: left;\n}\n#accept-terms {\n  float: left;\n}\n.terms-and-conditions {\n  height: 160px;\n  overflow: auto;\n  border-style: solid;\n  border-width: 1px;\n  padding: 6px;\n}\n.step-loading {\n  margin: 0 auto;\n  text-align: center;\n}\nhtml {\n  font-family: Verdana;\n  font-size: 11px;\n}\n", ""]);

// exports


/***/ }),
/* 45 */
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 46 */
/*!**************************************************************!*\
  !*** ./node_modules/vue-style-loader/lib/addStylesClient.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(/*! ./listToStyles */ 47)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 47 */
/*!***********************************************************!*\
  !*** ./node_modules/vue-style-loader/lib/listToStyles.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 48 */
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-7ba5bd90","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/App.vue ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "app" } }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7ba5bd90", esExports)
  }
}

/***/ }),
/* 49 */
/*!*****************************!*\
  !*** ./src/router/index.js ***!
  \*****************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(/*! vue */ 6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue_router__ = __webpack_require__(/*! vue-router */ 50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_home_Home_vue__ = __webpack_require__(/*! ../components/home/Home.vue */ 51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_client_Client_vue__ = __webpack_require__(/*! ../components/client/Client.vue */ 53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_account_Register_vue__ = __webpack_require__(/*! ../components/account/Register.vue */ 67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_account_Login_vue__ = __webpack_require__(/*! ../components/account/Login.vue */ 69);







__WEBPACK_IMPORTED_MODULE_0_vue__["a" /* default */].use(__WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (new __WEBPACK_IMPORTED_MODULE_1_vue_router__["a" /* default */]({
  // mode: 'history',
  routes: [{
    path: '/',
    name: 'Home',
    component: __WEBPACK_IMPORTED_MODULE_2__components_home_Home_vue__["a" /* default */]
  }, {
    path: '/client',
    name: 'Client',
    component: __WEBPACK_IMPORTED_MODULE_3__components_client_Client_vue__["a" /* default */]
  }, {
    path: '/account/register',
    name: 'Register',
    component: __WEBPACK_IMPORTED_MODULE_4__components_account_Register_vue__["a" /* default */]
  }, {
    path: '/account/login',
    name: 'Login',
    component: __WEBPACK_IMPORTED_MODULE_5__components_account_Login_vue__["a" /* default */]
  }]
}));

/***/ }),
/* 50 */
/*!********************************************************!*\
  !*** ./node_modules/vue-router/dist/vue-router.esm.js ***!
  \********************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/*!
  * vue-router v3.1.3
  * (c) 2019 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

function isExtendedError (constructor, err) {
  return (
    err instanceof constructor ||
    // _name is to support IE9 too
    (err && (err.name === constructor.name || err._name === constructor._name))
  )
}

function extend (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    // used by devtools to display a router-view badge
    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      var vnodeData = parent.$vnode && parent.$vnode.data;
      if (vnodeData) {
        if (vnodeData.routerView) {
          depth++;
        }
        if (vnodeData.keepAlive && parent._inactive) {
          inactive = true;
        }
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // register instance in init hook
    // in case kept-alive component be actived when routes changed
    data.hook.init = function (vnode) {
      if (vnode.data.keepAlive &&
        vnode.componentInstance &&
        vnode.componentInstance !== matched.instances[name]
      ) {
        matched.instances[name] = vnode.componentInstance;
      }
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  params = params || {};
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));

    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
    if (params.pathMatch) { params[0] = params.pathMatch; }

    return filler(params, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  } finally {
    // delete the 0 if it was added
    delete params[0];
  }
}

/*  */

function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next._normalized) {
    return next
  } else if (next.name) {
    return extend({}, raw)
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    var params = extend(extend({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var noop = function () {};

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(
      this.to,
      current,
      this.append
    );
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback =
      globalActiveClass == null ? 'router-link-active' : globalActiveClass;
    var exactActiveClassFallback =
      globalExactActiveClass == null
        ? 'router-link-exact-active'
        : globalExactActiveClass;
    var activeClass =
      this.activeClass == null ? activeClassFallback : this.activeClass;
    var exactActiveClass =
      this.exactActiveClass == null
        ? exactActiveClassFallback
        : this.exactActiveClass;

    var compareTarget = route.redirectedFrom
      ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location, noop);
        } else {
          router.push(location, noop);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) {
        on[e] = handler;
      });
    } else {
      on[this.event] = handler;
    }

    var data = { class: classes };

    var scopedSlot =
      !this.$scopedSlots.$hasNormal &&
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        href: href,
        route: route,
        navigate: handler,
        isActive: classes[activeClass],
        isExactActive: classes[exactActiveClass]
      });

    if (scopedSlot) {
      if (scopedSlot.length === 1) {
        return scopedSlot[0]
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        if (process.env.NODE_ENV !== 'production') {
          warn(
            false,
            ("RouterLink with to=\"" + (this.props.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child.")
          );
        }
        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
      }
    }

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var aData = (a.data = extend({}, a.data));
        aData.on = aData.on || {};
        // transform existing events in both objects into arrays so we can push later
        for (var event in aData.on) {
          var handler$1 = aData.on[event];
          if (event in on) {
            aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
          }
        }
        // append new listeners for router-link
        for (var event$1 in on) {
          if (event$1 in aData.on) {
            // on[event] is always a function
            aData.on[event$1].push(on[event$1]);
          } else {
            aData.on[event$1] = handler;
          }
        }

        var aAttrs = (a.data.attrs = extend({}, a.data.attrs));
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // warn if routes do not include leading slashes
    var found = pathList
    // check for missing leading slash
      .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; });

    if (found.length > 0) {
      var pathNames = found.map(function (path) { return ("- " + path); }).join('\n');
      warn(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames));
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(
        path || name
      )) + " cannot be a " + "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions =
    route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (
        route.name &&
        !route.redirect &&
        route.children.some(function (child) { return /^\/?$/.test(child.path); })
      ) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
            "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
            "the default child route will not be rendered. Remove the name from " +
            "this route and use the name of the default child route for named " +
            "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
    for (var i = 0; i < aliases.length; ++i) {
      var alias = aliases[i];
      if (process.env.NODE_ENV !== 'production' && alias === path) {
        warn(
          false,
          ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development.")
        );
        // skip in dev to make it work
        continue
      }

      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    }
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
          "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (
  path,
  pathToRegexpOptions
) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(
        !keys[key.name],
        ("Duplicate param keys in route with path: \"" + path + "\"")
      );
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (
  path,
  parent,
  strict
) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */



function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
      return _createRoute(record, location, redirectedFrom)
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

// use User Timing api (if present) for more accurate key precision
var Time =
  inBrowser && window.performance && window.performance.now
    ? window.performance
    : Date;

function genStateKey () {
  return Time.now().toFixed(3)
}

var _key = genStateKey();

function getStateKey () {
  return _key
}

function setStateKey (key) {
  return (_key = key)
}

/*  */

var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
  // window.location.protocol + '//' + window.location.host
  // location.host contains the port and location.hostname doesn't
  var protocolAndPath = window.location.protocol + '//' + window.location.host;
  var absolutePath = window.location.href.replace(protocolAndPath, '');
  window.history.replaceState({ key: getStateKey() }, '', absolutePath);
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior.call(
      router,
      to,
      from,
      isPop ? position : null
    );

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll
        .then(function (shouldScroll) {
          scrollToPosition((shouldScroll), position);
        })
        .catch(function (err) {
          if (process.env.NODE_ENV !== 'production') {
            assert(false, err.toString());
          }
        });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

var hashStartsWithNumberRE = /^#\d/;

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
    // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
    var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
      ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
      : document.querySelector(shouldScroll.selector);

    if (el) {
      var offset =
        shouldScroll.offset && typeof shouldScroll.offset === 'object'
          ? shouldScroll.offset
          : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState =
  inBrowser &&
  (function () {
    var ua = window.navigator.userAgent;

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    ) {
      return false
    }

    return window.history && 'pushState' in window.history
  })();

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: getStateKey() }, '', url);
    } else {
      history.pushState({ key: setStateKey(genStateKey()) }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

var NavigationDuplicated = /*@__PURE__*/(function (Error) {
  function NavigationDuplicated (normalizedLocation) {
    Error.call(this);
    this.name = this._name = 'NavigationDuplicated';
    // passing the message to super() doesn't seem to work in the transpiled version
    this.message = "Navigating to current location (\"" + (normalizedLocation.fullPath) + "\") is not allowed";
    // add a stack property so services like Sentry can correctly display it
    Object.defineProperty(this, 'stack', {
      value: new Error().stack,
      writable: true,
      configurable: true
    });
    // we could also have used
    // Error.captureStackTrace(this, this.constructor)
    // but it only exists on node and chrome
  }

  if ( Error ) NavigationDuplicated.__proto__ = Error;
  NavigationDuplicated.prototype = Object.create( Error && Error.prototype );
  NavigationDuplicated.prototype.constructor = NavigationDuplicated;

  return NavigationDuplicated;
}(Error));

// support IE9
NavigationDuplicated._name = 'NavigationDuplicated';

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (
  location,
  onComplete,
  onAbort
) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(
    route,
    function () {
      this$1.updateRoute(route);
      onComplete && onComplete(route);
      this$1.ensureURL();

      // fire ready cbs once
      if (!this$1.ready) {
        this$1.ready = true;
        this$1.readyCbs.forEach(function (cb) {
          cb(route);
        });
      }
    },
    function (err) {
      if (onAbort) {
        onAbort(err);
      }
      if (err && !this$1.ready) {
        this$1.ready = true;
        this$1.readyErrorCbs.forEach(function (cb) {
          cb(err);
        });
      }
    }
  );
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    // after merging https://github.com/vuejs/vue-router/pull/2771 we
    // When the user navigates through history through back/forward buttons
    // we do not want to throw the error. We only throw it if directly calling
    // push/replace. That's why it's not included in isError
    if (!isExtendedError(NavigationDuplicated, err) && isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) {
          cb(err);
        });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort(new NavigationDuplicated(route))
  }

  var ref = resolveQueue(
    this.current.matched,
    route.matched
  );
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) {
            cb();
          });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(
    activated,
    'beforeRouteEnter',
    function (guard, _, match, key) {
      return bindEnterGuard(guard, match, key, cbs, isValid)
    }
  )
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
      next(cb);
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = /*@__PURE__*/(function (History) {
  function HTML5History (router, base) {
    var this$1 = this;

    History.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History ) HTML5History.__proto__ = History;
  HTML5History.prototype = Object.create( History && History.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = decodeURI(window.location.pathname);
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */

var HashHistory = /*@__PURE__*/(function (History) {
  function HashHistory (router, base, fallback) {
    History.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History ) HashHistory.__proto__ = History;
  HashHistory.prototype = Object.create( History && History.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(
      supportsPushState ? 'popstate' : 'hashchange',
      function () {
        var current = this$1.current;
        if (!ensureSlash()) {
          return
        }
        this$1.transitionTo(getHash(), function (route) {
          if (supportsScroll) {
            handleScroll(this$1.router, route, current, true);
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath);
          }
        });
      }
    );
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(
      location,
      function (route) {
        pushHash(route.fullPath);
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      },
      onAbort
    );
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(
      location,
      function (route) {
        replaceHash(route.fullPath);
        handleScroll(this$1.router, route, fromRoute, false);
        onComplete && onComplete(route);
      },
      onAbort
    );
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location));
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  // empty path
  if (index < 0) { return '' }

  href = href.slice(index + 1);
  // decode the hash but not the search or hash
  // as search(query) is already decoded
  // https://github.com/vuejs/vue-router/issues/2708
  var searchIndex = href.indexOf('?');
  if (searchIndex < 0) {
    var hashIndex = href.indexOf('#');
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
    } else { href = decodeURI(href); }
  } else {
    if (searchIndex > -1) {
      href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
    }
  }

  return href
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */

var AbstractHistory = /*@__PURE__*/(function (History) {
  function AbstractHistory (router, base) {
    History.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History ) AbstractHistory.__proto__ = History;
  AbstractHistory.prototype = Object.create( History && History.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(
      location,
      function (route) {
        this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
        this$1.index++;
        onComplete && onComplete(route);
      },
      onAbort
    );
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(
      location,
      function (route) {
        this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
        onComplete && onComplete(route);
      },
      onAbort
    );
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(
      route,
      function () {
        this$1.index = targetIndex;
        this$1.updateRoute(route);
      },
      function (err) {
        if (isExtendedError(NavigationDuplicated, err)) {
          this$1.index = targetIndex;
        }
      }
    );
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */



var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // set up app destroyed handler
  // https://github.com/vuejs/vue-router/issues/2639
  app.$once('hook:destroyed', function () {
    // clean out app from this.apps array once destroyed
    var index = this$1.apps.indexOf(app);
    if (index > -1) { this$1.apps.splice(index, 1); }
    // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused
    if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }
  });

  // main app previously initialized
  // return as we don't need to set up new history listener
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

  // $flow-disable-line
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      this$1.history.push(location, resolve, reject);
    })
  } else {
    this.history.push(location, onComplete, onAbort);
  }
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

  // $flow-disable-line
  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
    return new Promise(function (resolve, reject) {
      this$1.history.replace(location, resolve, reject);
    })
  } else {
    this.history.replace(location, onComplete, onAbort);
  }
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  current = current || this.history.current;
  var location = normalizeLocation(
    to,
    current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.1.3';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../process/browser.js */ 1)))

/***/ }),
/* 51 */
/*!**************************************!*\
  !*** ./src/components/home/Home.vue ***!
  \**************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__ = __webpack_require__(/*! !babel-loader!../../../node_modules/vue-loader/lib/selector?type=script&index=0!./Home.vue */ 14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_74b1de62_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-74b1de62","hasScoped":false,"buble":{"transforms":{}}}!../../../node_modules/vue-loader/lib/selector?type=template&index=0!./Home.vue */ 52);
var disposed = false
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/component-normalizer */ 4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Home_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_74b1de62_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/home/Home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74b1de62", Component.options)
  } else {
    hotAPI.reload("data-v-74b1de62", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 52 */
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-74b1de62","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/home/Home.vue ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container" }, [
    _c("div", [
      _c("header", { staticClass: "header" }, [_vm._v(_vm._s(_vm.msg))]),
      _vm._v(" "),
      _c("div", { attrs: { id: "content" } })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-74b1de62", esExports)
  }
}

/***/ }),
/* 53 */
/*!******************************************!*\
  !*** ./src/components/client/Client.vue ***!
  \******************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Client_vue__ = __webpack_require__(/*! !babel-loader!../../../node_modules/vue-loader/lib/selector?type=script&index=0!./Client.vue */ 15);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0f8fd74f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Client_vue__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-0f8fd74f","hasScoped":false,"buble":{"transforms":{}}}!../../../node_modules/vue-loader/lib/selector?type=template&index=0!./Client.vue */ 66);
var disposed = false
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/component-normalizer */ 4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Client_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0f8fd74f_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Client_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/client/Client.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0f8fd74f", Component.options)
  } else {
    hotAPI.reload("data-v-0f8fd74f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 54 */
/*!***************************!*\
  !*** ./src/game/index.js ***!
  \***************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pixi__ = __webpack_require__(/*! pixi */ 16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pixi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_pixi__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_p2__ = __webpack_require__(/*! p2 */ 17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_p2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_p2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_phaser__ = __webpack_require__(/*! phaser */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__states_Boot__ = __webpack_require__(/*! ./states/Boot */ 58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__states_Splash__ = __webpack_require__(/*! ./states/Splash */ 59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__states_Game__ = __webpack_require__(/*! ./states/Game */ 61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__config__ = __webpack_require__(/*! ./config */ 65);










class Game extends __WEBPACK_IMPORTED_MODULE_2_phaser___default.a.Game {
  constructor() {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > __WEBPACK_IMPORTED_MODULE_6__config__["a" /* default */].gameWidth ? __WEBPACK_IMPORTED_MODULE_6__config__["a" /* default */].gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > __WEBPACK_IMPORTED_MODULE_6__config__["a" /* default */].gameHeight ? __WEBPACK_IMPORTED_MODULE_6__config__["a" /* default */].gameHeight : docElement.clientHeight;

    super(width, height, __WEBPACK_IMPORTED_MODULE_2_phaser___default.a.CANVAS, 'content', null);

    this.state.add('Boot', __WEBPACK_IMPORTED_MODULE_3__states_Boot__["a" /* default */], false);
    this.state.add('Splash', __WEBPACK_IMPORTED_MODULE_4__states_Splash__["a" /* default */], false);
    this.state.add('Game', __WEBPACK_IMPORTED_MODULE_5__states_Game__["a" /* default */], false);

    this.state.start('Boot');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/*!*********************************!*\
  !*** ./src/game/states/Boot.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(/*! phaser */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_webfontloader__ = __webpack_require__(/*! webfontloader */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_webfontloader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_webfontloader__);



/* harmony default export */ __webpack_exports__["a"] = (class extends __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.State {
  init() {
    this.stage.backgroundColor = '#000000';
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload() {
    __WEBPACK_IMPORTED_MODULE_1_webfontloader___default.a.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    });

    const text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' });
    text.anchor.setTo(0.5, 0.5);

    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
  }

  render() {
    if (this.fontsReady) {
      this.state.start('Splash');
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
});

/***/ }),
/* 59 */
/*!***********************************!*\
  !*** ./src/game/states/Splash.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(/*! phaser */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(/*! ../utils */ 60);



/* harmony default export */ __webpack_exports__["a"] = (class extends __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.State {
  init() {
    console.log(this.world);
  }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    Object(__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* centerGameObjects */])([this.loaderBg, this.loaderBar]);

    this.time.advancedTiming = true;

    this.load.setPreloadSprite(this.loaderBar);
    this.load.image('tile', 'assets/images/tile.png');
    this.load.image('tileHighlight', 'assets/images/tile_highlight.png');
  }

  create() {
    this.state.start('Game');
  }
});

/***/ }),
/* 60 */
/*!***************************!*\
  !*** ./src/game/utils.js ***!
  \***************************/
/*! exports provided: centerGameObjects, default */
/*! exports used: centerGameObjects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const centerGameObjects = objects => {
  objects.forEach(object => {
    object.anchor.setTo(0.5);
  });
};
/* harmony export (immutable) */ __webpack_exports__["a"] = centerGameObjects;


/* unused harmony default export */ var _unused_webpack_default_export = ({
  centerGameObjects
});

/***/ }),
/* 61 */
/*!*********************************!*\
  !*** ./src/game/states/Game.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(/*! phaser */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(/*! ../../api */ 62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprites_Tile__ = __webpack_require__(/*! ../sprites/Tile */ 63);
/* globals __DEV__ */



__webpack_require__(/*! phaser-plugin-isometric/dist/phaser-plugin-isometric */ 64);

/* harmony default export */ __webpack_exports__["a"] = (class extends __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.State {
  init() {
    this.isoGroup = null;
    this.cursorPos = null;
    console.log(this.world);
  }
  preload() {
    this.game.plugins.add(new __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.Plugin.Isometric(game));
    this.game.iso.anchor.setTo(0.5, 0.2);
  }

  create() {
    // const bannerText = 'Vue + Phaser + ES6 + Webpack'
    // const banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)

    this.tile = new __WEBPACK_IMPORTED_MODULE_2__sprites_Tile__["a" /* default */]({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'tile'
    });

    this.isoGroup = this.game.add.group();
    this.spawnTiles(this.game);

    this.cursorPos = new __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.Plugin.Isometric.Point3();

    // this.game.add.existing(this.tile);

    // this.getWeather()
  }

  update() {
    // Update the cursor position.
    // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
    this.game.iso.unproject(this.game.input.activePointer.position, this.cursorPos);

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    this.isoGroup.forEach(tile => {
      var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y);
      // If it does, do a little animation and tint change.
      if (!tile.selected && inBounds) {
        tile.selected = true;
        tile.loadTexture('tileHighlight', 0);
        // this.game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
      }
      // If not, revert back to how it was.
      else if (tile.selected && !inBounds) {
          tile.selected = false;
          tile.loadTexture('tile', 0);
        }
    });
  }

  /**
   * Example for getting data from service
   */
  async getWeather() {
    const text = 'Service calling test...';
    const message = this.add.text(this.world.centerX, this.game.height - 150, text);
    message.anchor.setTo(0.5);
    try {
      const weather = await Object(__WEBPACK_IMPORTED_MODULE_1__api__["a" /* fetchWeather */])();
      message.setText(weather.data.name);
    } catch (err) {
      message.setText('Service calling test.... Get weather fail!');
      console.log(err.response);
    }
  }

  spawnTiles(game) {
    var tile;
    for (var xx = 0; xx < 258; xx += 38) {
      for (var yy = 0; yy < 258; yy += 38) {
        // Create a tile using the new game.add.isoSprite factory method at the specified position.
        // The last parameter is the group you want to add it to (just like game.add.sprite)
        tile = game.add.isoSprite(xx, yy, 0, 'tile', 0, this.isoGroup);
        tile.anchor.set(0.5, 0);
      }
    }
  }

  render() {
    if (true) {
      this.game.debug.spriteInfo(this.tile, 32, 32);
    }
  }
});

/***/ }),
/* 62 */
/*!**************************!*\
  !*** ./src/api/index.js ***!
  \**************************/
/*! exports provided: fetchWeather, default */
/*! exports used: fetchWeather */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(/*! axios */ 7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


const fetchWeather = code => __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('/weather', code);
/* harmony export (immutable) */ __webpack_exports__["a"] = fetchWeather;


/* unused harmony default export */ var _unused_webpack_default_export = (fetchWeather);

/***/ }),
/* 63 */
/*!**********************************!*\
  !*** ./src/game/sprites/Tile.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(/*! phaser */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);


/* harmony default export */ __webpack_exports__["a"] = (class extends __WEBPACK_IMPORTED_MODULE_0_phaser___default.a.Sprite {
  constructor({
    game, x, y, asset
  }) {
    super(game, x, y, asset);
    this.anchor.setTo(0.5);
  }

  update() {
    // this.angle += 1
  }
});

/***/ }),
/* 64 */
/*!******************************************************************************!*\
  !*** ./node_modules/phaser-plugin-isometric/dist/phaser-plugin-isometric.js ***!
  \******************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/**
* The MIT License (MIT)

* Copyright (c) 2014 Lewis Lane

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* 
*
*/

/**
 * @author       Lewis Lane <lew@rotates.org>
 * @copyright    2014 Lewis Lane (Rotates.org)
 * @license      {@link http://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @class Phaser.Plugin.Isometric
 * 
 * @classdesc
 * Isometric is a comprehensive axonometric plugin for Phaser which provides an API for handling axonometric projection of assets in 3D space to the screen.
 * The goal has been to mimic as closely as possible the existing APIs provided by Phaser for standard orthogonal 2D projection, but add a third dimension.
 * Also included is an Arcade-based 3D AABB physics engine, which again is closely equivalent in functionality and its API.
 * 
 * @constructor
 * @param {Phaser.Game} game The current game instance.
 */
Phaser.Plugin.Isometric = function (game, parent) {

    Phaser.Plugin.call(this, game, parent);
    this.projector = new Phaser.Plugin.Isometric.Projector(this.game, Phaser.Plugin.Isometric.CLASSIC);
    //  Add an instance of Isometric.Projector to game.iso if it doesn't exist already
    this.game.iso = this.game.iso || this.projector;
};

Phaser.Plugin.Isometric.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Isometric.prototype.constructor = Phaser.Plugin.Isometric;

Phaser.Plugin.Isometric.VERSION = '0.9.2';

//  Directional consts
Phaser.Plugin.Isometric.UP = 0;
Phaser.Plugin.Isometric.DOWN = 1;
Phaser.Plugin.Isometric.FORWARDX = 2;
Phaser.Plugin.Isometric.FORWARDY = 3;
Phaser.Plugin.Isometric.BACKWARDX = 4;
Phaser.Plugin.Isometric.BACKWARDY = 5;

//  Type consts
Phaser.Plugin.Isometric.ISOSPRITE = 'isosprite';
Phaser.Plugin.Isometric.ISOARCADE = 'isoarcade';
;/**
 * @class Phaser.Plugin.Isometric.Cube
 *
 * @classdesc
 * Creates a new Cube object with the bottom-back corner specified by the x, y and z parameters, with the specified breadth (widthX), depth (widthY) and height parameters. If you call this function without parameters, a Cube with x, y, z, breadth, depth and height properties set to 0 is created.
 *
 * @constructor
 * @param {number} x - The x coordinate of the bottom-back corner of the Cube.
 * @param {number} y - The y coordinate of the bottom-back corner of the Cube.
 * @param {number} z - The z coordinate of the bottom-back corner of the Cube.
 * @param {number} widthX - The X axis width (breadth) of the Cube. Should always be either zero or a positive value.
 * @param {number} widthY - The Y axis width (depth) of the Cube. Should always be either zero or a positive value.
 * @param {number} height - The Z axis height of the Cube. Should always be either zero or a positive value.
 * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
 */
Phaser.Plugin.Isometric.Cube = function (x, y, z, widthX, widthY, height) {

    x = x || 0;
    y = y || 0;
    z = z || 0;
    widthX = widthX || 0;
    widthY = widthY || 0;
    height = height || 0;

    /**
     * @property {number} x - The x coordinate of the bottom-back corner of the Cube.
     */
    this.x = x;

    /**
     * @property {number} y - The y coordinate of the bottom-back corner of the Cube.
     */
    this.y = y;

    /**
     * @property {number} z - The z coordinate of the bottom-back corner of the Cube.
     */
    this.z = z;

    /**
     * @property {number} widthX - The X axis width (breadth) of the Cube. This value should never be set to a negative.
     */
    this.widthX = widthX;

    /**
     * @property {number} widthY - The Y axis width (depth) of the Cube. This value should never be set to a negative.
     */
    this.widthY = widthY;

    /**
     * @property {number} height - The Z axis height of the Cube. This value should never be set to a negative.
     */
    this.height = height;

    /**
     * @property {Array.<Phaser.Plugin.Isometric.Point3>} _corners - The 8 corners of the Cube.
     * @private
     */
    this._corners = [
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z + this.height)
    ];
};

Phaser.Plugin.Isometric.Cube.prototype.constructor = Phaser.Plugin.Isometric.Cube;

Phaser.Plugin.Isometric.Cube.prototype = {
    /**
     * Sets the members of Cube to the specified values.
     * @method Phaser.Plugin.Isometric.Cube#setTo
     * @param {number} x - The x coordinate of the bottom-back corner of the Cube.
     * @param {number} y - The y coordinate of the bottom-back corner of the Cube.
     * @param {number} z - The z coordinate of the bottom-back corner of the Cube.
     * @param {number} widthX - The X axis width (breadth) of the Cube. This value should never be set to a negative.
     * @param {number} widthY - The Y axis width (depth) of the Cube. This value should never be set to a negative.
     * @param {number} height - The Z axis height of the Cube. This value should never be set to a negative.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object
     */
    setTo: function (x, y, z, widthX, widthY, height) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.widthX = widthX;
        this.widthY = widthY;
        this.height = height;

        return this;

    },

    /**
     * Copies the x, y, z, widthX, widthY and height properties from any given object to this Cube.
     * @method Phaser.Plugin.Isometric.Cube#copyFrom
     * @param {any} source - The object to copy from.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
     */
    copyFrom: function (source) {

        this.setTo(source.x, source.y, source.z, source.widthX, source.widthY, source.height);

    },

    /**
     * Copies the x, y, z, widthX, widthY and height properties from this Cube to any given object.
     * @method Phaser.Plugin.Isometric.Cube#copyTo
     * @param {any} dest - The object to copy to.
     * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
     */
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;
        dest.widthX = this.widthX;
        dest.widthY = this.widthY;
        dest.height = this.height;

        return dest;

    },

    /**
     * The size of the Cube object, expressed as a Point3 object with the values of the widthX, widthY and height properties.
     * @method Phaser.Plugin.Isometric.Cube#size
     * @param {Phaser.Plugin.Isometric.Point3} [output] - Optional Point3 object. If given the values will be set into the object, otherwise a brand new Point3 object will be created and returned.
     * @return {Phaser.Plugin.Isometric.Point3} The size of the Cube object.
     */
    size: function (output) {

        return Phaser.Plugin.Isometric.Cube.size(this, output);

    },

    /**
    * Determines whether the specified coordinates are contained within the region defined by this Cube object.
    * @method Phaser.Plugin.Isometric.Cube#contains
    * @param {number} x - The x coordinate of the point to test.
    * @param {number} y - The y coordinate of the point to test.
    * @param {number} y - The z coordinate of the point to test.
    * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
    */
    contains: function (x, y, z) {

        return Phaser.Plugin.Isometric.Cube.contains(this, x, y, z);

    },

    /**
    * Determines whether the specified X and Y coordinates are contained within the region defined by this Cube object.
    * @method Phaser.Plugin.Isometric.Cube#containsXY
    * @param {number} x - The x coordinate of the point to test.
    * @param {number} y - The y coordinate of the point to test.
    * @return {boolean} A value of true if this Cube object contains the specified point; otherwise false.
    */
    containsXY: function (x, y) {

        return Phaser.Plugin.Isometric.Cube.containsXY(this, x, y);

    },

    /**
     * Returns a new Cube object with the same values for the x, y, z, widthX, widthY and height properties as the original Cube object.
     * @method Phaser.Plugin.Isometric.Cube#clone
     * @param {Phaser.Plugin.Isometric.Cube} [output] - Optional Cube object. If given the values will be set into the object, otherwise a brand new Cube object will be created and returned.
     * @return {Phaser.Plugin.Isometric.Cube}
     */
    clone: function (output) {

        return Phaser.Plugin.Isometric.Cube.clone(this, output);

    },

    /**
     * Determines whether the two Cubes intersect with each other.
     * This method checks the x, y, z, widthX, widthY, and height properties of the Cubes.
     * @method Phaser.Plugin.Isometric.Cube#intersects
     * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
     * @return {boolean} A value of true if the specified object intersects with this Cube object; otherwise false.
     */
    intersects: function (b) {

        return Phaser.Plugin.Isometric.Cube.intersects(this, b);

    },

    /**
     * Updates and returns an Array of eight Point3 objects containing the corners of this Cube.
     * @method Phaser.Plugin.Isometric.Cube#getCorners
     * @return {Array.<Phaser.Plugin.Isometric.Point3>} The corners of this Cube expressed as an Array of eight Point3 objects.
     */
    getCorners: function () {

        this._corners[0].setTo(this.x, this.y, this.z);
        this._corners[1].setTo(this.x, this.y, this.z + this.height);
        this._corners[2].setTo(this.x, this.y + this.widthY, this.z);
        this._corners[3].setTo(this.x, this.y + this.widthY, this.z + this.height);
        this._corners[4].setTo(this.x + this.widthX, this.y, this.z);
        this._corners[5].setTo(this.x + this.widthX, this.y, this.z + this.height);
        this._corners[6].setTo(this.x + this.widthX, this.y + this.widthY, this.z);
        this._corners[7].setTo(this.x + this.widthX, this.y + this.widthY, this.z + this.height);

        return this._corners;

    },

    /**
     * Returns a string representation of this object.
     * @method Phaser.Plugin.Isometric.Cube#toString
     * @return {string} A string representation of the instance.
     */
    toString: function () {

        return "[{Cube (x=" + this.x + " y=" + this.y + " z=" + this.z + " widthX=" + this.widthX + " widthY=" + this.widthY + " height=" + this.height + " empty=" + this.empty + ")}]";

    }
};

/**
 * @name Phaser.Plugin.Isometric.Cube#halfWidthX
 * @property {number} halfWidthX - Half of the widthX of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfWidthX", {

    get: function () {
        return Math.round(this.widthX * 0.5);
    }

});

/**
 * @name Phaser.Plugin.Isometric.Cube#halfWidthY
 * @property {number} halfWidthY - Half of the widthY of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfWidthY", {

    get: function () {
        return Math.round(this.widthY * 0.5);
    }

});

/**
 * @name Phaser.Plugin.Isometric.Cube#halfHeight
 * @property {number} halfHeight - Half of the height of the Cube.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "halfHeight", {

    get: function () {
        return Math.round(this.height * 0.5);
    }

});

/**
 * The z coordinate of the bottom of the Cube. Changing the bottom property of a Cube object has no effect on the x, y, widthX and widthY properties.
 * However it does affect the height property, whereas changing the z value does not affect the height property.
 * @name Phaser.Plugin.Isometric.Cube#bottom
 * @property {number} bottom - The z coordinate of the bottom of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "bottom", {

    get: function () {
        return this.z;
    },

    set: function (value) {
        if (value >= this.top) {
            this.height = 0;
        } else {
            this.height = (this.top - value);
        }
        this.z = value;
    }

});

/**
 * The sum of the z and height properties. Changing the top property of a Cube object has no effect on the x, y, z, widthX and widthY properties, but does change the height property.
 * @name Phaser.Plugin.Isometric.Cube#top
 * @property {number} top - The sum of the z and height properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "top", {

    get: function () {
        return this.z + this.height;
    },

    set: function (value) {
        if (value <= this.z) {
            this.height = 0;
        } else {
            this.height = (value - this.z);
        }
    }

});

/**
 * The x coordinate of the back of the Cube. Changing the backX property of a Cube object has no effect on the y, z, widthY and height properties. However it does affect the widthX property, whereas changing the x value does not affect the width property.
 * @name Phaser.Plugin.Isometric.Cube#backX
 * @property {number} backX - The x coordinate of the left of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "backX", {

    get: function () {
        return this.x;
    },

    set: function (value) {
        if (value >= this.frontX) {
            this.widthX = 0;
        } else {
            this.widthX = (this.frontX - value);
        }
        this.x = value;
    }

});

/**
 * The y coordinate of the back of the Cube. Changing the backY property of a Cube object has no effect on the x, z, widthX and height properties. However it does affect the widthY property, whereas changing the y value does not affect the width property.
 * @name Phaser.Plugin.Isometric.Cube#backY
 * @property {number} backY - The x coordinate of the left of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "backY", {

    get: function () {
        return this.y;
    },

    set: function (value) {
        if (value >= this.frontY) {
            this.widthY = 0;
        } else {
            this.widthY = (this.frontY - value);
        }
        this.y = value;
    }

});

/**
 * The sum of the x and widthX properties. Changing the frontX property of a Cube object has no effect on the x, y, z, widthY and height properties, however it does affect the widthX property.
 * @name Phaser.Plugin.Isometric.Cube#frontX
 * @property {number} frontX - The sum of the x and widthX properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "frontX", {

    get: function () {
        return this.x + this.widthX;
    },

    set: function (value) {
        if (value <= this.x) {
            this.widthX = 0;
        } else {
            this.widthX = (value - this.x);
        }
    }

});

/**
 * The sum of the y and widthY properties. Changing the frontY property of a Cube object has no effect on the x, y, z, widthX and height properties, however it does affect the widthY property.
 * @name Phaser.Plugin.Isometric.Cube#frontY
 * @property {number} frontY - The sum of the y and widthY properties.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "frontY", {

    get: function () {
        return this.y + this.widthY;
    },

    set: function (value) {
        if (value <= this.y) {
            this.widthY = 0;
        } else {
            this.widthY = (value - this.y);
        }
    }

});

/**
 * The volume of the Cube derived from widthX * widthY * height.
 * @name Phaser.Plugin.Isometric.Cube#volume
 * @property {number} volume - The volume of the Cube derived from widthX * widthY * height.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "volume", {

    get: function () {
        return this.widthX * this.widthY * this.height;
    }

});

/**
 * The x coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerX
 * @property {number} centerX - The x coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerX", {
    get: function () {
        return this.x + this.halfWidthX;
    },

    set: function (value) {
        this.x = value - this.halfWidthX;
    }
});

/**
 * The y coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerY
 * @property {number} centerY - The y coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerY", {
    get: function () {
        return this.y + this.halfWidthY;
    },

    set: function (value) {
        this.y = value - this.halfWidthY;
    }
});

/**
 * The z coordinate of the center of the Cube.
 * @name Phaser.Plugin.Isometric.Cube#centerZ
 * @property {number} centerZ - The z coordinate of the center of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "centerZ", {
    get: function () {
        return this.z + this.halfHeight;
    },

    set: function (value) {
        this.z = value - this.halfHeight;
    }
});

/**
 * A random value between the frontX and backX values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomX
 * @property {number} randomX - A random value between the frontX and backX values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomX", {

    get: function () {

        return this.x + (Math.random() * this.widthX);

    }

});

/**
 * A random value between the frontY and backY values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomY
 * @property {number} randomY - A random value between the frontY and backY values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomY", {

    get: function () {

        return this.y + (Math.random() * this.widthY);

    }

});

/**
 * A random value between the bottom and top values (inclusive) of the Cube.
 *
 * @name Phaser.Plugin.Isometric.Cube#randomZ
 * @property {number} randomZ - A random value between the bottom and top values (inclusive) of the Cube.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "randomZ", {

    get: function () {

        return this.z + (Math.random() * this.height);

    }

});

/**
 * Determines whether or not this Cube object is empty. A Cube object is empty if its widthX, widthY or height is less than or equal to 0.
 * If set to true then all of the Cube properties are set to 0.
 * @name Phaser.Plugin.Isometric.Cube#empty
 * @property {boolean} empty - Gets or sets the Cube's empty state.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Cube.prototype, "empty", {

    get: function () {
        return (!this.widthX || !this.widthY || !this.height);
    },

    set: function (value) {

        if (value === true) {
            this.setTo(0, 0, 0, 0, 0, 0);
        }

    }

});

/**
 * The size of the Cube object, expressed as a Point3 object with the values of the widthX, widthY and height properties.
 * @method Phaser.Plugin.Isometric.Cube.size
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Point3} [output] - Optional Point3 object. If given the values will be set into the object, otherwise a brand new Point3 object will be created and returned.
 * @return {Phaser.Plugin.Isometric.Point3} The size of the Cube object
 */
Phaser.Plugin.Isometric.Cube.size = function (a, output) {
    if (typeof output === "undefined" || output === null) {
        output = new Phaser.Plugin.Isometric.Point3(a.widthX, a.widthY, a.height);
    } else {
        output.setTo(a.widthX, a.widthY, a.height);
    }

    return output;
};

/**
 * Returns a new Cube object with the same values for the x, y, z, widthX, widthY, and height properties as the original Cube object.
 * @method Phaser.Plugin.Isometric.Cube.clone
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} [output] - Optional Cube object. If given the values will be set into the object, otherwise a brand new Cube object will be created and returned.
 * @return {Phaser.Plugin.Isometric.Cube}
 */
Phaser.Plugin.Isometric.Cube.clone = function (a, output) {
    if (typeof output === "undefined" || output === null) {
        output = new Phaser.Plugin.Isometric.Cube(a.x, a.y, a.z, a.widthX, a.widthY, a.height);
    } else {
        output.setTo(a.x, a.y, a.z, a.widthX, a.widthY, a.height);
    }

    return output;
};

/**
 * Determines whether the specified coordinates are contained within the region defined by this Cube object.
 * @method Phaser.Plugin.Isometric.Cube.contains
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {number} x - The x coordinate of the point to test.
 * @param {number} y - The y coordinate of the point to test.
 * @param {number} z - The z coordinate of the point to test.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.contains = function (a, x, y, z) {
    if (a.widthX <= 0 || a.widthY <= 0 || a.height <= 0) {
        return false;
    }

    return (x >= a.x && x <= a.frontX && y >= a.y && y <= a.frontY && z >= a.z && z <= a.top);
};

/**
 * Determines whether the specified X and Y coordinates are contained within the region defined by this Cube object.
 * @method Phaser.Plugin.Isometric.Cube.containsXY
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {number} x - The x coordinate of the point to test.
 * @param {number} y - The y coordinate of the point to test.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.containsXY = function (a, x, y) {
    if (a.widthX <= 0 || a.widthY <= 0) {
        return false;
    }

    return (x >= a.x && x <= a.frontX && y >= a.y && y <= a.frontY);
};

/**
 * Determines whether the specified point is contained within the cubic region defined by this Cube object. This method is similar to the Cube.contains() method, except that it takes a Point3 object as a parameter.
 * @method Phaser.Plugin.Isometric.Cube.containsPoint3
 * @param {Phaser.Plugin.Isometric.Cube} a - The Cube object.
 * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 object being checked. Can be Point3 or any object with .x, .y and .z values.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.containsPoint3 = function (a, point3) {
    return Phaser.Plugin.Isometric.Cube.contains(a, point3.x, point3.y, point3.z);
};

/**
 * Determines whether the first Cube object is fully contained within the second Cube object.
 * A Cube object is said to contain another if the second Cube object falls entirely within the boundaries of the first.
 * @method Phaser.Plugin.Isometric.Cube.containsCube
 * @param {Phaser.Plugin.Isometric.Cube} a - The first Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
 * @return {boolean} A value of true if the Cube object contains the specified point; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.containsCube = function (a, b) {

    //  If the given cube has a larger volume than this one then it can never contain it
    if (a.volume > b.volume) {
        return false;
    }

    return (a.x >= b.x && a.y >= b.y && a.z >= b.z && a.frontX <= b.frontX && a.frontY <= b.frontY && a.top <= b.top);

};

/**
 * Determines whether the two Cubes intersect with each other.
 * This method checks the x, y, z, widthX, widthY, and height properties of the Cubes.
 * @method Phaser.Plugin.Isometric.Cube.intersects
 * @param {Phaser.Plugin.Isometric.Cube} a - The first Cube object.
 * @param {Phaser.Plugin.Isometric.Cube} b - The second Cube object.
 * @return {boolean} A value of true if the specified object intersects with this Cube object; otherwise false.
 */
Phaser.Plugin.Isometric.Cube.intersects = function (a, b) {
    if (a.widthX <= 0 || a.widthY <= 0 || a.height <= 0 || b.widthX <= 0 || b.widthY <= 0 || b.height <= 0) {
        return false;
    }
    return !(a.frontX < b.x || a.frontY < b.y || a.x > b.frontX || a.y > b.frontY || a.z > b.top || a.top < b.z);
};
;/**
* @class Phaser.Plugin.Isometric.IsoSprite
*
* @classdesc
* Create a new `IsoSprite` object. IsoSprites are extended versions of standard Sprites that are suitable for axonometric positioning.
*
* IsoSprites are simply Sprites that have three new position properties (isoX, isoY and isoZ) and ask the instance of Phaser.Plugin.Isometric.Projector what their position should be in a 2D scene whenever these properties are changed.
* The IsoSprites retain their 2D position property to prevent any problems and allow you to interact with them as you would a normal Sprite. The upside of this simplicity is that things should behave predictably for those already used to Phaser.
* 
* @constructor
* @extends Phaser.Sprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in 3D space) to position the IsoSprite at.
* @param {number} y - The y coordinate (in 3D space) to position the IsoSprite at.
* @param {number} z - The z coordinate (in 3D space) to position the IsoSprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the IsoSprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this IsoSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
Phaser.Plugin.Isometric.IsoSprite = function (game, x, y, z, key, frame) {

    Phaser.Sprite.call(this, game, x, y, key, frame);

    /**
     * @property {number} type - The const type of this object.
     * @readonly
     */
    this.type = Phaser.Plugin.Isometric.ISOSPRITE;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} _isoPosition - Internal 3D position.
     * @private
     */
    this._isoPosition = new Phaser.Plugin.Isometric.Point3(x, y, z);

    /**
     * @property {number} snap - Snap this IsoSprite's position to the specified value; handy for keeping pixel art snapped to whole pixels.
     * @default
     */
    this.snap = 0;

    /**
     * @property {number} _depth - Internal cached depth value.
     * @readonly
     * @private
     */
    this._depth = 0;

    /**
     * @property {boolean} _depthChanged - Internal invalidation control for depth management.
     * @readonly
     * @private
     */
    this._depthChanged = true;

    /**
     * @property {boolean} _isoPositionChanged - Internal invalidation control for positioning.
     * @readonly
     * @private
     */
    this._isoPositionChanged = true;

    /**
     * @property {boolean} _isoBoundsChanged - Internal invalidation control for isometric bounds.
     * @readonly
     * @private
     */
    this._isoBoundsChanged = true;

    this._project();

    /**
     * @property {Phaser.Plugin.Isometric.Cube} _isoBounds - Internal derived 3D bounds.
     * @private
     */
    this._isoBounds = this.resetIsoBounds();
};

Phaser.Plugin.Isometric.IsoSprite.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Plugin.Isometric.IsoSprite.prototype.constructor = Phaser.Plugin.Isometric.IsoSprite;

/**
 * Internal function called by the World postUpdate cycle.
 *
 * @method Phaser.Plugin.Isometric.IsoSprite#postUpdate
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 */
Phaser.Plugin.Isometric.IsoSprite.prototype.postUpdate = function () {
    Phaser.Sprite.prototype.postUpdate.call(this);

    this._project();
};

/**
 * Internal function that performs the axonometric projection from 3D to 2D space.
 * @method Phaser.Plugin.Isometric.IsoSprite#_project
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 * @private
 */
Phaser.Plugin.Isometric.IsoSprite.prototype._project = function () {
    if (this._isoPositionChanged) {
        this.game.iso.project(this._isoPosition, this.position);

        if (this.snap > 0) {
            this.position.x = Phaser.Math.snapTo(this.position.x, this.snap);
            this.position.y = Phaser.Math.snapTo(this.position.y, this.snap);
        }

        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
    }
};

Phaser.Plugin.Isometric.IsoSprite.prototype.resetIsoBounds = function () {
    if (typeof this._isoBounds === "undefined") {
        this._isoBounds = new Phaser.Plugin.Isometric.Cube();
    }

    var asx = Math.abs(this.scale.x);
    var asy = Math.abs(this.scale.y);

    this._isoBounds.widthX = Math.round(Math.abs(this.width) * 0.5) * asx;
    this._isoBounds.widthY = Math.round(Math.abs(this.width) * 0.5) * asx;
    this._isoBounds.height = Math.round(Math.abs(this.height) - (Math.abs(this.width) * 0.5)) * asy;

    this._isoBounds.x = this.isoX + (this._isoBounds.widthX * -this.anchor.x) + this._isoBounds.widthX * 0.5;
    this._isoBounds.y = this.isoY + (this._isoBounds.widthY * this.anchor.x) - this._isoBounds.widthY * 0.5;
    this._isoBounds.z = this.isoZ - (Math.abs(this.height) * (1 - this.anchor.y)) + (Math.abs(this.width * 0.5));

    return this._isoBounds;
};

/**
 * The axonometric position of the IsoSprite on the x axis. Increasing the x coordinate will move the object down and to the right on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoX
 * @property {number} isoX - The axonometric position of the IsoSprite on the x axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoX", {
    get: function () {
        return this._isoPosition.x;
    },
    set: function (value) {
        this._isoPosition.x = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
    }
});

/**
 * The axonometric position of the IsoSprite on the y axis. Increasing the y coordinate will move the object down and to the left on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoY
 * @property {number} isoY - The axonometric position of the IsoSprite on the y axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoY", {
    get: function () {
        return this._isoPosition.y;
    },
    set: function (value) {
        this._isoPosition.y = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
    }
});

/**
 * The axonometric position of the IsoSprite on the z axis. Increasing the z coordinate will move the object directly upwards on the screen.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoZ
 * @property {number} isoZ - The axonometric position of the IsoSprite on the z axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoZ", {
    get: function () {
        return this._isoPosition.z;
    },
    set: function (value) {
        this._isoPosition.z = value;
        this._depthChanged = this._isoPositionChanged = this._isoBoundsChanged = true;
    }
});

/**
 * A Point3 object representing the axonometric position of the IsoSprite.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoPosition
 * @property {Point3} isoPosition - The axonometric position of the IsoSprite.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoPosition", {
    get: function () {
        return this._isoPosition;
    }
});

/**
 * A Cube object representing the derived boundsof the IsoSprite.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#isoBounds
 * @property {Point3} isoBounds - The derived 3D bounds of the IsoSprite.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoBounds", {
    get: function () {
        if (this._isoBoundsChanged || !this._isoBounds) {
            this.resetIsoBounds();
            this._isoBoundsChanged = false;
        }
        return this._isoBounds;
    }
});

/**
 * The non-unit distance of the IsoSprite from the 'front' of the scene. Used to correctly depth sort a group of IsoSprites.
 *
 * @name Phaser.Plugin.Isometric.IsoSprite#depth
 * @property {number} depth - A calculated value used for depth sorting.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "depth", {
    get: function () {
        if (this._depthChanged === true) {
            this._depth = (this._isoPosition.x + this._isoPosition.y) + (this._isoPosition.z * 1.25);
            this._depthChanged = false;
        }
        return this._depth;
    }
});

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */

Phaser.GameObjectCreator.prototype.isoSprite = function (x, y, z, key, frame) {

    return new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame);

};

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */
Phaser.GameObjectFactory.prototype.isoSprite = function (x, y, z, key, frame, group) {

    if (typeof group === 'undefined') {
        group = this.world;
    }

    return group.add(new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame));

};

Phaser.Plugin.Isometric.prototype.addIsoSprite = function (x, y, z, key, frame, group) {
    return Phaser.GameObjectFactory.prototype.isoSprite.call(this.game.add, x, y, z, key, frame, group);
};



Phaser.Utils.Debug.prototype.isoSprite = function (sprite, color, filled) {

    if (!sprite.isoBounds) {
        return;
    }

    if (typeof filled === 'undefined') {
        filled = true;
    }

    color = color || 'rgba(0,255,0,0.4)';


    var points = [],
        corners = sprite.isoBounds.getCorners();

    var posX = -sprite.game.camera.x;
    var posY = -sprite.game.camera.y;
            
    this.start();

    if (filled) {
        points = [corners[1], corners[3], corners[2], corners[6], corners[4], corners[5], corners[1]];

        points = points.map(function (p) {
            var newPos = sprite.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
            this.context.lineTo(points[i].x, points[i].y);
        }
        this.context.fill();
    } else {
        points = corners.slice(0, corners.length);
        points = points.map(function (p) {
            var newPos = sprite.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });

        this.context.moveTo(points[0].x, points[0].y);
        this.context.beginPath();
        this.context.strokeStyle = color;

        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[3].x, points[3].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[0].x, points[0].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.moveTo(points[3].x, points[3].y);
        this.context.lineTo(points[7].x, points[7].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.moveTo(points[7].x, points[7].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.stroke();
        this.context.closePath();
    }

    this.stop();

};;/**
 * Octree Constructor
 *
 * @class Phaser.Plugin.Isometric.Octree
 * @classdesc A Octree implementation based on Phaser.QuadTree.
 * Original version at https://github.com/timohausmann/quadtree-js/
 * 
 * @constructor
 * @param {number} x - The bottom-back coordinate of the octree.
 * @param {number} y - The bottom-back coordinate of the octree.
 * @param {number} z - The bottom-back coordinate of the octree.
 * @param {number} widthX - The width X (breadth) of the octree.
 * @param {number} widthY - The width Y (depth) of the octree.
 * @param {number} height - The height (Z) of the octree.
 * @param {number} [maxObjects=10] - The maximum number of objects per node.
 * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
 * @param {number} [level=0] - Which level is this?
 */
Phaser.Plugin.Isometric.Octree = function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

    /**
     * @property {number} maxObjects - The maximum number of objects per node.
     * @default
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - The maximum number of levels to break down to.
     * @default
     */
    this.maxLevels = 4;

    /**
     * @property {number} level - The current level.
     */
    this.level = 0;

    /**
     * @property {object} bounds - Object that contains the octree bounds.
     */
    this.bounds = {};

    /**
     * @property {array} objects - Array of octree children.
     */
    this.objects = [];

    /**
     * @property {array} nodes - Array of associated child nodes.
     */
    this.nodes = [];

    /**
     * @property {array} _empty - Internal empty array.
     * @private
     */
    this._empty = [];

    this.reset(x, y, z, widthX, widthY, height, maxObjects, maxLevels, level);

};

Phaser.Plugin.Isometric.Octree.prototype = {

    /**
     * Resets the QuadTree.
     *
     * @method Phaser.Plugin.Isometric.Octree#reset
     * @param {number} x - The bottom-back coordinate of the octree.
     * @param {number} y - The bottom-back coordinate of the octree.
     * @param {number} z - The bottom-back coordinate of the octree.
     * @param {number} widthX - The width X (breadth) of the octree.
     * @param {number} widthY - The width Y (depth) of the octree.
     * @param {number} height - The height (Z) of the octree.
     * @param {number} [maxObjects=10] - The maximum number of objects per node.
     * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
     * @param {number} [level=0] - Which level is this?
     */
    reset: function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

        this.maxObjects = maxObjects || 10;
        this.maxLevels = maxLevels || 4;
        this.level = level || 0;

        this.bounds = {
            x: Math.round(x),
            y: Math.round(y),
            z: Math.round(z),
            widthX: widthX,
            widthY: widthY,
            height: height,
            subWidthX: Math.floor(widthX * 0.5),
            subWidthY: Math.floor(widthY * 0.5),
            subHeight: Math.floor(height * 0.5),
            frontX: Math.round(x) + Math.floor(widthX * 0.5),
            frontY: Math.round(y) + Math.floor(widthY * 0.5),
            top: Math.round(z) + Math.floor(height * 0.5)
        };

        this.objects.length = 0;
        this.nodes.length = 0;

    },

    /**
     * Populates this octree with the children of the given Group. In order to be added the child must exist and have a body property.
     *
     * @method Phaser.Plugin.Isometric.Octree#populate
     * @param {Phaser.Group} group - The Group to add to the octree.
     */
    populate: function (group) {

        group.forEach(this.populateHandler, this, true);

    },

    /**
     * Handler for the populate method.
     *
     * @method Phaser.Plugin.Isometric.Octree#populateHandler
     * @param {Phaser.Plugin.Isometric.IsoSprite|object} sprite - The Sprite to check.
     */
    populateHandler: function (sprite) {

        if (sprite.body && sprite.exists) {
            this.insert(sprite.body);
        }

    },

    /**
     * Split the node into 8 subnodes
     *
     * @method Phaser.Plugin.Isometric.Octree#split
     */
    split: function () {

        //  bottom four octants
        //  -x-y-z
        this.nodes[0] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y-z
        this.nodes[1] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y-z
        this.nodes[2] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y-z
        this.nodes[3] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));

        //  top four octants
        //  -x-y+z
        this.nodes[4] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y+z
        this.nodes[5] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y+z
        this.nodes[6] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y+z
        this.nodes[7] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
    },

    /**
     * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
     *
     * @method Phaser.Plugin.Isometric.Octree#insert
     * @param {Phaser.Plugin.Isometric.Body|Phaser.Plugin.Isometric.Cube|object} body - The Body object to insert into the octree. Can be any object so long as it exposes x, y, z, frontX, frontY and top properties.
     */
    insert: function (body) {

        var i = 0;
        var index;

        //  if we have subnodes ...
        if (this.nodes[0] != null) {
            index = this.getIndex(body);

            if (index != -1) {
                this.nodes[index].insert(body);
                return;
            }
        }

        this.objects.push(body);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            //  Split if we don't already have subnodes
            if (this.nodes[0] == null) {
                this.split();
            }

            //  Add objects to subnodes
            while (i < this.objects.length) {
                index = this.getIndex(this.objects[i]);

                if (index != -1) {
                    //  this is expensive - see what we can do about it
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }

    },

    /**
     * Determine which node the object belongs to.
     *
     * @method Phaser.Plugin.Isometric.Octree#getIndex
     * @param {Phaser.Plugin.Isometric.Cube|object} cube - The bounds in which to check.
     * @return {number} index - Index of the subnode (0-7), or -1 if cube cannot completely fit within a subnode and is part of the parent node.
     */
    getIndex: function (cube) {

        //  default is that cube doesn't fit, i.e. it straddles the internal octants
        var index = -1;

        if (cube.x < this.bounds.frontX && cube.frontX < this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x-y-z octant
                    index = 0;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x-y+z octant
                    index = 4;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x+y-z octant
                    index = 2;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x+y+z octant
                    index = 6;
                }
            }
        } else if (cube.x > this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x-y-z octant
                    index = 1;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x-y+z octant
                    index = 5;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x+y-z octant
                    index = 3;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x+y+z octant
                    index = 7;
                }
            }
        }


        return index;

    },

    /**
     * Return all objects that could collide with the given IsoSprite or Cube.
     *
     * @method Phaser.Plugin.Isometric.Octree#retrieve
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Plugin.Isometric.Cube} source - The source object to check the Octree against. Either a IsoSprite or Cube.
     * @return {array} - Array with all detected objects.
     */
    retrieve: function (source) {

        var returnObjects, index;

        if (source instanceof Phaser.Plugin.Isometric.Cube) {
            returnObjects = this.objects;

            index = this.getIndex(source);
        } else {
            if (!source.body) {
                return this._empty;
            }

            returnObjects = this.objects;

            index = this.getIndex(source.body);
        }

        if (this.nodes[0]) {
            //  If cube fits into a subnode ..
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(source));
            } else {
                //  If cube does not fit into a subnode, check it against all subnodes (unrolled for speed)
                returnObjects = returnObjects.concat(this.nodes[0].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[1].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[2].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[3].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[4].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[5].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[6].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[7].retrieve(source));
            }
        }

        return returnObjects;

    },

    /**
     * Clear the octree.
     * @method Phaser.Plugin.Isometric.Octree#clear
     */
    clear: function () {

        this.objects.length = 0;

        var i = this.nodes.length;

        while (i--) {
            this.nodes[i].clear();
            this.nodes.splice(i, 1);
        }

        this.nodes.length = 0;
    }

};

Phaser.Plugin.Isometric.Octree.prototype.constructor = Phaser.Plugin.Isometric.Octree;

/**
 * Visually renders an Octree to the display.
 *
 * @method Phaser.Utils.Debug#octree
 * @param {Phaser.Plugin.Isometric.Octree} octree - The octree to render.
 * @param {string} color - The color of the lines in the quadtree.
 */
Phaser.Utils.Debug.prototype.octree = function (octree, color) {

    color = color || 'rgba(255,0,0,0.3)';

    this.start();

    var bounds = octree.bounds,
        i, points;

    if (octree.nodes.length === 0) {

        this.context.strokeStyle = color;

        var cube = new Phaser.Plugin.Isometric.Cube(bounds.x, bounds.y, bounds.z, bounds.widthX, bounds.widthY, bounds.height);
        var corners = cube.getCorners();

        var posX = -this.game.camera.x;
        var posY = -this.game.camera.y;

        points = corners.slice(0, corners.length);

        points = points.map(function (p) {
            var newPos = this.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });

        this.context.moveTo(points[0].x, points[0].y);
        this.context.beginPath();
        this.context.strokeStyle = color;

        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[3].x, points[3].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[0].x, points[0].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.moveTo(points[3].x, points[3].y);
        this.context.lineTo(points[7].x, points[7].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.moveTo(points[7].x, points[7].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.stroke();
        this.context.closePath();

        for (i = 0; i < octree.objects.length; i++) {
            this.body(octree.objects[i].sprite, 'rgb(0,255,0)', false);
        }
    } else {
        for (i = 0; i < octree.nodes.length; i++) {
            this.octree(octree.nodes[i]);
        }
    }

    this.stop();

};
;/**
 * @class Phaser.Plugin.Isometric.Point3
 * 
 * @classdesc
 * The Point3 object represents a location in a three-dimensional coordinate system,
 * where x and y represent the horizontal axes and z represents the vertical axis.
 * The following code creates a point at (0,0,0):
 * `var myPoint = new Phaser.Plugin.Isometric.Point3();`
 * 
 * Creates a new Point3 object. If you pass no parameters a Point3 is created set to (0, 0, 0).
 *
 * @constructor
 * @param {number} [x=0] - The horizontal X position of this Point.
 * @param {number} [y=0] - The horizontal Y position of this Point.
 * @param {number} [z=0] - The vertical position of this Point.
 */
Phaser.Plugin.Isometric.Point3 = function (x, y, z) {
    x = x || 0;
    y = y || 0;
    z = z || 0;

    /**
     * @property {number} x - The x value of the point.
     */
    this.x = x;

    /**
     * @property {number} y - The y value of the point.
     */
    this.y = y;

    /**
     * @property {number} z - The z value of the point.
     */
    this.z = z;
};

Phaser.Plugin.Isometric.Point3.prototype = {
    /**
     * Copies the x, y and z properties from any given object to this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#copyFrom
     * @param {any} source - The object to copy from.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object.
     */
    copyFrom: function (source) {

        return this.setTo(source.x, source.y, source.z);

    },

    /**
     * Copies the x, y and z properties from this Point3 to any given object.
     *
     * @method Phaser.Plugin.Isometric.Point3#copyTo
     * @param {any} dest - The object to copy to.
     * @return {Object} The dest object.
     */
    copyTo: function (dest) {

        dest.x = this.x;
        dest.y = this.y;
        dest.z = this.z;

        return dest;

    },

    /**
     * Determines whether the given object's x/y/z values are equal to this Point3 object.
     *
     * @method Phaser.Plugin.Isometric.Point3#equals
     * @param {Phaser.Plugin.Isometric.Point3|any} a - The object to compare with this Point3.
     * @return {boolean} A value of true if the x and y points are equal, otherwise false.
     */
    equals: function (a) {

        return (a.x === this.x && a.y === this.y && a.z === this.z);

    },

    /**
     * Sets the x, y and z values of this Point3 object to the given values.
     * If you omit the y and z value then the x value will be applied to all three, for example:
     * `Point3.set(2)` is the same as `Point3.set(2, 2, 2)`
     * If however you set both x and y, but no z, the z value will be set to 0.
     *
     * @method Phaser.Plugin.Isometric.Point3#set
     * @param {number} x - The x value of this point.
     * @param {number} [y] - The y value of this point. If not given the x value will be used in its place.
     * @param {number} [z] - The z value of this point. If not given and the y value is also not given, the x value will be used in its place.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    set: function (x, y, z) {
        this.x = x || 0;
        this.y = y || ((y !== 0) ? this.x : 0);
        this.z = z || ((typeof y === "undefined") ? this.x : 0);

        return this;
    },

    /**
     * Sets the x, y and z values of this Point3 object to the given values.
     * If you omit the y and z value then the x value will be applied to all three, for example:
     * `Point3.setTo(2)` is the same as `Point3.setTo(2, 2, 2)`
     * If however you set both x and y, but no z, the z value will be set to 0.
     *
     * @method Phaser.Plugin.Isometric.Point3#setTo
     * @param {number} x - The x value of this point.
     * @param {number} [y] - The y value of this point. If not given the x value will be used in its place.
     * @param {number} [z] - The z value of this point. If not given and the y value is also not given, the x value will be used in its place.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    setTo: function (x, y, z) {
        return this.set(x, y, z);
    },

    /**
     * Adds the given x, y and z values to this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#add
     * @param {number} x - The value to add to Point3.x.
     * @param {number} y - The value to add to Point3.y.
     * @param {number} z - The value to add to Point3.z.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    add: function (x, y) {

        this.x += x || 0;
        this.y += y || 0;
        return this;

    },

    /**
     * Subtracts the given x, y and z values from this Point3.
     *
     * @method Phaser.Plugin.Isometric.Point3#subtract
     * @param {number} x - The value to subtract from Point3.x.
     * @param {number} y - The value to subtract from Point3.y.
     * @param {number} z - The value to subtract from Point3.z.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    subtract: function (x, y, z) {

        this.x -= x || 0;
        this.y -= y || 0;
        this.z -= z || 0;

        return this;

    },

    /**
     * Multiplies Point3.x, Point3.y and Point3.z by the given x and y values. Sometimes known as `Scale`.
     *
     * @method Phaser.Plugin.Isometric.Point3#multiply
     * @param {number} x - The value to multiply Point3.x by.
     * @param {number} y - The value to multiply Point3.y by.
     * @param {number} z - The value to multiply Point3.z by.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    multiply: function (x, y, z) {

        this.x *= x || 1;
        this.y *= y || 1;
        this.z *= z || 1;

        return this;

    },

    /**
     * Divides Point3.x, Point3.y and Point3.z by the given x, y and z values.
     *
     * @method Phaser.Plugin.Isometric.Point3#divide
     * @param {number} x - The value to divide Point3.x by.
     * @param {number} y - The value to divide Point3.y by.
     * @param {number} z - The value to divide Point3.z by.
     * @return {Phaser.Plugin.Isometric.Point3} This Point3 object. Useful for chaining method calls.
     */
    divide: function (x, y, z) {

        this.x /= x || 1;
        this.y /= y || 1;
        this.z /= z || 1;

        return this;

    }
};

Phaser.Plugin.Isometric.Point3.prototype.constructor = Phaser.Plugin.Isometric.Point3;

/**
 * Adds the coordinates of two points together to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.add
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.add = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;

    return out;

};

/**
 * Subtracts the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.subtract
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.subtract = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;

    return out;

};

/**
 * Multiplies the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.multiply
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.multiply = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;

    return out;

};

/**
 * Divides the coordinates of two points to create a new point.
 *
 * @method Phaser.Plugin.Isometric.Point3.divide
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} [out] - Optional Point3 to store the value in, if not supplied a new Point3 object3 will be created.
 * @return {Phaser.Plugin.Isometric.Point3} The new Point3 object.
 */
Phaser.Plugin.Isometric.Point3.divide = function (a, b, out) {

    if (typeof out === "undefined") {
        out = new Phaser.Plugin.Isometric.Point3();
    }

    out.x = a.x / b.x;
    out.y = a.y / b.y;
    out.z = a.z / b.z;

    return out;

};

/**
 * Determines whether the two given Point3 objects are equal. They are considered equal if they have the same x, y and z values.
 *
 * @method Phaser.Plugin.Isometric.Point3.equals
 * @param {Phaser.Plugin.Isometric.Point3} a - The first Point3 object.
 * @param {Phaser.Plugin.Isometric.Point3} b - The second Point3 object.
 * @return {boolean} A value of true if the Points3 are equal, otherwise false.
 */
Phaser.Plugin.Isometric.Point3.equals = function (a, b) {

    return (a.x === b.x && a.y === b.y && a.z === b.z);

};
;/**
 * @class Phaser.Plugin.Isometric.Projector
 *
 * @classdesc
 * Creates a new Isometric Projector object, which has helpers for projecting x, y and z coordinates into axonometric x and y equivalents.
 *
 * @constructor
 * @param {Phaser.Game} game - The current game object.
 * @param {number} projectionAngle - The angle of the axonometric projection in radians. Defaults to approx. 0.4636476 (Math.atan(0.5) which is suitable for 2:1 pixel art dimetric)
 * @return {Phaser.Plugin.Isometric.Cube} This Cube object.
 */
Phaser.Plugin.Isometric.Projector = function (game, projectionAngle) {

    /**
     * @property {Phaser.Game} game - The current game object.
     */
    this.game = game;

    /**
     * @property {array} _transform - The pre-calculated axonometric transformation values.
     * @private
     */
    this._transform = null;

    /**
     * @property {number} _projectionAngle - The cached angle of projection in radians.
     * @private
     */
    this._projectionAngle = 0;

    /**
     * @property {number} projectionAngle - The angle of projection in radians.
     * @default
     */
    this.projectionAngle = projectionAngle || Phaser.Plugin.Isometric.CLASSIC;

    /**
     * @property {Phaser.Point} anchor - The x and y offset multipliers as a ratio of the game world size.
     * @default
     */
    this.anchor = new Phaser.Point(0.5, 0);


};

//  Projection angles
Phaser.Plugin.Isometric.CLASSIC = Math.atan(0.5);
Phaser.Plugin.Isometric.ISOMETRIC = Math.PI / 6;
Phaser.Plugin.Isometric.MILITARY = Math.PI / 4;

Phaser.Plugin.Isometric.Projector.prototype = {

    /**
     * Use axonometric projection to transform a 3D Point3 coordinate to a 2D Point coordinate. If given the coordinates will be set into the object, otherwise a brand new Point object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#project
     * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 to project from.
     * @param {Phaser.Point} out - The Point to project to.
     * @return {Phaser.Point} The transformed Point.
     */
    project: function (point3, out) {
        if (typeof out === "undefined") {
            out = new Phaser.Point();
        }

        out.x = (point3.x - point3.y) * this._transform[0];
        out.y = ((point3.x + point3.y) * this._transform[1]) - point3.z;

        out.x += this.game.world.width * this.anchor.x;
        out.y += this.game.world.height * this.anchor.y;

        return out;
    },

    /**
     * Use axonometric projection to transform a 3D Point3 coordinate to a 2D Point coordinate, ignoring the z-axis. If given the coordinates will be set into the object, otherwise a brand new Point object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#projectXY
     * @param {Phaser.Plugin.Isometric.Point3} point3 - The Point3 to project from.
     * @param {Phaser.Point} out - The Point to project to.
     * @return {Phaser.Point} The transformed Point.
     */
    projectXY: function (point3, out) {
        if (typeof out === "undefined") {
            out = new Phaser.Point();
        }

        out.x = (point3.x - point3.y) * this._transform[0];
        out.y = (point3.x + point3.y) * this._transform[1];

        out.x += this.game.world.width * this.anchor.x;
        out.y += this.game.world.height * this.anchor.y;

        return out;
    },

    /**
     * Use reverse axonometric projection to transform a 2D Point coordinate to a 3D Point3 coordinate. If given the coordinates will be set into the object, otherwise a brand new Point3 object will be created and returned.
     * @method Phaser.Plugin.Isometric.Projector#unproject
     * @param {Phaser.Plugin.Isometric.Point} point - The Point to project from.
     * @param {Phaser.Plugin.Isometric.Point3} out - The Point3 to project to.
     * @param {number} [z] - Specified z-plane to project to.
     * @return {Phaser.Plugin.Isometric.Point3} The transformed Point3.
     */
    unproject: function (point, out, z) {
        if (typeof out === "undefined") {
            out = new Phaser.Plugin.Isometric.Point3();
        }

        z = z || 0;


        var x = point.x - this.game.world.x - (this.game.world.width * this.anchor.x);
        var y = point.y - this.game.world.y - (this.game.world.height * this.anchor.y) + z;

        out.x = x / (2 * this._transform[0]) + y / (2 * this._transform[1]);
        out.y = -(x / (2 * this._transform[0])) + y / (2 * this._transform[1]);

        return out;
    },

    /**
     * Perform a simple depth sort on all IsoSprites in the passed group. This function is fast and will accurately sort items on a single z-plane, but breaks down when items are above/below one another in certain configurations.
     *
     * @method Phaser.Plugin.Isometric.Projector#simpleSort
     * @param {Phaser.Group} group - A group of IsoSprites to sort.
     */
    simpleSort: function(group) {
        group.sort("depth");
    },

    /**
     * Perform a volume-based topological sort on all IsoSprites in the passed group or array. Will use the body if available, otherwise it will use an automatically generated bounding cube. If a group is passed, <code>Phaser.Group#sort</code> is automatically called on the specified property.
     * Routine adapted from this tutorial: http://mazebert.com/2013/04/18/isometric-depth-sorting/
     *
     * @method Phaser.Plugin.Isometric.Projector#topologicalSort
     * @param {Phaser.Group|array} group - A group or array of IsoSprites to sort.
     * @param {number} [padding] - The amount of extra tolerance in the depth sorting; larger values reduce flickering when objects collide, but also introduce inaccuracy when objects are close. Defaults to 1.5.
     * @param {string} [prop] - The property to store the depth information on. If not specified, it will default to 'isoDepth'.
     */
    topologicalSort: function (group, padding, prop) {
        var children, isGroup;

        if (group instanceof Phaser.Group) {
            children = group.children;
            isGroup = true;
        }
        else if (group.length) {
            children = group;
        }
        else {
            return;
        }

        prop = prop || "isoDepth";

        if (typeof padding === "undefined") {
            padding = 1.5;
        }
        else {
            padding = padding;
        }

        var a, b, i, j, bounds, behindIndex, len = children.length;

        for (i = 0; i < len; i++) {
            a = children[i];
            behindIndex = 0;
            if (!a.isoSpritesBehind) {
                a.isoSpritesBehind = [];
            }

            for (j = 0; j < len; j++) {
                if (i != j) {
                    b = children[j];
                    bounds = a.body || a.isoBounds;
                    if (b._isoPosition.x + padding < bounds.frontX - padding && b._isoPosition.y + padding < bounds.frontY - padding && b._isoPosition.z + padding < bounds.top - padding) {
                        a.isoSpritesBehind[behindIndex++] = b;
                    }
                }
            }
            a.isoVisitedFlag = false;
        }

        var _sortDepth = 0;

        function visitNode(node) {
            if (node.isoVisitedFlag === false) {
                node.isoVisitedFlag = true;
                var spritesBehindLength = node.isoSpritesBehind.length;
                for (var k = 0; k < spritesBehindLength; k++) {
                    if (node.isoSpritesBehind[k] === null) {
                        break;
                    }
                    else {
                        visitNode(node.isoSpritesBehind[k]);
                        node.isoSpritesBehind[k] = null;
                    }
                }

                node[prop] = _sortDepth++;
            }
        }

        for (i = 0; i < len; i++) {
            visitNode(children[i]);
        }

        if (isGroup) {
            group.sort(prop);
        }
    }

};

/**
 * @name Phaser.Plugin.Isometric.Projector#projectionAngle
 * @property {number} projectionAngle - The angle of axonometric projection.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Projector.prototype, "projectionAngle", {

    get: function () {
        return this._projectionAngle;
    },

    set: function (value) {

        if (value === this._projectionAngle) {
            return;
        }

        this._projectionAngle = value;

        this._transform = [Math.cos(this._projectionAngle), Math.sin(this._projectionAngle)];
    }

});;/**
 * @class Phaser.Plugin.Isometric.Body
 *
 * @classdesc
 * The Physics Body is linked to a single IsoSprite. All physics operations should be performed against the body rather than
 * the IsoSprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
 *
 * @constructor
 * @param {Phaser.Plugin.Isometric.IsoSprite} sprite - The IsoSprite object this physics body belongs to.
 */
Phaser.Plugin.Isometric.Body = function (sprite) {

    /**
     * @property {Phaser.Plugin.Isometric.IsoSprite} sprite - Reference to the parent IsoSprite.
     */
    this.sprite = sprite;

    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = sprite.game;

    /**
     * @property {number} type - The type of physics system this body belongs to.
     */
    this.type = Phaser.Plugin.Isometric.ISOARCADE;

    /**
     * @property {boolean} enable - A disabled body won't be checked for any form of collision or overlap or have its pre/post updates run.
     * @default
     */
    this.enable = true;

    /**
     * @property {Phaser.Point} offset - The offset of the Physics Body from the IsoSprite x/y/z position.
     */
    this.offset = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} position - The position of the physics body.
     * @readonly
     */
    this.position = new Phaser.Plugin.Isometric.Point3(sprite.isoX, sprite.isoY, sprite.isoZ);

    /**
     * @property {Phaser.Point} prev - The previous position of the physics body.
     * @readonly
     */
    this.prev = new Phaser.Plugin.Isometric.Point3(this.position.x, this.position.y, this.position.z);

    /**
     * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
     * @default
     */
    this.allowRotation = true;

    /**
     * @property {number} rotation - The amount the Body is rotated.
     */
    this.rotation = sprite.rotation;

    /**
     * @property {number} preRotation - The previous rotation of the physics body.
     * @readonly
     */
    this.preRotation = sprite.rotation;

    /**
     * @property {number} sourceWidthX - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthX = sprite.texture.frame.width;

    /**
     * @property {number} sourceWidthY - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthY = sprite.texture.frame.width;

    /**
     * @property {number} sourceHeight - The un-scaled original size.
     * @readonly
     */
    this.sourceHeight = sprite.texture.frame.height;

    /**
     * @property {number} widthX - The calculated X width (breadth) of the physics body.
     */
    this.widthX = Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} widthY - The calculated Y width (depth) of the physics body.
     */
    this.widthY = Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} height - The calculated height of the physics body.
     */
    this.height = sprite.height - Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthX = Math.abs(this.widthX * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthY = Math.abs(this.widthY * 0.5);

    /**
     * @property {number} halfHeight - The calculated height / 2 of the physics body.
     */
    this.halfHeight = Math.abs(this.height * 0.5);

    /**
     * @property {Phaser.Plugin.Isometric.Point3} center - The center coordinate of the physics body.
     */
    this.center = new Phaser.Plugin.Isometric.Point3(sprite.isoX + this.halfWidthX, sprite.isoY + this.halfWidthY, sprite.isoZ + this.halfHeight);

    /**
     * @property {Phaser.Plugin.Isometric.Point3} velocity - The velocity in pixels per second sq. of the Body.
     */
    this.velocity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} newVelocity - New velocity.
     * @readonly
     */
    this.newVelocity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} deltaMax - The Sprite position is updated based on the delta x/y values. You can set a cap on those (both +-) using deltaMax.
     */
    this.deltaMax = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} acceleration - The velocity in pixels per second sq. of the Body.
     */
    this.acceleration = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} drag - The drag applied to the motion of the Body.
     */
    this.drag = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {boolean} allowGravity - Allow this Body to be influenced by gravity? Either world or local.
     * @default
     */
    this.allowGravity = true;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} gravity - A local gravity applied to this Body. If non-zero this over rides any world gravity, unless Body.allowGravity is set to false.
     */
    this.gravity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} bounce - The elasticitiy of the Body when colliding. bounce.x/y/z = 1 means full rebound, bounce.x/y/z = 0.5 means 50% rebound velocity.
     */
    this.bounce = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxVelocity = new Phaser.Plugin.Isometric.Point3(10000, 10000, 10000);

    /**
     * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
     * @default
     */
    this.angularVelocity = 0;

    /**
     * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
     * @default
     */
    this.angularAcceleration = 0;

    /**
     * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
     * @default
     */
    this.angularDrag = 0;

    /**
     * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxAngular = 1000;

    /**
     * @property {number} mass - The mass of the Body.
     * @default
     */
    this.mass = 1;

    /**
     * @property {number} angle - The angle of the Body in radians as calculated by its velocity, rather than its visual angle.
     * @readonly
     */
    this.angle = 0;

    /**
     * @property {number} speed - The speed of the Body as calculated by its velocity.
     * @readonly
     */
    this.speed = 0;

    /**
     * @property {number} facing - A const reference to the direction the Body is traveling or facing.
     * @default
     */
    this.facing = Phaser.NONE;

    /**
     * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
     * @default
     */
    this.immovable = false;

    /**
     * If you have a Body that is being moved around the world via a tween or a Group motion, but its local x/y position never
     * actually changes, then you should set Body.moves = false. Otherwise it will most likely fly off the screen.
     * If you want the physics system to move the body around, then set moves to true.
     * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
     * @default
     */
    this.moves = true;

    /**
     * This flag allows you to disable the custom x separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateX = false;

    /**
     * This flag allows you to disable the custom y separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateY = false;

    /**
     * This flag allows you to disable the custom z separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateZ - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateZ = false;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapX - The amount of horizontal overlap during the collision.
     */
    this.overlapX = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapY = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapZ = 0;

    /**
     * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
     * @property {boolean} embedded - Body embed value.
     */
    this.embedded = false;

    /**
     * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
     * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
     */
    this.collideWorldBounds = false;

    /**
     * Set the checkCollision properties to control which directions collision is processed for this Body.
     * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
     * @property {object} checkCollision - An object containing allowed collision.
     */
    this.checkCollision = {
        none: false,
        any: true,
        up: true,
        down: true,
        frontX: true,
        frontY: true,
        backX: true,
        backY: true
    };

    /**
     * This object is populated with boolean values when the Body collides with another.
     * touching.up = true means the collision happened to the top of this Body for example.
     * @property {object} touching - An object containing touching results.
     */
    this.touching = {
        none: true,
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * This object is populated with previous touching values from the bodies previous collision.
     * @property {object} wasTouching - An object containing previous touching results.
     */
    this.wasTouching = {
        none: true,
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
     * For example if blocked.up is true then the Body cannot move up.
     * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
     */
    this.blocked = {
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * @property {number} phase - Is this Body in a preUpdate (1) or postUpdate (2) state?
     */
    this.phase = 0;

    /**
     * @property {boolean} skipTree - If true and you collide this IsoSprite against a Group, it will disable the collision check from using a QuadTree/Octree.
     */
    this.skipTree = false;

    /**
     * @property {boolean} _reset - Internal cache var.
     * @private
     */
    this._reset = true;

    /**
     * @property {number} _sx - Internal cache var.
     * @private
     */
    this._sx = sprite.scale.x;

    /**
     * @property {number} _sy - Internal cache var.
     * @private
     */
    this._sy = sprite.scale.y;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;

    /**
     * @property {number} _dz - Internal cache var.
     * @private
     */
    this._dz = 0;

    /**
     * @property {Array.<Phaser.Plugin.Isometric.Point3>} _corners - The 8 corners of the bounding cube.
     * @private
     */
    this._corners = [new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z + this.height)
    ];

};

Phaser.Plugin.Isometric.Body.prototype = {

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#updateBounds
     * @protected
     */
    updateBounds: function () {

        var asx = Math.abs(this.sprite.scale.x);
        var asy = Math.abs(this.sprite.scale.y);

        if (asx !== this._sx || asy !== this._sy) {
            this.widthX = Math.ceil(this.sprite.width * 0.5);
            this.widthY = Math.ceil(this.sprite.width * 0.5);
            this.height = Math.ceil(this.sprite.height - (this.sprite.width * 0.5));
            this.halfWidthX = Math.floor(this.widthX * 2);
            this.halfWidthY = Math.floor(this.widthY * 2);
            this.halfHeight = Math.floor(this.height * 2);
            this._sx = asx;
            this._sy = asy;
            this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

            this._reset = true;
        }

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#preUpdate
     * @protected
     */
    preUpdate: function () {

        if (!this.enable) {
            return;
        }

        this.phase = 1;

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.backX = this.touching.backX;
        this.wasTouching.backY = this.touching.backY;
        this.wasTouching.frontX = this.touching.frontX;
        this.wasTouching.frontY = this.touching.frontY;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.backX = false;
        this.touching.backY = false;
        this.touching.frontX = false;
        this.touching.frontY = false;

        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.backX = false;
        this.blocked.frontX = false;
        this.blocked.backY = false;
        this.blocked.backX = false;

        this.embedded = false;

        this.updateBounds();

        //  Working out how to incorporate anchors into this was... fun.
        this.position.x = this.sprite.isoX + ((this.widthX * -this.sprite.anchor.x) + this.widthX * 0.5) + this.offset.x;
        this.position.y = this.sprite.isoY + ((this.widthY * this.sprite.anchor.x) - this.widthY * 0.5) + this.offset.y;
        this.position.z = this.sprite.isoZ - (Math.abs(this.sprite.height) * (1 - this.sprite.anchor.y)) + (Math.abs(this.sprite.width * 0.5)) + this.offset.z;


        this.rotation = this.sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset || this.sprite.fresh === true) {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
            this.prev.z = this.position.z;
        }

        if (this.moves) {
            this.game.physics.isoArcade.updateMotion(this);

            this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed, this.velocity.y * this.game.time.physicsElapsed, this.velocity.z * this.game.time.physicsElapsed);

            this.position.x += this.newVelocity.x;
            this.position.y += this.newVelocity.y;
            this.position.z += this.newVelocity.z;

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y || this.position.z !== this.prev.z) {
                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds) {
                this.checkWorldBounds();
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();
        this._dz = this.deltaZ();

        this._reset = false;

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#postUpdate
     * @protected
     */
    postUpdate: function () {

        if (!this.enable) {
            return;
        }

        //  Only allow postUpdate to be called once per frame
        if (this.phase === 2) {
            return;
        }

        this.phase = 2;

        if (this.deltaX() < 0) {
            this.facing = Phaser.Plugin.Isometric.BACKWARDX;
        } else if (this.deltaX() > 0) {
            this.facing = Phaser.Plugin.Isometric.FORWARDX;
        }

        if (this.deltaY() < 0) {
            this.facing = Phaser.Plugin.Isometric.BACKWARDY;
        } else if (this.deltaY() > 0) {
            this.facing = Phaser.Plugin.Isometric.FORWARDY;
        }

        if (this.deltaZ() < 0) {
            this.facing = Phaser.Plugin.Isometric.DOWN;
        } else if (this.deltaZ() > 0) {
            this.facing = Phaser.Plugin.Isometric.UP;
        }

        if (this.moves) {
            this._dx = this.deltaX();
            this._dy = this.deltaY();
            this._dz = this.deltaZ();

            if (this.deltaMax.x !== 0 && this._dx !== 0) {
                if (this._dx < 0 && this._dx < -this.deltaMax.x) {
                    this._dx = -this.deltaMax.x;
                } else if (this._dx > 0 && this._dx > this.deltaMax.x) {
                    this._dx = this.deltaMax.x;
                }
            }

            if (this.deltaMax.y !== 0 && this._dy !== 0) {
                if (this._dy < 0 && this._dy < -this.deltaMax.y) {
                    this._dy = -this.deltaMax.y;
                } else if (this._dy > 0 && this._dy > this.deltaMax.y) {
                    this._dy = this.deltaMax.y;
                }
            }

            if (this.deltaMax.z !== 0 && this._dz !== 0) {
                if (this._dz < 0 && this._dz < -this.deltaMax.z) {
                    this._dz = -this.deltaMax.z;
                } else if (this._dz > 0 && this._dz > this.deltaMax.z) {
                    this._dz = this.deltaMax.z;
                }
            }

            this.sprite.isoX += this._dx;
            this.sprite.isoY += this._dy;
            this.sprite.isoZ += this._dz;
        }

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

        if (this.allowRotation) {
            this.sprite.angle += this.deltaR();
        }

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
        this.prev.z = this.position.z;

    },

    /**
     * Removes this body's reference to its parent sprite, freeing it up for gc.
     *
     * @method Phaser.Plugin.Isometric.Body#destroy
     */
    destroy: function () {

        this.sprite = null;

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#checkWorldBounds
     * @protected
     */
    checkWorldBounds: function () {

        if (this.position.x < this.game.physics.isoArcade.bounds.x && this.game.physics.isoArcade.checkCollision.backX) {
            this.position.x = this.game.physics.isoArcade.bounds.x;
            this.velocity.x *= -this.bounce.x;
            this.blocked.backX = true;
        } else if (this.frontX > this.game.physics.isoArcade.bounds.frontX && this.game.physics.isoArcade.checkCollision.frontX) {
            this.position.x = this.game.physics.isoArcade.bounds.frontX - this.widthX;
            this.velocity.x *= -this.bounce.x;
            this.blocked.frontX = true;
        }

        if (this.position.y < this.game.physics.isoArcade.bounds.y && this.game.physics.isoArcade.checkCollision.backY) {
            this.position.y = this.game.physics.isoArcade.bounds.y;
            this.velocity.y *= -this.bounce.y;
            this.blocked.backY = true;
        } else if (this.frontY > this.game.physics.isoArcade.bounds.frontY && this.game.physics.isoArcade.checkCollision.frontY) {
            this.position.y = this.game.physics.isoArcade.bounds.frontY - this.widthY;
            this.velocity.y *= -this.bounce.y;
            this.blocked.frontY = true;
        }

        if (this.position.z < this.game.physics.isoArcade.bounds.z && this.game.physics.isoArcade.checkCollision.down) {
            this.position.z = this.game.physics.isoArcade.bounds.z;
            this.velocity.z *= -this.bounce.z;
            this.blocked.down = true;
        } else if (this.top > this.game.physics.isoArcade.bounds.top && this.game.physics.isoArcade.checkCollision.up) {
            this.position.z = this.game.physics.isoArcade.bounds.top - this.height;
            this.velocity.z *= -this.bounce.z;
            this.blocked.up = true;
        }

    },

    /**
     * You can modify the size of the physics Body to be any dimension you need.
     * So it could be smaller or larger than the parent Sprite. You can also control the x, y and z offset, which
     * is the position of the Body relative to the center of the Sprite.
     *
     * @method Phaser.Plugin.Isometric.Body#setSize
     * @param {number} widthX - The X width (breadth) of the Body.
     * @param {number} widthY - The Y width (depth) of the Body.
     * @param {number} height - The height of the Body.
     * @param {number} [offsetX] - The X offset of the Body from the Sprite position.
     * @param {number} [offsetY] - The Y offset of the Body from the Sprite position.
     * @param {number} [offsetY] - The Z offset of the Body from the Sprite position.
     */
    setSize: function (widthX, widthY, height, offsetX, offsetY, offsetZ) {

        if (typeof offsetX === 'undefined') {
            offsetX = this.offset.x;
        }
        if (typeof offsetY === 'undefined') {
            offsetY = this.offset.y;
        }
        if (typeof offsetZ === 'undefined') {
            offsetZ = this.offset.z;
        }

        this.sourceWidthX = widthX;
        this.sourceWidthY = widthY;
        this.sourceHeight = height;
        this.widthX = (this.sourceWidthX) * this._sx;
        this.widthY = (this.sourceWidthY) * this._sx;
        this.height = (this.sourceHeight) * this._sy;
        this.halfWidthX = Math.floor(this.widthX * 0.5);
        this.halfWidthY = Math.floor(this.widthY * 0.5);
        this.halfHeight = Math.floor(this.height * 0.5);
        this.offset.setTo(offsetX, offsetY, offsetZ);

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

    },

    /**
     * Resets all Body values (velocity, acceleration, rotation, etc)
     *
     * @method Phaser.Plugin.Isometric.Body#reset
     * @param {number} x - The new x position of the Body.
     * @param {number} y - The new y position of the Body.
     * @param {number} z - The new z position of the Body.
     */
    reset: function (x, y, z) {

        this.velocity.set(0);
        this.acceleration.set(0);

        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        this.position.x = x + ((this.widthX * -this.sprite.anchor.x) + this.widthX * 0.5) + this.offset.x;
        this.position.y = y + ((this.widthY * this.sprite.anchor.x) - this.widthY * 0.5) + this.offset.y;
        this.position.z = z - (Math.abs(this.sprite.height) * (1 - this.sprite.anchor.y)) + (Math.abs(this.sprite.width * 0.5)) + this.offset.z;

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
        this.prev.z = this.position.z;

        this.rotation = this.sprite.angle;
        this.preRotation = this.rotation;

        this._sx = this.sprite.scale.x;
        this._sy = this.sprite.scale.y;

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

        this.sprite._isoPositionChanged = true;

    },

    /**
     * Tests if a world point lies within this Body.
     *
     * @method Phaser.Plugin.Isometric.Body#hitTest
     * @param {number} x - The world x coordinate to test.
     * @param {number} y - The world y coordinate to test.
     * @param {number} z - The world z coordinate to test.
     * @return {boolean} True if the given coordinates are inside this Body, otherwise false.
     */
    hitTest: function (x, y, z) {

        return Phaser.Plugin.Isometric.Cube.contains(this, x, y, z);

    },

    /**
     * Returns true if the bottom of this Body is in contact with either the world bounds.
     *
     * @method Phaser.Plugin.Isometric.Body#onFloor
     * @return {boolean} True if in contact with either the world bounds.
     */
    onFloor: function () {

        return this.blocked.down;

    },

    /**
     * Returns true if either side of this Body is in contact with either the world bounds.
     *
     * @method Phaser.Plugin.Isometric.Body#onWall
     * @return {boolean} True if in contact with world bounds.
     */
    onWall: function () {

        return (this.blocked.frontX || this.blocked.frontY || this.blocked.backX || this.blocked.backY);

    },

    /**
     * Returns the absolute delta x value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsX
     * @return {number} The absolute delta value.
     */
    deltaAbsX: function () {

        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());

    },

    /**
     * Returns the absolute delta y value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsY
     * @return {number} The absolute delta value.
     */
    deltaAbsY: function () {

        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());

    },

    /**
     * Returns the absolute delta z value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsZ
     * @return {number} The absolute delta value.
     */
    deltaAbsZ: function () {

        return (this.deltaZ() > 0 ? this.deltaZ() : -this.deltaZ());

    },

    /**
     * Returns the delta x value. The difference between Body.x now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaX
     * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
     */
    deltaX: function () {

        return this.position.x - this.prev.x;

    },

    /**
     * Returns the delta y value. The difference between Body.y now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaY
     * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
     */
    deltaY: function () {

        return this.position.y - this.prev.y;

    },

    /**
     * Returns the delta z value. The difference between Body.z now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaZ
     * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
     */
    deltaZ: function () {

        return this.position.z - this.prev.z;

    },

    /**
     * Returns the delta r value. The difference between Body.rotation now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaR
     * @return {number} The delta value. Positive if the motion was clockwise, negative if anti-clockwise.
     */
    deltaR: function () {

        return this.rotation - this.preRotation;

    },

    /**
     * Returns the 8 corners that make up the body's bounding cube.
     *
     * @method Phaser.Plugin.Isometric.Body#getCorners
     * @return {Array.<Phaser.Plugin.Isometric.Point3>} An array of Phaser.Plugin.Isometric.Point3 values specifying each corner co-ordinate.
     */
    getCorners: function () {

        this._corners[0].setTo(this.x, this.y, this.z);
        this._corners[1].setTo(this.x, this.y, this.z + this.height);
        this._corners[2].setTo(this.x, this.y + this.widthY, this.z);
        this._corners[3].setTo(this.x, this.y + this.widthY, this.z + this.height);
        this._corners[4].setTo(this.x + this.widthX, this.y, this.z);
        this._corners[5].setTo(this.x + this.widthX, this.y, this.z + this.height);
        this._corners[6].setTo(this.x + this.widthX, this.y + this.widthY, this.z);
        this._corners[7].setTo(this.x + this.widthX, this.y + this.widthY, this.z + this.height);

        return this._corners;

    }
};

/**
 * @name Phaser.Plugin.Isometric.Body#top
 * @property {number} bottom - The top value of this Body (same as Body.z + Body.height)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "top", {

    get: function () {
        return this.position.z + this.height;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#frontX
 * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "frontX", {

    get: function () {
        return this.position.x + this.widthX;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#right
 * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX) - alias used for QuadTree
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "right", {

    get: function () {
        return this.position.x + this.widthX;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#frontY
 * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "frontY", {

    get: function () {
        return this.position.y + this.widthY;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#bottom
 * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY) - alias used for QuadTree
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "bottom", {

    get: function () {
        return this.position.y + this.widthY;
    }

});


/**
 * @name Phaser.Plugin.Isometric.Body#x
 * @property {number} x - The x position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "x", {

    get: function () {
        return this.position.x;
    },

    set: function (value) {

        this.position.x = value;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#y
 * @property {number} y - The y position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "y", {

    get: function () {
        return this.position.y;
    },

    set: function (value) {

        this.position.y = value;

    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#z
 * @property {number} z - The z position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "z", {

    get: function () {
        return this.position.z;
    },

    set: function (value) {

        this.position.z = value;

    }

});

/**
 * Render IsoSprite Body.
 *
 * @method Phaser.Plugin.Isometric.Body#render
 * @param {object} context - The context to render to.
 * @param {Phaser.Plugin.Isometric.Body} body - The Body to render the info of.
 * @param {string} [color='rgba(0,255,0,0.4)'] - color of the debug info to be rendered. (format is css color string).
 * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
 */
Phaser.Plugin.Isometric.Body.render = function (context, body, color, filled) {

    if (typeof filled === 'undefined') {
        filled = true;
    }

    color = color || 'rgba(0,255,0,0.4)';

    var points = [],
        corners = body.getCorners();

    var posX = -body.sprite.game.camera.x;
    var posY = -body.sprite.game.camera.y;

    if (filled) {
        points = [corners[1], corners[3], corners[2], corners[6], corners[4], corners[5], corners[1]];

        points = points.map(function (p) {
            var newPos = body.sprite.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });
        context.beginPath();
        context.fillStyle = color;
        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.fill();
    } else {
        points = corners.slice(0, corners.length);
        points = points.map(function (p) {
            var newPos = body.sprite.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });

        context.moveTo(points[0].x, points[0].y);
        context.beginPath();
        context.strokeStyle = color;

        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[3].x, points[3].y);
        context.lineTo(points[2].x, points[2].y);
        context.lineTo(points[6].x, points[6].y);
        context.lineTo(points[4].x, points[4].y);
        context.lineTo(points[5].x, points[5].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[0].x, points[0].y);
        context.lineTo(points[4].x, points[4].y);
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[2].x, points[2].y);
        context.moveTo(points[3].x, points[3].y);
        context.lineTo(points[7].x, points[7].y);
        context.lineTo(points[6].x, points[6].y);
        context.moveTo(points[7].x, points[7].y);
        context.lineTo(points[5].x, points[5].y);
        context.stroke();
        context.closePath();
    }

};

/**
 * Render IsoSprite Body Physics Data as text.
 *
 * @method Phaser.Plugin.Isometric.Body#renderBodyInfo
 * @param {Phaser.Plugin.Isometric.Body} body - The Body to render the info of.
 * @param {number} x - X position of the debug info to be rendered.
 * @param {number} y - Y position of the debug info to be rendered.
 * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
 */
Phaser.Plugin.Isometric.Body.renderBodyInfo = function (debug, body) {

    debug.line('x: ' + body.x.toFixed(2), 'y: ' + body.y.toFixed(2), 'z: ' + body.z.toFixed(2), 'widthX: ' + body.widthX, 'widthY: ' + body.widthY, 'height: ' + body.height);
    debug.line('velocity x: ' + body.velocity.x.toFixed(2), 'y: ' + body.velocity.y.toFixed(2), 'z: ' + body.velocity.z.toFixed(2), 'deltaX: ' + body._dx.toFixed(2), 'deltaY: ' + body._dy.toFixed(2), 'deltaZ: ' + body._dz.toFixed(2));
    debug.line('acceleration x: ' + body.acceleration.x.toFixed(2), 'y: ' + body.acceleration.y.toFixed(2), 'z: ' + body.acceleration.z.toFixed(2), 'speed: ' + body.speed.toFixed(2), 'angle: ' + body.angle.toFixed(2));
    debug.line('gravity x: ' + body.gravity.x, 'y: ' + body.gravity.y, 'z: ' + body.gravity.z);
    debug.line('bounce x: ' + body.bounce.x.toFixed(2), 'y: ' + body.bounce.y.toFixed(2), 'z: ' + body.bounce.z.toFixed(2));
    debug.line('touching: ', 'frontX: ' + (body.touching.frontX ? 1 : 0) + ' frontY: ' + (body.touching.frontY ? 1 : 0) + ' backX: ' + (body.touching.backX ? 1 : 0) + ' backY: ' + (body.touching.backY ? 1 : 0) + ' up: ' + (body.touching.up ? 1 : 0) + ' down: ' + (body.touching.down ? 1 : 0));
    debug.line('blocked: ', 'frontX: ' + (body.blocked.frontX ? 1 : 0) + ' frontY: ' + (body.blocked.frontY ? 1 : 0) + ' backX: ' + (body.blocked.backX ? 1 : 0) + ' backY: ' + (body.blocked.backY ? 1 : 0) + ' up: ' + (body.blocked.up ? 1 : 0) + ' down: ' + (body.blocked.down ? 1 : 0));

};

Phaser.Plugin.Isometric.Body.prototype.constructor = Phaser.Plugin.Isometric.Body;

Phaser.Utils.Debug.prototype.body = (function (_super) {

    return function (sprite, color, filled, depth) {
        if (sprite.body && sprite.body.type === Phaser.Plugin.Isometric.ISOARCADE) {
            this.start();
            Phaser.Plugin.Isometric.Body.render(this.context, sprite.body, color, filled);
            if (depth) {
                this.text(sprite.depth.toFixed(2), sprite.x, sprite.y, color, '12px Courier');
            }
            this.stop();
        }

        return _super.call(this, sprite, color, filled);
    };

})(Phaser.Utils.Debug.prototype.body);

Phaser.Utils.Debug.prototype.bodyInfo = (function (_super) {

    return function (sprite, x, y, color) {
        if (sprite.body && sprite.body.type === Phaser.Plugin.Isometric.ISOARCADE) {
            this.start(x, y, color, 210);
            Phaser.Plugin.Isometric.Body.renderBodyInfo(this, sprite.body);
            this.stop();
        }

        return _super.call(this, sprite, x, y, color);
    };

})(Phaser.Utils.Debug.prototype.bodyInfo);
;/**
 * IsoArcade Physics constructor.
 *
 * @class Phaser.Plugin.Isometric.Arcade
 * @classdesc IsoArcade Physics Constructor
 * @constructor
 * @param {Phaser.Game} game reference to the current game instance.
 */
Phaser.Plugin.Isometric.Arcade = function (game) {

    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = game;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} gravity - The World gravity setting. Defaults to x: 0, y: 0, z: 0 or no gravity.
     */
    this.gravity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Cube} bounds - The bounds inside of which the physics world exists. Defaults to match the world bounds relatively closely given the isometric projection.
     */
    this.bounds = new Phaser.Plugin.Isometric.Cube(0, 0, 0, game.world.width * 0.5, game.world.width * 0.5, game.world.height);

    /**
     * Set the checkCollision properties to control for which bounds collision is processed.
     * For example checkCollision.down = false means Bodies cannot collide with the World.bounds.bottom.
     * @property {object} checkCollision - An object containing allowed collision flags.
     */
    this.checkCollision = {
        up: true,
        down: true,
        frontX: true,
        frontY: true,
        backX: true,
        backY: true
    };

    /**
     * @property {number} maxObjects - Used by the QuadTree/Octree to set the maximum number of objects per quad.
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - Used by the QuadTree/Octree to set the maximum number of iteration levels.
     */
    this.maxLevels = 4;

    /**
     * @property {number} OVERLAP_BIAS - A value added to the delta values during collision checks.
     */
    this.OVERLAP_BIAS = 4;

    /**
     * @property {boolean} forceX - If true World.separate will always separate on the X and Y axes before Z. Otherwise it will check gravity totals first.
     */
    this.forceXY = false;

    /**
     * @property {boolean} skipTree - If true an Octree/QuadTree will never be used for any collision. Handy for tightly packed games. See also Body.skipTree.
     */
    this.skipTree = false;

    /**
     * @property {boolean} useQuadTree - If true, the collision/overlap routines will use a QuadTree, which will ignore the z position of objects when determining potential collisions. This will be faster if you don't do a lot of stuff on the z-axis.
     */
    this.useQuadTree = false;

    /**
     * @property {Phaser.QuadTree} quadTree - The world QuadTree.
     */
    this.quadTree = new Phaser.QuadTree(this.bounds.x, this.bounds.y, this.bounds.widthX, this.bounds.widthY, this.maxObjects, this.maxLevels);

    /**
     * @property {Phaser.Plugin.Isometric.Octree} octree - The world Octree.
     */
    this.octree = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.widthX, this.bounds.widthY, this.bounds.height, this.maxObjects, this.maxLevels);

    //  Avoid gc spikes by caching these values for re-use

    /**
     * @property {number} _overlap - Internal cache var.
     * @private
     */
    this._overlap = 0;

    /**
     * @property {number} _maxOverlap - Internal cache var.
     * @private
     */
    this._maxOverlap = 0;

    /**
     * @property {number} _velocity1 - Internal cache var.
     * @private
     */
    this._velocity1 = 0;

    /**
     * @property {number} _velocity2 - Internal cache var.
     * @private
     */
    this._velocity2 = 0;

    /**
     * @property {number} _newVelocity1 - Internal cache var.
     * @private
     */
    this._newVelocity1 = 0;

    /**
     * @property {number} _newVelocity2 - Internal cache var.
     * @private
     */
    this._newVelocity2 = 0;

    /**
     * @property {number} _average - Internal cache var.
     * @private
     */
    this._average = 0;

    /**
     * @property {Array} _mapData - Internal cache var.
     * @private
     */
    this._mapData = [];

    /**
     * @property {boolean} _result - Internal cache var.
     * @private
     */
    this._result = false;

    /**
     * @property {number} _total - Internal cache var.
     * @private
     */
    this._total = 0;

    /**
     * @property {number} _angle - Internal cache var.
     * @private
     */
    this._angle = 0;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;

    /**
     * @property {number} _dz - Internal cache var.
     * @private
     */
    this._dz = 0;

};

Phaser.Plugin.Isometric.Arcade.prototype.constructor = Phaser.Plugin.Isometric.Arcade;

Phaser.Plugin.Isometric.Arcade.prototype = {

    /**
     * Updates the size of this physics world.
     *
     * @method Phaser.Plugin.Isometric.Arcade#setBounds
     * @param {number} x - Bottom rear most corner of the world.
     * @param {number} y - Bottom rear most corner of the world.
     * @param {number} z - Bottom rear most corner of the world.
     * @param {number} widthX - New X width (breadth) of the world. Can never be smaller than the Game.width.
     * @param {number} widthY - New Y width (depth) of the world. Can never be smaller than the Game.width.
     * @param {number} height - New height of the world. Can never be smaller than the Game.height.
     */
    setBounds: function (x, y, z, widthX, widthY, height) {

        this.bounds.setTo(x, y, z, widthX, widthY, height);

    },

    /**
     * Updates the size of this physics world to match the size of the game world.
     *
     * @method Phaser.Plugin.Isometric.Arcade#setBoundsToWorld
     */
    setBoundsToWorld: function () {

        this.bounds.setTo(0, 0, 0, this.game.world.width * 0.5, this.game.world.width * 0.5, this.game.world.height);

    },

    /**
     * This will create an IsoArcade Physics body on the given game object or array of game objects.
     * A game object can only have 1 physics body active at any one time, and it can't be changed until the object is destroyed.
     *
     * @method Phaser.Plugin.Isometric.Arcade#enable
     * @param {object|array|Phaser.Group} object - The game object to create the physics body on. Can also be an array or Group of objects, a body will be created on every child that has a `body` property.
     * @param {boolean} [children=true] - Should a body be created on all children of this object? If true it will recurse down the display list as far as it can go.
     */
    enable: function (object, children) {

        if (typeof children === 'undefined') {
            children = true;
        }

        var i = 1;

        if (Array.isArray(object)) {
            i = object.length;

            while (i--) {
                if (object[i] instanceof Phaser.Group) {
                    //  If it's a Group then we do it on the children regardless
                    this.enable(object[i].children, children);
                } else {
                    this.enableBody(object[i]);

                    if (children && object[i].hasOwnProperty('children') && object[i].children.length > 0) {
                        this.enable(object[i], true);
                    }
                }
            }
        } else {
            if (object instanceof Phaser.Group) {
                //  If it's a Group then we do it on the children regardless
                this.enable(object.children, children);
            } else {
                this.enableBody(object);

                if (children && object.hasOwnProperty('children') && object.children.length > 0) {
                    this.enable(object.children, true);
                }
            }
        }

    },

    /**
     * Creates an IsoArcade Physics body on the given game object.
     * A game object can only have 1 physics body active at any one time, and it can't be changed until the body is nulled.
     *
     * @method Phaser.Plugin.Isometric.Arcade#enableBody
     * @param {object} object - The game object to create the physics body on. A body will only be created if this object has a null `body` property.
     */
    enableBody: function (object) {

        if (object.hasOwnProperty('body') && object.body === null) {
            object.body = new Phaser.Plugin.Isometric.Body(object);
        }

    },

    /**
     * Called automatically by a Physics body, it updates all motion related values on the Body.
     *
     * @method Phaser.Plugin.Isometric.Arcade#updateMotion
     * @param {Phaser.Plugin.Isometric.Body} body - The Body object to be updated.
     */
    updateMotion: function (body) {

        this._velocityDelta = this.computeVelocity(0, body, body.angularVelocity, body.angularAcceleration, body.angularDrag, body.maxAngular) - body.angularVelocity;
        body.angularVelocity += this._velocityDelta;
        body.rotation += (body.angularVelocity * this.game.time.physicsElapsed);

        body.velocity.x = this.computeVelocity(1, body, body.velocity.x, body.acceleration.x, body.drag.x, body.maxVelocity.x);
        body.velocity.y = this.computeVelocity(2, body, body.velocity.y, body.acceleration.y, body.drag.y, body.maxVelocity.y);
        body.velocity.z = this.computeVelocity(3, body, body.velocity.z, body.acceleration.z, body.drag.z, body.maxVelocity.z);

    },

    /**
     * A tween-like function that takes a starting velocity and some other factors and returns an altered velocity.
     * Based on a function in Flixel by @ADAMATOMIC
     *
     * @method Phaser.Plugin.Isometric.Arcade#computeVelocity
     * @param {number} axis - 0 for nothing, 1 for X-axis, 2 for Y-axis, 3 for vertical (Z-axis).
     * @param {Phaser.Plugin.Isometric.Body} body - The Body object to be updated.
     * @param {number} velocity - Any component of velocity (e.g. 20).
     * @param {number} acceleration - Rate at which the velocity is changing.
     * @param {number} drag - Really kind of a deceleration, this is how much the velocity changes if Acceleration is not set.
     * @param {number} [max=10000] - An absolute value cap for the velocity.
     * @return {number} The altered Velocity value.
     */
    computeVelocity: function (axis, body, velocity, acceleration, drag, max) {

        max = max || 10000;

        if (axis === 1 && body.allowGravity) {
            velocity += (this.gravity.x + body.gravity.x) * this.game.time.physicsElapsed;
        } else if (axis === 2 && body.allowGravity) {
            velocity += (this.gravity.y + body.gravity.y) * this.game.time.physicsElapsed;
        } else if (axis === 3 && body.allowGravity) {
            velocity += (this.gravity.z + body.gravity.z) * this.game.time.physicsElapsed;
        }

        if (acceleration) {
            velocity += acceleration * this.game.time.physicsElapsed;
        } else if (drag) {
            this._drag = drag * this.game.time.physicsElapsed;

            if (velocity - this._drag > 0) {
                velocity -= this._drag;
            } else if (velocity + this._drag < 0) {
                velocity += this._drag;
            } else {
                velocity = 0;
            }
        }

        if (velocity > max) {
            velocity = max;
        } else if (velocity < -max) {
            velocity = -max;
        }

        return velocity;

    },

    /**
     * Checks for overlaps between two game objects. The objects can be IsoSprites or Groups.
     * You can perform IsoSprite vs. IsoSprite, IsoSprite vs. Group and Group vs. Group overlap checks.
     * Unlike collide the objects are NOT automatically separated or have any physics applied, they merely test for overlap results.
     * The second parameter can be an array of objects, of differing types.
     * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within Groups).
     *
     * @method Phaser.Plugin.Isometric.Arcade#overlap
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group|array} object2 - The second object or array of objects to check. Can be Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {function} [overlapCallback=null] - An optional callback function that is called if the objects overlap. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then overlapCallback will only be called if processCallback returns true.
     * @param {object} [callbackContext] - The context in which to run the callbacks.
     * @return {boolean} True if an overlap occured otherwise false.
     */
    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext) {

        overlapCallback = overlapCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || overlapCallback;

        this._result = false;
        this._total = 0;

        if (Array.isArray(object2)) {
            for (var i = 0, len = object2.length; i < len; i++) {
                this.collideHandler(object1, object2[i], overlapCallback, processCallback, callbackContext, true);
            }
        } else {
            this.collideHandler(object1, object2, overlapCallback, processCallback, callbackContext, true);
        }

        return (this._total > 0);

    },

    /**
     * Checks for collision between two game objects. You can perform IsoSprite vs. IsoSprite, IsoSprite vs. Group or Group vs. Group collisions.
     * The second parameter can be an array of objects, of differing types.
     * The objects are also automatically separated. If you don't require separation then use IsoArcade.overlap instead.
     * An optional processCallback can be provided. If given this function will be called when two sprites are found to be colliding. It is called before any separation takes place,
     * giving you the chance to perform additional checks. If the function returns true then the collision and separation is carried out. If it returns false it is skipped.
     * The collideCallback is an optional function that is only called if two sprites collide. If a processCallback has been set then it needs to return true for collideCallback to be called.
     * NOTE: This function is not recursive, and will not test against children of objects passed (i.e. Groups within Groups).
     *
     * @method Phaser.Plugin.Isometric.Arcade#collide
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group|array} object2 - The second object or array of objects to check. Can be Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {function} [collideCallback=null] - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them, unless you are colliding Group vs. Sprite, in which case Sprite will always be the first parameter.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} [callbackContext] - The context in which to run the callbacks.
     * @return {boolean} True if a collision occured otherwise false.
     */
    collide: function (object1, object2, collideCallback, processCallback, callbackContext) {

        collideCallback = collideCallback || null;
        processCallback = processCallback || null;
        callbackContext = callbackContext || collideCallback;

        this._result = false;
        this._total = 0;

        if (Array.isArray(object2)) {
            for (var i = 0, len = object2.length; i < len; i++) {
                this.collideHandler(object1, object2[i], collideCallback, processCallback, callbackContext, false);
            }
        }
        else {
            this.collideHandler(object1, object2, collideCallback, processCallback, callbackContext, false);
        }

        return (this._total > 0);

    },

    /**
     * Internal collision handler.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideHandler
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object1 - The first object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group.
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Group} object2 - The second object to check. Can be an instance of Phaser.Plugin.Isometric.IsoSprite or Phaser.Group. Can also be an array of objects to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideHandler: function (object1, object2, collideCallback, processCallback, callbackContext, overlapOnly) {

        //  Only collide valid objects
        if (!object2 && object1.type === Phaser.GROUP) {
            this.collideGroupVsSelf(object1, collideCallback, processCallback, callbackContext, overlapOnly);
            return;
        }

        if (object1 && object2 && object1.exists && object2.exists) {
            //  ISOSPRITES
            if (object1.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                if (object2.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                    this.collideSpriteVsSprite(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                } else if (object2.type === Phaser.GROUP) {
                    this.collideSpriteVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
                //  GROUPS
            else if (object1.type === Phaser.GROUP) {
                if (object2.type === Phaser.Plugin.Isometric.ISOSPRITE) {
                    this.collideSpriteVsGroup(object2, object1, collideCallback, processCallback, callbackContext, overlapOnly);
                } else if (object2.type === Phaser.GROUP) {
                    this.collideGroupVsGroup(object1, object2, collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideSpriteVsSprite
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite1 - The first sprite to check.
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite2 - The second sprite to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} True if there was a collision, otherwise false.
     */
    collideSpriteVsSprite: function (sprite1, sprite2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (!sprite1.body || !sprite2.body) {
            return false;
        }

        if (this.separate(sprite1.body, sprite2.body, processCallback, callbackContext, overlapOnly)) {
            if (collideCallback) {
                collideCallback.call(callbackContext, sprite1, sprite2);
            }

            this._total++;
        }

        return true;

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideSpriteVsGroup
     * @private
     * @param {Phaser.Plugin.Isometric.IsoSprite} sprite - The sprite to check.
     * @param {Phaser.Group} group - The Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideSpriteVsGroup: function (sprite, group, collideCallback, processCallback, callbackContext, overlapOnly) {
        var i, len;

        if (group.length === 0 || !sprite.body) {
            return;
        }

        if (sprite.body.skipTree || this.skipTree) {
            for (i = 0, len = group.children.length; i < len; i++) {
                if (group.children[i] && group.children[i].exists) {
                    this.collideSpriteVsSprite(sprite, group.children[i], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        } else {
            if (this.useQuadTree) {
                //  What is the sprite colliding with in the quadTree?
                this.quadTree.clear();

                this.quadTree.reset(this.bounds.x, this.bounds.y, this.bounds.widthX, this.bounds.widthY, this.maxObjects, this.maxLevels);

                this.quadTree.populate(group);

                this._potentials = this.quadTree.retrieve(sprite);
            } else {
                //  What is the sprite colliding with in the octree?
                this.octree.clear();

                this.octree.reset(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.widthX, this.bounds.widthY, this.bounds.height, this.maxObjects, this.maxLevels);

                this.octree.populate(group);

                this._potentials = this.octree.retrieve(sprite);
            }

            for (i = 0, len = this._potentials.length; i < len; i++) {
                //  We have our potential suspects, are they in this group?
                if (this.separate(sprite.body, this._potentials[i], processCallback, callbackContext, overlapOnly)) {
                    if (collideCallback) {
                        collideCallback.call(callbackContext, sprite, this._potentials[i].sprite);
                    }

                    this._total++;
                }
            }
        }
    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideGroupVsSelf
     * @private
     * @param {Phaser.Group} group - The Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} True if there was a collision, otherwise false.
     */
    collideGroupVsSelf: function (group, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group.length === 0) {
            return;
        }

        var len = group.children.length;

        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j <= len; j++) {
                if (group.children[i] && group.children[j] && group.children[i].exists && group.children[j].exists) {
                    this.collideSpriteVsSprite(group.children[i], group.children[j], collideCallback, processCallback, callbackContext, overlapOnly);
                }
            }
        }

    },

    /**
     * An internal function. Use Phaser.Plugin.Isometric.Arcade.collide instead.
     *
     * @method Phaser.Plugin.Isometric.Arcade#collideGroupVsGroup
     * @private
     * @param {Phaser.Group} group1 - The first Group to check.
     * @param {Phaser.Group} group2 - The second Group to check.
     * @param {function} collideCallback - An optional callback function that is called if the objects collide. The two objects will be passed to this function in the same order in which you specified them.
     * @param {function} processCallback - A callback function that lets you perform additional checks against the two objects if they overlap. If this is set then collision will only happen if processCallback returns true. The two objects will be passed to this function in the same order in which you specified them.
     * @param {object} callbackContext - The context in which to run the callbacks.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     */
    collideGroupVsGroup: function (group1, group2, collideCallback, processCallback, callbackContext, overlapOnly) {

        if (group1.length === 0 || group2.length === 0) {
            return;
        }

        for (var i = 0, len = group1.children.length; i < len; i++) {
            if (group1.children[i].exists) {
                this.collideSpriteVsGroup(group1.children[i], group2, collideCallback, processCallback, callbackContext, overlapOnly);
            }
        }

    },

    /**
     * The core separation function to separate two physics bodies.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separate
     * @param {Phaser.Plugin.Isometric.Body} body1 - The first Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The second Body object to separate.
     * @param {function} [processCallback=null] - A callback function that lets you perform additional checks against the two objects if they overlap. If this function is set then the sprites will only be collided if it returns true.
     * @param {object} [callbackContext] - The context in which to run the process callback.
     * @param {boolean} overlapOnly - Just run an overlap or a full collision.
     * @return {boolean} Returns true if the bodies collided, otherwise false.
     */
    separate: function (body1, body2, processCallback, callbackContext, overlapOnly) {

        if (!body1.enable || !body2.enable || !this.intersects(body1, body2)) {
            return false;
        }

        //  They overlap. Is there a custom process callback? If it returns true then we can carry on, otherwise we should abort.
        if (processCallback && processCallback.call(callbackContext, body1.sprite, body2.sprite) === false) {
            return false;
        }

        if (overlapOnly) {
            //  We already know they intersect from the check above, and we don't need separation, so ...
            return true;
        }

        //  Do we separate on X and Y first?
        //  If we weren't having to carry around so much legacy baggage with us, we could do this properly. But alas ...
        if (this.forceXY || Math.abs(this.gravity.z + body1.gravity.z) < Math.abs(this.gravity.x + body1.gravity.x) || Math.abs(this.gravity.z + body1.gravity.z) < Math.abs(this.gravity.y + body1.gravity.y)) {
            this._result = (this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly) || this.separateZ(body1, body2, overlapOnly));
        } else {
            this._result = (this.separateZ(body1, body2, overlapOnly) || this.separateX(body1, body2, overlapOnly) || this.separateY(body1, body2, overlapOnly));
        }

        return this._result;

    },

    /**
     * Check for intersection against two bodies.
     *
     * @method Phaser.Plugin.Isometric.Arcade#intersects
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to check.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to check.
     * @return {boolean} True if they intersect, otherwise false.
     */
    intersects: function (body1, body2) {

        if (body1.frontX <= body2.x) {
            return false;
        }

        if (body1.frontY <= body2.y) {
            return false;
        }

        if (body1.x >= body2.frontX) {
            return false;
        }

        if (body1.y >= body2.frontY) {
            return false;
        }

        if (body1.top <= body2.z) {
            return false;
        }

        if (body1.z >= body2.top) {
            return false;
        }

        return true;

    },

    /**
     * The core separation function to separate two physics bodies on the x axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateX
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateX: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;

            if (body1.deltaX() === 0 && body2.deltaX() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaX() > body2.deltaX()) {
                //  Body1 is moving forward and/or Body2 is moving back
                this._overlap = body1.frontX - body2.x;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.frontX === false || body2.checkCollision.backX === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.frontX = true;
                    body2.touching.none = false;
                    body2.touching.backX = true;
                }
            } else if (body1.deltaX() < body2.deltaX()) {
                //  Body1 is moving back and/or Body2 is moving forward
                this._overlap = body1.x - body2.widthX - body2.x;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.backX === false || body2.checkCollision.frontX === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.backX = true;
                    body2.touching.none = false;
                    body2.touching.frontX = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapX = this._overlap;
                body2.overlapX = this._overlap;

                if (overlapOnly || body1.customSeparateX || body2.customSeparateX) {
                    return true;
                }

                this._velocity1 = body1.velocity.x;
                this._velocity2 = body2.velocity.x;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.x = body1.x - this._overlap;
                    body2.x += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.x = this._average + this._newVelocity1 * body1.bounce.x;
                    body2.velocity.x = this._average + this._newVelocity2 * body2.bounce.x;
                } else if (!body1.immovable) {
                    body1.x = body1.x - this._overlap;
                    body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                } else if (!body2.immovable) {
                    body2.x += this._overlap;
                    body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                }

                return true;
            }
        }

        return false;

    },

    /**
     * The core separation function to separate two physics bodies on the x axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateY
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateY: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable bodies
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;

            if (body1.deltaY() === 0 && body2.deltaY() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaY() > body2.deltaY()) {
                //  Body1 is moving forward and/or Body2 is moving back
                this._overlap = body1.frontY - body2.y;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.frontY === false || body2.checkCollision.backY === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.frontY = true;
                    body2.touching.none = false;
                    body2.touching.backY = true;
                }
            } else if (body1.deltaY() < body2.deltaY()) {
                //  Body1 is moving back and/or Body2 is moving forward
                this._overlap = body1.y - body2.widthY - body2.y;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.backY === false || body2.checkCollision.frontY === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.backY = true;
                    body2.touching.none = false;
                    body2.touching.frontY = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapY = this._overlap;
                body2.overlapY = this._overlap;

                if (overlapOnly || body1.customSeparateY || body2.customSeparateY) {
                    return true;
                }

                this._velocity1 = body1.velocity.y;
                this._velocity2 = body2.velocity.y;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.y = body1.y - this._overlap;
                    body2.y += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.y = this._average + this._newVelocity1 * body1.bounce.y;
                    body2.velocity.y = this._average + this._newVelocity2 * body2.bounce.y;
                } else if (!body1.immovable) {
                    body1.y = body1.y - this._overlap;
                    body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;
                } else if (!body2.immovable) {
                    body2.y += this._overlap;
                    body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;
                }

                return true;
            }
        }

        return false;

    },

    /**
     * The core separation function to separate two physics bodies on the z axis.
     *
     * @private
     * @method Phaser.Plugin.Isometric.Arcade#separateZ
     * @param {Phaser.Plugin.Isometric.Body} body1 - The Body object to separate.
     * @param {Phaser.Plugin.Isometric.Body} body2 - The Body object to separate.
     * @param {boolean} overlapOnly - If true the bodies will only have their overlap data set, no separation or exchange of velocity will take place.
     * @return {boolean} Returns true if the bodies were separated, otherwise false.
     */
    separateZ: function (body1, body2, overlapOnly) {

        //  Can't separate two immovable or non-existing bodys
        if (body1.immovable && body2.immovable) {
            return false;
        }

        this._overlap = 0;

        //  Check if the hulls actually overlap
        if (this.intersects(body1, body2)) {
            this._maxOverlap = body1.deltaAbsZ() + body2.deltaAbsZ() + this.OVERLAP_BIAS;

            if (body1.deltaZ() === 0 && body2.deltaZ() === 0) {
                //  They overlap but neither of them are moving
                body1.embedded = true;
                body2.embedded = true;
            } else if (body1.deltaZ() > body2.deltaZ()) {
                //  Body1 is moving down and/or Body2 is moving up
                this._overlap = body1.top - body2.z;

                if ((this._overlap > this._maxOverlap) || body1.checkCollision.down === false || body2.checkCollision.up === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.down = true;
                    body2.touching.none = false;
                    body2.touching.up = true;
                }
            } else if (body1.deltaZ() < body2.deltaZ()) {
                //  Body1 is moving up and/or Body2 is moving down
                this._overlap = body1.z - body2.top;

                if ((-this._overlap > this._maxOverlap) || body1.checkCollision.up === false || body2.checkCollision.down === false) {
                    this._overlap = 0;
                } else {
                    body1.touching.none = false;
                    body1.touching.up = true;
                    body2.touching.none = false;
                    body2.touching.down = true;
                }
            }

            //  Then adjust their positions and velocities accordingly (if there was any overlap)
            if (this._overlap !== 0) {
                body1.overlapZ = this._overlap;
                body2.overlapZ = this._overlap;

                if (overlapOnly || body1.customSeparateY || body2.customSeparateZ) {
                    return true;
                }

                this._velocity1 = body1.velocity.z;
                this._velocity2 = body2.velocity.z;

                if (!body1.immovable && !body2.immovable) {
                    this._overlap *= 0.5;

                    body1.z = body1.z - this._overlap;
                    body2.z += this._overlap;

                    this._newVelocity1 = Math.sqrt((this._velocity2 * this._velocity2 * body2.mass) / body1.mass) * ((this._velocity2 > 0) ? 1 : -1);
                    this._newVelocity2 = Math.sqrt((this._velocity1 * this._velocity1 * body1.mass) / body2.mass) * ((this._velocity1 > 0) ? 1 : -1);
                    this._average = (this._newVelocity1 + this._newVelocity2) * 0.5;
                    this._newVelocity1 -= this._average;
                    this._newVelocity2 -= this._average;

                    body1.velocity.z = this._average + this._newVelocity1 * body1.bounce.z;
                    body2.velocity.z = this._average + this._newVelocity2 * body2.bounce.z;
                } else if (!body1.immovable) {
                    body1.z = body1.z - this._overlap;
                    body1.velocity.z = this._velocity2 - this._velocity1 * body1.bounce.z;

                    //  This is special case code that handles things like moving platforms you can ride
                    if (body2.moves) {
                        body1.x += body2.x - body2.prev.x;
                        body1.y += body2.y - body2.prev.y;
                    }
                } else if (!body2.immovable) {
                    body2.z += this._overlap;
                    body2.velocity.z = this._velocity1 - this._velocity2 * body2.bounce.z;

                    //  This is special case code that handles things like moving platforms you can ride
                    if (body1.moves) {
                        body2.x += body1.x - body1.prev.x;
                        body1.y += body2.y - body2.prev.y;
                    }
                }

                return true;
            }

        }

        return false;

    },

    /**
     * Find the distance between two display objects (like Sprites).
     *
     * @method Phaser.Plugin.Isometric.Arcade#distanceBetween
     * @param {any} source - The Display Object to test from.
     * @param {any} target - The Display Object to test to.
     * @return {number} The distance between the source and target objects.
     */
    distanceBetween: function (source, target) {

        this._dx = source.x - target.x;
        this._dy = source.y - target.y;
        this._dz = source.z - target.z;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy + this._dz * this._dz);

    },

    /**
     * Find the distance between a display object (like a Sprite) and the given x/y coordinates only (ignore z).
     * The calculation is made from the display objects x/y coordinate. This may be the top-left if its anchor hasn't been changed.
     * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
     *
     * @method Phaser.Plugin.Isometric.Arcade#distanceToXY
     * @param {any} displayObject - The Display Object to test from.
     * @param {number} x - The x coordinate to test to.
     * @param {number} y - The y coordinate to test to.
     * @return {number} The distance between the object and the x/y coordinates.
     */
    distanceToXY: function (displayObject, x, y) {

        this._dx = displayObject.x - x;
        this._dy = displayObject.y - y;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    },


    /**
     * Find the distance between a display object (like a Sprite) and the given x/y/z coordinates.
     * The calculation is made from the display objects x/y/z coordinate. This may be the top-left if its anchor hasn't been changed.
     * If you need to calculate from the center of a display object instead use the method distanceBetweenCenters()
     *
     * @method Phaser.Plugin.Isometric.Arcade#distanceToXYZ
     * @param {any} displayObject - The Display Object to test from.
     * @param {number} x - The x coordinate to test to.
     * @param {number} y - The y coordinate to test to.
     * @param {number} z - The y coordinate to test to
     * @return {number} The distance between the object and the x/y coordinates.
     */
    distanceToXYZ: function (displayObject, x, y, z) {

        this._dx = displayObject.x - x;
        this._dy = displayObject.y - y;
        this._dz = displayObject.y - z;

        return Math.sqrt(this._dx * this._dx + this._dy * this._dy + this._dz * this._dz);

    }

};

Phaser.Physics.prototype.isoArcade = null;

Phaser.Physics.prototype.parseConfig = (function (_super) {

    return function () {
        if (this.config.hasOwnProperty('isoArcade') && this.config['isoArcade'] === true && Phaser.Plugin.Isometric.hasOwnProperty('IsoArcade')) {
            this.isoArcade = new Phaser.Plugin.Isometric(this.game, this.config);
        }
        return _super.call(this);
    };

})(Phaser.Physics.prototype.parseConfig);

Phaser.Physics.prototype.startSystem = (function (_super) {

    return function (system) {
        if (system === Phaser.Plugin.Isometric.ISOARCADE && this.isoArcade === null) {
            this.isoArcade = new Phaser.Plugin.Isometric.Arcade(this.game);
            this.setBoundsToWorld();
        }
        return _super.call(this, system);
    };

})(Phaser.Physics.prototype.startSystem);

Phaser.Physics.prototype.enable = (function (_super) {

    return function (sprite, system) {
        if (system === Phaser.Plugin.Isometric.ISOARCADE && this.isoArcade) {
            this.isoArcade.enable(sprite);
        }
        return _super.call(this, sprite, system);
    };

})(Phaser.Physics.prototype.enable);

Phaser.Physics.prototype.setBoundsToWorld = (function (_super) {

    return function () {
        if (this.isoArcade) {
            this.isoArcade.setBoundsToWorld();
        }
        return _super.call(this);
    };

})(Phaser.Physics.prototype.setBoundsToWorld);

Phaser.Physics.prototype.destroy = (function (_super) {

    return function () {
        this.isoArcade = null;

        return _super.call(this);
    };

})(Phaser.Physics.prototype.destroy);


/***/ }),
/* 65 */
/*!****************************!*\
  !*** ./src/game/config.js ***!
  \****************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  gameWidth: 720,
  gameHeight: 570,
  localStorageName: 'isometric-client'
});

/***/ }),
/* 66 */
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-0f8fd74f","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/client/Client.vue ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "container" }, [
      _c("div", { attrs: { id: "content" } })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-0f8fd74f", esExports)
  }
}

/***/ }),
/* 67 */
/*!*********************************************!*\
  !*** ./src/components/account/Register.vue ***!
  \*********************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Register_vue__ = __webpack_require__(/*! !babel-loader!../../../node_modules/vue-loader/lib/selector?type=script&index=0!./Register.vue */ 19);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c68eb416_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Register_vue__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-c68eb416","hasScoped":false,"buble":{"transforms":{}}}!../../../node_modules/vue-loader/lib/selector?type=template&index=0!./Register.vue */ 68);
var disposed = false
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/component-normalizer */ 4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Register_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_c68eb416_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Register_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/account/Register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c68eb416", Component.options)
  } else {
    hotAPI.reload("data-v-c68eb416", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 68 */
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-c68eb416","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/account/Register.vue ***!
  \**********************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "wrapper" }, [
      _c("div", { staticClass: "wrapper__content" }, [
        _c("div", { staticClass: "register" }, [
          _c("div", { staticClass: "register__top" }),
          _vm._v(" "),
          _c("div", { staticClass: "register__content" }, [
            _c("div", { staticClass: "container-fluid" }, [
              _c("div", { staticClass: "row" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "box-wrapper col-12 col-sm-12 col-md-12 col-lg-12"
                  },
                  [
                    _c("div", { staticClass: "box box--orange" }, [
                      _c("div", { staticClass: "box__wrapper" }, [
                        _c("div", { staticClass: "box__header" }, [
                          _c("span", [_vm._v("REGISTRATION")]),
                          _vm._v(" "),
                          _c("span", { staticClass: "pull-right" }, [
                            _c(
                              "a",
                              {
                                staticClass: "right-link",
                                attrs: { href: "/account/login" }
                              },
                              [_c("u", [_vm._v("Cancel")])]
                            )
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "box__body" }, [
                          _c(
                            "form",
                            {
                              attrs: {
                                role: "form",
                                method: "POST",
                                novalidate: "novalidate"
                              }
                            },
                            [
                              _c("div", { staticClass: "box__body-step1" }, [
                                _c("div", { staticClass: "frank" }, [
                                  _c("div", { staticClass: "frank__speech" }, [
                                    _c("p", [
                                      _vm._v(
                                        "Now the fun begins. Choose what you want to look like in Habbo!"
                                      )
                                    ])
                                  ]),
                                  _vm._v(" "),
                                  _c("img", {
                                    staticClass: "frank__figure",
                                    attrs: {
                                      src: "/assets/images/frank_speech.gif"
                                    }
                                  })
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "step-content" }, [
                                  _c("input", {
                                    attrs: {
                                      type: "hidden",
                                      name: "dob",
                                      id: "dob",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("p", [_vm._v("Figure maker to go here!")]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      id: "figure",
                                      type: "text",
                                      name: "figure",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "step__buttons" }, [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-right",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step2" }
                                          },
                                          [_vm._v("Continue")]
                                        )
                                      ]
                                    )
                                  ])
                                ])
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "box__body-step2" }, [
                                _c("div", { staticClass: "frank" }, [
                                  _c("div", { staticClass: "frank__speech" }, [
                                    _c("p", [
                                      _vm._v(
                                        "Now to pick your Habbo name! Who are you going to be in Habbo?"
                                      )
                                    ])
                                  ])
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "step-content" }, [
                                  _c("h1", [_vm._v("Choose your Habbo Name:")]),
                                  _vm._v(" "),
                                  _c("p", [
                                    _vm._v("Your "),
                                    _c("strong", [_vm._v("Habbo Name")]),
                                    _vm._v(
                                      " can contain lowercase and uppercase letters. Your Habbo Name can also contain numbers and the following characters: -=?!@:."
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("label", { attrs: { for: "username" } }, [
                                    _vm._v("Habbo Name")
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      id: "username",
                                      type: "text",
                                      name: "username",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("hr"),
                                  _vm._v(" "),
                                  _c("h1", [
                                    _vm._v("Now, choose your password:")
                                  ]),
                                  _vm._v(" "),
                                  _c("p", [
                                    _vm._v("Your "),
                                    _c("strong", [_vm._v("password")]),
                                    _vm._v(
                                      " must be at least six characters long. Your "
                                    ),
                                    _c("strong", [_vm._v("password")]),
                                    _vm._v(" can contain both "),
                                    _c("strong", [_vm._v("uppercase letters")]),
                                    _vm._v(" and "),
                                    _c("strong", [_vm._v("numbers")]),
                                    _vm._v(".")
                                  ]),
                                  _vm._v(" "),
                                  _c("label", { attrs: { for: "password" } }, [
                                    _vm._v("Password")
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      id: "password",
                                      type: "password",
                                      name: "password",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("label", { attrs: { for: "password" } }, [
                                    _vm._v("Retype Password")
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      id: "password-confirm",
                                      type: "password",
                                      name: "password_confirmation",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("strong", [
                                    _vm._v(
                                      "Please check your password is long enough, contains all required characters, and is rewritten correctly."
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "step__buttons" }, [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-left",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step2" }
                                          },
                                          [_vm._v("Back")]
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-right",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step3" }
                                          },
                                          [_vm._v("Continue")]
                                        )
                                      ]
                                    )
                                  ])
                                ])
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "box__body-step3" }, [
                                _c("div", { staticClass: "frank" }, [
                                  _c("div", { staticClass: "frank__speech" }, [
                                    _c("p", [
                                      _vm._v(
                                        "Remember to give us your real E-mail - it's the only way we can award you credits and awesome prizes!"
                                      )
                                    ])
                                  ])
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "step-content" }, [
                                  _c("p", [
                                    _vm._v("Please enter your email address.")
                                  ]),
                                  _vm._v(" "),
                                  _c("label", { attrs: { for: "email" } }, [
                                    _vm._v("Your Email Address:")
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      id: "email",
                                      type: "email",
                                      name: "email",
                                      required: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      type: "checkbox",
                                      name: "subscribe",
                                      id: "subscribe",
                                      checked: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "label",
                                    {
                                      staticClass: "checkbox-label",
                                      attrs: { for: "subscribe" }
                                    },
                                    [
                                      _vm._v(
                                        "Yes! I want the latest Habbo news sent straight to my inbox."
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "step__buttons" }, [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-left",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step3" }
                                          },
                                          [_vm._v("Back")]
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-right",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step4" }
                                          },
                                          [_vm._v("Continue")]
                                        )
                                      ]
                                    )
                                  ])
                                ])
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "box__body-step4" }, [
                                _c("div", { staticClass: "frank" }, [
                                  _c("div", { staticClass: "frank__speech" }, [
                                    _c("p", [
                                      _vm._v(
                                        "Please read the Terms and Conditions carefully. They are more exciting than they look!"
                                      )
                                    ])
                                  ])
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "step-content" }, [
                                  _c("p", [
                                    _vm._v(
                                      "You must agree to the following terms before entering Habbo Hotel."
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "terms-and-conditions" },
                                    [
                                      _c("p", [
                                        _vm._v(
                                          "BY INSTALLING, USING OR OTHERWISE ACCESSING THE SERVICE, YOU AGREE TO THESE TERMS OF SERVICE AND OUR PRIVACY POLICY. IF YOU DO NOT AGREE, YOU DO NOT HAVE PERMISSION TO INSTALL, USE OR OTHERWISE ACCESS THE SERVICE.  PERMISSION TO USE THE SERVICE IS VOID WHERE PROHIBITED."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The terms of this agreement (“Terms of Service” or “Terms”) govern the relationship between you and Sulake Corporation Oy (hereinafter “Sulake” or “Us” or “We”) regarding your use of Habbo Hotel located at www.habbo.com or our other sites or services that post these Terms (the “Service(s)”), whether accessed by computer, mobile phone or other device (each, a “Device”). Use of the Service is also governed by the Service’s Privacy Policy, incorporated herein by reference, and you consent to our practices as explained there.   You further agree that we may change, alter, or modify the settings or configurations on your Device in order to allow for or optimize your use of the Service.  In addition, some of our Service products or services may be made available subject to certain additional or different terms and/or conditions that apply to them (in each such instance, and collectively, “Additional Terms”), which will supplement these Terms."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Before accessing or using the Service, you must agree to these Terms and the Service’s Privacy Policyand register an account on the Service (an “Account”).  By registering for an Account or otherwise using the Service, you represent that you are 13 or older and you understand and accept these Terms and the Service’s Privacy Policy. If you are under the age of majority where you live you represent that your legal guardian has also reviewed and agreed to these Terms and the Service’s Privacy Policy. The Service may exist on, or in connection with, a number of third-party platforms (e.g., Facebook). Please be aware that your activities on these platforms may also be subject to the terms of service and/or privacy policies for that platform, and we are not responsible for these third parties."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake reserves the right to prospectively revise these Terms at any time (meaning the old terms continue to apply to your use that predates the changes).  If we do, we will post the modified Terms on the Service and indicate the date of most the recent change above, and you agree that this will be sufficient notice to you that new terms apply and your continued use indicates your agreement to the new terms in connection with that ongoing use."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The Service contains a variety of: (i) materials and other items relating to Sulake and its products and services, and similar items from our licensors and other third parties, including all layout, information, text, data, files, images, scripts, designs, graphics, button icons, instructions, illustrations, photographs, audio clips, music, sounds, pictures, videos, advertising copy, URLs, technology, software, communications, interactive features, the “look and feel” of the Service, and the compilation, assembly, and arrangement of the materials of the Service and any and all copyrightable material (including source and object code); (ii) trademarks, logos, trade names, service marks, and trade identities of various parties, including those of Sulake(collectively,  “Trademarks”); and (iii) other forms of intellectual property (all of the foregoing, collectively “Content”). Unless otherwise specified in writing, all Content is owned, controlled, or licensed by Sulake or its licensors.  All Content is copyrighted under copyright laws and/or similar laws protecting it from unauthorized use. The Trademarks, including but not limited to Sulake, its logos, and Habbo and its logos, may not be used without Sulake’s express written permission. You agree not to copy, redistribute, publish or otherwise exploit any Content in violation of the intellectual property rights of Sulake or any other third party."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Subject to your strict compliance with these Terms, Sulake grants you a limited, non-exclusive, revocable, non-assignable, personal, and non-transferable license to (i) download (temporary storage only), display, view, use, play, and/or print one copy of the Content (excluding source and object code in raw form or otherwise, other than as made available to access and use to enable display and functionality) on a Device for your personal, non-commercial use only, and (ii) to use certain Content that we may from time to time make available on the Service explicitly for you for use as part of your User-Generated Content (defined below) (“Sulake Licensed Elements”), but only for such purposes as may be explicitly stated at the time that the Sulake Licensed Elements are made available on the Service; but we and our licensors and certain other third parties, as the case may be, retain ownership of such SulakeLicensed Elements.  The foregoing limited license (i) does not give you any ownership of, or any other intellectual property interest in, any Content, and (ii) may be immediately suspended or terminated for any reason, in Sulake’s sole discretion, and without advance notice or liability.  In some instances, we may permit you to have greater access to and use of Content and/or SulakeLicensed Elements, subject to Additional Terms."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The Service may include virtual, in-game currency (“Virtual Currency”), such as credits, coins, cash, or points (e.g., Habbo coins and diamonds), that may be purchased with “real world” money or obtained through interactions with a third-party service. Virtual Currency may be used to purchase virtual, in-game digital items (“Virtual Goods”).  Your purchase or award of Virtual Currency and Virtual Goods are merely a grant by us to a limited, non-exclusive, revocable, non-assignable, personal, and non-transferable right to use the Virtual Currency and Virtual Goods as part of the Service under these Terms and any applicable Additional Terms we provide at the time.  Accordingly, you have no other interest, including no property, proprietary, intellectual property, ownership, or monetary interest, in your Virtual Currency and Virtual Goods, which remain our Content and property.  We reserve the absolute right, at any time and in our sole discretion, to manage, regulate, control, modify or eliminate Virtual Currency and/or Virtual Goods."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Virtual Currency or Virtual Goods cannot be redeemed by you for “real world” money, goods, or other items of monetary value from any party. Transfers of Virtual Currency or Virtual Goods by you outside of what we permit on the Service are strictly prohibited. This means you may not buy or sell Virtual Currency or Virtual Goods for “real world” money or otherwise exchange items for value outside of the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You also agree that all sales of Virtual Currency and Virtual Goods are final unless otherwise detailed in the applicable Additional Terms. No refunds will be given by Sulake. Sulake has the absolute right to manage, regulate, control, modify, and/or eliminate Virtual Currency and/or Virtual Goods as it sees fit in its sole discretion, including the right to terminate or suspend your account or discontinue its Service (in whole or in part) for any reason, and Sulake shall have no liability to you or anyone for the exercise of such rights."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "It is possible for you contribute to the Service through the submission of Content you create or contribute to the creation of (“User-Generated Content”). User-Generated Content, includes without limitation, various kinds of content that are submitted by users (for example, wall posts, messages, reviews, and actions with others end users), as well as any feedback, comments, or suggestions that users you provide to us regarding the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You will retain whatever ownership you may have in your User-Generated Content, but you hereby irrevocably grant to Sulake a non-exclusive, worldwide, royalty-free, sublicenseable, and transferable license to use, reproduce, distribute, prepare derivative works of, display, perform and otherwise exploit in any manner whatsoever the User-Generated Content, or any portion thereof, you submit to the Service or otherwise to Sulake, by any and all means, and in all forms of media, now known or hereafter developed, and to advertise, market and promote the same. To the extent permitted by applicable laws, you hereby waive any moral rights or rights of publicity or privacy you may have in or in connection with such User-Generated Content."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You represent that all User-Generated Content that you submit to the Service is wholly original to you and you exclusively own the rights to such User-Generated Content, and/or you have all necessary authority to grant all of the rights and licenses to Sulake under these Terms and/or any applicable Additional Terms, and that Sulake and its licensees may exercise those rights without Sulake or its licensees or successors incurring any third-party obligations or liability."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake reserves the right to control and operate our Service in the manner we deem appropriate.  In connection with doing so, we may monitor User-Generated Content and your activities in connection with the Service, but cannot monitor or prescreen all of the User-Generated Content and do not attempt to do so. We have the right, but not the obligation, to edit, refuse to post, or remove any User-Generated Content posted on the Service that we deem objectionable or think   violates these Terms and any applicable Additional Terms, or the spirit of these Terms and any applicable Additional Terms, in our sole discretion and determination. If you encounter something you find objectionable and in violation of these Terms, you can bring it to our attention by contacting us here."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "We do not assume any responsibility or liability for User-Generated Content that is generated by users of the Service. You bear the entire risk of the completeness, accuracy or usefulness of any User-Generated Content found in connection with the Service. You are solely responsible for your interactions with other users of the Service and any other parties with whom you interact through the Service. Sulake reserves the right, but has no obligation, to become involved in any way with these disputes. You will fully cooperate with Sulake to investigate any suspected unlawful, fraudulent or improper activity, including, without limitation, granting Sulake access to any password-protected portions of your Account. If you have a dispute with one or more users, you release us (and our officers, directors, agents, subsidiaries, joint ventures and employees) from claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, arising out of or in any way connected with such disputes."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "During the Account creation process, you will be required to select a password (“Login Information”). You shall not share the Account or the Login Information, nor let anyone else access your Account or do anything else that might jeopardize the security of your Account. In the event you become aware of or reasonably suspect any breach of security, including without limitation any loss, theft, or unauthorized disclosure of the Login Information, you must immediately notify Sulake and modify your Login Information. You are solely responsible for maintaining the confidentiality of the Login Information, and you will be responsible for all uses of the Login Information, including purchases, whether or not authorized by you. You are responsible for anything that happens through your Account."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake reserves the right to remove or reclaim any usernames at any time and for any reason, including but not limited to claims by a third party that a username violates the third party’s rights."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You shall not use our Content off of our Service, except as we may allow use of Sulake Licensed Elements for certain fan site use approved by us in writing. We do not approve and you may not create or use “retro” or substitute sites or services that offer game play with our Content off of our Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No Young Children and Parents Responsible for Minors: You shall not create an Account or access the Service if you are under the age of 13 and shall not permit access to children under the age of 13. If you are under the age of majority (not yet legally an adult), your parent or legal guardian must take approve and take responsibility for your Account  for any use of  a credit card or other payment instrument (e.g., Paypal) by minors."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No false information: You shall not create an Account using a false identity or information, or on behalf of someone other than yourself. You shall not use the Service if you have previously been removed or banned from the Service by Sulake. You shall not falsify or delete any author attributions, legal or other proper notices or proprietary designations or labels of the origin or source of software or other material contained in a file that is uploaded; or forge headers or otherwise manipulate identifiers to disguise the origin of any material transmitted through the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No use of others’ content without proper permission: You shall not use any User-Generated Content or other content that belongs to other people and pass it off as your own; this includes any content that you might have found elsewhere on the Internet. If anyone contributes to your User-Generated Content or has any rights to your User-Generated Content, or if anyone appears in the User-Generated Content, then you must also have their permission to submit such User-Generated Content to Sulake under these Terms."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No commercial or political use: You shall use your Account and the Service only for non-commercial and non-political purposes. You shall not use the Service or any features on the Service to advertise, or solicit, or transmit any commercial advertisements, including chain letters, junk or spam e-mail, surveys, contests, pyramid schemes, or repetitive messages to anyone; to distribute unsolicited e-mail to others for commercial use or otherwise; or harvest or otherwise collect personal information about other individuals, including e-mail addresses or screen names for the purpose of sending unsolicited e-mails or for exchange. You shall not advertise or offer to sell or buy any goods or services for any commercial or business purpose. You shall not use, download or otherwise copy, or provide (whether or not for a fee) to a person or entity any directory of visitors to the Service or other visitor or usage information or any portion thereof."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No harassment, defamation, or profanity: You shall not publish, post, upload, distribute or disseminate any material or information on the Service which: (i) is inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful topic, name, material or information (including but not limited to pornography, depiction of acts of violence and sexual acts, and material and information which may perpetuate hatred against any person or group or having the likely effect of causing harm or offence); (ii) is a false statement about a person or their property or business which is actuated by malice and may cause financial harm to that person; (iii) is misleading or deceptive; (iv) is a breach of confidence or an invasion of a person's right to privacy; (v) may cause us to breach, or be involved in a breach of law, a code or an instrument which governs our conduct; or (vi) otherwise infringes any person's rights, including without limitation their intellectual property rights, e.g., copyright or trademark rights (or rights of privacy or publicity)."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No harm, damage or interference: You shall not upload files that contain, or otherwise intentionally release or disseminate, viruses, Trojan horses, worms, time bombs, cancel bots, corrupted files, or any other similar software or programs that may interfere with or damage Sulake, the Service, its Content or the operation of another's Device or property of another. You shall not download any file posted by another visitor of a home page, chat room or message board that you know, or reasonably should know, cannot be legally distributed. You shall not restrict or inhibit any other user from using and enjoying the home pages, chat room and message boards; or violate any code of conduct or other guidelines which may be displayed on the Service for any particular feature or service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No law violations or conspiracy: You shall not violate, or encourage others to violate, any laws or regulations or the legal rights of another individual, on the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "No refusal to cooperate: You shall not refuse to follow the instructions of any personnel of Sulake or a Sulake affiliate."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake reserves the right to determine what conduct it considers to be in violation of the rules of use or otherwise outside the intent or spirit of these Terms, any applicable Additional Terms, or the Service itself. Sulake reserves the right to take action as a result, which may include terminating your Account and prohibiting you from using the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The Service may also contain links, as part of third-party ads or content on the Service or otherwise, to or from third-party websites (“Linked Sites”), including websites operated by advertisers, licensors, licensees, and certain other third parties who may have business relationships with Sulake, e.g., inside of the Habbo Game Center, or via links to sites outside of the Service that are operated by third parties. Sulakemay have no control over the content, operations, policies, terms, or other elements of Linked Sites, and Sulake does not assume any obligation to review any Linked Sites. Sulake doesnot endorse, approve, or sponsor any Linked Sites, or any third-party content, advertising, information, materials, products, services, or other items. Furthermore, Sulake is not responsible for the quality or delivery of the products or services offered, accessed, obtained by or advertised at such sites.  Finally, Sulake will under no circumstances be liable for any direct, indirect, incidental or special loss or other damage, whether arising from negligence, breach of contract, defamation, infringement of copyright or other intellectual property rights or otherwise, arising out of or related to Linked Sites or their products or services.  Any activities you engage in connection with any of the same are subject to the privacy and other policies, terms and conditions of use and/or sale, and rules issued by the operator of the Linked Sites.  The Linked Sites may send cookies or solicit personal information from you, and as we have no control over these Linked Sites you agree that we have no responsibility for their actions and you should review their privacy policies. Sulake disclaims all liability in connection therewith."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Further, where part of the Service contains advertising, content and other material submitted to us by third parties, please note that those third parties are responsible for ensuring that material submitted for inclusion on the Service complies with all legal and regulatory requirements. Sulake disclaims all liability in connection with such advertising or other third-party content or material."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Any interactions, correspondence, transactions, and other dealings that you have with any third parties found on or through the Service (including on or via Linked Sites or third-party advertisements or content made available on or through our Service) are solely between you and the third party (including issues related to the content of third-party advertisements, payments, delivery of goods, warranties (including product warranties), privacy and data security, and the like).  Sulake disclaims all liability in connection therewith."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You understand that the Service is an evolving one. Sulake may require that you accept updates to the Service and to the third-party software you have installed on your Device. You acknowledge and agree that Sulake may update and modify the Service, with or without notifying you. You may need to update third-party software from time to time in order to continue to use the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "WITHOUT LIMITATION, WE MAY TERMINATE YOUR LICENSE TO THE SERVICE OR OTHERWISE SUSPEND OR TERMINATE YOUR ACCOUNT AT ANY TIME WITH OR WITHOUT NOTICE TO YOU IF: (A) YOU BREACH THESE TERMS OR ANY APPLICABLE ADDITIONAL TERMS INCLUDING WITHOUT LIMITATION THE HABBO WAY; (B) YOU HAVE NOT ACCESSED YOUR ACCOUNT FOR 180 DAYS; OR (C) IF THE SERVICE IS GOING TO BE SHUT DOWN OR MERGED WITH OTHER SITES AND/OR SERVICES. IN THESE SITUATIONS YOUR ACCOUNT LICENSE TO USE THE SERVICE OR A PART THEREOF WILL BE AUTOMATICALLY TERMINATED. IN SUCH EVENT, SULAKE SHALL NOT BE REQUIRED TO PROVIDE REFUNDS, BENEFITS OR OTHER COMPENSATION TO USERS IN CONNECTION WITH SUCH DISCONTINUED SERVICES. TERMINATION OF YOUR ACCOUNT CAN INCLUDE DISABLING YOUR ACCESS TO THE SERVICE OR ANY PART THEREOF INCLUDING ANY CONTENT YOU OR OTHERS SUBMITTED."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "WITHOUT LIMITING OUR OTHER REMEDIES, WE MAY LIMIT, SUSPEND OR TERMINATE THE SERVICE AND USER ACCOUNTS OR PORTIONS THEREOF, PROHIBIT ACCESS TO OUR GAMES AND SERVICE, AND THEIR CONTENT, SERVICES AND TOOLS, DELAY OR REMOVE HOSTED CONTENT, AND TAKE TECHNICAL AND LEGAL STEPS TO PREVENT USERS FROM ACCESSING THE SERVICE IF WE BELIEVE THAT THEY ARE CREATING RISK OR POSSIBLE LEGAL LIABILITIES, INFRINGING THE INTELLECTUAL PROPERTY RIGHTS OF THIRD PARTIES, OR ACTING INCONSISTENTLY WITH THE LETTER OR SPIRIT OF OUR TERMS OR ANY APPLICABLE ADDITIONAL TERMS. ADDITIONALLY, WE MAY, IN APPROPRIATE CIRCUMSTANCES AND AT OUR SOLE DISCRETION, SUSPEND OR TERMINATE ACCOUNTS OF USERS WHO MAY BE REPEAT INFRINGERS OF THIRD-PARTY INTELLECTUAL PROPERTY RIGHTS."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You may terminate your access to the Service at any time for any reason without penalty by contacting us here, at which point you will no longer be permitted to use the Service. We will not refund you the fees (or any part of them) that we have already charged you."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Any suspension or termination will not affect your obligations to Sulake under these Terms or any applicable Additional Terms. Upon suspension or termination of your access to the Service, or upon notice from Sulake, all rights granted to you under these Terms or any applicable Additional Terms will cease immediately, and you agree that you will immediately discontinue use of the Service. The provisions of these Terms and any applicable Additional Terms, which by their nature should survive your suspension or termination will survive, including the rights and licenses you grant to Sulake in these Terms, as well as the indemnities, releases, disclaimers, and limitations on liability and the provisions regarding jurisdiction, choice of law, no class action, and mandatory arbitration."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR YOUR USE, WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, MISAPPROPRIATION OF INTELLECTUAL PROPERTY RIGHTS OF THIRD PARTIES, AND THOSE ARISING FROM COURSE OF DEALING OR USAGE OF TRADE. SULAKE DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS AS TO: THE SERVICE AND ITS FUNCTIONS, FEATURES, AND ELEMENTS; ANY PRODUCTS OR SERVICES OFFERED OR REFERENCED AT OR LINKED THROUGH THE SERVICE; THE SECURITY ASSOCIATED WITH THE TRANSMISSION OF YOUR USER-GENERATED CONTENT TO OR VIA THE SERVICE; THAT YOU WILL BE ABLE TO ACCESS OR USE THE SERVICE AT THE TIMES OR LOCATIONS OF YOUR CHOOSING; THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE; THAT DEFECTS WILL BE CORRECTED; OR THAT THE GAME OR THE SERVICE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, SULAKE SHALL NOT BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE OR OTHER SIMILAR DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF REVENUES, LOST PROFITS, LOST DATA OR BUSINESS INTERRUPTION OR OTHER INTANGIBLE LOSSES (HOWEVER SUCH LOSSES ARE QUALIFIED), ARISING OUT OF OR RELATING IN ANY WAY TO YOUR ACCESS TO AND USE OF THE SERVICE AND YOUR RIGHTS UNDER THESE TERMS OF SERVICE OR ANY APPLICABLE ADDITIONAL TERMS, WHETHER BASED ON CONTRACT, TORT OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT SULAKE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU FURTHER AGREE THAT UNDER NO CIRCUMSTANCES SHALL SULAKE SHALL NOT BE LIABLE TO YOU FOR MORE THAN THE AMOUNT YOU HAVE PAID TO SULAKE IN ACCORDANCE WITH THESE TERMS OF SERVICE OR ANY APPLICABLE ADDITIONAL TERMS IN THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE DATE ON WHICH YOU FIRST ASSERT A CLAIM. YOU ACKNOWLEDGE AND AGREE THAT IF YOU HAVE NOT PAID ANYTHING TO SULAKE DURING SUCH TIME PERIOD, YOUR SOLE REMEDY (AND SULAKE’S EXCLUSIVE LIABILITY) FOR ANY DISPUTE WITH SULAKE IS TO STOP USING THE SERVICE AND TO CANCEL YOUR ACCOUNT. IF SUCH REMEDIES ARE DEEMED INSUFFICIENT UNDER ANY APPLICABLE LAW, SULAKE’S LIABILITY SHOULD INSTEAD BE LIMITED TO THE LESSER OF £435.95OS OR THE MINIMUM AMOUNT REQUIRED BY LAW."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for certain types of damages. Accordingly, some of the above disclaimers and limitations may not apply to you. To the extent that Sulake may not, as a matter of applicable law, disclaim any warranty or limit its liability as set forth herein, the scope of such warranty and the extent of Sulake’s liability shall be the minimum permitted under such applicable law. TO THE EXTENT REQUIRED BY APPLICABLE LAW, NOTHING IN THESE TERMS OF SERVICE OR ANY APPLICABLE ADDITIONAL TERMS SHALL AFFECT THE STATUTORY RIGHTS OF ANY CONSUMER OR EXCLUDE OR RESTRICT ANY LIABILITY FOR DEATH OR PERSONAL INJURY ARISING FROM ANY NEGLIGENCE OR FRAUD OF SULAKE."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You agree to indemnify, defend and hold Sulake and its successors and assigns harmless from any claim, demand, damages or other losses, including reasonable attorneys’ fees, asserted by any third party resulting from or arising out of: our use of information you submit to us (including your User-Generated Content) through the Service; your use of the Service and your activities in connection with the Service; any breach by you of these Terms or any applicable Additional Terms; your violation of any laws in connection with your use of the Service or your activities in connection with the Service; content transmitted through your Device that infringes, violates, or misappropriates any copyright, trademark, trade secret, trade dress, patent, publicity, privacy, or other right of any person or entity; and any misrepresentation made by you (all of the foregoing, “Claims and Losses”). You will cooperate as fully required by us in the defense of any Claim and Loss. Notwithstanding anything to the contrary, we retain the exclusive right to control, settle, compromise, and pay any and all Claims and Losses. We reserve the right to assume the exclusive defense and control of any Claims and Losses. You will not settle any Claims and Losses without, in each instance, the prior written consent of an officer of Sulake."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Certain portions of this Section 10 are deemed to be a “written agreement to arbitrate” pursuant to the U.S. Federal Arbitration Act and apply to all United States users of the Service and to all other users to the extent the mandatory laws in their country of residence permit the various terms of this Section (so some provisions will not apply to some users if doing so would violate mandatory applicable law).  You and Sulake agree that we intend that this Section 10 satisfies the “writing” requirement of the Federal Arbitration Act.  This Section 10 can only be changed or terminated upon mutual agreement."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Any controversy, allegation, or claim between you and Sulake arising out of or relating to the Service, the Content, these Terms, or any applicable Additional Terms, whether heretofore or hereafter arising are “Disputes”."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If you or Sulake becomes aware of a Dispute, then you and we agree to send a written notice to the other providing a reasonable description of the Dispute, along with a proposed resolution of it.  Our notice to you will be sent to you based on the most recent contact information that you provide us.  But if no such information exists or if such information is not current, then we have no obligation under this Section 10.1.1.  Your notice to us must be sent to:  Sulake Corporation Oy, Legal, Kaarlenkatu 11, 00530 Helsinki, Finland.  For a period of sixty (60) days from the date of receipt of notice from the other party, Sulakeand you will engage in a dialogue in order to attempt to resolve the Dispute, though nothing will require either you or Sulake to resolve the Dispute on terms with respect to which you and Sulake, in each of our sole discretion, are not comfortable."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If we cannot resolve a Dispute as set forth in Section 10.1.1 within sixty (60) days of receipt of the notice, then either you or we may submit the Dispute to formal arbitration in accordance with this Section 10.1, unless it is an Excluded Dispute, which shall be handled in accordance with Section 10.2."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Upon expiration of the applicable sixty (60)-day period and to the fullest extent permitted by applicable law, a Dispute will be resolved solely by binding arbitration in accordance with the then-current JAMS Comprehensive Arbitration Rules & Procedures of JAMS, Inc. (“JAMS”).  JAMS procedures, rules, and fee information are available, as follows: JAMS: 949.224.1810 - http://www.jamsadr.com/"
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "In arbitration, as with a court, the arbitrator must honor the terms of these Terms (and any applicable Additional Terms) and can award the prevailing party damages and other relief (including attorneys’ fees).  However, WITH ARBITRATION: (A) THERE IS NO JUDGE OR JURY, (B) THE ARBITRATION PROCEEDINGS AND ARBITRATION OUTCOME ARE SUBJECT TO CERTAIN CONFIDENTIALITY RULES, AND (C) JUDICIAL REVIEW OF THE ARBITRATION OUTCOME IS LIMITED.  All parties to the arbitration will have the right, at their own expense, to be represented by an attorney or other advocate of their choosing.  If an in-person arbitration hearing is required, then it will be conducted in the metropolitan area where you are a resident at the time the Dispute is submitted to arbitration.  You and we will pay the administrative and arbitrator’s fees and other costs in accordance with the applicable arbitration rules; but, if applicable arbitration rules or laws require Sulake to pay a greater portion or all of such fees and costs in order for this Section 10 to be enforceable, then Sulake will have the right to elect to pay the fees and costs and proceed to arbitration.  Discovery will be permitted pursuant to the applicable arbitration rules.  The arbitrator’s decision must consist of a written statement stating the disposition of each claim of the Dispute, and must provide a statement of the essential findings and conclusions on which the decision and any award (if any) is based.  Judgment on the arbitration decision and award (if any) may be entered in or by any court that has jurisdiction over the parties pursuant to Section 9 of the Federal Arbitration Act."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Disputes will be arbitrated only on an individual basis and will not be consolidated with any other arbitrations or other proceedings that involve any claim or controversy of any other party.  But if, for any reason, any court with competent jurisdiction or any arbitrator selected pursuant to Section 10.1.3 holds that this restriction is unconscionable or unenforceable, then our agreement in Section 10.1.2 to arbitrate will not apply, and the Dispute must be brought exclusively in court pursuant to Section 10.3."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IF YOU OR WE WANT TO ASSERT A DISPUTE (BUT NOT A EXCLUDED DISPUTE) AGAINST THE OTHER, THEN YOU OR WE MUST COMMENCE IT (BY DELIVERY OF WRITTEN NOTICE AS SET FORTH IN SECTION 10.1.1 WITHIN ONE (1) YEAR AFTER DISCOVERY OF THE DISPUTE ARISES -- OR IT WILL BE FOREVER BARRED."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The following disputes constitute “Excluded Disputes” hereunder: (i) any Dispute regarding any of Sulake’s actual or alleged intellectual property rights, (ii) Disputes, to the extent that the laws of the user’s local jurisdiction authorize may be brought in small claims court, and (iii) legal action taken by Sulake to seek an injunction or other equitable relief in connection with, any loss, cost, or damage (or any potential loss, cost, or damage) relating to the Service, any Content, your User-Generated Content and/or Sulake’s intellectual property rights (including such Sulake may claim that may be in dispute), Sulake’s operations, and/or Sulake’s products or services (collectively, “Injunctive Relief”)."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If (x) any Excluded Dispute arises, and (y) excluding Excluded Disputes involving Injunctive Relief, you and we agree to send a written notice to the other providing a reasonable description of the Excluded Dispute, along with a proposed resolution of it.  Our notice to you will be sent to you based on the most recent contact information that you provide us.  But if no such information exists or if such information is not current, then we have no obligation under this Section 10.2.1.  Your notice to us must be sent to:  Sulake Corporation Oy, Legal, Kaarlenkatu 11, 00530 Helsinki, Finland.  For a period of sixty (60) days from the date of receipt of notice from the other party, Sulake and you will engage in a dialogue in order to attempt to resolve the Excluded Dispute, though nothing will require either you or Sulake to resolve the Excluded Dispute on terms with respect to which you and Sulake, in each of our sole discretion, are not comfortable."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If we cannot resolve authorized Excluded Dispute as set forth in Section 10.2.1 within sixty (60) days of receipt of the notice, then either you or we may submit the Excluded Dispute to formal arbitration pursuant to Section 10.1 only if you and Sulake consent, in a writing signed by you and an officer or business and legal affairs representative of Sulake, to have that Excluded Dispute subject to arbitration.  In such a case (and only in such a case), that Excluded Dispute will be deemed a “Dispute” and shall be governed by Section 10.1.  In the absence of such agreement, Section 10.1 shall not apply to Excluded Disputes, and Sections 10.3 and 15.1 shall apply."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "With respect to Excluded Disputes involving Injunctive Relief, Sections 10.3 and 15.1 apply, and Sulake may institute such Excluded Disputes as authorized therein immediately."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Except to the extent that arbitration is required in Section 10.1 or authorized in Section 10.2, and except as to the enforcement of any arbitration decision or award, any action or proceeding relating to any Dispute or Excluded Dispute may only be instituted in Helsinki, Finland.  Accordingly, you and Sulake consent to the exclusive personal jurisdiction and venue of such courts for such matters."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If any controversy, allegation, or claim (including any non-contractual claim) arises out of or relates to the Service, the Content, these Terms, or any applicable Additional Terms, whether heretofore or hereafter arising or to any of Sulake’s actual or alleged intellectual property rights (collectively, a “Section 11 Dispute”), then you and we agree to send a written notice to the other providing a reasonable description of the Section 11 Dispute, along with a proposed resolution of it.  Our notice to you will be sent to you based on the most recent contact information that you provide us.  But if no such information exists or if such information is not current, then we have no obligation under this Section 11.1.  Your notice to us must be sent to:  Sulake Corporation Oy, Legal, Kaarlenkatu 11, 00530 Helsinki, Finland.  Except to the extent Sulake determines it reasonably necessary to seek immediate relief to protect its or third-party rights, for a period of sixty (60) days from the date of receipt of notice from the other party, Sulake and you will engage in a dialogue in order to attempt to resolve the Section 11 Dispute, though nothing will require either you or Sulake to resolve the Section 11 Dispute on terms with respect to which you and Sulake, in each of our sole discretion, are not comfortable."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The parties agree that the courts in Finland shall have jurisdiction of any Section 11 Dispute and you consent to the venue there."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IF YOU OR WE WANT TO ASSERT A SECTION 11 DISPUTE AGAINST THE OTHER, THEN YOU OR WE MUST COMMENCE IT (BY DELIVERY OF WRITTEN NOTICE AS SET FORTH IN SECTION 11.1) WITHIN ONE (1) YEAR AFTER DISCOVERY OF THE SECTION 11 DISPUTE ARISES -- OR IT WILL BE FOREVER BARRED."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You and Sulake agree that if any portion of these Terms or any applicable Additional Terms, or of the Service’s Privacy Policy, is found illegal or unenforceable, in whole or in part by any court of competent jurisdiction, such provision shall, as to such jurisdiction, be ineffective solely to the extent of such determination of invalidity or unenforceability without affecting the validity or enforceability thereof in any other manner or jurisdiction and without affecting the remaining provisions of the terms, which shall continue to be in full force and effect."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The Service may offer certain features and services that are available to you via your wireless Device. These features and services may include the ability to access the Service’s features and upload content to the Service, receive messages from the Service, and download applications to your wireless Device (collectively, “Wireless Features”). Standard messaging, data and other fees may be charged by your carrier to participate in Wireless Features. Fees and charges may appear on your wireless bill or be deducted from your pre-paid balance. Your carrier may prohibit or restrict certain Wireless Features and certain Wireless Features may be incompatible with your carrier or wireless Device. You should check with your carrier to find out what plans are available and how much they cost."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You agree that as to the Wireless Features for which you are registered for, we may send communications to your wireless Device regarding us or other parties. Further, we may collect information related to your use of the Wireless Features. If you have registered via the Service for Wireless Features, then you agree to notify Sulake of any changes to your wireless contact information (including phone number) and update your Account on the Service to reflect the changes."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "We grant you a limited, non-exclusive, revocable, non-assignable, personal and non-transferable license to create hyperlinks to the Service, so long as: (a) the links only incorporate text, and do not use any Trademarks, (b) the links and the content on your web site do not suggest any affiliation with Sulake or cause any other confusion, and (c) the links and the content on your web site do not portray Sulake or its products or services in a false, misleading, derogatory, or otherwise offensive manner, and do not contain content that is unlawful, offensive, obscene, lewd, lascivious, filthy, violent, threatening, harassing, or abusive, or that violate any right of any third party or are otherwise objectionable to Sulake. Sulake reserves the right to suspend or prohibit linking to the Service for any reason, in its sole discretion, without advance notice or any liability of any kind to you or any third party."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You and we disclaim any application to these Terms of the Convention on Contracts for the International Sale of Goods. To the maximum extent permitted by the mandatory laws in your country of residence, these Terms, any applicable Additional Terms and any dispute arising out of or in connection with it or its subject matter or formation (including non-contractual disputes), will be governed by, and construed in accordance with, the laws of the United States for users located in the United States, and the laws of Finland for all other users, without regard to conflicts of law provisions that might apply other law."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake may assign or delegate these Terms, any applicable Additional Terms and/or the Service’s Privacy Policy, in whole or in part, to any person or entity at any time with or without your consent. You may not assign or delegate any rights or obligations under the Terms and/or the Service’s Privacy Policy without Sulake’s prior written consent, and any unauthorized assignment and delegation by you is ineffective."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "These Terms, any applicable Additional Terms, and any documents expressly incorporated by reference herein (including the Service’s Privacy Policy), contain the entire understanding of you and Sulake, and supersede all prior understandings of the parties hereto relating to the subject matter hereof, whether electronic, oral or written, or whether established by custom, practice, policy or precedent, between you and us with respect to the Service."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "The failure of Sulake to require or enforce strict performance by you of any provision of these Terms, any applicable Additional Terms and/or the Service’s Privacy Policyor failure to exercise any right under them shall not be construed as a waiver or relinquishment of Sulake’s right to assert or rely upon any such provision or right in that or any other instance. The express waiver by Sulake of any provision, condition, or requirement of these Terms, any applicable Additional Terms and/or the Service’s Privacy Policy shall not constitute a waiver of any future obligation to comply with such provision, condition or requirement. Except as expressly and specifically set forth in this these Terms and any applicable Additional Terms, no representations, statements, consents, waivers, or other acts or omissions by Sulake shall be deemed a modification of these Terms or any applicable Additional Terms nor legally binding, unless documented in physical writing, hand signed by you and a duly appointed officer of Sulake."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "As our Service evolves, the terms and conditions under which we offer the Service may prospectively be modified and we may cease offering the Service under the Terms or any applicable Additional Terms for which they were previously offered. Accordingly, each time you sign in to or otherwise use the Service you are entering into a new agreement with us on the then-applicable terms and conditions, and you agree that we may notify you of other terms by posting them on the Service (or in any other reasonable manner of notice which we elect), and that your use of the Service after such notice constitutes your going forward agreement to the other terms for your new use and transactions. You can reject any new, revised or additional terms by discontinuing use of the Service and canceling your Account."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You agree that we may notify you via postings on the Service, and via e-mail or any other reasonable communications means to contact you based on the information you provided to us when creating your Account, with respect to changes to these Terms or any applicable Additional Terms. You agree to promptly notify us if you change your e-mail or mailing address by updating your Account settings."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "All notices given by you or required from you under these Terms, any applicable Additional Terms and/or the Service’s Privacy Policy shall be in writing and addressed to: Sulake Corporation Oy, Legal, Kaarlenkatu 11, 00530 Helsinki, Finland. Any notices that you provide without compliance with this Section on Notices shall have no legal effect."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If you have a question about the Service, you may contact our Customer Service. You acknowledge that the provision of customer support is at Sulake’s sole discretion and that we have no obligation to provide you with customer support of any kind."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "You acknowledge that the rights granted and obligations made under these Terms and/or any applicable Additional Terms to Sulake are of a unique and irreplaceable nature, the loss of which shall irreparably harm Sulake and which cannot be replaced by monetary damages alone so that Sulake shall be entitled to injunctive or other equitable relief (without the obligations of posting any bond or surety or proof of damages) in the event of any breach or anticipatory breach by you. You irrevocably waive all rights to seek injunctive or other equitable relief, or to enjoin or restrain the operation of the Service or any Content or other product or service, exploitation of any advertising or other materials issued in connection therewith, or exploitation of the Service or any content or other material used or displayed through the Service and agree to limit your claims to claims for monetary damages, limited by Section 9 (if any)."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "If you believe that your copyright or other rights have been infringed by Content on the Service, please contact our Customer Service. For rights holders in the U.S., please click here  to see our infringement notice and takedown policy."
                                        )
                                      ]),
                                      _vm._v(" "),
                                      _c("p", [
                                        _vm._v(
                                          "Sulake shall not be liable for any delay or failure to perform resulting from causes outside the reasonable control of Sulake, including without limitation any failure to perform hereunder due to unforeseen circumstances or cause beyond Sulake’s control such as acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor or materials."
                                        )
                                      ])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      type: "checkbox",
                                      name: "accept-terms",
                                      id: "accept-terms",
                                      checked: ""
                                    }
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "label",
                                    {
                                      staticClass: "checkbox-label",
                                      attrs: { for: "accept-terms" }
                                    },
                                    [
                                      _vm._v(
                                        "I accept the Terms and Conditions."
                                      )
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("br"),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "step__buttons" }, [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-left",
                                        attrs: { type: "button" }
                                      },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "button-label",
                                            attrs: { for: "registration-step4" }
                                          },
                                          [_vm._v("Back")]
                                        )
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "button",
                                      {
                                        staticClass: "pull-right",
                                        attrs: { type: "submit" }
                                      },
                                      [_c("label", [_vm._v("Continue")])]
                                    )
                                  ])
                                ])
                              ])
                            ]
                          )
                        ])
                      ])
                    ])
                  ]
                )
              ])
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "register__footer" }, [
            _c("span", [
              _vm._v(
                "© 2005 Sulake Corporation Ltd. HABBO is a registered trademark of Sulake Corporation Oy in the European Union, the USA, Japan, the People's Republic of China and various other jurisdictions. All rights reserved."
              )
            ])
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c68eb416", esExports)
  }
}

/***/ }),
/* 69 */
/*!******************************************!*\
  !*** ./src/components/account/Login.vue ***!
  \******************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__ = __webpack_require__(/*! !babel-loader!../../../node_modules/vue-loader/lib/selector?type=script&index=0!./Login.vue */ 20);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ac79cf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/template-compiler/index?{"id":"data-v-3ac79cf2","hasScoped":false,"buble":{"transforms":{}}}!../../../node_modules/vue-loader/lib/selector?type=template&index=0!./Login.vue */ 70);
var disposed = false
var normalizeComponent = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/component-normalizer */ 4)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_Login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3ac79cf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_Login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/account/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ac79cf2", Component.options)
  } else {
    hotAPI.reload("data-v-3ac79cf2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 70 */
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-3ac79cf2","hasScoped":false,"buble":{"transforms":{}}}!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/components/account/Login.vue ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "wrapper" }, [
      _c("div", { staticClass: "wrapper__content" }, [
        _c("div", { staticClass: "register" }, [
          _c("div", { staticClass: "register__top" }),
          _vm._v(" "),
          _c("div", { staticClass: "register__content" }, [
            _c("div", { staticClass: "container-fluid" }, [
              _c("div", { staticClass: "row" }, [
                _c(
                  "div",
                  {
                    staticClass: "box-wrapper col-6 col-sm-6 col-md-6 col-lg-6"
                  },
                  [
                    _c("div", { staticClass: "box box--orange" }, [
                      _c("div", { staticClass: "box__wrapper" }, [
                        _c("div", { staticClass: "box__header" }, [
                          _c("span", [_vm._v("New to Habbo? Register here!")])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "box__body" }, [
                          _c(
                            "h2",
                            { staticClass: "main-registration-header" },
                            [_vm._v("Register Now!")]
                          ),
                          _vm._v(" "),
                          _c("img", {
                            attrs: {
                              src: "/assets/images/frank_with_key.gif",
                              align: "right"
                            }
                          }),
                          _vm._v(" "),
                          _c("p", [
                            _vm._v(
                              "Habbo is an online community that lets you create your own virtual space for you and your friends. With thousands of members already checked in there's always something to do..."
                            )
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "date-of-birth-container" },
                            [
                              _c("span", { attrs: { id: "dobError" } }),
                              _vm._v(" "),
                              _c(
                                "h2",
                                { staticClass: "middle-registration-header" },
                                [
                                  _vm._v(
                                    "Please start by entering your birthday"
                                  )
                                ]
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "date-of-birth" }, [
                                _c("input", {
                                  attrs: {
                                    type: "hidden",
                                    name: "birthday",
                                    id: "birthday"
                                  }
                                }),
                                _vm._v(" "),
                                _c(
                                  "select",
                                  {
                                    staticClass:
                                      "date-of-bith__input date-of-birth__input--day",
                                    attrs: { id: "day", name: "day" }
                                  },
                                  [
                                    _c("option", { attrs: { value: "--" } }, [
                                      _vm._v("--")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "01" } }, [
                                      _vm._v("1")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "02" } }, [
                                      _vm._v("2")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "03" } }, [
                                      _vm._v("3")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "04" } }, [
                                      _vm._v("4")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "05" } }, [
                                      _vm._v("5")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "06" } }, [
                                      _vm._v("6")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "07" } }, [
                                      _vm._v("7")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "08" } }, [
                                      _vm._v("8")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "09" } }, [
                                      _vm._v("9")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "10" } }, [
                                      _vm._v("10")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "11" } }, [
                                      _vm._v("11")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "12" } }, [
                                      _vm._v("12")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "13" } }, [
                                      _vm._v("13")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "14" } }, [
                                      _vm._v("14")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "15" } }, [
                                      _vm._v("15")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "16" } }, [
                                      _vm._v("16")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "17" } }, [
                                      _vm._v("17")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "18" } }, [
                                      _vm._v("18")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "19" } }, [
                                      _vm._v("19")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "20" } }, [
                                      _vm._v("20")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "21" } }, [
                                      _vm._v("21")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "22" } }, [
                                      _vm._v("22")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "23" } }, [
                                      _vm._v("23")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "24" } }, [
                                      _vm._v("24")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "25" } }, [
                                      _vm._v("25")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "26" } }, [
                                      _vm._v("26")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "27" } }, [
                                      _vm._v("27")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "28" } }, [
                                      _vm._v("28")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "29" } }, [
                                      _vm._v("29")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "30" } }, [
                                      _vm._v("30")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "31" } }, [
                                      _vm._v("31")
                                    ])
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "select",
                                  {
                                    staticClass:
                                      "date-of-bith__input date-of-birth__input--month",
                                    attrs: { id: "month", name: "month" }
                                  },
                                  [
                                    _c("option", { attrs: { value: "--" } }, [
                                      _vm._v("--")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "01" } }, [
                                      _vm._v("January")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "02" } }, [
                                      _vm._v("February")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "03" } }, [
                                      _vm._v("March")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "04" } }, [
                                      _vm._v("April")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "05" } }, [
                                      _vm._v("May")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "06" } }, [
                                      _vm._v("June")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "07" } }, [
                                      _vm._v("July")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "08" } }, [
                                      _vm._v("August")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "09" } }, [
                                      _vm._v("September")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "10" } }, [
                                      _vm._v("October")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "11" } }, [
                                      _vm._v("November")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "12" } }, [
                                      _vm._v("December")
                                    ])
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "select",
                                  {
                                    staticClass:
                                      "date-of-bith__input date-of-birth__input--year",
                                    attrs: { id: "year", name: "year" }
                                  },
                                  [
                                    _c("option", { attrs: { value: "--" } }, [
                                      _vm._v("--")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2017" } }, [
                                      _vm._v("2017")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2016" } }, [
                                      _vm._v("2016")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2015" } }, [
                                      _vm._v("2015")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2014" } }, [
                                      _vm._v("2014")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2013" } }, [
                                      _vm._v("2013")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2012" } }, [
                                      _vm._v("2012")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2011" } }, [
                                      _vm._v("2011")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2010" } }, [
                                      _vm._v("2010")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2009" } }, [
                                      _vm._v("2009")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2008" } }, [
                                      _vm._v("2008")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2007" } }, [
                                      _vm._v("2007")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2006" } }, [
                                      _vm._v("2006")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2005" } }, [
                                      _vm._v("2005")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2004" } }, [
                                      _vm._v("2004")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2003" } }, [
                                      _vm._v("2003")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2002" } }, [
                                      _vm._v("2002")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2001" } }, [
                                      _vm._v("2001")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "2000" } }, [
                                      _vm._v("2000")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1999" } }, [
                                      _vm._v("1999")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1998" } }, [
                                      _vm._v("1998")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1997" } }, [
                                      _vm._v("1997")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1996" } }, [
                                      _vm._v("1996")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1995" } }, [
                                      _vm._v("1995")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1994" } }, [
                                      _vm._v("1994")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1993" } }, [
                                      _vm._v("1993")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1992" } }, [
                                      _vm._v("1992")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1991" } }, [
                                      _vm._v("1991")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1990" } }, [
                                      _vm._v("1990")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1989" } }, [
                                      _vm._v("1989")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1988" } }, [
                                      _vm._v("1988")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1987" } }, [
                                      _vm._v("1987")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1986" } }, [
                                      _vm._v("1986")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1985" } }, [
                                      _vm._v("1985")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1984" } }, [
                                      _vm._v("1984")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1983" } }, [
                                      _vm._v("1983")
                                    ]),
                                    _vm._v(" "),
                                    _c("option", { attrs: { value: "1982" } }, [
                                      _vm._v("1982")
                                    ])
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "date-of-birth__buttons" },
                                  [
                                    _c("input", {
                                      staticClass: "date-of-bith__submit",
                                      attrs: {
                                        type: "submit",
                                        id: "submitDateOfBirth",
                                        name: "submitDateOfBirth",
                                        value: "Continue Registration"
                                      }
                                    })
                                  ]
                                )
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "h2",
                            {
                              staticClass:
                                "main-registration-header main-registration-header--push"
                            },
                            [_vm._v("Top Reasons to Register")]
                          ),
                          _vm._v(" "),
                          _c("img", {
                            attrs: {
                              src: "/assets/images/reindeer_1_small.gif",
                              align: "right"
                            }
                          }),
                          _vm._v(" "),
                          _c("br"),
                          _vm._v(" "),
                          _c("ul", [
                            _c("li", [
                              _vm._v(
                                "Create your own Habbo character and Home page"
                              )
                            ]),
                            _vm._v(" "),
                            _c("li", [
                              _vm._v("Meet your friends and find new ones")
                            ]),
                            _vm._v(" "),
                            _c("li", [_vm._v("Decorate your own room")]),
                            _vm._v(" "),
                            _c("li", [
                              _vm._v("It’s more fun than not joining!")
                            ]),
                            _vm._v(" "),
                            _c("br"),
                            _vm._v(" "),
                            _c("li", [
                              _c("strong", [_vm._v("It's completely free!")])
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass:
                      "box-wrapper col-xs-6 col-sm-6 col-md-6 col-lg-6"
                  },
                  [
                    _c("div", { staticClass: "box box--blue" }, [
                      _c("div", { staticClass: "box__wrapper" }, [
                        _c("div", { staticClass: "box__header" }, [
                          _c("span", [
                            _vm._v("Already have a Habbo? Please log in here!")
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "box__body" }, [
                          _c("p", [
                            _vm._v(
                              "If you already have a Habbo account then log in here using your Habbo user name and your password. Your user name and password are the same for here as they are in the Hotel."
                            )
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "login-container" }, [
                            _c(
                              "form",
                              {
                                attrs: {
                                  role: "form",
                                  method: "POST",
                                  novalidate: "novalidate"
                                }
                              },
                              [
                                _c("div", {
                                  staticClass: "login-container__error"
                                }),
                                _vm._v(" "),
                                _c("img", {
                                  attrs: {
                                    src: "/assets/images/habbo_key.png",
                                    align: "left"
                                  }
                                }),
                                _vm._v(" "),
                                _c("p", [
                                  _c("strong", [
                                    _c(
                                      "label",
                                      { attrs: { for: "username" } },
                                      [_vm._v("MY HABBO NAME")]
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      type: "text",
                                      name: "username",
                                      id: "username",
                                      required: ""
                                    }
                                  })
                                ]),
                                _vm._v(" "),
                                _c("p", [
                                  _c("strong", [
                                    _c(
                                      "label",
                                      { attrs: { for: "password" } },
                                      [_vm._v("PASSWORD")]
                                    )
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    attrs: {
                                      type: "password",
                                      name: "password",
                                      id: "password",
                                      required: ""
                                    }
                                  })
                                ]),
                                _vm._v(" "),
                                _c("p", [
                                  _c("input", {
                                    staticClass: "login__submit",
                                    attrs: {
                                      type: "submit",
                                      id: "submitLogin",
                                      name: "submitLogin",
                                      value: "Login"
                                    }
                                  })
                                ])
                              ]
                            )
                          ]),
                          _vm._v(" "),
                          _c("br"),
                          _vm._v(" "),
                          _c(
                            "h2",
                            {
                              staticClass:
                                "main-registration-header main-registration-header--push"
                            },
                            [_vm._v("Forgotten your Password?")]
                          ),
                          _vm._v(" "),
                          _c("br"),
                          _vm._v(" "),
                          _c("p", [
                            _vm._v(
                              "If you have forgotten your password or username please visit the Account Restore page."
                            )
                          ]),
                          _vm._v(" "),
                          _c("br"),
                          _vm._v(" "),
                          _c(
                            "h2",
                            { staticClass: "main-registration-header" },
                            [_vm._v("Security Measure")]
                          ),
                          _vm._v(" "),
                          _c("img", {
                            staticClass: "image-right",
                            attrs: {
                              src: "/assets/images/encryption_pc_ie.gif",
                              align: "right"
                            }
                          }),
                          _vm._v(" "),
                          _c("p", [
                            _vm._v(
                              "The real Habbo site is encrypted to protect you and your data. You can check whether or not this site is encrypted by looking for the nice looking padlock at the bottom of your web browser."
                            )
                          ])
                        ])
                      ])
                    ])
                  ]
                )
              ])
            ])
          ])
        ])
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3ac79cf2", esExports)
  }
}

/***/ })
],[21]);
//# sourceMappingURL=bundle.js.map