'use strict';
import React, {Component, createElement} from 'react';
//import assign from 'object-assign';
import EnterAnimationChild from './EnterAnimationChild';
import EnterAnimationRouteGroup from './EnterAnimationRouteGroup';
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

  componentDidUpdate() {
    //添加出场时的position: absolute;

    this.childWapArr = deleteRepeatKeyArr(toArrayChildren(this.props.children));
    //this.keysToLeave = [];
    //this.keysToEnter = [];
    //console.log(this.props.children[1],React.cloneElement(this.props.children[1].props.route.component))
  }


  componentWillReceiveProps(nextProps) {
    let newChildrenArr = deleteRepeatKeyArr(toArrayChildren(nextProps.children));
    let currentChildWapArr = this.childWapArr;

    let leaveChildArr = [];
    //增加absolute,所以把进场的也放数组里。。
    let enterChildArr = [];

    //console.log(nextProps.children[1].props.route.component.prototype.render())

    this.keysToLeave = [];
    this.keysToEnter = [];


    //判断两Arr里的不同；
    contrastArr(currentChildWapArr, newChildrenArr, (cm)=> {
      if (cm.key) {
        this.keysToEnter.push(cm.key);
        enterChildArr.push(cm);
        //newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);//清掉进场的；
      }
    });
    //清掉进场；
    enterChildArr.map((cm)=> {
      newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);
    });

    contrastArr(newChildrenArr, currentChildWapArr, (cm)=> {
      if (cm.key) {
        leaveChildArr.push(cm);
        this.keysToLeave.push(cm.key);
        //newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);//清掉出场的；
      }

    });


    newChildrenArr = newChildrenArr.concat(leaveChildArr, enterChildArr);

    this.setData(nextProps, deleteRepeatKeyArr(newChildrenArr));
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
      //console.log('direction:', props.direction, direction);
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


