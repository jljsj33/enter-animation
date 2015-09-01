var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState() {
    return {
      bool: true,
      close: true,
      direction: 'leave'
    }
  },
  onClick() {
    this.setState({
      bool: !this.state.bool,
      close: true,
      direction: this.state.direction === 'leave' ? 'enter' : 'leave'
    })
  },
  render() {
    return (

      <div>


        <h3 style={{"textAlign": "center"}}>示例5（有操作时,不启动动画）</h3>

        <EnterAnimation style={{
          margin: "auto",
          width: 200
        }} enter={{
          duration: .5, interval: 0.1, callback: ()=> {
            console.log(this)
          }
        }} onClick={this.onClick}>
          <div key='a'>
            <div data-enter='{"type":"top"}' enter-data={{delay: 1}}>示例1示例1</div>
            <div>示例1示例1</div>
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
          </div>
        </EnterAnimation>
      </div>

    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



