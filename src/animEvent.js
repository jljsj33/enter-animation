'use strict';
var Css = require('./Css');

module.exports = {
  getTransform() {
    var style = 'transform';
    if (!(style in document.documentElement.style)) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = '-' + prefix[i] + '-transform';
        if (style in document.documentElement.style) {
          break;
        }
      }
    }
    return style;
  },
  getTransition() {
    var style = 'transition';
    if (!(style in document.documentElement.style)) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = '-' + prefix[i] + '-transition';
        if (style in document.documentElement.style) {
          break;
        }
      }
    }
    return style;
  },
  getAnimation() {
    var style = 'animation';
    if (!(style in document.documentElement.style)) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = '-' + prefix[i] + '-animation';
        if (style in document.documentElement.style) {
          break;
        }
      }
    }
    return style;
  },
  whichAnimationEvent() {
    var animation = {
      'animation': 'animationend',
      'oAnimation': 'oanimationend',
      'MozAnimation': 'mozAnimationEnd',
      'WebkitAnimation': 'webkitAnimationEnd',
      'msAnimation': 'MSAnimationEnd'
    };
    for (var t in animation) {
      if (t in document.documentElement.style) {
        return animation[t];
      }
    }
  },
  whichTransitionEvent() {
    var transitions = {
      'transition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };

    for (var t in transitions) {
      if (t in document.documentElement.style) {
        return transitions[t];
      }
    }
  },
  setAnimEventEnd(mc, css, style) {
    var animationEvent = this.whichAnimationEvent();

    function _event() {
      if (document.addEventListener) {
        mc.removeEventListener(animationEvent, _event);
      } else {
        window.detachEvent(animationEvent, _event);
      }
      Css.removeClass(mc, css);
      Css.removeStyle(mc, style);
    }


    if (document.addEventListener) {
      mc.addEventListener(animationEvent, _event);
    } else {
      mc.attachEvent(animationEvent, _event);
    }
  },
  setTrnsitionEnd(mc) {
    var transitionEvent = this.whichTransitionEvent();
    var self = this;

    function _event(e) {
      if (document.addEventListener) {
        mc.removeEventListener(transitionEvent, _event);
      } else {
        window.detachEvent(transitionEvent, _event);
      }
      Css.removeStyle(mc, 'opacity:1;visibility:visible');
      if (mc.getAttribute('style')) {
        var s = mc.getAttribute('style').split(';');
        var i = 0, _style = '';

        while (i < s.length) {

          if (s[i] !== '') {
            if (s[i].indexOf(mc.style[self.getTransition()]) >= 0 && mc.style[self.getTransition()] && mc.style[self.getTransition()] !== '') {
              s[i] = '';
            }
            //这里的判断为改变s[i]值后的判断
            if (s[i] !== '') {
              _style += s[i] + ';';
            }
          }
          i++;
        }

        if (!_style || _style.replace(/\s/g, '') === '') {
          mc.removeAttribute('style');
        } else {
          mc.setAttribute('style', _style);
        }
      }
      mc.removeAttribute('delay');
    }

    if (document.addEventListener) {
      mc.addEventListener(transitionEvent, _event);
    } else {
      mc.attachEvent(transitionEvent, _event);
    }
  }
};
