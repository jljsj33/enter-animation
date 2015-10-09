/**
 * Created by jljsj on 15/9/30.
 */
import React, {Component, createElement} from 'react';
import {toArrayChildren, deleteRepeatKeyArr, contrastArr} from './EnterUtils';

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
    //console.log(this.props.children[1],React.cloneElement(this.props.children[1].props.route.component))
  }

  componentWillReceiveProps(nextProps) {
    let newChildrenArr = deleteRepeatKeyArr(toArrayChildren(nextProps.children));
    let currentChildWapArr = this.childWapArr;


    let leaveChildArr = [];
    //增加absolute,所以把进场的也放数组里。。
    let enterChildArr = [];


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
  }

  kill() {
    //console.log('group kill');
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
