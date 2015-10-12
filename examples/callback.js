var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState() {
    return {
      show: true
    }
  },
  onClick() {
    this.setState({
      show: !this.state.show

    })
  },
  render() {
    return (

      <div>

        <h3 style={{"textAlign": "center"}}  onClick={this.onClick}>示例5（点我切换进出场）</h3>

        <EnterAnimation style={{margin: "auto", width: 200}} callback={()=>{console.log('动画结束了')}}>
        {this.state.show ?[
          <div key='a'>示例1示例1</div>,
          <div key='b'>示例1示例1</div>,
          <div key='c' style={{'backgroundColor': 'red'}}>
            <div>
              <div>
                <div>
                  <div >示例1示例1</div>
                </div>
              </div>
            </div>
          </div>,
          <div key='d'>示例1示例1</div>]: null}
        </EnterAnimation>
      </div>



    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



