'use strict';
import React, {Component} from 'react';
var startAnimation = require('./StartAnimation');
const {findDOMNode, cloneElement, createElement} = React;

class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);
    this.dataArr = [];
    this.state = {
      transition: props['enter-transition'] || 'x-right',
      delay: props['enter-delay'] || 0
    };
  }

  /*遍历children里的dataEnter*/
  componentChildrenDataEnter(children, arr) {
    var self = this, props;
    if (children.length) {
      children.map(function (re, i) {
        props = re.props;
        if (props['enter-data']) {
          arr.push(props['enter-data']);
        } else {
          arr[i] = [];
          if (typeof props.children === 'object') {
            self.componentChildrenDataEnter(props.children, arr[i]);
          } else {
            arr[i] = {style: this.props['enter-transition'] || 'x-right'};
          }
        }
      });
    } else {
      props = children.props;
      if (props['enter-data']) {
        arr.push(props['enter-data']);
      } else {
        arr[0] = [];
        if (typeof props.children === 'object') {
          self.componentChildrenDataEnter(props.children, arr[0]);
        } else {
          arr[0] = {style: this.props['enter-transition'] || 'x-right'};
        }
      }
    }

  }

  componentDidMount() {
    var dom = findDOMNode(this),
      state = this.state,
      children = this.props.children;
    if (!this.props['enter-transition']) {
      this.componentChildrenDataEnter(children, this.dataArr);
      this.state.transition = this.dataArr;
    }
    EnterAnimation.to(dom, state.transition, state.delay);
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


