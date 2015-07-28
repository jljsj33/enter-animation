'use strict';
import React, {Component} from 'react';
var startAnimation = require('./StartAnimation');
const {findDOMNode, cloneElement, createElement} = React;

class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);
    this.dataArr = [];
    this.state = {
      type: props.type || 'right',
      style: props.style || 'right',
      delay: props.delay || 0,
      interval: props.interval || 0.1
    };
  }

  /*遍历children里的dataEnter*/
  callChildrenDataEnter(props, data, arr, i) {
    var self = this;
    if (data) {
      if (!data.type && !data.style) {
        data = {};
        data.type = self.state.type;
      }
      arr.push(data);
      if (data.style || data.type) {
        self.dataArr.cBool = true;
      }
    } else {
      arr[i] = {};
    }
    if (typeof props.children === 'object') {
      arr[i].children = [];
      self.componentChildrenDataEnter(props.children, arr[i].children);
    }
  }

  componentChildrenDataEnter(children, arr) {
    var self = this, props, _enter_data;
    if (children.length) {
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

  componentDidMount() {
    var dom = findDOMNode(this),
      state = this.state,
      children = this.props.children instanceof Array ? this.props.children : this.props.children.props.children;
    //console.log("is Array", this.props.children instanceof Array)
    this.componentChildrenDataEnter(children, this.dataArr);
    state.transition = this.dataArr;
    if (!this.dataArr.cBool) {
      state.transition = this.props.type || this.props.style;
    }
    //if (!this.props['enter-transition']) {
    //  this.componentChildrenDataEnter(children, this.dataArr);
    //  this.state.transition = this.dataArr;
    //}
    EnterAnimation.to(dom, state.transition, state.delay, state.interval);
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


