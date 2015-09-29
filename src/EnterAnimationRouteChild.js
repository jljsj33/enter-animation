/**
 * Created by jljsj on 15/9/28.
 */
import React, {createElement} from 'react';
import {toArrayChildren} from './EnterUtils';
import EnterAnimationChild from './EnterAnimationChild';

class EnterAnimationRouteChild extends EnterAnimationChild {

  componentWillReceiveProps(nextProps) {
    if (nextProps) {

      this.wapToEnter = [];
      this.wapToLeave = [];

      //let newChildren = this.returnChildren(nextProps);
      //console.log(this.props.children,nextProps.children)
      //let currentChild = this.childrenWap;//=this.returnChildren(this.props.children);
      //console.log(currentChild)

      let newChildrenWap = this.returnChildren(nextProps.children);
      let currentChildWap = toArrayChildren(this.childrenWap);

      //合并两wap和计算进出场的wap；
      let allChildrenArr = this.MergeWap(currentChildWap, newChildrenWap);


      this.childrenWap = allChildrenArr;

    }

  }

  render() {
    var props = this.props;
    return createElement(
      'div',
      props,
      props.children
    );
  }
}
EnterAnimationRouteChild.propTypes = {
  component: React.PropTypes.string
};
EnterAnimationRouteChild.defaultProps = {
  component: 'div'
};
export default EnterAnimationRouteChild;
