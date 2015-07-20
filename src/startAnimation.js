/**
 * Created by jljsj on 15/7/10.
 */
(function () {
  var startAnim = function (node, data, delay, hideen) {
    this.nodeStr = node;
    this.doc = document;
    this.tweenData = data instanceof Array ? data : null;
    this.str = typeof data == "string" ? data : "x-right";
    this.delay = Number(delay) ? delay * 1000 : 10;
    hideen = typeof hideen == "undefined" ? true : hideen;
    if (hideen) {
      this.doc.documentElement.style.opacity = 0;
      this.doc.documentElement.style.visibility = "hidden";
    }

    this.ready();
  };
  var a = startAnim.prototype = [];
  a.error = function (msg) {
    throw new Error(msg);
  };
  a.ready = function () {
    var self = this;

    function detach() {
      if (self.doc.addEventListener) {
        self.doc.removeEventListener("DOMContentLoaded", completed, false);
        window.removeEventListener("load", completed, false);
      } else {
        self.doc.detachEvent("onreadystatechange", completed);
        window.detachEvent("onload", completed);
      }
    }

    function completed() {
      if (self.doc.addEventListener || event.type === "load" || self.doc.readyState === "complete") {
        detach();
        self.init();
      }
    }

    if (self.doc.readyState === "complete") {
      completed()
    } else if (self.doc.addEventListener) {
      self.doc.addEventListener("DOMContentLoaded", completed, false);
      window.addEventListener("load", completed, false);
    } else {
      self.doc.attachEvent("onreadystatechange", completed);
      window.attachEvent("onload", completed);
    }
  };

  a.init = function () {
    var self = this,
      regTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
    //rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
    var htmlStyle = self.doc.documentElement;
    self.removeStyle(htmlStyle, "visibility:hidden;opacity:0");
    if (htmlStyle.style.length <= 0) {
      self.doc.documentElement.removeAttribute("style");
    }
    if (!self.nodeStr || regTag.test(self.nodeStr)) {
      return self.error("元素错误;");
    }
    if (typeof self.nodeStr == "string") {
      //var m=rquickExpr.exec(self.nodeStr);
      self.push.apply(self, self.doc.querySelectorAll(self.nodeStr))
    }
    if (!self.length) {
      return self.error("元素错误;");
    }
    for (var i = 0; i < self.length; i++) {
      var m = self[i];
      self.removeStyle(m, "visibility:hidden;opacity:0");
    }
    var mc = self.length == 1 ? self[0].children : self;
    self.forTweenData(mc, self.tweenData, function (mc, data) {
      if (!mc) {
        console.log("数据多余:" + JSON.stringify(data));
        return
      }
      mc.style.opacity = "0";
      mc.style.visibility = "visible";
      if (data) {
        if (data.style && !data.to) {
          self.addStyle(mc, self.animNameGroup(data.style))
        }
      } else {
        self.addStyle(mc, self.animNameGroup(self.str))
      }
    });
    var delay = self.delay || 10;
    setTimeout(function () {
      self.addTween();
    }, delay);
  };

  a.getTransform = function () {
    var style = "transform";
    if (!style in this.doc.documentElement.style) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = "-" + prefix[i] + "-transform";
        if ("-" + prefix[i] + "-transform" in this.doc.documentElement.style) break;
      }
    }
    return style
  };
  a.getTransition = function () {
    var style = "transition";
    if (!style in this.doc.documentElement.style) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = "-" + prefix[i] + "-transition";
        if ("-" + prefix[i] + "-transition" in this.doc.documentElement.style) break;
      }
    }
    return style
  };
  a.getAnimation = function () {
    var style = "animation";
    if (!style in this.doc.documentElement.style) {
      var prefix = ['webkit', 'moz', 'ms', 'o'];
      for (var i in prefix) {
        style = "-" + prefix[i] + "-animation";
        if ("-" + prefix[i] + "-animation" in this.doc.documentElement.style) break;
      }
    }
    return style
  };
//遍历dom节点；
  a.forTweenData = function (mc, data, callFunc) {
    if (!mc) {
      console.log("数据多余:" + JSON.stringify(data));
      return
    }
    var tm = mc.children || mc,
      i = 0;
    if (data && data.length) {
      for (i = 0; i < data.length; i++) {
        if (data[i].length) {
          this.forTweenData(tm[i], data[i], callFunc)
        } else {
          callFunc(tm[i], data[i])
        }
      }
    } else {
      for (i = 0; i < tm.length; i++) {
        if (mc.children) {
          callFunc(tm[i], null);
        } else {
          this.forTweenData(tm[i], null, callFunc);
        }
      }
    }
  };
//添加样式类
  a.addClass = function (m, value) {
    var _classname = m.className, s_k = " ";
    if (_classname.indexOf(value) < 0) {
      m.className += s_k + value;
    }
    m.className = m.className.trim()
  };
//删除样式类
  a.removeClass = function (m, value) {
    var rclass = /[\t\r\n\f]/g;
    var _classname = (" " + m.className + " ").replace(" " + rclass + " ", " ");
    while (_classname.indexOf(value) >= 0) {
      _classname = _classname.replace(value, " ");
    }
    m.className = _classname.trim();
    if (!m.className || m.className == "" || m.className == " ") {
      m.removeAttribute("class")
    }
  };
//添加style
  a.addStyle = function (mc, style) {
    var _style = mc.getAttribute("style");
    _style += style;
    mc.setAttribute("style", _style);
  };
//删除style;
  a.removeStyle = function (mc, style) {
    //console.log(style)
    var cArr = style.trim().split(";");
    cArr.map(function (arr) {
      if (arr && arr !== "") {

        //if(style.indexOf("animation")>=0||style.indexOf("transition")>=0||style.indexOf("transform")>=0){
        var _style = "";
        var _carr = mc.style.cssText.split(";");

        _carr.map(function (_arr) {
          if (_arr && _arr !== "") {
            //console.log(arr.split(":")[0].trim() == _arr.split(":")[0].trim(),
            //  arr.split(":")[0].trim(), _arr.split(":")[0].trim(),
            //  _arr.split(":")[0].trim().indexOf(arr.split(":")[0].trim()));
            if (_arr.split(":")[0].trim().indexOf(arr.split(":")[0].trim()) >= 0 && _arr.split(":")[1].trim().indexOf(arr.split(":")[1].trim()) >= 0) {

            } else {
              _style += _arr ? _arr + ";" : "";
            }
          }
        });
        //var sArr=arr.split(":");
        //_style = mc.style.cssText.replace(sArr[0] + ":", "").replace(sArr[1] + ";", "");
        mc.setAttribute("style", _style)
      }
    });
  };
  a.addTween = function () {

    //查找tweenDataArr与dom下子级的匹配；
    var self = this, delay = 0, ease = "cubic-bezier(0.165, 0.84, 0.44, 1)", timer = 0.5;

    function whichAnimationEvent() {
      var animation = {
        'animation': 'animationend',
        'oAnimation': 'oanimationend',
        'MozAnimation': 'mozAnimationEnd',
        'WebkitAnimation': 'webkitAnimationEnd',
        'msAnimation': 'MSAnimationEnd'
      };
      for (var t in animation) {
        if (t in self.doc.documentElement.style) {
          return animation[t];
        }
      }
    }

    function whichTransitionEvent() {
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };

      for (var t in transitions) {
        if (t in self.doc.documentElement.style) {
          return transitions[t];
        }
      }
    }

    function setAnimEventEnd(mc, css, style) {
      var animationEvent = whichAnimationEvent();

      function _event(e) {
        if (self.doc.addEventListener) {
          mc.removeEventListener(animationEvent, _event)
        } else {
          window.detachEvent(animationEvent, _event);
        }
        self.removeClass(mc, css);
        self.removeStyle(mc, style);
      }

      if (self.doc.addEventListener) {
        animationEvent && mc.addEventListener(animationEvent, _event);
      } else {
        animationEvent && mc.attachEvent(animationEvent, _event);
      }
    }

    function setTrnsitionEnd(mc) {
      var transitionEvent = whichTransitionEvent();

      function _event(e) {
        if (self.doc.addEventListener) {
          mc.removeEventListener(transitionEvent, _event)
        } else {
          window.detachEvent(transitionEvent, _event);
        }
        self.removeStyle(mc, "opacity:1;visibility:visible");
        var s = mc.getAttribute("style").split(";");
        var i = 0, _style = "";
        while (i < s.length) {
          if (s[i] !== "") {
            if (s[i].indexOf(mc.style[self.getTransition()]) >= 0) {
              s[i] = "";

            }
            if (s[i] !== "") {
              _style += s[i] + ";"
            }
          }
          i++
        }
        mc.setAttribute("style", _style);
      }

      if (self.doc.addEventListener) {
        transitionEvent && mc.addEventListener(transitionEvent, _event);
      } else {
        transitionEvent && mc.attachEvent(transitionEvent, _event);
      }
    }

    var mc = self.length == 1 ? self[0].children : self;
    self.forTweenData(mc, self.tweenData, function (mc, data) {
      if (!mc) {
        console.log("数据多余:" + JSON.stringify(data));
        return
      }
      setTimeout(function () {
        var tweenStr = " " + timer + "s " + ease + " " + delay + "s";

        function fjStyle(mc, style) {
          var cArr = style.trim().split(";");
          for (var i = 0; i < cArr.length; i++) {
            if (cArr[i] && cArr[i] !== "") {
              var sArr = cArr[i].split(":");
              mc.style[self.getTransition()] = sArr[0] + tweenStr;
            }
          }
        }

        if (data) {
          var _delay = data.delay || delay,
            _ease = data.ease || ease,
            _timer = data.timer || timer;
          //重写延时
          delay = data.delayRewrite ? _delay : delay;
          tweenStr = " " + _timer + "s " + _ease + " " + _delay + "s";
          if (data.css) {
            //mc.style[self.getTransition()] = "none";
            var a_delay="";
            if(data.animationDelay){
              if(typeof data.animationDelay=="number"){
                tweenStr = " " + _timer + "s " + _ease + " " + data.animationDelay + "s";
                a_delay="animation-delay:" + data.animationDelay + "s"
              }else
              a_delay="animation-delay:" + delay + "s"
            }
            self.addStyle(mc, a_delay);
            self.addClass(mc, data.css);
            setAnimEventEnd(mc, data.css, a_delay);
          } else if (data.style && !data.css) {
            var _name = self.animNameGroup(data.style);
            fjStyle(mc, _name);
            if (data.to) {
              self.addStyle(mc, _name)
            } else {
              self.removeStyle(mc, _name)
            }
          }
        } else {
          fjStyle(mc, self.animNameGroup(self.str));
          self.removeStyle(mc, self.animNameGroup(self.str))
        }
        mc.style[self.getTransition()] = mc.style[self.getTransition()] ? mc.style[self.getTransition()] + "," + "opacity" + tweenStr : "opacity" + tweenStr;
        mc.style.opacity = 1;
        delay += 0.1;
        //console.log(mc.style[self.getTransition()])
        setTrnsitionEnd(mc)
      }, 10)
    });
  };
  a.animNameGroup = function (name) {
    var _style = "", self = this;
    switch (name) {
      case "x-left":
        _style = self.getTransform() + ":translateX(-30px)";
        break;
      case "x-right":
        _style = self.getTransform() + ":translateX(30px)";
        break;
      case "y-bottom":
        _style = self.getTransform() + ":translateY(30px)";
        break;
      case "y-top":
        _style = self.getTransform() + ":translateY(-30px)";
        break;
      case "scale":
        _style = self.getTransform() + ":scale(0)";
        break;
      case "scaleFrom":
        _style = self.getTransform() + ":scale(2)";
        break;
      case "scaleX":
        _style = self.getTransform() + ":scaleX(0)";
        break;
      case "scaleY":
        _style = self.getTransform() + ":scaleY(0)";
        break;
      default :
        _style = name;
        break;
    }
    return _style
  };
  window.startAnimation = startAnim;
})();