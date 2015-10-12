'use strict';
import React, {Component, createElement} from 'react';
//import assign from 'object-assign';
import EnterAnimationChild from './EnterAnimationChild';
import EnterAnimationRouteGroup from './EnterAnimationRouteGroup';
import {toArrayChildren, deleteRepeatKeyArr, MergeWap} from './EnterUtils';
let startAnimation = require('./StartAnimation');


class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);

    this.keysToEnter = [];
    this.keysToLeave = [];

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
      keysToLeave: this.props.keysToLeave
    };
  }

  setData(props, wap, dic, bool, callback) {
    this.setState({
      enter: props.enter,
      leave: props.leave,
      childWapArr: wap
    });
  }

  componentDidMount() {
    this.keysToLeave = [];
    this.keysToEnter = [];
  }

  componentDidUpdate() {
    //添加出场时的position: absolute;
    this.childWapArr = deleteRepeatKeyArr(toArrayChildren(this.props.children));
    //this.keysToLeave = [];
    //this.keysToEnter = [];
  }


  componentWillReceiveProps(nextProps) {
    let newChildrenArr = deleteRepeatKeyArr(toArrayChildren(nextProps.children));
    let currentChildWapArr = this.childWapArr;

    this.keysToLeave = [];
    this.keysToEnter = [];

    newChildrenArr = MergeWap(currentChildWapArr, newChildrenArr, this.keysToEnter, this.keysToLeave);
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

  start(h) {
    //findDOMNode(this).style.height = h + 'px';
    //获取Enter的元素里的高。。
  }

  render() {
    var props = this.props;
    if (props && props.children && props.children.props && props.children.props.route) {
      throw new Error('Please use "EnterAnimation.EnterRouteGroup"');
    }
    var childrenToRender = this.state.childWapArr.map((m)=> {
      if (!m || !m.key) {
        return m;
      }
      let direction = this.keysToEnter.indexOf(m.key) >= 0 ? 'enter' : this.keysToLeave.indexOf(m.key) >= 0 ? 'leave' : null;
      let callback = this.kill.bind(this);
      let posBool = false;//(direction === 'leave');
      if (props.routeDirection === 'leave' && props.routeCallBack) {
        direction = 'leave';
        //callback = this.props.routeCallBack;
        this.keysToLeave.push(m.key);
        posBool = true;
      }
      return <EnterAnimationChild
        key={m.key}
        ref={m.key}
        direction={direction}
        enter={props.enter}
        leave={props.leave}
        position={posBool}
        callback={callback}
        renderTag={props.renderTag}
        onStart={this.start.bind(this)}>
        {m}
      </EnterAnimationChild>;
    });
    //去重复和null
    childrenToRender = deleteRepeatKeyArr(childrenToRender);
    return createElement(
      props.component,
      props,
      childrenToRender
    );
  }
}

EnterAnimation.to = startAnimation;
EnterAnimation.EnterRouteGroup = EnterAnimationRouteGroup;
EnterAnimation.propTypes = {
  component: React.PropTypes.string,
  direction: React.PropTypes.string
};
EnterAnimation.defaultProps = {
  component: 'div',
  direction: null
};

export default EnterAnimation;


