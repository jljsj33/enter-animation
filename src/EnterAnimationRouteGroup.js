/**
 * Created by jljsj on 15/9/30.
 */
import React, {Component, createElement} from 'react';
import {toArrayChildren, deleteRepeatKeyArr, MergeWap} from './EnterUtils';

class EnterAnimationRouteGroup extends Component {
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
      bool: false
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
    //添加出场时的position: absolute;

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

    this.setData(nextProps, newChildrenArr);
  }

  kill() {
    this.setData(this.props, this.childWapArr);
  }

  render() {
    var props = this.props;
    var childrenToRender = this.state.childWapArr.map((m)=> {
      if (!m || !m.key) {
        return m;
      }
      let direction = this.keysToEnter.indexOf(m.key) >= 0 ? 'enter' : this.keysToLeave.indexOf(m.key) >= 0 ? 'leave' : null;
      return React.cloneElement(m, {
        routeCallBack: this.kill.bind(this),
        routeDirection: direction,
        enter: props.enter,
        leave: props.leave,
        component: props.component
      });
    });
    return createElement(
      props.component,
      props,
      childrenToRender
    );
  }
}
EnterAnimationRouteGroup.propTypes = {
  component: React.PropTypes.string
};
EnterAnimationRouteGroup.defaultProps = {
  component: 'div'
};
export default EnterAnimationRouteGroup;
