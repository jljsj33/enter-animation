import React, {Component, findDOMNode, cloneElement} from 'react';
import {isPropsPushData, leaveInherit, toArrayChildren} from './EnterUtils';
let startAnimation = require('./StartAnimation');
//const defaultKey = 'enter_' + Date.now();

class EnterAnimationChild extends Component {
  constructor(props) {
    super(...arguments);
    this.childrenWap = this.props.children;
    this.state = {
      enter: props.enter || {},
      leave: props.leave || {},
      children: this.childrenWap
    };
    this.childrenKey = [];

    this.keysToEnter = [];
    this.keysToLeave = [];
    this.wapToEnter = [];
    this.wapToLeave = [];
    this.dataArr = [];
    this.direction = '';
    this.defaultType = !this.state.enter && !this.state.leave ? 'right' : this.direction === 'leave' ? this.state.leave.type || this.state.leave.style || this.state.enter.type || this.state.enter.style || 'right' : this.state.enter.type || this.state.enter.style || 'right';

  }

  /*遍历children里的dataEnter*/
  callChildrenDataEnter(re, arr, i) {
    var self = this, props = re.props, enter, leave;
    arr[i] = {enter: {}, leave: {}};
    if (props) {
      arr[i].key = re.key;
      //arr[i].re = re;
      enter = isPropsPushData(props['enter-data'], self.defaultType);
      leave = isPropsPushData(props['leave-data'], self.state.leave.type || self.state.leave.style || enter.type || enter.style || self.defaultType);
      if (!self.keysToLeave.length && !self.keysToEnter.length) {
        arr[i].enter = leaveInherit(enter, self.state.enter, {});
        //出场如果没有效果，继承进场效果；
        arr[i].leave = leaveInherit(leave, self.state.leave, enter);
      } else {
        let key = re.key;
        if (this.keysToEnter.indexOf(key) >= 0) {
          arr[i].direction = 'enter';
          arr[i].enter = leaveInherit(enter, self.state.enter, {});
          let qId = Math.round(Math.random() * 9999) + 10000;
          arr[i].enter.queueId = qId;//出场进场分支，跟默认的分开，因为这是新添加的。
          arr[i].leave = leaveInherit(leave, self.state.leave, enter);
          arr[i].leave.queueId = qId;
        } else if (this.keysToLeave.indexOf(key) >= 0) {
          arr[i].direction = 'leave';
          arr[i].enter = leaveInherit(enter, self.state.enter, {});
          arr[i].leave = leaveInherit(leave, self.state.leave, enter);
          let qId = Math.round(Math.random() * 9999) + 10000;
          arr[i].enter.queueId = qId;
          arr[i].leave.queueId = qId;
        }
      }


      if (typeof props.children === 'object' && props.children && props.children.length) {
        arr[i].children = [];
        self.componentChildrenDataEnter(props.children, arr[i].children);
      }
    } else {
      console.warn('props is null');
    }
    if (arr[i].enter.type || arr[i].enter.style || arr[i].leave.type || arr[i].leave.style) {
      self.dataArr.cBool = true;
    }
  }


  componentChildrenDataEnter(children, arr) {
    let self = this, props;
    if (children && typeof children === 'object' && children.length) {
      //有react时
      //要处理children里的enter-data;
      //判断子级还有没有Array;
      children = toArrayChildren(children.reduce(function (a, b) {
        if (!(a instanceof Array)) {
          return [a].concat(b);
        } else {
          return a.concat(b);
        }
      }));
      children.map(function (re, i) {
        if (re) {
          props = re.props;
          if (props) {
            self.callChildrenDataEnter(re, arr, i);
          }
        }
      });
    } else {
      return console.warn('Warning: Not perform EnterAnimation, Children is null.');
    }
  }


  callEnterAnimation(dom) {

    var state = this.state;

    var enter = state.enter || {}, leave = state.leave || null;
    var transition = this.dataArr;
    let direction = this.direction;
    if (!this.dataArr.cBool) {
      transition = enter.type || enter.style || 'right';
      if (direction === 'leave' && leave) {
        transition = leave.type || leave.style || transition;
      }
    }
    var callFunc = ()=> {
      enter.callback.call(this, {ReactElement: this.props.children, target: dom, direction: direction});
    };
    var callBack = typeof enter.callback === 'function' ? callFunc : null,
      reverse = enter.reverse,
      duration = enter.duration,
      delay = enter.delay,
      interval = enter.interval,
      ease = enter.ease;
    if (direction === 'leave') {
      callBack = ()=> {
        //动画后;
        if (leave && typeof leave.callback === 'function') {
          leave.callback.call(this, {ReactElement: this.props.children, target: dom, direction: direction});
        } else if (typeof enter.callback === 'function') {
          enter.callback.call(this, {ReactElement: this.props.children, target: dom, direction: direction});
        }
        //出场周期结束；
        this.props.callback();
      };
      //大标签上的继承
      if (leave) {
        reverse = leave.reverse || enter.reverse;
        duration = typeof leave.duration === 'number' ? leave.duration : enter.duration;
        delay = typeof leave.delay === 'number' ? leave.delay : enter.delay;
        interval = typeof leave.interval === 'number' ? leave.interval : enter.interval;
        ease = leave.ease || enter.ease;
      }
    }
    startAnimation(dom, {
      duration: duration,
      data: transition,
      delay: delay,
      direction: direction,
      interval: interval,
      reverse: reverse,
      ease: ease,
      onComplete: callBack
    });
  }

  oneAddEnd() {
    this.wapToEnter = [];
    this.wapToLeave = [];
    this.keysToEnter = [];
    this.keysToLeave = [];
    //this.childrenWap = this.props.children;
    this.setState({
      children: this.props.children
    });
  }

  callEnterAnimationOne(dom) {

    //var enter = state.enter || {}, leave = state.leave || null;
    var transition = this.dataArr;
    var callBack = ()=> {
      this.oneAddEnd();
    };


    //这里data肯定有值，所以不需要继承；
    startAnimation(dom, {
      data: transition,
      onComplete: callBack
    });
  }

  childMap(child) {
    let _arr = [];
    child = toArrayChildren(toArrayChildren(child).reduce(function (a, b) {
      if (!(a instanceof Array)) {
        return [a].concat(b);
      } else {
        return a.concat(b);
      }
    }));
    React.Children.map(child, (item)=> {
      if (typeof item.type === 'string' || (item.props && item.props['enter-comp'])) {
        item = cloneElement(item, {children: this.childMap(item.props.children)});
      } else if (typeof item.type === 'function' && item.props && typeof item.props.children !== 'string') {
        let _child = item.type.prototype.render();
        _child.props['enter-comp'] = true;
        item = cloneElement(item, {
          'enter-data': _child.props['enter-data'] || item.props['enter-data'],
          children: this.childMap(_child.props.children)
        });
      }
      _arr.push(item);
    });
    if (_arr.length === 1) {
      _arr = _arr[0];
    }
    return _arr;
  }

  returnChildren(children) {
    let child = children;
    if (typeof child.type === 'function') {
      let _child = child.type.prototype.render();
      _child.props['enter-comp'] = true;
      child = this.childMap(_child);
    } else {
      child = this.childMap(child);
    }
    return child;
  }

  setChildrenData(_children, dom) {

    //判断route子级
    if (!_children) {
      return false;
    } else if (typeof _children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + _children + ').');
    }

    let children = _children instanceof Array ? _children : _children.props.children;
    if (typeof children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + children + ').');
    }
    this.dataArr = [];


    this.componentChildrenDataEnter(toArrayChildren(children), this.dataArr);


    if (this.wapToEnter.length || this.wapToLeave.length) {
      if (!this.dataArr.cBool) {
        //这里是判断子节点没有enter-data时；
        this.dataArr.cBool = true;//开启cBool;
        this.keysToEnter = this.wapMapKeysNoEnterData(this.wapToEnter);
        this.keysToLeave = this.wapMapKeysNoEnterData(this.wapToLeave);
        this.dataArr.map((m)=> {
          if (this.keysToEnter.indexOf(m.key) >= 0 || this.keysToLeave.indexOf(m.key) >= 0) {
            m.enter = leaveInherit({}, {}, this.state.enter);
            m.leave = this.state.leave ? leaveInherit({}, {}, this.state.leave) : m.enter;
            let qId = Math.round(Math.random() * 9999) + 10000;
            m.enter.queueId = qId;
            m.leave.queueId = qId;
            if (this.keysToEnter.indexOf(m.key) >= 0) {
              m.direction = 'enter';
            } else if (this.keysToLeave.indexOf(m.key) >= 0) {
              m.direction = 'leave';
            }
          }
        });
      }
      this.callEnterAnimationOne(dom);
    } else {
      this.callEnterAnimation(dom, _children);
    }
    //console.log(this.dataArr);
  }

  wapMapKeys(wap) {
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

  wapMapKeysNoEnterData(wap) {
    let result = [];
    React.Children.map(wap, (m)=> {
      if (m.props && m.key) {
        result.push(m.key);
      }
    });
    return result;
  }


  filter(array, target) {
    let result;
    React.Children.forEach(array, (item) => {
      if (item.props && item.props.children && typeof item.props.children === 'object') {
        //如果相等，判断子级
        //item.props.children = this.MergeWap(target.props ? target.props.children : null, item.props.children);
        item = cloneElement(item, {children: this.MergeWap(target.props ? target.props.children : null, item.props.children)});
      }

      if (typeof item !== 'object') {
        //只改里面的文字不执行动画；
        result = true;
      } else if (item.props && target.props && item.key === target.key) {

        result = item;
      }
    });
    return result;
  }

  MergeWap(currentArray, newArray) {
    let result = [];
    if (!currentArray || !currentArray.length) {
      result = newArray;
      return result;
    } else {
      //new里的与current里的对比，
      React.Children.forEach(currentArray, (item) => {
        let existItem = this.filter(newArray, item);//返回new里是否有current里的；
        if (!existItem && typeof item === 'object' && item.key) {
          //如果没有，放入新增数组；
          this.wapToLeave = result;
        }
      });
      React.Children.forEach(newArray, (item)=> {
        let existItem = this.filter(currentArray, item);
        if (!existItem && typeof item === 'object' && item.key) {
          this.wapToEnter.push(item);
        }
      });
      let _arr = toArrayChildren(newArray).concat(result);
      return _arr;
    }

  }

  componentDidMount() {
    this.childrenWap = this.returnChildren(this.childrenWap);
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    var dom = findDOMNode(this);
    //
    var wap = this.childrenWap;
    if (this.props.direction) {
      this.props.onStart();
      this.direction = this.props.direction;
      this.setChildrenData(wap, dom);

    } else if (this.wapToEnter.length || this.wapToLeave.length) {
      this.direction = this.props.direction;
      this.keysToEnter = this.wapMapKeys(this.wapToEnter);
      this.keysToLeave = this.wapMapKeys(this.wapToLeave);
      this.setChildrenData(wap, dom);

    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.direction) {

      let dom = findDOMNode(this);
      this.childrenWap = this.returnChildren(this.props.children);
      if (nextProps.position) {
        dom.style.position = 'absolute';
      } else {
        dom.style.position = '';
      }
      this.direction = nextProps.direction;
      this.defaultType = !nextProps.enter && !nextProps.leave ? 'right' : this.direction === 'leave' && nextProps.leave ? nextProps.leave.type || nextProps.leave.style || nextProps.enter.type || nextProps.enter.style || 'right' : nextProps.enter.type || nextProps.enter.style || 'right';
      //this.setChildrenData(wap, dom);
      this.setState({
        enter: nextProps.enter || {},
        leave: nextProps.leave || {}
      });

    } else {
      this.wapToEnter = [];
      this.wapToLeave = [];

      let newChildren = this.returnChildren(nextProps.children);
      //console.log(this.props.children,nextProps.children)
      let currentChild = this.childrenWap;//=this.returnChildren(this.props.children);
      let newChildrenWap = toArrayChildren(newChildren.props.children);
      let currentChildWap = toArrayChildren(currentChild.props.children);


      //console.log(newChildrenWap.length, currentChild.props.children.length);
      //合并两wap和计算进出场的wap；
      let allChildrenArr = this.MergeWap(currentChildWap, newChildrenWap);
      //console.log(this.wapToEnter.length, this.wapToLeave.length)
      this.childrenWap = cloneElement(this.childrenWap, {children: allChildrenArr});

    }

  }

  render() {

    return cloneElement(this.props.children);
  }
}
export default EnterAnimationChild;
