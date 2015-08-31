require('../assets/index.css');
require('../assets/router.css');
import React, { cloneElement } from 'react/addons';
import { history } from 'react-router/lib/HashHistory';
import { Router, Route, Link } from 'react-router';
var EnterAnimation = require("enter-animation");

var App = React.createClass({
  getInitialState: function () {
    return {
      title: '改变state',
      type: 'right',
      interval: 0.1,
      delay: 0,
      callback: function (e) {
        console.log('我进场了', e.direction)
      },
      leave: null,
      ease: null
    };
  },
  click() {
    this.setState({
      title: '动画不产生'
    })
  },
  clickPage1() {
    this.setState({
      interval: 0.2,
      type: 'margin-top:100px',
      ease: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      callback: function (e) {
        console.log('你点了page1,进场用的是你自定的效果', e.direction);
      },
      leave: {
        type: 'left',
        upend: true,
        ease: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        callback: function (e) {
          console.log('你点了page1,出场用的是你自定的效果', e.direction);
          console.log('如果你在用了的参数，在出场没有设定，那么出场没设的将用回进场那设定的参数，如interval,这里出场时还是延时1秒')
        }
      }

    })
  },
  clickPage2() {
    this.setState({
      interval: 0.1,
      type: 'top',
      ease: null,
      leave: null,
      callback: function (e) {
        console.log('你点了page2,leave为null,出场进场同效果', e.direction)
      }
    })
  },

  render() {
    var key = this.props.location.pathname;
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
        <EnterAnimation className='demoImgBox' leave={this.state.leave} type={this.state.type} ease={this.state.ease} interval={this.state.interval} callback={this.state.callback}>
          {cloneElement(this.props.children || <div/>, {key: key})}
        </EnterAnimation>
      </div>
    );
  }
});

var Page1 = React.createClass({
  render() {
    return (
      <div className="Image">
        <h1>Page 1</h1>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
        <p>
          <Link to="/page2">A link to page 1 should be active</Link>
          dsfklafkds</p>
      </div>
    );
  }
});

var Page2 = React.createClass({
  render() {
    return (
      <div className="Image">
        <h1>Page 2</h1>
        <p>
          <Link to="/page1">a link to page 2 </Link>
          abcsdfadf f.</p>
        <p>
          <Link to="/page1">a link to page 2 </Link>
          abcsdfadf f.</p>
        <p>
          <Link to="/page1">a link to page 2 </Link>
          abcsdfadf f.</p>
        <p>
          <Link to="/page1">a link to page 2 </Link>
          abcsdfadf f.</p>
      </div>
    );
  }
});


React.render((
  <Router history={history}>
    <Route path="/" component={App}>
      <Route path="page1" component={Page1} />
      <Route path="page2" component={Page2} />
    </Route>
  </Router>
), document.getElementById("__react-content"));
