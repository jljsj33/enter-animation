import React, {Component, findDOMNode, cloneElement} from 'react';
import {isPropsPushData, leaveInherit, toArrayChildren, MergeWap} from './EnterUtils';
let startAnimation = require('./StartAnimation');
//const defaultKey = 'enter_' + Date.now();

class EnterAnimationChild extends Component {
  constructor(props) {
    super(...arguments);
    this.childrenWap = this.returnChildren(this.props.children);
    this.state = {
      enter: props.enter || {},
      leave: props.leave || props.enter || {},
      children: this.childrenWap
    };
    this.childrenKey = [];
    this.enterQueueId = Math.round(Math.random() * 9999) + 10000;
    this.leaveQueueId = Math.round(Math.random() * 9999) + 10000;
    this.keysToEnter = [];
    this.keysToLeave = [];
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
      if (!props.EnterChild) {
        if ((props['enter-data'] || props['leave-data']) && !arr[i].key) {
          console.warn('Warning: EnterAnimation in the enter-data or leave-data need have key,data:' + JSON.stringify(props['enter-data'] || props['leave-data']));
        }
        enter = isPropsPushData(props['enter-data'], self.defaultType);
        leave = isPropsPushData(props['leave-data'], enter.type || enter.style || self.state.leave.type || self.state.leave.style || self.defaultType);
        if (!self.keysToLeave.length && !self.keysToEnter.length) {
          arr[i].enter = leaveInherit(enter, self.state.enter, {});
          //出场如果没有效果，继承进场效果；
          arr[i].leave = leaveInherit(leave, self.state.leave, arr[i].enter);
        } else {
          let key = re.key;
          if (this.keysToEnter.indexOf(key) >= 0) {
            arr[i].direction = 'enter';
          } else if (this.keysToLeave.indexOf(key) >= 0) {
            arr[i].direction = 'leave';
          }
          if (this.keysToEnter.indexOf(key) >= 0 || this.keysToLeave.indexOf(key) >= 0) {
            arr[i].enter = leaveInherit(enter, self.state.enter, {});
            arr[i].leave = leaveInherit(leave, self.state.leave, arr[i].enter);
            if (arr[i].enter.type || arr[i].enter.style) {
              arr[i].enter.queueId = this.leaveQueueId;//出场进场分支，跟默认的分开，因为这是新添加的。
            }
            if (arr[i].leave.type || arr[i].leave.style) {
              arr[i].leave.queueId = this.leaveQueueId;
            }
          }
        }

        if (props.children && typeof props.children === 'object') {
          arr[i].children = [];
          self.componentChildrenDataEnter(toArrayChildren(props.children), arr[i].children);
        }
      } else {
        arr[i].EnterChild = true;
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
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.childrenWap = this.returnChildren(this.props.children);
    this.setState({
      children: this.childrenWap
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
    if (!child) {
      return null;
    }
    child = toArrayChildren(toArrayChildren(child).reduce(function (a, b) {
      if (!(a instanceof Array)) {
        return [a].concat(b);
      } else {
        return a.concat(b);
      }
    }));
    React.Children.map(child, (item)=> {

      if (!item) {
        return null;
      }
      if ((typeof item.type === 'string' || (item.props && item.props['enter-comp'])) && item.props.children) {
        item = cloneElement(item, {children: this.childMap(item.props.children)});
      } else if (typeof item.type === 'function' && item.props && typeof item.props.children !== 'string') {
        //let _c = <item.type {...item.props} enter-comp={true}/>;

        //item.type.prototype.constructor(item.props)
        //item.type.prototype.props = item.props;
        //item.type.prototype.state = item.type.prototype.getInitialState ? item.type.prototype.getInitialState() : null;
        //拆解指定；
        if (this.props.renderTag) {
          this.props.renderTag.map((tag)=> {
            if (tag === item.type.name || tag === item.type.displayName) {
              //item.type.prototype.props = item.props;
              //item.type.prototype.state = item.type.prototype.getInitialState ? item.type.prototype.getInitialState() : null;
              let _child = item.type.prototype.render();
              _child.props['enter-comp'] = true;
              item = cloneElement(item, {
                'enter-data': _child.props['enter-data'] || item.props['enter-data'],
                children: this.childMap(_child.props.children)
              });
            }
          });
        }

        if (item.type.name === 'EnterAnimation') {
          item = cloneElement(item, {EnterChild: true});
          //console.warn('Warning:Child level can not have EnterAnimation;')
        }
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
    //if (typeof child.type === 'function') {
    //
    //  child.type.prototype.props = child.props;
    //  child.type.prototype.state = child.type.prototype.getInitialState ? item.type.prototype.getInitialState() : null;
    //  let _child = child.type.prototype.render();
    //  _child.props['enter-comp'] = true;
    //  child = this.childMap(_child);
    //} else {
    //  child = this.childMap(child);
    //}
    child = this.childMap(child);
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
    this.enterQueueId = Math.round(Math.random() * 9999) + 10000;
    this.leaveQueueId = Math.round(Math.random() * 9999) + 10000;
    this.componentChildrenDataEnter(toArrayChildren(children), this.dataArr);


    if (this.keysToEnter.length || this.keysToEnter.length) {
      if (!this.dataArr.cBool) {
        //这里是判断子节点没有enter-data时；
        this.dataArr.cBool = true;//开启cBool;
        this.dataArr.map((m)=> {
          if (this.keysToEnter.indexOf(m.key) >= 0 || this.keysToLeave.indexOf(m.key) >= 0) {
            m.enter = leaveInherit({}, {}, this.state.enter);
            m.leave = this.state.leave ? leaveInherit({}, {}, this.state.leave) : m.enter;

            if (this.keysToEnter.indexOf(m.key) >= 0) {
              m.direction = 'enter';
              m.enter.queueId = this.enterQueueId;
              m.leave.queueId = this.enterQueueId;
            } else if (this.keysToLeave.indexOf(m.key) >= 0) {
              m.direction = 'leave';
              m.enter.queueId = this.leaveQueueId;
              m.leave.queueId = this.leaveQueueId;
            }
          }
        });
      }
      this.callEnterAnimationOne(dom);
    } else {
      this.callEnterAnimation(dom, _children);
    }
    //console.log(this.dataArr, this.direction)
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

  childChangeNewArrayMap(newArray, _item) {
    let child;
    for (let i = 0; i < newArray.length; i++) {
      let item = newArray[i];
      if (item.key === _item.key) {
        newArray[i] = cloneElement(item, {children: MergeWap(_item.props.children, item.props.children, this.keysToEnter, this.keysToLeave)});
        break;
      } else if (item.props && typeof item.props.children === 'object') {
        child = this.childChangeNewArrayMap(toArrayChildren(item.props.children), _item);
      }
    }
    return child;
  }

  childChangeMap(currentArray, newArray) {
    React.Children.forEach(currentArray, (item)=> {
      if (item.key) {
        this.childChangeNewArrayMap(newArray, item);
      } else if (item.props && typeof item.props.children === 'object') {
        this.childChangeMap(item.props.children, newArray);
      }
    });
  }

  componentDidMount() {
    this.childrenWap = this.returnChildren(this.props.children);
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    var dom = findDOMNode(this);
    //
    var wap = this.childrenWap;
    if (this.props.direction === 'enter' || this.props.direction === 'leave') {
      this.props.onStart();
      this.direction = this.props.direction;
      this.setChildrenData(wap, dom);

    } else if (this.keysToEnter.length || this.keysToLeave.length) {
      this.direction = this.props.direction;
      this.setChildrenData(wap, dom);

    }
  }


  componentWillReceiveProps(nextProps) {

    if (nextProps.direction === 'enter' || nextProps.direction === 'leave') {
      let dom = findDOMNode(this);
      //this.childrenWap = this.state.children;
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
      this.keysToLeave = [];
      this.keysToEnter = [];

      let newChildren = this.returnChildren(nextProps.children);
      let currentChild = this.childrenWap;//=this.returnChildren(this.props.children);
      let newChildrenWap = toArrayChildren(newChildren.props.children);
      let currentChildWap = toArrayChildren(currentChild.props.children);

      //在这里遍历子级的enter-data和key；
      this.childChangeMap(currentChildWap, newChildrenWap);


      //合并两wap和计算进出场的wap；
      let allChildrenArr = MergeWap(currentChildWap, newChildrenWap, this.keysToEnter, this.keysToLeave);
      //allChildrenArr = this.ArrrSort(allChildrenArr);


      this.childrenWap = cloneElement(this.childrenWap, {children: allChildrenArr});
      this.setState({
        enter: nextProps.enter || {},
        leave: nextProps.leave || nextProps.enter || {},
        children: this.childrenWap
      });
    }

  }

  render() {
    return this.state.children;
  }
}
export default EnterAnimationChild;
