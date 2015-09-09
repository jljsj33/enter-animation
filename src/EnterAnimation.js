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
    //添加出场时的position: absolute;
    //if (this.keysToEnter.length) {
    //  this.keysToLeave.map((key)=> {
    //    this.state.childWapArr.map((m)=> {
    //      if (key == m.key) {
    //        m.props.style = {position: "absolute"};
    //        console.log(m)
    //      }
    //    })
    //  })
    //}

    this.childWapArr = deleteRepeatKeyArr(toArrayChildren(this.props.children));
    this.keysToLeave = [];
    this.keysToEnter = [];
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
      this.keysToEnter.push(cm.key);
      enterChildArr.push(cm);
      //newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);//清掉进场的；
    });
    contrastArr(newChildrenArr, currentChildWapArr, (cm)=> {
      leaveChildArr.push(cm);
      this.keysToLeave.push(cm.key);
      //newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);//清掉出场的；
    });

    //newChildrenArr = leaveChildArr.concat(newChildrenArr);
    //清掉进场；
    enterChildArr.map((cm)=> {
      newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);
    });
    ////清掉出场;
    //leaveChildArr.map((cm)=>{
    //  newChildrenArr.splice(newChildrenArr.indexOf(cm), 1);
    //});

    newChildrenArr = newChildrenArr.concat(leaveChildArr, enterChildArr);

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
      var posBool = false;
      if (this.keysToEnter.length) {
        this.keysToLeave.map((key)=> {
          if (key === m.key) {
            posBool = true;
          }
        });
      }
      return <EnterAnimationChild
        key={m.key}
        ref={m.key}
        direction={direction}
        enter={props.enter}
        leave={props.leave}
        position={posBool}
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


