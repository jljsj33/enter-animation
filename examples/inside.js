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

        <EnterAnimation style={{margin: "auto", width: 200}} enter={{type: 'right'}} one={true}>
        {this.state.show ? [
          <div key='a'>示例1示例1</div>,
          <div key='b'>示例1示例1</div>,
          <div key='c' style={{'backgroundColor': 'red'}}>
            <EnterAnimation enter={{type: 'left'}}>
              <div key='i0'>示例1示例1</div>
              <div key='i1'>示例1示例1</div>
              <div key='i2'>示例1示例1</div>
              <div key='i3'>
                <EnterAnimation>
                  <div key='i10'>示例1示例1</div>
                  <div key='i11'>示例1示例1</div>
                  <div key='i12'>示例1示例1</div>
                  <div key='i13'>示例1示例1</div>
                </EnterAnimation>
              </div>
            </EnterAnimation>
          </div>,
          <div key='d'>示例1示例1</div>] : null}
        </EnterAnimation>

      </div>



    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



