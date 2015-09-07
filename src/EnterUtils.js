/**
 * Created by jljsj on 15/9/1.
 */
import React from 'react';


const utils = {
  toArrayChildren: function (children) {
    const ret = [];
    React.Children.forEach(children, (c)=> {
      ret.push(c);
    });
    return ret;
  },
  //getChildrenFromProps: function (props) {
  //  const children = props.children;
  //  if (React.isValidElement(children)) {
  //    if (!children.key) {
  //      return React.cloneElement(children, {
  //        key: defaultKey
  //      });
  //    }
  //  }
  //  return obj;
  //},

  extend: function (des, src, override) {
    let i, len = src.length;
    if (src instanceof Array) {
      for (i = 0; i < len; i++) {
        utils.extend(des, src[i], override);
      }
    } else {
      for (i in src) {
        if (override || !(i in des)) {
          des[i] = src[i];
        }
      }
    }
    return des;
  },
  deleteRepeatKeyArr: function (arr) {
    var result = [], hash = {};
    for (var i = 0; i < arr.length; i++) {
      var elem = arr[i];
      if (elem) {
        if (elem.key) {
          if (elem && !hash[elem.key]) {
            result.push(elem);
            hash[elem.key] = true;
          }
        } else {
          result.push(elem);
        }
      }
    }
    return result;
  },
  contrastArr: function (a, b, callback) {
    if (a.length === 0) {
      b.map((m)=> {
        callback.call(this, m);
      });
    } else {
      a.map((m)=> {
        if (!m || !m.key) {
          return;
        }
        for (var i = 0; i < b.length; i++) {
          var cm = b[i];

          if (!cm || !cm.key || cm.key === m.key) {
            break;
          }
          if (i >= b.length - 1) {
            callback.call(this, cm);
          }
        }
      });
    }

  }
};
export default utils;
