var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  render() {
    return (

      <div>
        <h3 style={{"text-align": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation style={{margin: "auto", width: 200}}>
          <div enter-data={{style: "margin-top:100px", direction: 'leave', delay: 1}}>示例1示例1</div>
          <div>示例1示例1</div>
          <div enter-data={{type: "left"}} style={{'background-color': 'red'}}>
            <div>
              <div enter-data={{style: "top"}}>示例1示例1</div>
            </div>
          </div>
          <div>示例1示例1</div>
        </EnterAnimation>
        <h3 style={{"text-align": "center"}} >示例2（EnterAnimation里的参数控制默认，只需加enter-data就可执行默认动画）</h3>
        <EnterAnimation style={{margin: "auto", width: 200}} type={"left"} >
          <div>示例2示例2</div>
          <div enter-data>示例2示例2</div>
          <div >
            <div>
              <div enter-data>示例2示例2</div>
            </div>
          </div>
          <div>示例2示例2</div>
        </EnterAnimation>
        <h3 style={{"text-align": "center"}} >示例3（如果子节点没有enter-data,EnterAnimation里的参数控制下面一级子节点动画）</h3>
        <EnterAnimation  type={"left"} delay={2} style={{margin: "auto", width: 200}}>
            木大土木
            <div>示例3示例3</div>
            <div>示例3示例3</div>
            <div >
              <div>
                <div>示例3示例3</div>
              </div>
            </div>
            <div>示例3示例3</div>
        </EnterAnimation>
      </div>

    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));



