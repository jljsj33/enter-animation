require('../assets/index.css');
var React = require('react');
var EnterAnimation = require("enter-animation");

var Demo = React.createClass({
  labelClick: function () {
    var t = EnterAnimation.to('.demo-startAnim');
  },
  listClick: function () {
    EnterAnimation.to('.demo-list', [
      [{style: "bottom"}, [{style: "bottom"}, {style: "bottom"}, {style: "bottom"}, {style: "bottom"}, {style: "bottom"}]],
      [{
        style: "bottom",
        delay: 0.2,
        delayRewrite: true
      }, [{style: "bottom"}, {style: "bottom"}, {style: "bottom"}, {style: "bottom"}, {style: "bottom"}]]
    ])
  },
  render() {
    return (

        <div>
          <h1 style={{"text-align": "center","margin-top":20}}>示例3，按钮触发</h1>
          <div style={{"text-align": "center", "margin": "20px auto"}}>
            <button className="ant-btn ant-btn-primary" id="overBtn" onClick={this.labelClick}>
              刷新页面进场播放
            </button>
            <button className="ant-btn ant-btn-primary" id="listBtn" onClick={this.listClick}>
              刷新局部进场播放
            </button>
          </div>
          <div className="demo-startAnim">
            <div className="demo-header">
              <div className="logo">
                <img width="30" src="https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg" />
                <span>logo</span>
              </div>
              <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
            <div className="demo-content">
              <div className="demo-title">我是标题</div>
              <div className="demo-kp">
                <ul>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div className="demo-title">我是标题</div>
              <div className="demo-listBox">
                <ul>
                  <li>
                    <div className="demo-list">
                      <div className="title"></div>
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <div className="demo-list">
                      <div className="title"></div>
                      <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="demo-footer" style={{"width": "100%", "display": "table", "float": "left"}}></div>
          </div>

        </div>

    )
  }
});

React.render(
  <Demo />
  , document.getElementById("__react-content"));



