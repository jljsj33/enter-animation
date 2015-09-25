var React = require('react');
var EnterAnimation = require("enter-animation");

var div = [<div><div>示例1示例1</div></div>, <div >sdfsdf</div>],
  adiv=div.concat(),
  cdiv=[<div><div>示例1示例2221</div></div>];
var Demo = React.createClass({
  getInitialState: function () {
    return {
      addElement: div,
      cbool: true,
      enter: {
        style: {transform: "translateY(-50px)", opacity: 0},
        interval: 0.1,
        delay: 0,
        duration:.5,
        callback: function (e) {
          //console.log('我进场了', e.ReactElement.key)
        },
        ease: null
      },
      leave: {
        type:'left',
        duration:.5,
        ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
      }
    };
  },
  onClick() {
    this.setState({
      cbool: !this.state.cbool

    })
  },
  onAddElement() {
    cdiv.push(<div key={Date.now()} enter-data>示例1示例1{cdiv.length}</div>);
    //let newDiv = this.state.addElement.slice();
    adiv.unshift(<div key={Date.now()}>示例1示例1{adiv.length}</div>);

    this.setState({
      addElement:cdiv
    })
  },
  render() {
    return (
      <div>
        <h3 style={{"textAlign": "center"}} onClick={this.onClick}>添加子节点</h3>
        <div style={{"textAlign": "center", margin: '10px 0'}}>
          <button onClick={this.onAddElement}>点击添加</button>
        </div>
        <EnterAnimation  enter={this.state.enter} leave={this.state.leave} style={{margin: "auto", width: 200}}>
          {this.state.cbool ? <div key='acc'>{this.state.addElement}</div> : null}
        </EnterAnimation>
      </div>
    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));
