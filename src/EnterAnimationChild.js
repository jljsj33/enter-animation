import {Component, findDOMNode} from 'react';
import {extend} from './EnterUtils';
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
    var self = this;
    let tagData = null;
    if (props) {
      arr[i] = {};
      if (props['enter-data'] || props['data-enter']) {
        let data = props['enter-data'] || {};
        if (typeof data === 'boolean') {
          data = {};
        }
        tagData = props['data-enter'];
        if (typeof tagData === 'string') {
          tagData = JSON.parse(tagData);
        }
        tagData = tagData || {};
        let _data = extend({}, [data, tagData]);

        if (!_data.type && !_data.style) {
          _data.type = this.defaultType;
        }
        arr[i] = _data;
        if (_data.style || _data.type) {
          self.dataArr.cBool = true;
        }
      }

      if (typeof props.children === 'object') {
        arr[i].children = [];
        self.componentChildrenDataEnter(props.children, mc.children, arr[i].children);
      }

    } else {
      tagData = mc.getAttribute('data-enter');
      if (typeof tagData === 'string') {
        tagData = JSON.parse(tagData);
      }

      arr[i] = {};
      if (tagData) {
        if (typeof tagData === 'boolean') {
          tagData = {};
        }
        if (!tagData.type && !tagData.style) {
          tagData.type = this.defaultType;
        }
        arr[i] = tagData;
        if (tagData.style || tagData.type) {
          self.dataArr.cBool = true;
        }
      }
      if (mc.children.length > 0) {
        arr[i].children = [];
        self.componentChildrenDataEnter(null, mc.children, arr[i].children);
      }
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
    } else {
      //router时；
      for (let i = 0; i < dom.length; i++) {
        mc = dom[i];
        self.callChildrenDataEnter(null, mc, arr, i);
      }
    }
  }


  callEnterAnimation(dom, wap) {

    var state = this.state;

    var enter = state.enter || {}, leave = state.leave || null;
    var transition = this.dataArr;
    let direction = this.direction;
    if (!this.dataArr.cBool) {
      transition = enter.type || enter.eStyle || 'right';
      if (direction === 'leave' && leave) {
        transition = leave.type || leave.eStyle || transition;
      }
    }
    var callFunc = ()=> {
      enter.callback.call(this, {ReactElement: wap, target: dom, direction: direction});
    };
    var callBack = typeof enter.callback === 'function' ? callFunc : null,
      upend = enter.upend,
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
      if (leave) {
        upend = leave.upend || enter.upend;
        duration = leave.duration || enter.duration;
        delay = leave.delay || enter.delay;
        interval = leave.interval || enter.interval;
        ease = leave.ease || enter.ease;
      }
    }
    startAnimation(dom, {
      duration: duration,
      data: transition,
      delay: delay,
      direction: direction,
      interval: interval,
      upend: upend,
      ease: ease,
      onComplete: callBack,
      kill: true
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


  }

  componentDidMount() {
    //第一次进入；默认给enter；
    this.direction = 'enter';
    this.componentWillReceiveProps(this.props);
  }

  componentDidUpdate() {
    var dom = findDOMNode(this);
    var wap = this.props.children;
    if (this.props.direction !== 'static') {
      this.props.onStart();
      this.direction = this.props.direction;
      this.callEnterAnimation(dom, wap);
    }
  }

  componentWillReceiveProps(nextProps) {
    //要对新插入元素做动画;
    //let wap = nextProps.children;
    //let dom = findDOMNode(this);
    if (nextProps.direction !== 'static') {
      this.setDomKey();
      this.setState({
        enter: nextProps.enter,
        leave: nextProps.leave
      });
    }
    this.direction = nextProps.direction;
  }

  render() {
    //console.log(this.props.children)
    return this.state.children;
  }
}
export default EnterAnimationChild;
