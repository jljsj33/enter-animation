var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState() {
    return {
      bool: true,
      cbool:true
    }
  },
  onClick() {
    this.setState({
      bool: !this.state.bool,
      cbool:!this.state.cbool

    })
  },
  render() {

    console.log(typeof undefined)
    return (

      <div>
        <h3 style={{"textAlign": "center"}}>示例1（子节点enter-data数据控制进场）</h3>
        <EnterAnimation>
          <div key='1' style={{margin: "auto", width: 200}}>
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
        <EnterAnimation >
          <div key='2' style={{margin: "auto", width: 200}}>
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
        <EnterAnimation  className={'abc'} >
          <div key='3' style={{margin: "auto", width: 200}} className={'bbb'}>示例3示例3</div>
        </EnterAnimation>


        <h3 style={{"textAlign": "center"}}>示例4（分支倒放出场）</h3>
        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }}>
          <div key='4'>
            <div enter-data={{delay: 1}}>示例1示例1</div>
            <div enter-data={{queueId: 2}}>示例1示例1</div>
            <div enter-data={{
              type: "left",
              direction: this.state.direction,
              queueId: 2
            }} style={{'backgroundColor': 'red'}}>
              <div>
                <div enter-data={{queueId: 2, style: "top", delay: 1, direction: this.state.direction}}>示例1示例1</div>
              </div>
            </div>
            <div enter-data>示例1示例1</div>
          </div>
        </EnterAnimation>


        <h3 style={{"textAlign": "center"}}  onClick={this.onClick}>示例5（点我切换进出场）</h3>

        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} enter={{
          duration: .5, interval: 0.1, callback: ()=> {
            console.log(this)
          }
        }}>
        {this.state.cbool ? <div key='a'>
          <div data-enter='{"type":"top"}' enter-data={{delay: 1}}>示例1示例1</div>
          <div data-enter>示例1示例1</div>
          <div  enter-data={{type: "right", queueId: 2}} style={{'backgroundColor': 'red'}}>
            <div>
              <div>
                <div>
                  <div data-enter='{"type":"top"}' enter-data={{queueId: 2, delay: 1}}>示例1示例1</div>
                </div>
              </div>
            </div>
          </div>
          <div enter-data>示例1示例1</div>
        </div> : null}
        </EnterAnimation>


        <h3 style={{"textAlign": "center"}} >示例6（无key，无动画）</h3>
        <EnterAnimation >
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
          <div  style={{margin: "auto", width: 200}}>
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


        <h3 style={{"textAlign": "center"}}  onClick={this.onClick}>示例5（点我切换进出场）</h3>

        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} enter={{
          duration: .5, interval: 0.1, callback: ()=> {
            console.log(this)
          }
        }} leave={{type:'top',callback:()=>{console.log('leave')}}}>
        {this.state.cbool ? <div key='a'>
          <div>示例1示例1</div>
          <div>示例1示例1</div>
          <div style={{'backgroundColor': 'red'}}>
            <div>
              <div>
                <div>
                  <div >示例1示例1</div>
                </div>
              </div>
            </div>
          </div>
          <div>示例1示例1</div>
        </div> : null}
        </EnterAnimation>
      </div>



    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



