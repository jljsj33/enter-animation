var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  getInitialState() {
    return {
      show: true,
      element: [
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
        <div key='d'>示例1示例1</div>]
    }
  },
  onClick() {
    this.setState({
      show: !this.state.show
    })
  },
  onAddElement() {
    let arr = this.state.element;
    arr.push(<div key={Date.now()}>新增元素</div>);
    this.setState({
      element: arr
    })
  },
  onAddRemove(){
    let arr=this.state.element;
    arr.pop();
    this.setState({
      addElement: arr
    })
  },
  render() {
    return (

      <div>

        <h3 style={{"textAlign": "center"}}  onClick={this.onClick}>示例5（点我切换进出场）</h3>
        <div style={{"textAlign": "center", margin: '10px 0'}}>
          <button onClick={this.onAddElement}>点击添加</button>
          <button onClick={this.onAddRemove}>点击删除</button>
        </div>
        <EnterAnimation style={{margin: "auto", width: 200}} callback={()=> {
          console.log('动画结束了')
        }}>
        {this.state.show ? this.state.element : null}
        </EnterAnimation>
      </div>



    )
  }
});


React.render(
  <Demo />
  , document.getElementById("__react-content"));



