'use strict';
var Css = require('./Css');
var Event = require('./animEvent');


var startAnim = function (node, data, delay, interval, hidden) {
  this.nodeStr = node;
  this.doc = document;
  this.tweenData = typeof data === 'object'  ? data : null;
  this.str = typeof data === 'string' ? data : 'right';
  this.delay = Number(delay) ? delay * 1000 : 10;
  this.interval = interval || 0.1;
  hidden = typeof hidden === 'undefined' ? true : hidden;
  if (hidden) {
    this.doc.documentElement.style.opacity = 0;
    this.doc.documentElement.style.visibility = 'hidden';
  }
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
    self.push(self.nodeStr);
  }
  if (!self.length) {
    return self.error('node error;');
  }
  var _mc = self.length === 1 ? self[0].children : self;
  self.forTweenData(_mc, self.tweenData, function (mc, data) {

    if (data) {
      var _style = data.type || data.style;
      if (_style && data.direction !== 'leave') {
        mc.style.opacity = '0';
        self.addStyle(mc, self.animNameGroup(_style));
      }
    } else {
      //mc.style.opacity = '0';
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
  var tm = mc.children || mc, self = this;
  //console.log(data)
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
    } else if (data.children.length) {
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
    }
  } else {
    for (var i = 0; i < mc.length; i++) {
      //if (mc.children) {
      //  callFunc(mc[i], null);
      //} else {
      //  if (!animBool) {
      //    //self.addStyle(tm[i], 'opacity:0;');
      //    if (!mc[i].children.length) {
      //      self.addStyle(mc[i], self.animNameGroup(self.str));
      //    }
      //  }
      //  self.forTweenData(mc[i], null, callFunc, animBool);
      //}
      callFunc(mc[i], null);
    }
    //if (animBool && mc.children) {
    //  self.setParentAnim(mc);
    //}
  }
};
a.setParentAnim = function (m) {
  var self = this;
  if (m) {
    self.removeStyle(m, 'opacity:0');
    var delay = 0;
    var cm = m.children[0];
    //var tweenStr = '';

    if (cm) {
      delay = cm.getAttribute('delay');
      //tweenStr = 'opacity .5s cubic-bezier(0.165, 0.84, 0.44, 1) ' + delay + 's';
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
        delay = p_mc ? Number(p_mc.getAttribute('delay')) + self.interval : Number(p[ci - 1].getAttribute('delay'));
      }

      self.__delay = delay + self.interval;
      self.fjStyle(m, self.animNameGroup(self.str), ' ' + self.__timer + 's ' + self.__ease + ' ' + delay + 's');
      self.removeStyle(m, self.animNameGroup(self.str));
      //tweenStr = m.style[self.getTransition()] + ',opacity .5s cubic-bezier(0.165, 0.84, 0.44, 1) ' + delay + 's';
    }
    m.setAttribute('delay', self.__delay);
    //m.style[self.getTransition()] = tweenStr;
    Event.setTrnsitionEnd(m);
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
  var self = this;
  var m = self.length === 1 ? self[0].children : self;
  //默认值
  self.__delay = 0;
  self.queueIdArr = [];//管理分支队延时间；
  self.__ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
  self.__timer = 0.5;
  self.__qId = 0;

  self.forTweenData(m, self.tweenData, function (mc, data) {

    var tweenStr = ' ' + self.__timer + 's ' + self.__ease + ' ' + self.__delay + 's';
    var _style = null;
    if (data) {
      //判断分支；
      self.__qId = data.queueId || self.__qId;
      //判断延时；
      self.queueIdArr[self.__qId] = (self.queueIdArr[self.__qId] || 0) + (data.delay || 0);
      self.__delay = self.queueIdArr[self.__qId];
      var _ease = data.ease || self.__ease,
        _timer = data.duration || self.__timer;
      tweenStr = ' ' + _timer + 's ' + _ease + ' ' + self.__delay + 's';
      _style = data.type || data.style;
      if (_style) {
        var _name = self.animNameGroup(_style);
        self.fjStyle(mc, _name, tweenStr);
        if (data.direction === 'leave') {
          self.addStyle(mc, _name);
        } else {
          self.removeStyle(mc, _name);
        }
      }
    } else {
      self.queueIdArr[self.__qId] = self.queueIdArr[self.__qId] || 0;
      self.__delay = self.queueIdArr[self.__qId] || self.__delay;
      tweenStr = ' ' + self.__timer + 's ' + self.__ease + ' ' + self.__delay + 's';
      self.fjStyle(mc, self.animNameGroup(self.str), tweenStr);
      self.removeStyle(mc, self.animNameGroup(self.str));
    }
    mc.setAttribute('delay', self.__delay);
    /*if (_style !== 'alpha') {
     mc.style[self.getTransition()] = mc.style[self.getTransition()] ? mc.style[self.getTransition()] + ',opacity' + tweenStr : 'opacity' + tweenStr;
     }*/
    self.removeStyle(mc, 'opacity:0');
    self.queueIdArr[self.__qId] += self.interval;
    Event.setTrnsitionEnd(mc);
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
var startAnimation = function (node, data, delay, interval, hidden) {
  return new startAnim(node, data, delay, interval, hidden);
};

module.exports = startAnimation;
