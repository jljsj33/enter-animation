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
  contrastArr: function (_a, _b, callback) {
    var a = _a, b = _b.concat();
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
            b.splice(i, 1);
          }
        }
      });
      b.map((m)=> {
        callback.call(this, m);
      });
    }
  },
  isPropsPushData: function (data, tagData, enterDataType) {
    let _data = {};
    if (data || tagData) {
      data = data || {};
      if (typeof data === 'boolean') {
        data = {};
      }
      if (typeof tagData === 'string') {
        tagData = JSON.parse(tagData);
      }
      tagData = tagData || {};
      _data = utils.extend({}, [data, tagData]);

      if (!_data.type && !_data.style) {
        _data.type = enterDataType;
      }
    }
    return _data;
  },
  noPropsPushData: function (tagData, enterDataType) {
    if (typeof tagData === 'string') {
      tagData = JSON.parse(tagData);
    }
    if (tagData) {
      if (typeof tagData === 'boolean') {
        tagData = {};
      }
      if (!tagData.type && !tagData.style) {
        tagData.type = enterDataType;
      }
    }
    return tagData || {};
  },
  leaveInherit: function (leave, enter) {
    if (leave.type || enter.type) {
      leave.type = leave.type || enter.type;
    }
    if (leave.style || enter.style) {
      leave.style = leave.style || enter.style;
    }
    if (typeof leave.duration === 'number' || enter.duration) {
      leave.duration = typeof leave.duration === 'number' ? leave.duration : enter.duration;
    }
    if (leave.ease || enter.ease) {
      leave.ease = leave.ease || enter.ease;
    }
    if (typeof leave.delay === 'number' || enter.delay) {
      leave.delay = typeof leave.delay === 'number' ? leave.delay : enter.delay;
    }
    if (typeof leave.queueId === 'number' || enter.queueId) {
      leave.queueId = typeof leave.queueId === 'number' ? leave.queueId : enter.queueId;
    }
    return leave;
  }
};
export default utils;
