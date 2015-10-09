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
        if (!m || (!m.key && !m.props)) {
          return;
        }

        for (var i = b.length - 1; i >= 0; i--) {
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
  contrastEnterKeyArr: function (_a, _b, callback) {
    var a = _a, b = _b.concat();
    if (a.length === 0) {
      b.map((m)=> {
        callback.call(this, m);
      });
    } else {
      a.map((m)=> {
        if (!m || !m.props) {
          return;
        }
        for (var i = b.length - 1; i >= 0; i--) {
          var cm = b[i];
          if (cm.props['enter-key'] === m.props['enter-key']) {
            b.splice(i, 1);
          }
        }
      });
      b.map((m)=> {
        callback.call(this, m);
      });
    }
  },
  isPropsPushData: function (data, enterDataType) {
    let _data = {};
    //if (data || tagData) {
    //  data = data || {};
    //  if (typeof data === 'boolean') {
    //    data = {};
    //  }
    //  if (typeof tagData === 'string') {
    //    tagData = JSON.parse(tagData);
    //  }
    //  tagData = tagData || {};
    //  _data = utils.extend({}, [data, tagData]);
    //  if (!_data.type && !_data.style) {
    //    _data.type = enterDataType;
    //  }
    //}
    if (data) {
      //React.Children.forEach(data,(m)=> {
      //  _data[m] = data[m];
      //})
      for (var a in data) {
        _data[a] = data[a];
      }
      if (!_data.type && !_data.style) {
        _data.type = enterDataType;
      }
    }
    return _data;
  },
  //noPropsPushData: function (tagData, enterDataType) {
  //  if (typeof tagData === 'string') {
  //    tagData = JSON.parse(tagData);
  //  }
  //  if (tagData) {
  //    if (typeof tagData === 'boolean') {
  //      tagData = {};
  //    }
  //    if (!tagData.type && !tagData.style) {
  //      tagData.type = enterDataType;
  //    }
  //  }
  //  return tagData || {};
  //},
  leaveInherit: function (a, _root, b) {
    if (a.type || b.type) {
      a.type = a.type || _root.type || b.type;
    }
    if (a.style || b.style) {
      a.style = a.style || _root.style || b.style;
    }
    //console.log(typeof a.duration === 'number' || typeof b.duration === 'number')
    if (typeof a.duration === 'number' || typeof b.duration === 'number') {
      a.duration = typeof a.duration === 'number' ? a.duration : b.duration;
    }
    if (a.ease || b.ease) {
      a.ease = a.ease || b.ease;
    }
    if (typeof a.delay === 'number' || b.delay) {
      a.delay = typeof a.delay === 'number' ? a.delay : b.delay;
    }
    if (typeof a.queueId === 'number' || b.queueId) {
      a.queueId = typeof a.queueId === 'number' ? a.queueId : b.queueId;
    }
    if (a.type || a.style) {
      if (typeof a.duration !== 'number' && typeof _root.duration === 'number') {
        a.duration = _root.duration;
      }
      if (!a.ease && _root.ease) {
        a.ease = _root.ease;
      }
    }
    return a;
  }
};
export default utils;
