'use strict';
var Css = require('./Css');
var Event = require('./animEvent');


var startAnim = function (node, data, delay, hidden) {
  this.nodeStr = node;
  this.doc = document;
  this.tweenData = data instanceof Array ? data : null;
  this.str = typeof data === 'string' ? data : 'x-right';
  this.delay = Number(delay) ? delay * 1000 : 10;
  hidden = typeof hidden === 'undefined' ? true : hidden;
  if (hidden) {
    this.doc.documentElement.style.opacity = 0;
    this.doc.documentElement.style.visibility = 'hidden';
  }
  this.init();
};
var a = startAnim.prototype = [];
a.__delay = 0;
a.__ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
a.__timer = 0.5;
a.addClass = Css.addClass;
a.removeClass = Css.removeClass;
a.addStyle = Css.addStyle;
a.removeStyle = Css.removeStyle;
a.getTransform = Event.getTransform;
a.getTransition = Event.getTransition;
a.getAnimation = Event.getAnimation;
a.error = function (msg) {
  throw new Error(msg);
};
a.init = function () {
  var self = this,
    regTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
  //rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
  var htmlStyle = self.doc.documentElement;
  self.removeStyle(htmlStyle, 'visibility:hidden;opacity:0');
  if (htmlStyle.style.length <= 0) {
    self.doc.documentElement.removeAttribute('style');
  }
  if (!self.nodeStr || regTag.test(self.nodeStr)) {
    return self.error('元素错误;');
  }
  if (typeof self.nodeStr === 'string') {
    //var m=rquickExpr.exec(self.nodeStr);
    self.push.apply(self, self.doc.querySelectorAll(self.nodeStr));
  } else if (typeof self.nodeStr === 'object') {
    self.push(self.nodeStr);
  }
  if (!self.length) {
    return self.error('node error;');
  }
  /*for (var i = 0; i < self.length; i++) {
   var m = self[i];
   self.removeStyle(m, 'visibility:hidden;opacity:0');
   }*/
  var _mc = self.length === 1 ? self[0].children : self;
  self.forTweenData(_mc, self.tweenData, function (mc, data) {
    mc.style.opacity = '0';
    //mc.style.visibility = 'visible';
    if (data) {
      if (data.style && !data.to) {
        self.addStyle(mc, self.animNameGroup(data.style));
      }
    } else {
      self.addStyle(mc, self.animNameGroup(self.str));
    }
  });
  var delay = self.delay || 10;
  setTimeout(function () {
    self.addTween();
  }, delay);
};
//遍历dom节点；
a.forTweenData = function (mc, data, callFunc, animBool) {
  if (!mc) {
    if (!animBool) {
      console.log('Data redundancy:' + JSON.stringify(data));
    }
    return;
  }
  var tm = mc.children || mc, self = this, i = 0;
  if (data && data.length) {
    for (i = 0; i < data.length; i++) {
      if (data[i].length) {
        if (!animBool) {
          self.addStyle(tm[i], 'opacity:0');
        }
        this.forTweenData(tm[i], data[i], callFunc, animBool);
      } else {
        callFunc(tm[i], data[i]);
      }
    }
  } else {
    for (i = 0; i < tm.length; i++) {
      if (mc.children) {
        callFunc(tm[i], null);
      } else {
        if (!animBool) {
          self.addStyle(tm[i], 'opacity:0;');
          if (!tm[i].children.length) {
            self.addStyle(tm[i], self.animNameGroup(self.str));
          }
        }
        this.forTweenData(tm[i], null, callFunc, animBool);
      }
    }
  }
  if (animBool && mc.children) {
    self.setParentAnim(mc);
  }
};
a.setParentAnim = function (m) {
  var self = this;
  if (m && m.style) {
    m.style.opacity = 1;
    var delay = 0;
    var cm = m.children[0];
    var tweenStr = '';
    if (cm) {
      delay = cm.getAttribute('delay');
      tweenStr = 'opacity .5s cubic-bezier(0.165, 0.84, 0.44, 1) ' + delay + 's';
    } else {
      var p = m.parentNode.children, _m = m, ci = 0;
      while (_m) {
        _m = _m.previousSibling;
        if (_m && _m.nodeType === 1) {
          ci++;
        }
      }
      if (ci) {
        var p_mc = p[ci - 1].children[p[ci - 1].children.length - 1];
        delay = p_mc ? Number(p_mc.getAttribute('delay')) + 0.1 : (ci / 10);
      }
      self.__delay = delay + 0.1;
      self.fjStyle(m, self.animNameGroup(self.str), ' ' + self.__timer + 's ' + self.__ease + ' ' + delay + 's');
      self.removeStyle(m, self.animNameGroup(self.str));
      tweenStr = m.style[self.getTransition()] + ',opacity .5s cubic-bezier(0.165, 0.84, 0.44, 1) ' + delay + 's';
    }
    m.style[self.getTransition()] = tweenStr;
    Event.setTrnsitionEnd(m);
  }
};
a.fjStyle = function (node, style, tweenStr) {
  var cArr = style.trim().split(';'), self = this;
  for (var i = 0; i < cArr.length; i++) {
    if (cArr[i] && cArr[i] !== '') {
      var sArr = cArr[i].split(':');
      node.style[self.getTransition()] = sArr[0] + tweenStr;
    }
  }
};
a.addTween = function () {
  //查找tweenDataArr与dom下子级的匹配；
  var self = this;
  var m = self.length === 1 ? self[0].children : self;
  self.forTweenData(m, self.tweenData, function (mc, data) {
    var tweenStr = ' ' + self.__timer + 's ' + self.__ease + ' ' + self.__delay + 's';
    if (data) {
      var _delay = data.delay || self.__delay,
        _ease = data.ease || self.__ease,
        _timer = data.timer || self.__timer;
      //重写延时
      self.__delay = data.delayRewrite ? _delay : self.__delay;
      tweenStr = ' ' + _timer + 's ' + _ease + ' ' + _delay + 's';
      if (data.css) {
        var a_delay = '';
        if (data.animationDelay) {
          if (typeof data.animationDelay === 'number') {
            tweenStr = ' ' + _timer + 's ' + _ease + ' ' + data.animationDelay + 's';
            a_delay = 'animation-delay:' + data.animationDelay + 's';
          } else {
            a_delay = 'animation-delay:' + self.__delay + 's';
          }
        }
        self.addStyle(mc, a_delay);
        self.addClass(mc, data.css);
        Event.setAnimEventEnd(mc, data.css, a_delay);
      } else if (data.style && !data.css) {
        var _name = self.animNameGroup(data.style);
        self.fjStyle(mc, _name, tweenStr);
        if (data.to) {
          self.addStyle(mc, _name);
        } else {
          self.removeStyle(mc, _name);
        }
      }
    } else {
      self.fjStyle(mc, self.animNameGroup(self.str), tweenStr);
      self.removeStyle(mc, self.animNameGroup(self.str));
    }
    mc.setAttribute('delay', self.__delay);
    mc.style[self.getTransition()] = mc.style[self.getTransition()] ? mc.style[self.getTransition()] + ',opacity' + tweenStr : 'opacity' + tweenStr;
    mc.style.opacity = 1;
    self.__delay += 0.1;
    Event.setTrnsitionEnd(mc);
  }, true);
};
a.animNameGroup = function (name) {
  var _style = '', self = this;
  switch (name) {
    case 'x-left':
      _style = self.getTransform() + ':translateX(-30px)';
      break;
    case 'x-right':
      _style = self.getTransform() + ':translateX(30px)';
      break;
    case 'y-bottom':
      _style = self.getTransform() + ':translateY(30px)';
      break;
    case 'y-top':
      _style = self.getTransform() + ':translateY(-30px)';
      break;
    case 'scale':
      _style = self.getTransform() + ':scale(0)';
      break;
    case 'scaleFrom':
      _style = self.getTransform() + ':scale(2)';
      break;
    case 'scaleX':
      _style = self.getTransform() + ':scaleX(0)';
      break;
    case 'scaleY':
      _style = self.getTransform() + ':scaleY(0)';
      break;
    default :
      _style = name;
      break;
  }
  return _style;
};
var startAnimation = function (node, data, delay, hidden) {
  return new startAnim(node, data, delay, hidden);
};

module.exports = startAnimation;
