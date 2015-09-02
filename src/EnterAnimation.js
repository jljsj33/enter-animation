'use strict';
import React, {Component, createElement} from 'react';
//import assign from 'object-assign';
import EnterAnimationChild from './EnterAnimationChild';
import {toArrayChildren, deleteRepeatKeyArr, contrastArr} from './EnterUtils';
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
      childWapArr: this.childWapArr
    };
  }

  setData(props, wap) {
    this.setState({
      enter: props.enter,
      leave: props.leave,
      childWapArr: wap
    });

  }

  componentDidUpdate() {
    this.childWapArr = deleteRepeatKeyArr(toArrayChildren(this.props.children));
    this.keysToLeave = [];
    this.keysToEnter = [];
  }


  componentWillReceiveProps(nextProps) {
    let newChildrenArr = deleteRepeatKeyArr(toArrayChildren(nextProps.children));
    let currentChildWapArr = this.childWapArr;

    let leaveChildArr = [];

    this.keysToLeave = [];
    this.keysToEnter = [];
    //判断两Arr里的不同；
    contrastArr(currentChildWapArr, newChildrenArr, (cm)=> {
      this.keysToEnter.push(cm.key);
    });

    contrastArr(newChildrenArr, currentChildWapArr, (cm)=> {
      leaveChildArr.push(cm);
      this.keysToLeave.push(cm.key);
    });
    newChildrenArr = newChildrenArr.concat(leaveChildArr);
    this.setData(nextProps, newChildrenArr);
    return false;
  }

  kill() {
    this.setData(this.props, this.childWapArr);
  }

  start(h) {
    //findDOMNode(this).style.height = h + 'px';
    //获取Enter的元素里的高。。
  }

  render() {
    var props = this.props;
    var childrenToRender = this.state.childWapArr.map((m)=> {
      if (!m || !m.key) {
        return m;
      }
      let direction = this.keysToEnter.indexOf(m.key) >= 0 ? 'enter' : this.keysToLeave.indexOf(m.key) >= 0 ? 'leave' : null;
      return <EnterAnimationChild
        key={m.key}
        ref={m.key}
        direction={direction}
        enter={props.enter}
        leave={props.leave}
        callback={this.kill.bind(this)}
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
EnterAnimation.propTypes = {
  component: React.PropTypes.string
};
EnterAnimation.defaultProps = {
  component: 'div'
};

export default EnterAnimation;


