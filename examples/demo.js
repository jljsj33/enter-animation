var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  render() {
    return (

      <div>
        <h3 style={{"text-align": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation style={{margin:"auto",width:200}}>
          <div enter-data={{style:"y-bottom",delay:1}}>示例1示例1</div>
          <div>示例1示例1</div>
          <div><div><div enter-data={{style:"y-top"}}>示例1示例1</div></div></div>
          <div>示例1示例1</div>
        </EnterAnimation>
        <h3 style={{"text-align": "center"}} >示例2（EnterAnimation里的参数控制）</h3>
        <EnterAnimation style={{margin:"auto",width:200}} enter-transition={"x-left"} enter-delay={1} >
          <div>示例2示例2</div>
          <div>示例2示例2</div>
          <div><div><div>示例2示例2</div></div></div>
          <div>示例2示例2</div>
        </EnterAnimation>

      </div>

    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));



