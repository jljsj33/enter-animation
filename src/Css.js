'use strict';

module.exports = {
  addClass(m, value) {
    //添加样式类
    if (!m) {
      return false;
    }
    var _classname = m.className, s_k = ' ';
    if (_classname.indexOf(value) < 0) {
      m.className += s_k + value;
    }
    m.className = m.className.trim();
  },
  removeClass(m, value) {
    //删除样式类
    if (!m) {
      return false;
    }
    var rclass = /[\t\r\n\f]/g;
    var _classname = (' ' + m.className + ' ').replace(' ' + rclass + ' ', ' ');
    while (_classname.indexOf(value) >= 0) {
      _classname = _classname.replace(value, ' ');
    }
    m.className = _classname.trim();
    if (!m.className || m.className === '' || m.className === ' ') {
      m.removeAttribute('class');
    }
  },
  addStyle(m, style) {
    //添加style
    if (!m) {
      return false;
    }
    var _style = m.getAttribute('style') || '';
    _style += style;
    m.setAttribute('style', _style);
  },
  removeStyle(m, style, oneBool) {
    //删除style;
    if (!m) {
      return false;
    }
    var cArr = style.trim().split(';');
    cArr.map(function (arr) {
      if (arr && arr !== '') {
        var carr = m.style.cssText.split(';'),
          cOne = arr.split(':')[0].replace(/\s/g, ''),
          cTow = arr.split(':')[1] ? arr.split(':')[1].replace(/\s/g, '') : '';
        carr.map(function (_arr) {
          if (_arr && _arr !== '') {
            var tcOne = _arr.split(':')[0].replace(/\s/g, ''),
              tcTow = _arr.split(':')[1].replace(/\s/g, '');
            if (oneBool && tcOne.indexOf(cOne) >= 0) {
              m.style[arr.split(':')[0]] = '';
            } else if (tcOne.indexOf(cOne) >= 0 && tcTow === cTow) {
              m.style[arr.split(':')[0]] = '';
            }
          }
        });
      }
    });
  }
};
