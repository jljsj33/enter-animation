'use strict';
import React, {Component, createElement} from 'react';
//import assign from 'object-assign';
import EnterAnimationChild from './EnterAnimationChild';
import {toArrayChildren} from './EnterUtils';
let startAnimation = require('./StartAnimation');


class EnterAnimation extends Component {
  constructor(props) {
    super(...arguments);

    this.keysToEnter = [];
    this.keysToLeave = [];
    this.keysStatic = [];

    //第一次进入，默认进场；
    var elementArr = toArrayChildren(this.props.children);

    elementArr.map((m)=> {
      if (!m) {
        return;
      }
      this.keysToEnter.push(m.key);
    });

    this.state = {
      childWapArr: elementArr
    };
  }


  setData(props, wap) {
    this.setState({
      enter: props.enter,
      leave: props.leave,
      childWapArr: wap
    });

  }

  componentDidMount() {
    ////获取child下的高度；
    //let domBox = findDOMNode(this);
    //let h = 0;
    //for (var i = 0; i < domBox.children.length; i++) {
    //  var m = domBox.children[i];
    //  if (m.offsetHeight > h) {
    //    h = m.offsetHeight
    //  }
    //}
    //domBox.style.height = h + 'px';

    //把进场后的key放里static里；
    this.keysStatic = this.keysToEnter;
    this.keysToEnter = [];

  }

  componentDidUpdate() {
    //更新后删除出场，把进场放入停止；
    this.keysToLeave = [];
    this.keysToEnter.map((m)=> {
      this.keysStatic.push(m);
    });
    this.keysToEnter = [];
  }


  componentWillReceiveProps(nextProps) {
    let childrenArr = nextProps.children;
    let childWapArr = this.state.childWapArr;
    if (!(childrenArr instanceof Array)) {
      childrenArr = [childrenArr];
    }
    childrenArr.map((m)=> {
      if (!m || !m.key) {
        return; //console.warn('Warning: key is null');
        //throw new Error('key is null');
      }
      //把key放进进场;
      if (this.keysStatic.indexOf(m.key) === -1) {
        this.keysToEnter.push(m.key);
        childWapArr.push(m);
      }
      //把当前没有放入出场;
      this.keysStatic.map((cm)=> {
        //console.log(m.key, cm);
        if (m.key === cm) {
          this.keysToLeave.push(cm);
          this.keysStatic.splice(this.keysStatic.indexOf(cm), 1);
        }
      });
    });
    var tArr = this.keysToLeave;
    this.keysToLeave = this.keysStatic;
    this.keysStatic = tArr;

    this.setData(nextProps, childWapArr);
    return false;
  }

  kill(wap) {
    //删除出场wap;
    let childWapArr = this.state.childWapArr;
    childWapArr.map((m)=> {
      if (!m || !m.key) {
        return;
      }
      if (m.key === wap.key) {
        childWapArr.splice(childWapArr.indexOf(wap), 1);
      }
    });
    this.setData(this.props, childWapArr);
  }

  start(h) {
    //findDOMNode(this).style.height = h + 'px';
    //获取Enter的元素里的高。。
  }

  render() {
    var props = this.props;

    var childrenToRender = this.state.childWapArr.map((m)=> {
      if (!m || !m.key) {
        return null;
        //throw new Error('key is null');
      }
      let direction = this.keysToEnter.indexOf(m.key) >= 0 ? 'enter' : this.keysToLeave.indexOf(m.key) >= 0 ? 'leave' : 'static';
      return <EnterAnimationChild
        key={m.key}
        ref={m.key}
        direction={direction}
        enter={props.enter}
        leave={props.leave}
        callback={this.kill.bind(this)}
        onStart={this.start.bind(this)}
      >
      {m}
      </EnterAnimationChild>;
    });
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


