var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  render() {
    return (

      <div>
        <h3 style={{"text-align": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation style={{margin:"auto",width:200}}>
          <div enter-data={{type:"margin-top:100px",direction: 'leave',delay:1}}>示例1示例1</div>
          <div>示例1示例1</div>
          <div enter-data={{type:"right"}} style={{'background-color': 'red'}}><div><div enter-data={{type:"top"}}>示例1示例1</div></div></div>
          <div>示例1示例1</div>
        </EnterAnimation>
        <h3 style={{"text-align": "center"}} >示例2（EnterAnimation里的参数控制）</h3>
        <EnterAnimation style={{margin:"auto",width:200}} enter-transition={"left"} enter-delay={1} enter-interval={.5}>
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



