(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  cookieName: 'timers'
};

},{}],3:[function(require,module,exports){
'use strict';

var _timers = require('./timers');

var _timers2 = _interopRequireDefault(_timers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ready = function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

ready(function () {
  var timers = new _timers2.default('directions');
  var timerLink = document.getElementById('timers-trigger');
  timerLink.addEventListener('click', function (e) {
    e.preventDefault();
    timers.show();
  });
});

},{"./timers":9}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable maxlen */
exports.default = {
  beep: 'data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerFinder = function () {
  function TimerFinder(directionsId, timerList) {
    _classCallCheck(this, TimerFinder);

    this.el = document.getElementById(directionsId);
    this.timerList = timerList;
    this.boundClickHandler = this.handleSuggestionClick.bind(this);
    this.enableSuggestions();
  }

  _createClass(TimerFinder, [{
    key: 'enableSuggestions',
    value: function enableSuggestions() {
      var text = this.el.innerHTML;
      var matches = text.match(/[\d]+[\s]+(minutes|seconds)/g);

      if (matches.length) {
        text = matches.reduce(function (rawText, m) {
          rawText = rawText.replace(m, '<a href="#" class="suggestion">' + m + '</a>');
          return rawText;
        }, text);
      }
      this.findSuggestions().map(this.unbindClickEvent.bind(this));
      this.el.innerHTML = text;
      this.findSuggestions().map(this.bindClickEvent.bind(this));
    }
  }, {
    key: 'findSuggestions',
    value: function findSuggestions() {
      return [].concat(_toConsumableArray(this.el.getElementsByClassName('suggestion')));
    }
  }, {
    key: 'bindClickEvent',
    value: function bindClickEvent(el) {
      el.addEventListener('click', this.boundClickHandler);
    }
  }, {
    key: 'unbindClickEvent',
    value: function unbindClickEvent(el) {
      el.removeEventListener('click', this.boundClickHandler);
    }
  }, {
    key: 'handleSuggestionClick',
    value: function handleSuggestionClick(e) {
      e.preventDefault();
      var suggestion = e.currentTarget;
      var suggestionText = suggestion.innerText;
      var minutes = 0;
      var seconds = 0;
      if (suggestionText.includes('minute')) {
        minutes = parseInt(suggestionText.replace(/([\d]+)[\s]+minute(s)?/, '$1'), 10);
      }
      if (suggestionText.includes('seconds')) {
        seconds = parseInt(suggestionText.replace(/([\d]+)[\s]+second(s)?/, '$1'), 10);
      }
      this.timerList.handleSuggestion(minutes, seconds);
    }
  }]);

  return TimerFinder;
}();

exports.default = TimerFinder;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerForm = function () {
  function TimerForm(timerList) {
    _classCallCheck(this, TimerForm);

    this.timerList = timerList;
    this.el = document.createElement('form');
    this.el.classList.add('timer-form');
    this.el.innerHTML = this.template();
    this.el.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.closeLink = this.el.querySelector('.timer-close-link');
    this.closeLink.addEventListener('click', this.handleCloseClick.bind(this));
    document.body.appendChild(this.el);
  }

  _createClass(TimerForm, [{
    key: 'template',
    value: function template(error) {
      var minutes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var seconds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      return '\n      <a href="#close" class="timer-close-link">\u2715</a>\n      ' + (error ? '<p class="error">' + error + '</p>' : '') + '\n      <div class="fieldset">\n        <div class="control">\n          <input name="name"type="text" autocomplete="off" required />\n          <label>Timer Name</label>\n        </div>\n      </div>\n      <div class="fieldset time-fields">\n        <div class="control">\n          <input name="minutes" type="number" min="0" max="59" size="3" value="' + minutes + '" />\n          <label>Minutes</label>\n        </div>\n        <div class="control">\n          <input name="seconds" type="number" min="0" max="59" value="' + seconds + '" required />\n          <label>Seconds</label>\n        </div>\n      </div>\n      <input type="submit" value="Start Timer" />\n    ';
    }
  }, {
    key: 'show',
    value: function show() {
      this.el.classList.add('active');
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.classList.remove('active');
    }
  }, {
    key: 'acceptSuggestion',
    value: function acceptSuggestion(minutes, seconds) {
      this.setFormValues(minutes, seconds);
      this.show();
    }
  }, {
    key: 'setFormValues',
    value: function setFormValues() {
      var minutes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;
      var seconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      this.el.minutes.value = minutes;
      this.el.seconds.value = seconds;
      this.el.name.value = name;
    }
  }, {
    key: 'handleCloseClick',
    value: function handleCloseClick(e) {
      e.preventDefault();
      this.setFormValues();
      this.hide();
    }
  }, {
    key: 'getValues',
    value: function getValues() {
      var _el = this.el,
          name = _el.name.value,
          seconds = _el.seconds.value,
          minutes = _el.minutes.value;

      return { name: name, minutes: minutes, seconds: seconds };
    }
  }, {
    key: 'validate',
    value: function validate() {
      var _getValues = this.getValues(),
          name = _getValues.name,
          seconds = _getValues.seconds,
          minutes = _getValues.minutes;

      if (+seconds + +minutes === 0) {
        throw new Error('Please enter a value for minutes or seconds');
      }
      if (this.timerList.timers.find(function (t) {
        return t.name.toUpperCase() === name.toUpperCase();
      })) {
        throw new Error('Timer named ' + name + ' already exists');
      }
    }
  }, {
    key: 'handleFormSubmit',
    value: function handleFormSubmit(e) {
      e.preventDefault();
      try {
        this.validate();

        var _getValues2 = this.getValues(),
            name = _getValues2.name,
            seconds = _getValues2.seconds,
            minutes = _getValues2.minutes;

        var totalSeconds = +minutes * 60 + +seconds;
        this.timerList.addTimerFromForm({
          name: name,
          active: true,
          totalSeconds: totalSeconds
        });
        this.setFormValues();
        this.hide();
      } catch (err) {
        this.el.innerHTML = this.template(err.message);
        console.error(err);
      }
    }
  }]);

  return TimerForm;
}();

exports.default = TimerForm;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sounds = require('./sounds');

var _sounds2 = _interopRequireDefault(_sounds);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerItem = function () {
  function TimerItem(name, totalSeconds) {
    var secondClock = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var active = arguments[3];
    var timerList = arguments[4];

    _classCallCheck(this, TimerItem);

    this.name = name;
    this.totalSeconds = totalSeconds;
    this.timerList = timerList;

    var _utils$parseSeconds = _utils2.default.parseSeconds(secondClock || totalSeconds),
        _utils$parseSeconds2 = _slicedToArray(_utils$parseSeconds, 2),
        parsedMinutes = _utils$parseSeconds2[0],
        parsedSeconds = _utils$parseSeconds2[1];

    this.minuteClock = parsedMinutes;
    this.secondClock = secondClock || parsedSeconds;

    this.active = active;
    this.bingCount = 3;
    this.tickTimeout = null;
    this.alarmInterval = null;
    this.bingSound = new Audio(_sounds2.default.beep);

    this.el = this.createElement();
    this.counterEl = this.el.querySelector('.time-remaining');
    this.buttons = this.el.getElementsByTagName('button');
    this.el.addEventListener('click', this.handleClick.bind(this));

    if (this.active) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  _createClass(TimerItem, [{
    key: 'handleClick',
    value: function handleClick(e) {
      var target = e.target.closest('button');
      if (target && typeof target.dataset.action !== 'undefined') {
        var action = target.dataset.action;
        if (typeof this[action] !== 'undefined') {
          this[action]();
        }
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        active: this.active,
        secondClock: this.secondClock,
        name: this.name,
        totalSeconds: this.totalSeconds
      };
    }
  }, {
    key: 'tickTemplate',
    value: function tickTemplate(min, sec) {
      return min + ':' + (sec < 10 ? '0' : '') + sec;
    }
  }, {
    key: 'timerTemplate',
    value: function timerTemplate(name, time) {
      return '\n      <div class="times">\n        <span class="timer-name">' + name + ':</span>\n        <span class="time-remaining">' + time + '</span>\n      </div>\n      <div class="buttons">\n        <button class="pause" data-action="pause"><svg width="10" height="10"><rect fill="#000" width="10" height="10" /></svg></button>\n        <button class="unpause" data-action="unpause">&#x25BA;</button>\n        <button class="reset" data-action="reset">&#x21ba;</button>\n        <button class="delete" data-action="delete">\u2715</button>\n      </div>\n    ';
    }
  }, {
    key: 'createElement',
    value: function createElement() {
      var evenMinute = this.secondClock % 60 === 0;
      var timeHtml = this.tickTemplate(evenMinute ? this.minuteClock + 1 : this.minuteClock, evenMinute ? 0 : this.secondClock);
      var timerEl = document.createElement('li');
      timerEl.innerHTML = this.timerTemplate(this.name, timeHtml);
      timerEl.classList.add('timer');
      return timerEl;
    }
  }, {
    key: 'delete',
    value: function _delete() {
      if (this.active) return;
      this.deleted = true;
      this.el.classList.add('deleted');
    }
  }, {
    key: 'undelete',
    value: function undelete() {
      delete this.deleted;
      this.el.classList.remove('deleted');
    }
  }, {
    key: 'reset',
    value: function reset() {
      if (this.deleted) return;

      var _utils$parseSeconds3 = _utils2.default.parseSeconds(this.totalSeconds),
          _utils$parseSeconds4 = _slicedToArray(_utils$parseSeconds3, 2),
          parsedMinutes = _utils$parseSeconds4[0],
          parsedSeconds = _utils$parseSeconds4[1];

      this.minuteClock = parsedMinutes;
      this.secondClock = parsedSeconds;
      this.pause();

      var evenMinute = this.secondClock % 60 === 0;
      this.counterEl.innerHTML = this.tickTemplate(evenMinute ? this.minuteClock + 1 : this.minuteClock, evenMinute ? 0 : this.secondClock);
    }
  }, {
    key: 'pause',
    value: function pause() {
      if (this.deleted) return;
      this.active = false;
      clearTimeout(this.tickTimeout);
      this.el.classList.add('paused');
      if (this.counterEl.classList.contains('pending')) {
        this.makeunPending();
      }
    }
  }, {
    key: 'unpause',
    value: function unpause() {
      if (this.deleted) return;
      this.active = true;
      this.tick();
      this.el.classList.remove('paused');
      if (this.secondClock < 10) {
        this.makePending();
      }
    }
  }, {
    key: 'setMinutes',
    value: function setMinutes() {
      this.secondClock = this.minuteClock * 60;
      this.minuteClock -= 1;
      this.tick();
    }
  }, {
    key: 'tick',
    value: function tick() {
      this.tickTimeout = setTimeout(this.run.bind(this), 1000);
    }
  }, {
    key: 'makePending',
    value: function makePending() {
      this.counterEl.classList.add('pending');
    }
  }, {
    key: 'makeunPending',
    value: function makeunPending() {
      this.counterEl.classList.remove('pending');
    }
  }, {
    key: 'bing',
    value: function bing() {
      this.bingCount -= 1;
      this.bingSound.play();
      if (this.bingCount <= 0) {
        clearInterval(this.alarmInterval);
        this.counterEl.classList.remove('pending');
        this.bingCount = 3;
        if (typeof window.speechSynthesis !== 'undefined') {
          var msg = new SpeechSynthesisUtterance(this.name + ' is done!');
          window.speechSynthesis.speak(msg);
        }
      }
    }
  }, {
    key: 'finish',
    value: function finish() {
      this.alarmInterval = setInterval(this.bing.bind(this), 1000);
      this.el.classList.add('complete');
    }
  }, {
    key: 'run',
    value: function run() {
      this.secondClock -= 1;
      this.counterEl.innerHTML = this.tickTemplate(this.minuteClock, this.secondClock);
      if (this.minuteClock === 0 && this.secondClock <= 10) {
        this.makePending();
      }

      if (this.secondClock > 0) {
        this.tick();
      } else if (this.minuteClock > 0) {
        this.setMinutes();
      } else {
        this.finish();
      }
    }
  }]);

  return TimerItem;
}();

exports.default = TimerItem;

},{"./sounds":4,"./utils":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _timerItem = require('./timer-item');

var _timerItem2 = _interopRequireDefault(_timerItem);

var _timerFinder = require('./timer-finder');

var _timerFinder2 = _interopRequireDefault(_timerFinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TimerList = function () {
  function TimerList(containerId, directionsId, manager) {
    _classCallCheck(this, TimerList);

    this.el = document.getElementById(containerId);
    this.timers = this.getStoredTimers();
    this.timers.forEach(this.drawTimer.bind(this));
    window.addEventListener('beforeunload', this.handleUnload.bind(this));
    this.suggestionFinder = new _timerFinder2.default(directionsId, this);
    this.manager = manager;
  }

  _createClass(TimerList, [{
    key: 'handleUnload',
    value: function handleUnload() {
      this.timers.forEach(function (t) {
        return t.pause();
      });
      this.storeTimers();
    }
  }, {
    key: 'addTimerFromForm',
    value: function addTimerFromForm(formObj) {
      var newTimer = this.createTimer(formObj);
      this.timers.push(newTimer);
      this.drawTimer(newTimer);
      this.storeTimers();
      this.manager.onTimerListChange();
    }
  }, {
    key: 'createTimer',
    value: function createTimer(_ref) {
      var name = _ref.name,
          totalSeconds = _ref.totalSeconds,
          _ref$secondClock = _ref.secondClock,
          secondClock = _ref$secondClock === undefined ? null : _ref$secondClock,
          _ref$active = _ref.active,
          active = _ref$active === undefined ? true : _ref$active;

      return new _timerItem2.default(name, totalSeconds, secondClock, active, this);
    }
  }, {
    key: 'storeTimers',
    value: function storeTimers() {
      var timersJSON = this.timers.reduce(function (timers, t) {
        if (!t.deleted) {
          timers.push(t.toJSON());
        }
        return timers;
      }, []);
      if (timersJSON.length) {
        _jsCookie2.default.set(_constants2.default.cookieName, timersJSON);
      } else {
        _jsCookie2.default.remove(_constants2.default.cookieName);
      }
    }
  }, {
    key: 'drawTimer',
    value: function drawTimer(timer) {
      this.el.appendChild(timer.el);
    }
  }, {
    key: 'getStoredTimers',
    value: function getStoredTimers() {
      var timers = _jsCookie2.default.getJSON(_constants2.default.cookieName) || [];
      return timers.map(this.createTimer);
    }
  }, {
    key: 'handleFormSubmit',
    value: function handleFormSubmit(e) {
      e.preventDefault();
      var form = e.target;
      var name = form.name.value,
          secondsVal = form.seconds.value,
          minutesVal = form.minutes.value;

      var totalSeconds = +minutesVal * 60 + +secondsVal;
      var newTimer = this.createTimer({
        name: name,
        active: true,
        totalSeconds: totalSeconds
      });
      this.timers.push(newTimer);
      this.drawTimer(newTimer);
      this.storeTimers();
    }
  }, {
    key: 'handleSuggestion',
    value: function handleSuggestion() {
      var _manager;

      (_manager = this.manager).acceptSuggestion.apply(_manager, arguments);
    }
  }]);

  return TimerList;
}();

exports.default = TimerList;

},{"./constants":2,"./timer-finder":5,"./timer-item":7,"js-cookie":1}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _timerList = require('./timer-list');

var _timerList2 = _interopRequireDefault(_timerList);

var _timerForm2 = require('./timer-form');

var _timerForm3 = _interopRequireDefault(_timerForm2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timers = function () {
  function Timers(directionsId) {
    _classCallCheck(this, Timers);

    this.el = document.createElement('section');
    this.el.classList.add('timers-container');
    this.el.innerHTML = this.template();
    this.headingEl = this.el.querySelector('.timer-heading');
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.addEl = this.el.querySelector('.add');
    this.closeLink = this.el.querySelector('.timer-close-link');
    this.closeLink.addEventListener('click', this.handleCloseClick.bind(this));
    this.boundAddClick = this.handleAddClick.bind(this);
    this.addEl.addEventListener('click', this.boundAddClick);
    this.initializeDrag();
    document.body.appendChild(this.el);

    var _el$getBoundingClient = this.el.getBoundingClientRect(),
        top = _el$getBoundingClient.top,
        left = _el$getBoundingClient.left,
        width = _el$getBoundingClient.width;

    this.position = { x: left, y: top, width: width };

    this.timerList = new _timerList2.default('timers', directionsId, this);
    if (this.timerList.timers.length) {
      this.show();
    }
    this.timerForm = new _timerForm3.default(this.timerList);
  }

  _createClass(Timers, [{
    key: 'handleCloseClick',
    value: function handleCloseClick(e) {
      e.preventDefault();
      this.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      this.el.classList.add('active');
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.el.classList.remove('active');
    }
  }, {
    key: 'template',
    value: function template() {
      return '\n      <header>\n        <h3 class="timer-heading">My Timers</h3>\n        <a class="add timer-link" href="add" title="Add timer">\n          <svg width="23" height="23" version="1">\n            <g fill="none" stroke="#FF0000">\n              <path stroke-width="1" d="M20.694 11.64c0 5.068-4.112 9.18-9.18 9.18-5.066 0-9.178-4.112-9.178-9.18 0-5.065 4.112-9.177 9.18-9.177 5.066 0 9.178 4.112 9.178 9.178z"/>\n              <path d="M11.604 11.91L7.63 7.89"/>\n              <path stroke-width="1" d="M17.218 6.105l-5.93 6.067"/>\n            </g>\n          </svg>\n          New\n        </a>\n        <a href="#close" class="timer-close-link">\u2715</a>\n      </header>\n      <ul class="timers" id="timers"></ul>\n    ';
    }
  }, {
    key: 'initializeDrag',
    value: function initializeDrag() {
      this.headingEl.addEventListener('mousedown', this.handleMouseDown.bind(this));
      document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }
  }, {
    key: 'acceptSuggestion',
    value: function acceptSuggestion() {
      var _timerForm;

      (_timerForm = this.timerForm).acceptSuggestion.apply(_timerForm, arguments);
    }
  }, {
    key: 'handleAddClick',
    value: function handleAddClick(e) {
      e.preventDefault();
      this.timerForm.show();
    }
  }, {
    key: 'onTimerListChange',
    value: function onTimerListChange() {
      if (this.timerList.timers.some(function (t) {
        return !t.deleted;
      })) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown() {
      this.headingEl.classList.add('active');
      document.addEventListener('mousemove', this.boundMouseMove);
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp() {
      this.headingEl.classList.remove('active');
      document.removeEventListener('mousemove', this.boundMouseMove);
    }
  }, {
    key: 'onMouseMove',
    value: function onMouseMove(e) {
      var x = e.clientX - this.position.x - this.position.width / 2;
      var y = e.clientY - this.position.y - 25;

      var style = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
      this.el.style.transform = style;
    }
  }]);

  return Timers;
}();

exports.default = Timers;

},{"./timer-form":6,"./timer-list":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable */
/* Polyfill for .closest() method - https://github.com/jonathantneal/closest */
if (typeof window !== 'undefined') {
  (function (ElementProto) {
    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;

        while (elements[index] && elements[index] !== element) {
          ++index;
        }

        return Boolean(elements[index]);
      };
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector) {
        var element = this;

        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }

          element = element.parentNode;
        }

        return null;
      };
    }
  })(window.Element.prototype);
}
/* eslint-enable */

exports.default = {
  parseSeconds: function parseSeconds(totalSeconds) {
    var secondMod = totalSeconds % 60;
    var seconds = secondMod || 60;
    var minutes = totalSeconds > 60 ? Math.ceil(totalSeconds / 60) - 1 : 0;
    return [minutes, seconds];
  }
};

},{}]},{},[3])