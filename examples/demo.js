var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState(){
    return {
      bool:true
    }
  },
  onClick (){
    this.setState({
      bool:!this.state.bool
    })
  },
  render() {
    return (

      <div>
        <h3 style={{"text-align": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation style={{margin: "auto", width: 200}} duration={2} ease='cubic-bezier(0.68, -0.55, 0.265, 1.55)'>
          <div enter-data={{direction: 'leave', delay: 1,duration:0.5,ease:'cubic-bezier(0.165, 0.84, 0.44, 1)'}}>示例1示例1</div>
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


        <h3 style={{"text-align": "center"}} >示例4（只有一个子级时合并enterAnimation上的样式进div）</h3>
        <EnterAnimation  eStyle={'transform: scale(0)'} delay={2} style={{margin: "auto", width: 200,position:'relative','text-align':'center'}} className={'abc'}>
          <div style={{'margin':100}} className={'bbb'}><div>示例3示例3</div>
            <div>示例3示例3</div>
            <div >
              <div>
                <div>示例3示例3</div>
              </div>
            </div>
            <div>示例3示例3</div></div>
        </EnterAnimation>

        <h3 style={{"text-align": "center"}} >示例5（没有标签或只有一个时而且子级为string的警告,没有动画）</h3>
        <EnterAnimation  type={"bottom"} delay={2} style={{margin: "auto", width: 200}} className={'abc'} >
          <div style={{'margin':100}} className={'bbb'}>示例3示例3</div>
        </EnterAnimation>

        <h3 style={{"text-align": "center"}} >示例6（只有一个子级时合并enterAnimation上的样式进div）</h3>
        <EnterAnimation  eStyle={'transform: scale(0)'} delay={2} style={{margin: "auto", width: 200,position:'relative','text-align':'center'}} className={'abc'} upend={this.state.bool}>
          <div style={{'margin':100}} className={'bbb'}><div>示例3示例3</div>
            <div>示例3示例3</div>
            <div >
              <div>
                <div>示例3示例3</div>
              </div>
            </div>
            <div>示例3示例3</div></div>
        </EnterAnimation>

        <h3 style={{"text-align": "center"}}>示例6－1（分支倒放出场）</h3>
        <EnterAnimation style={{margin: "auto", width: 200}} duration={0.5} onClick={this.onClick} upend={this.state.bool} callback={function(){console.log(this)}}>
          <div enter-data={{ delay: 1}}>示例1示例1</div>
          <div enter-data={{queueId:2}}>示例1示例1</div>
          <div enter-data={{type: "left",direction:'leave',queueId:2}} style={{'background-color': 'red'}}>
            <div>
              <div enter-data={{queueId:2,style: "top",delay: 1,direction:'leave'}}>示例1示例1</div>
            </div>
          </div>
          <div enter-data>示例1示例1</div>
        </EnterAnimation>
      </div>

    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



