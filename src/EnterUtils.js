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
  }
};
export default utils;
