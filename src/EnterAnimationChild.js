import {Component, findDOMNode} from 'react';
import {isPropsPushData, noPropsPushData, leaveInherit} from './EnterUtils';
let startAnimation = require('./StartAnimation');
//const defaultKey = 'enter_' + Date.now();


class EnterAnimationChild extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {
      enter: props.enter,
      leave: props.leave,
      children: this.props.children
    };
    this.dataArr = [];
    this.key = [];
    this.direction = '';
    this.defaultType = !this.state.enter && !this.state.leave ? 'right' : this.direction === 'leave' ? this.state.leave.type || this.state.leave.style || this.state.enter.type || this.state.enter.style || 'right' : this.state.enter.type || this.state.enter.style || 'right';

  }

  /*遍历children里的dataEnter*/
  callChildrenDataEnter(props, mc, arr, i) {
    var self = this, enter, leave;

    arr[i] = {enter: {}, leave: {}};

    if (props) {
      enter = isPropsPushData(props['enter-data'], props['data-enter'], self.defaultType);
      leave = isPropsPushData(props['leave-data'], props['data-leave'], enter.type || enter.style || self.defaultType);

      arr[i].enter = enter;
      //出场如果没有效果，继承进场效果；
      arr[i].leave = leaveInherit(leave, enter);

      if (typeof props.children === 'object') {
        arr[i].children = [];
        self.componentChildrenDataEnter(props.children, mc.children, arr[i].children);
      }

    } else {
      let _enter = mc.getAttribute('data-enter'),
        _leave = mc.getAttribute('data-leave');
      enter = noPropsPushData(_enter, self.defaultType);
      leave = noPropsPushData(_leave, enter.type || enter.style || self.defaultType);

      arr[i].enter = enter;
      arr[i].leave = leaveInherit(leave, enter);
      if (mc.children.length > 0) {
        arr[i].children = [];
        self.componentChildrenDataEnter(null, mc.children, arr[i].children);
      }
    }
    if (arr[i].enter.type || arr[i].enter.style || arr[i].leave.type || arr[i].leave.style) {
      self.dataArr.cBool = true;
    }
  }

  componentChildrenDataEnter(children, dom, arr) {
    let self = this, props, mc;
    if (children && typeof children === 'object' && children.length) {
      //有react时
      //要处理children里的enter-data,dom里的data-enter;

      children.map(function (re, i) {
        props = re.props;
        mc = dom[i];
        self.callChildrenDataEnter(props, mc, arr, i);
      });
    } else if (children) {
      props = children ? children.props : null;
      self.callChildrenDataEnter(props, dom[0], arr, 0);
    } else if (dom) {
      //router时；
      for (let i = 0; i < dom.length || 0; i++) {
        mc = dom[i];
        self.callChildrenDataEnter(null, mc, arr, i);
      }
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

  setDomKey() {
    //取出dom下的要做动画的节点，如果没key，自动加上

    let dom = findDOMNode(this);
    if (typeof this.props.children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + this.props.children + ').');
    }
    if (typeof dom.children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + dom.children + ').');
    }
    let children = this.props.children instanceof Array ? this.props.children : this.props.children.props.children;
    let domChildren = dom.children.length >= 1 ? dom.children : dom.children.children;
    if (typeof children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + children + ').');
    }
    if (typeof domChildren === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + domChildren + ').');
    }
    //dom的data-enter或reactElement的props的enter-data;
    this.componentChildrenDataEnter(children, domChildren, this.dataArr);
    //console.log(this.dataArr)
  }

  componentDidMount() {
    //第一次进入；默认给enter；
    this.direction = 'enter';
    this.componentWillReceiveProps(this.props);
  }

  componentDidUpdate() {
    var dom = findDOMNode(this);
    var wap = this.props.children;
    if (this.props.direction) {
      this.props.onStart();
      this.direction = this.props.direction;
      this.callEnterAnimation(dom, wap);
    }
  }

  componentWillReceiveProps(nextProps) {
    //要对新插入元素做动画;
    if (nextProps.direction) {

      let dom = findDOMNode(this);
      if (nextProps.position) {
        dom.style.position = 'absolute';
      } else {
        dom.style.position = '';
      }
      this.direction = nextProps.direction;
      this.defaultType = !nextProps.enter && !nextProps.leave ? 'right' : this.direction === 'leave' && nextProps.leave ? nextProps.leave.type || nextProps.leave.style || nextProps.enter.type || nextProps.enter.style || 'right' : nextProps.enter.type || nextProps.enter.style || 'right';
      this.setDomKey();
      this.setState({
        enter: nextProps.enter,
        leave: nextProps.leave
      });

    }

  }

  render() {

    return this.props.children;
  }
}
export default EnterAnimationChild;
