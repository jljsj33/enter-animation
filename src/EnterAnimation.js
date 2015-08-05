'use strict';
import React, {Component} from 'react';
var startAnimation = require('./StartAnimation');
const {findDOMNode, cloneElement, createElement} = React;

class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);
    this.setData(props);
  }

  setData(props) {
    this.dataArr = [];
    this.state = {
      type: props.type,
      style: props.eStyle,
      duration: props.duration,
      delay: props.delay,
      direction: props.direction,
      ease: props.ease,
      interval: props.interval,
      upend: props.upend
    };
    //如果子级为一个div时，用的是clone,所以要把样式合进子级div，

    var child = props.children;

    if (!child.length) {
      for (var s in props) {
        if (s !== 'children') {
          if (typeof child.props[s] === 'object') {
            child.props[s] = this.extend({}, [props[s], child.props[s]]);
          } else if (typeof child.props[s] === 'string') {
            child.props[s] = props[s] + ' ' + child.props[s];
          } else {
            child.props[s] = props[s];
          }
        }
      }
    }
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
    } else {
      props = children.props;
      _enter_data = props['enter-data'];
      self.callChildrenDataEnter(props, _enter_data, arr, 0);
    }

  }

  callEnterAnimation() {
    if (typeof this.props.children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + this.props.children + ').');
    }
    var dom = findDOMNode(this),
      state = this.state,
      children = this.props.children instanceof Array ? this.props.children : this.props.children.props.children;
    if (typeof children === 'string') {
      return console.warn('Warning: Not perform EnterAnimation, Elements is String(' + children + ').');
    }
    this.componentChildrenDataEnter(children, this.dataArr);
    state.transition = this.dataArr;
    if (!this.dataArr.cBool) {
      state.transition = this.props.type || this.props.eStyle || 'right';
    }
    EnterAnimation.to(dom, {
      duration: state.duration,
      data: state.transition,
      delay: state.delay,
      direction: state.direction,
      interval: state.interval,
      upend: state.upend,
      ease: state.ease
    });
  }

  componentDidMount() {
    this.callEnterAnimation();
  }


  componentWillReceiveProps(nextProps) {
    this.setData(nextProps);
    this.callEnterAnimation();
    return false;
  }

  render() {
    var props = this.props;
    var len = props.children.length;
    var child = props.children;
    var Element = null;
    if (len) {
      Element = createElement(
        'div',
        props,
        child
      );
    } else {
      Element = cloneElement(
        child
      );
    }
    return Element;
  }
}

EnterAnimation.to = startAnimation;
/*
 EnterAnimation.defaultProps = {
 transition: 'x-right',
 delay: 0
 };*/
export default EnterAnimation;


