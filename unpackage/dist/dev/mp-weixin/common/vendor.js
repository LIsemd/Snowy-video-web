(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name);
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({});



var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属
  var parentVm = $children.find(function (childVm) {return childVm.$scope._$vueId === vuePid;});
  if (parentVm) {
    return parentVm;
  }
  // 反向递归查找
  for (var i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var componentOptions = {
    options: {
      multipleSlots: true,
      addGlobalClass: true },

    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 136:
/*!**************************************************************!*\
  !*** D:/项目/Web实战项目/Snowy-video-web/static/images/avatar.jpg ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ 137:
/*!***************************************************************!*\
  !*** D:/项目/Web实战项目/Snowy-video-web/static/images/avatar2.jpg ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),

/***/ 14:
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
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
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
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
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

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
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
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

if (true) {
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
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
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
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
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
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
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
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
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
      if (Dep.SharedObject.target) { // fixed by xxxxxx
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
      if ( true && customSetter) {
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
  if ( true &&
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
     true && warn(
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
  if ( true &&
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
     true && warn(
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
if (true) {
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
       true && warn(
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
     true && assertObjectType(key, childVal, vm);
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
  if (true) {
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
  if (childVal && "development" !== 'production') {
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
      } else if (true) {
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
  } else if (true) {
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
  } else if (true) {
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
  if (true) {
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
  if ( true && warnMissing && !res) {
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
    true
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
  if ( true && isObject(def)) {
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
  if (true) {
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

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
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

var mark;
var measure;

if (true) {
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
       true && warn(
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
      if (true) {
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
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
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
        } else if (true) {
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
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
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
      if ( true && !isObject(bindObject)) {
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
       true && warn(
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
       true && warn(
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
    } else if ( true && key !== '' && key !== null) {
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
  if (true) {
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
    if (true) {
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
     true && warn(
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
  if ( true &&
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
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
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
      if ( true && vm.$options.renderError) {
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
      if ( true && Array.isArray(vnode)) {
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
       true && warn(
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
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
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
    if (true) {
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

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
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

  if (true) {
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
  if (true) {
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
    if ( true && has[id] != null) {
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

      if ( true && !config.async) {
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
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
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
    if (true) {
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
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
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
     true && warn(
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
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
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
    if ( true && getter == null) {
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
    } else if (true) {
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
  if ( true &&
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
      if (Dep.SharedObject.target) {// fixed by xxxxxx
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
    if (true) {
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
  if (true) {
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
    if ( true && config.performance && mark) {
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
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
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
  if ( true &&
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
    if ( true && name) {
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
        if ( true && type === 'component') {
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
  if (true) {
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

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
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
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

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

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    console.error(err);
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope) {
        return this.$scope[method](args)
      }
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 4:
/*!************************************************!*\
  !*** D:/项目/Web实战项目/Snowy-video-web/pages.json ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    packName = uni.getAccountInfoSync().miniProgram.appId || '';
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@next","_id":"@dcloudio/uni-stat@2.0.0-23320190923002","_inBundle":false,"_integrity":"sha512-MnftsvgOac3q1FCOBPzivbFn8GNQFo7D2DY325HeEZyFCWgx5GEwHpGYjT1PQU6v7DaDn0ruxa3ObdpUIYbmZw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@next","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"next","saveSpec":null,"fetchSpec":"next"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-23320190923002.tgz","_shasum":"0c400c140ca0b3c05f52d25f11583cf05a0c4e9a","_spec":"@dcloudio/uni-stat@next","_where":"/Users/fxy/Documents/DCloud/HbuilderX-plugins/release/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"fed4c73fb9142a1b277dd79313939cad90693d3e","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-23320190923002"};

/***/ }),

/***/ 7:
/*!*****************************************************************!*\
  !*** D:/项目/Web实战项目/Snowy-video-web/pages.json?{"type":"style"} ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/video/video": { "usingComponents": { "video-list": "/components/video/videoList", "video-header": "/components/video/videoHeader", "video-footer": "/components/video/videoFooter" } }, "pages/login/login": { "usingComponents": {} }, "pages/search/search": { "usingComponents": { "m-search": "/components/mehaotian-search-revision/mehaotian-search-revision" } }, "pages/mine/mine": { "usingComponents": {} }, "pages/regist/regist": { "usingComponents": {} }, "pages/index/index": { "enablePullDownRefresh": true, "usingComponents": { "index-list": "/components/indexList/indexList", "intro-swiper": "/components/introSwiper/introSwiper" } }, "pages/upload/upload": { "usingComponents": {} }, "pages/search/result": { "usingComponents": { "index-list": "/components/indexList/indexList" } } }, "globalStyle": { "navigationStyle": "custom", "navigationBarBackgroundColor": "#0081ff", "navigationBarTitleText": "Snowy 短视频", "navigationBarTextStyle": "white" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!****************************************************************!*\
  !*** D:/项目/Web实战项目/Snowy-video-web/pages.json?{"type":"stat"} ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__9FA140D" };exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map