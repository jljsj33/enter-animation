'use strict';
import React, {Component} from 'react';
var startAnimation = require('./StartAnimation');
const {findDOMNode, cloneElement, createElement} = React;

class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);
    this.dataArr = [];
    this.state = {
      transition: props['enter-transition'] || 'right',
      delay: props['enter-delay'] || 0,
      interval: props['enter-interval'] || 0.1
    };
  }

  /*遍历children里的dataEnter*/
  componentChildrenDataEnter(children, arr) {
    var self = this, props, _enter_data;
    if (children.length) {
      children.map(function (re, i) {
        props = re.props;
        _enter_data = props['enter-data'];
        if (_enter_data) {
          arr.push(_enter_data);
          if (_enter_data.style || _enter_data.type) {
            self.dataArr.cBool = true;
          }
          if (typeof props.children === 'object') {
            arr[i].children = [];
            self.componentChildrenDataEnter(props.children, arr[i].children);
          }
        } else {
          arr[i] = {};
          if (typeof props.children === 'object') {
            arr[i].children = [];
            self.componentChildrenDataEnter(props.children, arr[i].children);
          }
        }
      });
    } else {
      props = children.props;
      _enter_data = props['enter-data'];
      if (_enter_data) {
        if (_enter_data.style || _enter_data.type) {
          self.dataArr.cBool = true;
        }
        arr.push(_enter_data);
      } else {
        arr[0] = {};
        if (typeof props.children === 'object') {
          arr[0].children = [];
          self.componentChildrenDataEnter(props.children, arr[0].children);
        }
      }
    }

  }

  componentDidMount() {
    var dom = findDOMNode(this),
      state = this.state,
      children = this.props.children;
    this.componentChildrenDataEnter(children, this.dataArr);
    this.state.transition = this.dataArr;
    if (!this.dataArr.cBool) {
      this.state.transition = this.props['enter-transition'];
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


