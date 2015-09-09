var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState: function () {
    return {
      addElement: null,
      cbool:true,
      enter: {
        type: 'bottom',
        interval: 0.1,
        delay: 0,
        callback: function (e) {
          //console.log('我进场了', e.ReactElement.key)
        },
        ease: null
      },
      leave: null
    };
  },
  onClick() {
    this.setState({
      cbool: !this.state.cbool

    })
  },
  render() {
    return (
      <div>
        <h3 style={{"textAlign": "center"}} onClick={this.onClick}>示例1（出场动画配置）</h3>
        <EnterAnimation  enter={this.state.enter} style={{margin: "auto", width: 200}}>
          {this.state.cbool ? <div key='a'>
            <div>示例1示例1</div>
            <div enter-data={{delay:1.5}} leave-data={{type:'left'}} leave-data={{delay:0}}>示例1示例1</div>
            <div style={{'backgroundColor': 'red'}} enter-data>
              <div>
                <div>
                  <div>
                    <div enter-data>示例1示例1</div>
                  </div>
                </div>
              </div>
            </div>
            <div leave-data>示例1示例1</div>
          </div> : null}
        </EnterAnimation>
      </div>
    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));
