'use strict';
import React, {Component} from 'react';
let startAnimation = require('./StartAnimation');
const {findDOMNode, createElement} = React;


class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);
    this.state = {};
    this.direction = null;
  }

  setData(props, wap) {
    this.dataArr = [];

    this.setState({
      type: props.type,
      style: props.eStyle,
      duration: props.duration,
      delay: props.delay,
      direction: props.direction,
      ease: props.ease,
      interval: props.interval,
      upend: props.upend,
      onComplete: props.callback,
      leave: props.leave,
      close: props.close,
      childWapArr: wap
    });

  }

  extend(des, src) {
    var i, len;
    if (src instanceof Array) {
      for (i = 0, len = src.length; i < len; i++) {
        this.extend(des, src[i]);
      }
      return des;
    }
    for (i in src) {
      des[i] = src[i];
    }
    return des;
  }

  /*遍历children里的dataEnter*/
  callChildrenDataEnter(props, data, arr, i) {
    var self = this;
    if (data) {
      if (!data.type && !data.style) {
        if (typeof data === 'boolean') {
          data = {};
        }
        data.type = self.state.type || 'right';
      }

      arr.push(data);
      if (data.style || data.type) {
        self.dataArr.cBool = true;
      }
    } else {
      arr[i] = {};
    }
    if (props && typeof props.children === 'object') {
      arr[i].children = [];
      self.componentChildrenDataEnter(props.children, arr[i].children);
    }
  }

  componentChildrenDataEnter(children, arr) {
    var self = this, props, _enter_data;
    if (typeof children === 'object' && children.length) {
      children.map(function (re, i) {
        props = re.props;
        if (props) {
          _enter_data = props['enter-data'];
          self.callChildrenDataEnter(props, _enter_data, arr, i);
        } else {
          arr[i] = {};
        }
      });
    } else if (children) {
      props = children.props;
      _enter_data = props['enter-data'];
      self.callChildrenDataEnter(props, _enter_data, arr, 0);
    }
  }

  callEnterAnimation(dom, direction, wap) {
    if (typeof this.props.children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + this.props.children + ').');
    }
    var state = this.state,
      children = this.props.children instanceof Array ? this.props.children : this.props.children.props.children;
    if (typeof children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + children + ').');
    }
    this.componentChildrenDataEnter(children, this.dataArr);
    var transition = this.dataArr;
    if (!this.dataArr.cBool) {
      transition = state.type || state.eStyle || 'right';
      if (direction === 'leave' && state.leave) {
        transition = state.leave.type || state.leave.eStyle || transition;
      }
    }
    var callFunc = ()=> {
      state.onComplete.call(this, {ReactElement: wap, target: dom, direction: direction});
    };
    var callBack = typeof state.onComplete === 'function' ? callFunc : null,
      upend = state.upend,
      duration = state.duration,
      delay = state.delay,
      interval = state.interval,
      ease = state.ease;
    if (direction === 'leave') {
      callBack = ()=> {
        //动画后;
        if (!this.direction) {
          this.prevChildDom = null;
          this.prevChildWap = null;
          this.setState({
            childWapArr: [this.nextChildWap]//state.childWapArr.splice(0, 1)
          });
        }


        if (state.leave && typeof state.leave.callback === 'function') {
          state.leave.callback.call(this, {ReactElement: wap, target: dom, direction: direction});
        } else if (typeof state.onComplete === 'function') {
          state.onComplete.call(this, {ReactElement: wap, target: dom, direction: direction});
        }
      };
      if (state.leave) {
        upend = state.leave.upend || state.upend;
        duration = state.leave.duration || state.duration;
        delay = state.leave.delay || state.delay;
        interval = state.leave.interval || state.interval;
        ease = state.leave.ease || state.ease;
      }
    }


    EnterAnimation.to(dom, {
      duration: duration,
      data: transition,
      delay: delay,
      direction: direction,
      interval: interval,
      upend: upend,
      ease: ease,
      onComplete: callBack
    });
  }

  componentWillMount() {
    this.nextChildDom = null;
    this.prevChildDom = null;
    this.nextChildWap = this.props.children;
    this.prevChildWap = null;
    this.setData(this.props, this.nextChildWap);
  }

  componentDidMount() {
    var domBox = findDOMNode(this);
    this.nextChildDom = domBox.children[0];
    domBox.style.height = this.nextChildDom.offsetHeight + 'px';
    //刚进入时执行进场动画
    this.callEnterAnimation(this.nextChildDom, 'enter');

  }

  componentDidUpdate() {

    if (!this.props.close) {
      //获取当然的dom
      var dom = findDOMNode(this),
        len = dom.children.length;

      if (len > 1) {
        this.nextChildDom = dom.children[1];
        this.prevChildDom = dom.children[0];
        //给dom高；
        dom.style.height = this.nextChildDom.offsetHeight + 'px';

        //给position:absolute;
        this.prevChildDom.style.position = 'absolute';
        //this.nextChildDom.style.proition = 'absolute';
      } else {
        this.nextChildDom = dom.children[0];
      }

      //处理遍历数理;
      if (this.prevChildDom) {
        this.callEnterAnimation(this.prevChildDom, 'leave', this.prevChildWap);
      }

      if (this.nextChildDom && (len > 1 || this.direction)) {
        this.callEnterAnimation(this.nextChildDom, this.direction || 'enter', this.nextChildWap);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    //if (!nextProps.children.key) {
    //  throw new Error('key not null');
    //}
    var childWapArr = this.nextChildWap;
    if (!nextProps.close) {
      if (nextProps.children.key && this.nextChildWap.key) {
        if (this.nextChildWap.key !== nextProps.children.key) {
          //取出刚才已经进场的child变为要出场；
          this.prevChildWap = this.nextChildWap;

          //获取当前要进场的child;
          this.nextChildWap = nextProps.children;

          //插入两个child，进出场切换
          childWapArr = [this.prevChildWap, this.nextChildWap];
        }
        this.direction = null;
      } else {
        //没有key，单个dom处理：
        this.nextChildWap = nextProps.children;
        childWapArr = this.nextChildWap;
        this.direction = this.direction === 'leave' ? 'enter' : 'leave';
      }
    }


    this.setData(nextProps, childWapArr);
    return false;
  }

  render() {
    var props = this.props;
    var childArr = this.state.childWapArr;
    return createElement(
      props.component,
      props,
      childArr
    );
  }
}

EnterAnimation.to = startAnimation;
EnterAnimation.propTypes = {
  component: React.PropTypes.string,
  style: React.PropTypes.object
};
EnterAnimation.defaultProps = {
  component: 'div'
};

export default EnterAnimation;


