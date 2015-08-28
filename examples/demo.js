var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState() {
    return {
      bool: true,
      close:true,
      direction:'leave'
    }
  },
  onClick() {
    this.setState({
      bool: !this.state.bool,
      close:true,
      direction:this.state.direction==='leave'?'enter':'leave'
    })
  },
  render() {
    return (

      <div>
        <h3 style={{"textAlign": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation  duration={2} ease='cubic-bezier(0.68, -0.55, 0.265, 1.55)'>
          <div style={{margin: "auto", width: 200}}>
            <div enter-data={{
              direction: 'leave',
              delay: 1,
              duration: 0.5,
              ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}>示例1示例1</div>
            <div>示例1示例1</div>
            <div enter-data={{type: "left"}} style={{'backgroundColor': 'red'}}>
              <div>
                <div enter-data={{style: "top"}}>示例1示例1</div>
              </div>
            </div>
            <div>示例1示例1</div>
          </div>
        </EnterAnimation>

        <h3 style={{"textAlign": "center"}} >示例2（EnterAnimation里的参数控制默认，只需加enter-data就可执行默认动画）</h3>
        <EnterAnimation  type={"left"} >
          <div style={{margin: "auto", width: 200}}>
            <div>示例2示例2</div>
            <div enter-data>示例2示例2</div>
            <div >
              <div>
                <div enter-data>示例2示例2</div>
              </div>
            </div>
            <div>示例2示例2</div>
          </div>
        </EnterAnimation>



        <h3 style={{"textAlign": "center"}} >示例3（没有标签或只有一个时而且子级为string的警告,没有动画）</h3>
        <EnterAnimation  type={"bottom"} delay={2}  className={'abc'} >
          <div style={{margin: "auto", width: 200}} className={'bbb'}>示例3示例3</div>
        </EnterAnimation>


        <h3 style={{"textAlign": "center"}}>示例4（分支倒放出场）</h3>
        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} duration={0.5} upend={this.state.bool} callback={function () {
          console.log(this)
        }}>
          <div>
            <div enter-data={{delay: 1}}>示例1示例1</div>
            <div enter-data={{queueId: 2}}>示例1示例1</div>
            <div enter-data={{type: "left", direction: this.state.direction, queueId: 2}} style={{'backgroundColor': 'red'}}>
              <div>
                <div enter-data={{queueId: 2, style: "top", delay: 1, direction: this.state.direction}}>示例1示例1</div>
              </div>
            </div>
            <div enter-data>示例1示例1</div>
          </div>
        </EnterAnimation>

        <h3 style={{"textAlign": "center"}}>示例4（有操作时）</h3>
        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} duration={0.5} onClick={this.onClick} upend={this.state.bool} callback={function () {
          console.log(this)
        }}>
          <div>
            <div enter-data={{delay: 1}}>示例1示例1</div>
            <div enter-data={{queueId: 2}}>示例1示例1</div>
            <div enter-data={{type: "left", direction: this.state.direction, queueId: 2}} style={{'backgroundColor': 'red'}}>
              <div>
                <div enter-data={{queueId: 2, style: "top", delay: 1, direction: this.state.direction}}>示例1示例1</div>
              </div>
            </div>
            <div enter-data>示例1示例1</div>
          </div>
        </EnterAnimation>

        <h3 style={{"textAlign": "center"}}>示例5（有操作时,不启动动画）</h3>

        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} duration={0.5} onClick={this.onClick}  upend={this.state.bool} close={this.state.close} callback={function () {
          console.log(this)
        }}>
          <div>
            <div enter-data={{delay: 1}}>示例1示例1</div>
            <div enter-data={{queueId: 2}}>示例1示例1</div>
            <div enter-data={{type: "left", direction: 'leave', queueId: 2}} style={{'backgroundColor': 'red'}}>
              <div>
                <div enter-data={{queueId: 2, style: "top", delay: 1, direction: 'leave'}}>示例1示例1</div>
              </div>
            </div>
            <div enter-data>示例1示例1</div>
          </div>
        </EnterAnimation>
      </div>

    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



