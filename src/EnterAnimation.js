'use strict';
import React, {Component, findDOMNode, cloneElement, createElement} from 'react';
//import assign from 'object-assign';
import EnterAnimationRouteGroup from './EnterAnimationRouteGroup';
import {toArrayChildren, deleteRepeatKeyArr, isPropsPushData, MergeWap} from './EnterUtils';
let startAnimation = require('./StartAnimation');


class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);

    this.keysToEnter = [];
    this.keysToLeave = [];
    this.index = 0;

    //第一次进入，默认进场；
    var elementArr = toArrayChildren(this.props.children);

    elementArr.map((m)=> {
      if (!m || !m.key) {
        return;
      }
      this.keysToEnter.push(m.key);
    });


    this.childWapArr = deleteRepeatKeyArr(elementArr);
    this.state = {
      childWapArr: this.childWapArr,
      keysToEnrer: this.props.keysToEnter,
      keysToLeave: this.props.keysToLeave,
      enter: this.props.enter || {},
      leave: this.props.leave || this.props.enter || {}
    };
    this.defaultType = !this.state.enter && !this.state.leave ? 'right' : this.direction === 'leave' ? this.state.leave.type || this.state.leave.style || this.state.enter.type || this.state.enter.style || 'right' : this.state.enter.type || this.state.enter.style || 'right';

  }

  setData(props, wap) {
    this.setState({
      enter: props.enter || {},
      leave: props.leave || props.enter || {},
      childWapArr: wap
    });
  }

  setStartAnimation() {
    let dataArr = [], dom = findDOMNode(this);

    let delay = this.props.delay;
    let reverse = this.props.reverse;
    let interval = this.props.interval;

    React.Children.map(this.state.childWapArr, (item, i)=> {
      let _data = {enter: {}, leave: {}};
      let index = item.props.index;
      if (this.keysToEnter.indexOf(item.key) >= 0 || this.keysToLeave.indexOf(item.key) >= 0) {
        _data.enter = isPropsPushData(this.state.enter, this.defaultType);
        _data.leave = isPropsPushData(this.state.leave, this.state.enter.type || this.state.enter.style || this.defaultType);
      }
      if (this.keysToEnter.indexOf(item.key) >= 0) {
        _data.direction = 'enter';
        _data.delay = (index - i) / 2;
        //console.log(_data.delay, index, i);
      } else if (this.keysToLeave.indexOf(item.key) >= 0) {
        _data.direction = 'leave';
      }
      dataArr.push(_data);
    });

    let callBack = ()=> {
      if (typeof this.props.callback === 'function') {
        this.props.callback();
      }
      //console.log(1212)
      this.kill();
    };
    if (dataArr.length) {
      dataArr.cBool = true;
    }
    startAnimation({children: dom}, {
      data: dataArr,
      delay: delay,
      interval: interval,
      reverse: reverse, onComplete: callBack
    });
  }

  childMap(child) {
    /*React.Children.forEach(child, (item)=> {

     });*/
    child = toArrayChildren(child);
    for (let i = 0; i < child.length; i++) {
      let item = child[i];
      if (item.key) {
        child[i] = cloneElement(item, {index: this.index});
        item = child[i];
        this.index++;
      }
      if (item.props && typeof item.props.children === 'object') {
        let _child = item.props.children;
        if (_child.type.name === 'EnterAnimation') {
          let e_child = toArrayChildren(_child.props.children);
          _child = cloneElement(_child, {children: this.childMap(e_child)});
          child[i] = cloneElement(item, {children: _child});
        } else {
          item.props.children = this.childMap(_child);
        }
      }
    }
    return child;
  }

  componentWillMount() {
    if (this.props.one) {
      this.state.childWapArr = this.childMap(this.props.children);
    }

    //console.log(this.state.childWapArr, this.index)
  }

  componentDidMount() {
    //console.log(this)
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    //添加出场时的position: absolute;
    this.setStartAnimation();
    this.childWapArr = deleteRepeatKeyArr(toArrayChildren(this.props.children));
    this.keysToLeave = [];
    this.keysToEnter = [];
  }

  componentWillReceiveProps(nextProps) {
    let newChildrenArr = deleteRepeatKeyArr(toArrayChildren(nextProps.children));
    let currentChildWapArr = this.childWapArr;

    this.keysToLeave = [];
    this.keysToEnter = [];

    newChildrenArr = MergeWap(currentChildWapArr, newChildrenArr, this.keysToEnter, this.keysToLeave);

    if (nextProps.one) {
      this.index = 0;
      newChildrenArr = this.childMap(newChildrenArr);
    }
    this.setData(nextProps, newChildrenArr);
    return false;
  }

  kill() {
    if (this.props.routeCallBack && this.props.routeDirection === 'leave') {
      this.props.routeCallBack();
    } else {
      //this.setData(this.props, []);
      this.setData(this.props, this.childWapArr);
    }

  }

  render() {
    var props = this.props;
    return createElement(
      props.component,
      props,
      this.state.childWapArr
    );
  }
}

EnterAnimation.to = startAnimation;
EnterAnimation.EnterRouteGroup = EnterAnimationRouteGroup;
EnterAnimation.propTypes = {
  component: React.PropTypes.string,
  direction: React.PropTypes.string,
  index: React.PropTypes.number,
  one: React.PropTypes.bool
};
EnterAnimation.defaultProps = {
  component: 'div',
  direction: null,
  index: 0,
  one: false
};

export default EnterAnimation;


