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

    this.keysToEnter = [];
    this.keysToLeave = [];
    this.dataArr = [];
    this.direction = '';
    this.defaultType = !this.state.enter && !this.state.leave ? 'right' : this.direction === 'leave' ? this.state.leave.type || this.state.leave.style || this.state.enter.type || this.state.enter.style || 'right' : this.state.enter.type || this.state.enter.style || 'right';

  }

  /*遍历children里的dataEnter*/
  callChildrenDataEnter(props, arr, i) {
    var self = this, enter, leave;

    arr[i] = {enter: {}, leave: {}};
    if (props) {
      arr[i]['enter-key'] = props['enter-key'];
      enter = isPropsPushData(props['enter-data'], self.defaultType);
      leave = isPropsPushData(props['leave-data'], self.state.leave.type || self.state.leave.style || enter.type || enter.style || self.defaultType);
      if (!this.keysToLeave.length && !this.keysToEnter.length) {
        arr[i].enter = leaveInherit(enter, this.state.enter, {});
        //出场如果没有效果，继承进场效果；
        arr[i].leave = leaveInherit(leave, this.state.leave, enter);
      } else {
        let key = props['enter-key'];
        if (this.keysToEnter.indexOf(key) >= 0) {
          arr[i].direction = 'enter';
          arr[i].enter = leaveInherit(enter, this.state.enter, {});
          let qId = Math.round(Math.random() * 9999) + 10000;
          arr[i].enter.queueId = qId;//出场进场分支，跟默认的分开，因为这是新添加的。
          arr[i].leave = leaveInherit(leave, this.state.leave, enter);
          arr[i].leave.queueId = qId;
        } else if (this.keysToLeave.indexOf(key) >= 0) {
          arr[i].direction = 'leave';
          arr[i].enter = leaveInherit(enter, this.state.enter, {});
          arr[i].leave = leaveInherit(leave, this.state.leave, enter);
          let qId = Math.round(Math.random() * 9999) + 10000;
          arr[i].enter.queueId = qId;
          arr[i].leave.queueId = qId;
        }
      }
      if (typeof props.children === 'object' && props.children && props.children.props) {
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
    //console.log(children.length)
    if (children && typeof children === 'object' && children.length) {
      //有react时
      //要处理children里的enter-data,dom里的data-enter;
      children.map(function (re, i) {
        props = re.props;
        if (props) {
          self.callChildrenDataEnter(props, arr, i);
        }
      });
      /*else if (children && children.length) {
       console.log(dom.length)
       props = children ? children.props : null;
       self.callChildrenDataEnter(props, dom[0], arr, 0);
       }else if (dom) {
       //router时；
       for (let i = 0; i < dom.length || 0; i++) {
       mc = dom[i];

       //router状态key末插；
       self.callChildrenDataEnter(null, mc, arr, i);
       }
       }*/
    } else {
      return console.warn('Warning: Not perform EnterAnimation, Children is null.');
    }
  }


  callEnterAnimation(dom, wap) {

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
      enter.callback.call(this, {ReactElement: wap, target: dom, direction: direction});
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
          leave.callback.call(this, {ReactElement: wap, target: dom, direction: direction});
        } else if (typeof enter.callback === 'function') {
          enter.callback.call(this, {ReactElement: wap, target: dom, direction: direction});
        }
        //出场周期结束；
        this.props.callback.call(this, wap, direction);
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
    this.childrenWap = this.props.children;
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

  setDomKey(_children, dom) {
    //取出dom下的要做动画的节点，如果没key，自动加上
    _children = _children.props.route ? _children.props.route.component.prototype.render().props.children : _children;

    if (typeof _children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + _children + ').');
    }

    let children = _children instanceof Array ? _children : _children.props.children;
    if (typeof children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + children + ').');
    }
    this.dataArr = [];
    //dom的data-enter或reactElement的props的enter-data;
    this.componentChildrenDataEnter(children, this.dataArr);

    //console.log(this.dataArr)
  }

  wapMapKeys(wap) {
    let result = [];
    React.Children.map(wap, (m)=> {
      if (m.props) {
        if (m.props['enter-data'] && m.props['enter-key']) {
          //m.props['enter-key'] = m.key || m.props['enter-key'] || m.props['data-enter-key'];
          result.push(m.props['enter-key']);
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
      if (m.props && m.props['enter-key']) {
        result.push(m.props['enter-key']);
      }
    });
    return result;
  }


  filter(array, target) {
    let result;
    React.Children.forEach(array, (item) => {
      //console.log(React.findDOMNode(item));
      //console.log(item, target)
      if (item.props && item.props.children && typeof item.props.children === 'object') {
        //如果相等，判断子级
        item.props.children = this.MergeWap(target.props ? target.props.children : null, item.props.children);
      }
      if (typeof item !== 'object') {
        //只改里面的文字不执行动画；
        result = true;
      } else if (item.props && target.props && (item.key === target.key || (item.props['enter-key'] === target.props['enter-key']))) {

        result = item;
      }
    });
    return result;
  }

  MergeWap(currentArray, newArray) {
    let result = [];
    if (!currentArray || !currentArray.length) {
      result = newArray;
    } else {
      //new里的与current里的对比，
      React.Children.forEach(currentArray, (item) => {
        let existItem = this.filter(newArray, item);//返回new里是否有current里的；
        if (!existItem && typeof item === 'object' && !!item.props['enter-key']) {
          //如果没有，放入新增数组；
          result.push(item);
          this.wapToLeave = result;
        }
      });

      React.Children.forEach(newArray, (item)=> {
        let existItem = this.filter(currentArray, item);
        if (!existItem && typeof item === 'object' && item.props['enter-key']) {
          this.wapToEnter.push(item);
        }
      });
    }
    let _arr = newArray.concat(result);
    //console.log(_arr)
    return _arr;
  }

  addWapEnterKey(wap) {
    //强行插key
    let _arr = toArrayChildren(wap.props.children).map((m)=> {
      //var defaultKey = 'enter_' + defaultNum;//Math.random();//Date.now();
      if (!m.props) {
        return m;
      }
      if (typeof m.props.children === 'object') {
        this.addWapEnterKey(m);
      }
      if (m.props && !m.props['enter-key']) {
        //m = cloneElement(m, {'enter-key': defaultKey})
        m.props['enter-key'] = m.key || m.props['enter-key'] || m.props['data-enter-key'];
      }
      return cloneElement(m);
    });
    wap.props.children = _arr;

  }

  /*
   addDomEnterKey(dom) {
   for (let i = 0; i < dom.children.length; i++) {
   let m = dom.children[i];
   var defaultKey = 'enter' + Math.random();
   if (m.children.length) {
   this.addDomEnterKey(m);
   }
   if (!m.getAttribute('enter-key')) {
   m.setAttribute('enter-key', defaultKey);
   }
   }
   }*/


  componentWillMount() {
    //console.log(findDOMNode(this.props.parent))
  }

  componentDidMount() {
    //this.componentWillReceiveProps(this.props);

    //this.addDomEnterKey(findDOMNode(this));
    //this.setDomKey(this.childrenWap, findDOMNode(this));
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    var dom = findDOMNode(this);
    var wap = this.props.children;
    //强行插入data-etnerkey;
    //this.addDomEnterKey(dom);
    if (this.props.direction) {
      this.props.onStart();
      this.direction = this.props.direction;
      this.setDomKey(wap, dom);
      this.callEnterAnimation(dom, wap);
    } else if (this.wapToEnter.length || this.wapToLeave.length) {
      this.direction = this.props.direction;
      this.keysToEnter = this.wapMapKeys(this.wapToEnter);
      this.keysToLeave = this.wapMapKeys(this.wapToLeave);


      this.setDomKey(this.childrenWap, dom);
      if (!this.dataArr.cBool) {
        //这里是判断子节点没有enter-data时；
        this.dataArr.cBool = true;//开启cBool;
        this.keysToEnter = this.wapMapKeysNoEnterData(this.wapToEnter);
        this.keysToLeave = this.wapMapKeysNoEnterData(this.wapToLeave);
        //console.log(this.keysToEnter, this.keysToLeave)
        this.dataArr.map((m)=> {
          if (this.keysToEnter.indexOf(m['enter-key']) >= 0 || this.keysToLeave.indexOf(m['enter-key']) >= 0) {
            m.enter = leaveInherit({}, {}, this.state.enter);
            m.leave = this.state.leave ? leaveInherit({}, {}, this.state.leave) : m.enter;
            let qId = Math.round(Math.random() * 9999) + 10000;
            m.enter.queueId = qId;
            m.leave.queueId = qId;
            if (this.keysToEnter.indexOf(m['enter-key']) >= 0) {
              m.direction = 'enter';
            } else if (this.keysToLeave.indexOf(m['enter-key']) >= 0) {
              m.direction = 'leave';
            }
          }
        });
      }
      this.callEnterAnimationOne(dom, this.childrenWap);
    }
  }


  componentWillReceiveProps(nextProps) {
    //要对新插入元素做动画;

    //router的children;


    if (nextProps.direction) {

      let dom = findDOMNode(this);
      if (nextProps.position) {
        dom.style.position = 'absolute';
      } else {
        dom.style.position = '';
      }
      this.direction = nextProps.direction;
      this.defaultType = !nextProps.enter && !nextProps.leave ? 'right' : this.direction === 'leave' && nextProps.leave ? nextProps.leave.type || nextProps.leave.style || nextProps.enter.type || nextProps.enter.style || 'right' : nextProps.enter.type || nextProps.enter.style || 'right';
      //this.setDomKey(wap, dom);
      this.setState({
        enter: nextProps.enter,
        leave: nextProps.leave
      });

    } else {

      this.wapToEnter = [];
      this.wapToLeave = [];
      let newChildren = nextProps.children;
      let currentChild = this.childrenWap;
      let newChildrenWap = toArrayChildren(newChildren.props.children);
      let currentChildWap = toArrayChildren(currentChild.props.children);

      if (nextProps.children.props.route) {
        //console.log(nextProps.children.props.route.component.prototype.render().props.children,nextProps)
        //newChildren = nextProps.children.props.route.component.prototype.render();
        //currentChild = currentChild.props.route.component.prototype.render();
        newChildrenWap = toArrayChildren(newChildren.props.route.component.prototype.render().props.children);
        currentChildWap = toArrayChildren(currentChild.props.route.component.prototype.render().props.children);
      }


      this.addWapEnterKey(newChildren);

      //合并两wap和计算进出场的wap；
      let allChildrenArr = this.MergeWap(currentChildWap, newChildrenWap);
      //console.log(this.wapToLeave, this.wapToEnter);
      this.childrenWap.props.children = allChildrenArr;
    }

  }

  render() {
    this.addWapEnterKey(this.childrenWap);

    return cloneElement(this.childrenWap);
  }
}
export default EnterAnimationChild;
