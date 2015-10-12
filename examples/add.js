var React = require('react');
var EnterAnimation = require("enter-animation");

var div = [<div key='21' enter-data>
    <div>示例1示例2676671</div>
  </div>, <div key='22'>sdfsdf</div>],
  adiv = div.concat(),
  cdiv = [<div>
    <div>示例1示例2221</div>
  </div>];
var Page = React.createClass({
  render() {
    return <div>new Children</div>
  }
})
var Demo = React.createClass({
  getInitialState: function () {
    return {
      addElement: div,
      cbool: true,
      enter: {
        style: {transform: "translateY(-50px)", opacity: 0},
        interval: 0.1,
        delay: 0,
        duration: .5,
        callback: function (e) {
          //console.log('我进场了', e.ReactElement.key)
        },
        ease: null
      },
      leave: {
        type: 'left',
        duration: .5,
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
    cdiv.push(<Page key={Date.now()} enter-data/>);
    cdiv.push(<Page key={Date.now() + '1221'} enter-data/>);
    //let newDiv = this.state.addElement.slice();
    adiv.unshift(<div key={Date.now()}>示例1示例1{adiv.length}</div>);

    this.setState({
      enter: {type: 'left'}, leave: null,
      addElement: cdiv
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
          {this.state.cbool ? <div key='acc'><div key='bdfd'>{this.state.addElement}</div></div> : null}

        </EnterAnimation>
      </div>
    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));
/*<div key='dd'>
 <EnterAnimation enter={this.state.enter} leave={this.state.leave}>
 {this.state.cbool ?<div key='bbb'><div>bbbbb</div></div>: null}
 </EnterAnimation>
 </div>
 <div>dddddffff</div>*/
