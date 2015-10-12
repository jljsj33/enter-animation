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
  },

  filter: function (array, target) {
    let result;
    if (!target.key) {
      return target;
    }

    React.Children.forEach(array, (item) => {

      if (typeof item !== 'object') {
        //只改里面的文字不执行动画；
        result = true;
      } else if (item.props && target.props && item.key === target.key) {
        result = item;
      }
    });
    return result;
  },

  MergeWap: function (currentArray, newArray, keysToEnter, keysToLeave) {
    //组数合并，检索两数组的不同
    let wapToEnter = [];
    let wapToLeave = [];
    if (!currentArray || !currentArray.length) {
      wapToEnter = newArray;
      React.Children.forEach(newArray, (item)=> {
        if (item.key) {
          keysToEnter.push(item.key);
        }
      });
      return wapToEnter;
    } else if (!newArray || !newArray.length) {
      wapToLeave = currentArray;
      React.Children.forEach(currentArray, (item)=> {
        if (item.key) {
          keysToLeave.push(item.key);
        }
      });

      return wapToLeave;
    } else {
      //new里的与current里的对比，
      //如果current里的元素没key，那在new里肯定存在。
      //如果没key的情况下还存在，用newArray里的会导至刷新子级;
      React.Children.forEach(currentArray, (item) => {
        let existItem = utils.filter(newArray, item);//返回new里是否有item,如果有返回item,如果没key直接返回；
        if (!existItem && typeof item === 'object' && item.key) {
          //result.push(item);
          //如果没有，放入新增数组；
          wapToLeave.push(item);

          keysToLeave.push(item.key);
        }
      });
      React.Children.forEach(newArray, (item)=> {
        let existItem = utils.filter(currentArray, item);
        if (!existItem && typeof item === 'object' && item.key) {
          wapToEnter.push(item);
          keysToEnter.push(item.key);
        }
      });
      let leavaItem = [];
      wapToLeave.map((item)=> {
        //算出item在newArray里的位置；
        //item在currentArrray的位轩;
        let index = currentArray.indexOf(item);
        let nextIndex = 0;
        //if (index >= currentArray.length - 1) {
        //  nextIndex = index;
        //}
        for (let i = index + 1; i < currentArray.length; i++) {
          //判断index后面的item在newArr里是否存在；
          let _item = currentArray[i];
          for (let ii = 0; ii < newArray.length; ii++) {
            let new_item = newArray[ii];
            if (new_item.key === _item.key) {
              nextIndex = ii;
              break;
            }
          }
          if (nextIndex) {
            break;
          }
        }
        //判断index前面
        for (let j = index - 1; j >= 0; j--) {
          let __item = currentArray[j];
          for (let jj = 0; jj < newArray.length; jj++) {
            let _new_item = newArray[jj];
            if (__item.key === _new_item.key) {
              nextIndex = jj + 1;
              break;
            }
          }
          if (nextIndex) {
            break;
          }
        }
        //如果存在，newArray的指定位置插入，如果没有，放在leavaItem,然后再合并的最前面；
        if (nextIndex) {
          newArray.splice(nextIndex, 0, item);

        } else {
          leavaItem.push(item);
        }
      });

      newArray = leavaItem.concat(newArray);
      return newArray;
    }
  },
  wapMapKeys: function (wap) {
    let result = [];
    React.Children.map(wap, (m)=> {
      if (m.props) {
        if (m.key) {
          result.push(m.key);
        } else if (m.props.children) {
          let _res = this.wapMapKeys(m.props.children);
          result = result.concat(_res);
        }
      }
    });
    return result;
  }
};
export default utils;
