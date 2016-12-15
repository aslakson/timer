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

export default {
  parseSeconds(totalSeconds) {
    const secondMod = totalSeconds % 60;
    const seconds = secondMod || 60;
    const minutes = totalSeconds > 60 ? Math.ceil(totalSeconds / 60) - 1 : 0;
    return [minutes, seconds];
  },
};
