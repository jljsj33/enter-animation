/**
 * Created by jljsj on 15/9/24.
 */
require('../assets/index.css');
require('../assets/router.css');
import React, { cloneElement } from 'react/addons';
import { history } from 'react-router/lib/HashHistory';
import { Router, Route, RouteHandler, Link} from 'react-router';
var EnterAnimation = require("enter-animation");

var at = null
var App = React.createClass({
  getInitialState: function () {
    return {
      title: '改变state',
      addElement: null,
      enter: {
        style: {marginTop: '10px', opacity: 0},
        interval: 0.1,
        delay: 0,
        callback: function (e) {
          console.log('我进场了', e.ReactElement.key)
        },
        ease: null
      },
      leave: null,
      t: <div key='bb' onClick={this.addElement} className='demo-router-add'>
        <div>点我变换元素</div>
      </div>
    };
  },
  click() {
    console.log(this)
    this.setState({
      title: '动画不产生'
    })
  },
  clickPage1() {
    this.setState({
      enter: {
        interval: 0.1,
        type: null,
        style: {marginTop: '10px', opacity: 0},//'margin-top:10px;opacity:0',
        ease: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        delay: .5,
        callback: function (e) {
          console.log('你点了page1,进场用的是你自定的效果', e.direction);
        }
      },
      leave: {
        type: 'left',
        reverse: true,
        interval: 0.05,
        ease: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        delay: 0,
        callback: function (e) {
          console.log('你点了page1,出场用的是你自定的效果', e.direction);
          console.log('如果你在用了的参数，在出场没有设定，那么出场没设的将用回进场那设定的参数，如reverse，从最后个开始')
        }
      },
      addElement: null,

    })
  },
  clickPage2() {
    this.setState({
      enter: {
        interval: 0.03,
        type: 'bottom',
        ease: null,
        callback: function (e) {
          console.log('你点了page2,leave为null,出场进场同效果', e.direction)
        }
      },
      leave: {},
      addElement: null,
    })
  },
  addElement() {
    console.log('点这不会改变进出场,');
    this.setState({
      addElement: React.createElement('div', {
        key: Date.now(),
        className: 'demo-router-element'
      }, React.createElement('div', null, 'abc' + Date.now()))
    })
  },

  render() {
    var key = this.props.location.pathname;
    //let child = React.createElement('div', {key: key}, this.props.children || <div/>);
    let child = cloneElement(this.props.children || <div/>, {key: key});
    return (
      <div>
        <ul  className='demo-router-nav'>
          <li>
            <a onClick={this.click}>{this.state.title}</a>
          </li>
          <li>
            <Link to="/page1" onClick={this.clickPage1}>Page 1</Link>
          </li>
          <li>
            <Link to="/page2" onClick={this.clickPage2}>Page 2</Link>
          </li>
        </ul>
        <EnterAnimation.EnterRouteGroup enter={this.state.enter} leave={this.state.leave}>
        {child}
        </EnterAnimation.EnterRouteGroup>
      </div>
    );
  }
});

var Page1 = React.createClass({
  render() {
    return (
      <EnterAnimation className='demo-router-wap' ref='myChild' {...this.props}>
        <div className="demo-router-child" ref='page1' style={{width: '100%'}} key='page1'>
          <h1 enter-data={{"type": "right"}} style={{background: "#ff0000"}}>Page 1</h1>
          <p enter-data={{"type": "top"}} style={{background: "#ff0000"}}>
            <Link to="/page2">A link to page 1 should be active</Link>
            我是页面1</p>
          <p enter-data={{"type": "top"}} style={{background: "#ff0000"}}>
            <Link to="/page2" enter-data={{"type": "bottom"}}>A link to page 1 should be active</Link>
            我是页面1</p>
          <p enter-data={{"type": "right"}} style={{background: "#ff0000"}}>
            <Link to="/page2">A link to page 1 should be active</Link>
            我是页面1</p>
          <p enter-data={{"style": {"marginTop": "50px", "opacity": 0}}} data-leave={{
            "type": "top",
            "duration": 1
          }} style={{background: "#ff0000"}}>
            <Link to="/page2">A link to page 1 should be active</Link>
            我是页面1</p>
          <p enter-data style={{background: "#ff0000"}}>
            <Link to="/page2">A link to page 1 should be active</Link>
            我是页面1</p>
        </div>
      </EnterAnimation>
    );
  }
});

var Page3 = React.createClass({
  render() {
    return <p style={{background: "#fff000"}} enter-data={{type: 'left'}}>
      <Link to="/page1">a link to page 2 </Link>
      我是页面2.{this.props ? this.props.i : 1222}</p>
  }
});
var t = [0, 1, 2];
var Page2 = React.createClass({
  getInitialState() {
    return {
      addElement: t
    }
  },
  onAddElement() {
    t.push(t.length);
    t.push(t.length);
    this.setState({});
  },
  onRemoveElement() {
    t.splice(1, 1);
    t.push(Date.now());
    this.setState({});
  },
  render() {
    let a = t.map((m)=> {
      return <Page3 key={m} i={m}/>
    });
    return (
      <EnterAnimation className='demo-router-wap'  ref='myChild' {...this.props}>
        <div style={{width: '100%'}} ref='page2' className="demo-router-child" key='page2'>
          <h1 enter-data style={{background: "#fff000"}} >
            <span>Page 2</span>
            <button style={{'fontSize': 16, display: 'inline-block'}} onClick={this.onAddElement}>点击添加</button>
            <button style={{'fontSize': 16, display: 'inline-block'}} onClick={this.onRemoveElement}>点击删除</button>
          </h1>
      {a}
          <div enter-data={{type: 'top'}}>sfdfsdfdsf
            <Page3/>
          </div>
        </div>
      </EnterAnimation>
    );
  }
});


React.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="page1" component={Page1} get/>
      <Route path="page2" component={Page2} />
    </Route>
  </Router>
), document.getElementById("__react-content"));
