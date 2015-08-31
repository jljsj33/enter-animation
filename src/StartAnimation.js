'use strict';
var Css = require('./Css');
var Event = require('./animEvent');


var cssStr = '';

var startAnim = function (node, vars) {
  //判断浏览，ie10以下不支持；
  if (!(this.getTransition() in document.documentElement.style)) {
    return false;
  }
  if (!vars) {
    vars = {};
  }
  this.nodeStr = node;
  this.doc = document;
  this.tweenData = typeof vars.data === 'object' ? vars.data : null;
  this.str = typeof vars.data === 'string' ? vars.data : 'right';
  this.delay = Number(vars.delay) ? vars.delay * 1000 : 30;
  this.interval = vars.interval || 0.1;
  this.direction = vars.direction || 'enter';
  this.__ease = vars.ease || 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  this.__timer = vars.duration || 0.5;
  this.upend = vars.upend || false;
  var hidden = typeof vars.hidden === 'undefined' ? true : vars.hidden;
  this.callback = vars.onComplete;
  this.kill = vars.kill;
  if (hidden) {
    this.doc.documentElement.style.opacity = 0;
    this.doc.documentElement.style.visibility = 'hidden';
  }
  cssStr += cssStr !== this.str + ';' ? this.str + ';' : '';
  setTimeout(function () {
    cssStr = '';
  }, 1000);//1秒后清掉样式
  this.init();
};
var a = startAnim.prototype = [];
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
    if (self.nodeStr.length) {
      self.push.apply(self, self.nodeStr);
    } else {
      self.push(self.nodeStr);
    }
  }
  if (!self.length) {
    return self.error('node error;');
  }
  var _mc = self.length === 1 ? self[0].children : self;
  //默认值
  self.__delay = 0;
  self.queueIdArr = [];//管理分支队延时间；

  self.__ease = self.__ease || 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  self.__timer = self.__timer || 0.5;
  self.__qId = 0;

  self.forTweenData(_mc, self.tweenData, function (mc, data) {
    if (self.kill) {
      var s = '';
      for (var c = 0; c < cssStr.split(';').length; c++) {
        s += self.animNameGroup(cssStr.split(';')[c]) + ';';
      }
      self.removeStyle(mc, 'transition;' + s, true);
    }

    if (data) {
      if (self.upend) {
        //判断分支；
        self.__qId = data.queueId || 0;
        //判断延时；
        if (!self.queueIdArr[self.__qId] && self.queueIdArr[self.__qId] !== 0) {
          self.queueIdArr[self.__qId] = 0 + (data.delay || 0);
        } else {
          self.queueIdArr[self.__qId] = Number(Number(self.queueIdArr[self.__qId] + (data.delay || 0) + self.interval).toFixed(3));
        }
      }
      var _style = data.type || data.style;

      var direction = data.direction || self.direction;

      if (_style) {
        if (direction !== 'leave') {
          mc.style.opacity = '0';
          self.addStyle(mc, self.animNameGroup(_style));
        } else {
          self.removeStyle(mc, self.animNameGroup(_style));
        }
      }
    } else {
      if (self.upend) {
        if (!self.queueIdArr[self.__qId] && self.queueIdArr[self.__qId] !== 0) {
          self.queueIdArr[self.__qId] = 0;
        } else {
          self.queueIdArr[self.__qId] = Number(Number(self.queueIdArr[self.__qId] + self.interval).toFixed(3));
        }
      }
      if (self.direction !== 'leave') {
        self.addStyle(mc, self.animNameGroup(self.str));
      } else {
        self.removeStyle(mc, self.animNameGroup(self.str));
      }
    }
    self.enterLength = self.enterLength ? self.enterLength + 1 : 1;
  });
  setTimeout(function () {
    self.addTween();
  }, self.delay);
};
//遍历dom节点；
a.forTweenData = function (mc, data, callFunc, animBool) {
  if (!mc) {
    if (!animBool) {
      console.log('Data redundancy:' + JSON.stringify(data));
    }
    return;
  }
  var tm = mc.children || mc, self = this;
  if (data) {
    if (data.length) {
      data.map(function (m, ii) {
        if (m.length) {
          self.forTweenData(tm[ii], m, callFunc, animBool);
        } else if (m.children) {
          if (m.type || m.style) {
            callFunc(tm[ii], m);
          }
          self.forTweenData(tm[ii], m, callFunc, animBool);
        } else if (m.type || m.style) {
          callFunc(tm[ii], m);
        }
      });
    } else if (data.children && data.children.length) {
      data.children.map(function (m, ii) {
        if (m.length) {
          self.forTweenData(tm[ii], m, callFunc, animBool);
        } else if (m.children) {
          if (m.type || m.style) {
            callFunc(tm[ii], m);
          }
          self.forTweenData(tm[ii], m, callFunc, animBool);
        } else if (m.type || m.style) {
          callFunc(tm[ii], m);
        }
      });
    } else {
      self.error('data(' + data + ') is error');
    }
  } else {

    for (var i = 0; i < tm.length; i++) {
      callFunc(tm[i], null);
    }
  }
};

a.fjStyle = function (node, style, tweenStr) {
  var cArr = style.trim().split(';'), self = this;
  for (var i = 0; i < cArr.length; i++) {
    if (cArr[i] && cArr[i] !== '') {
      var sArr = cArr[i].split(':');
      node.style[self.getTransition()] = node.style[self.getTransition()] ? node.style[self.getTransition()] + ',' + sArr[0] + tweenStr : sArr[0] + tweenStr;
    }
  }

};
a.addTween = function () {
  //查找tweenDataArr与dom下子级的匹配；
  var self = this, eNum = 0;
  var m = self.length === 1 ? self[0].children : self;

  self.forTweenData(m, self.tweenData, function (mc, data) {
    var tweenStr = ' ' + self.__timer + 's ' + self.__ease + ' ' + self.__delay + 's';
    var _style = null;
    if (data) {
      //判断分支；
      self.__qId = data.queueId || 0;
      //判断延时；
      if (self.upend) {
        self.queueIdArr[self.__qId] = Number(Number((self.queueIdArr[self.__qId] || 0) - (data.delay || 0)).toFixed(3));
        self.__delay = Number(Number((self.queueIdArr[self.__qId]) + (data.delay || 0)).toFixed(3));
      } else {
        self.queueIdArr[self.__qId] = Number(Number((self.queueIdArr[self.__qId] || 0) + (data.delay || 0)).toFixed(3));
        self.__delay = self.queueIdArr[self.__qId];
      }

      var _ease = data.ease || self.__ease,
        _timer = data.duration || self.__timer;
      tweenStr = ' ' + _timer + 's ' + _ease + ' ' + self.__delay + 's';
      _style = data.type || data.style;
      if (_style) {
        var _name = self.animNameGroup(_style);
        self.fjStyle(mc, _name, tweenStr);
        var direction = data.direction || self.direction;
        if (direction === 'leave') {
          self.addStyle(mc, _name);
        } else {
          self.removeStyle(mc, _name);
        }
      }
    } else {
      self.queueIdArr[self.__qId] = self.queueIdArr[self.__qId] || 0;
      self.__delay = self.queueIdArr[self.__qId] || self.queueIdArr[self.__qId] === 0 ? self.queueIdArr[self.__qId] : self.__delay;
      tweenStr = ' ' + self.__timer + 's ' + self.__ease + ' ' + self.__delay + 's';
      self.fjStyle(mc, self.animNameGroup(self.str), tweenStr);
      if (self.direction === 'leave') {
        self.addStyle(mc, self.animNameGroup(self.str));
      } else {
        self.removeStyle(mc, self.animNameGroup(self.str));
      }
    }
    mc.setAttribute('delay', self.__delay);
    if (self.upend) {
      if (self.queueIdArr[self.__qId] > 0) {
        self.queueIdArr[self.__qId] -= self.interval;
      }
    } else {
      self.queueIdArr[self.__qId] += self.interval;
    }
    setTimeout(function () {
      Event.setTrnsitionEnd(mc, function () {
        eNum++;
        if (eNum >= self.enterLength) {
          if (typeof self.callback === 'function') {
            self.callback();
          }
        }
      });
    }, self.__delay * 1000);

  }, true);
};
a.animNameGroup = function (name) {
  var _style = '', self = this;
  switch (name) {
    case 'alpha':
      _style = 'opacity:0';
      break;
    case 'left':
      _style = self.getTransform() + ':translateX(-30px);opacity:0';
      break;
    case 'right':
      _style = self.getTransform() + ':translateX(30px);opacity:0;';
      break;
    case 'bottom':
      _style = self.getTransform() + ':translateY(30px);opacity:0';
      break;
    case 'top':
      _style = self.getTransform() + ':translateY(-30px);opacity:0';
      break;
    case 'scale':
      _style = self.getTransform() + ':scale(0);opacity:0';
      break;
    case 'scaleBig':
      _style = self.getTransform() + ':scale(2);opacity:0';
      break;
    case 'scaleX':
      _style = self.getTransform() + ':scaleX(0);opacity:0';
      break;
    case 'scaleY':
      _style = self.getTransform() + ':scaleY(0);opacity:0';
      break;
    default :
      _style = name;
      break;
  }
  return _style;
};
var startAnimation = function (node, vars) {
  return new startAnim(node, vars);
};
module.exports = startAnimation;
