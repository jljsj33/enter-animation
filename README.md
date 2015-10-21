##EnterAnimation进场动画
---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/enter-animation.svg?style=flat-square
[npm-url]: http://npmjs.org/package/enter-animation
[travis-image]: https://img.shields.io/travis/react-component/animate.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/animate
[coveralls-image]: https://img.shields.io/coveralls/react-component/animate.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/animate?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/animate.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/animate
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/enter-animation.svg?style=flat-square
[download-url]: https://npmjs.org/package/enter-animation

## Feature

* support ie10+,chrome,firefox,safari

## install

[![enter-animation](https://nodei.co/npm/enter-animation.png)](https://npmjs.org/package/enter-animation)

### 用法
```html
var EnterAnimation = require('enter-animation');
var React = require('react');
React.render(<EnterAnimation>
  <div key='demo'>
    <div>依次进场</div>
    <div>依次进场</div>
    <div>依次进场</div>
    <div>依次进场</div>
  </EnterAnimation>
  </div>,container)

```


### api
动画默认`right`

EnterAnimation标签下：


|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|enter|object|管理进场数据|
|leave|object|管理当前元素出场的数据,默认null,null继承上面所有标签的值 |
|component|string|EnterAnimation替换的标签名|
|routeDirection|string|route时需要|
|routeCallBack|function|route时需要|

enter={} or leave={}

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|type|string|执行动画的内置参数，默认；`right`  |
|style|object/string|同上，style的样式动画,`type`有值，此项无效， 默认null|
|duration    |number             |每个动画的时间；默认0.5|
|delay       |number|整个区块的延时，默认为0；</br>同startAnimation的delay|
|reverse       |boolean|是否倒放,从最后一个dom开始往上播放,默认false|
|ease             |string|样式缓动;默认 `cubic-bezier(0.165, 0.84, 0.44, 1);`|
|interval|number|递增延时值，默认0.1|
|callback|function|动画完成后回调|

子dom标签下：

一级标签key:

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|key|string|必需，控制进出场；|

二级标签或再下级标签:

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|key              |string|子节新增与去除必须，单进场可不用                         |
|enter-data       |object            |如下data值;|
|leave-data       |object |如上,如果为null，则继承enter-data和data-enter的所有参数|


注：如子节点有`enter-data`值，则只执行有`enter-data`的节点的动画;
如果标签上的`enter-data`没`type`||`style`，则执行`EnterAnimation`标签上的`type`||`style`;


## EnterRouteGroup

控制route的进出场；

如:
```html
var Page1 = React.createClass({
  render() {
    return
      <EnterAnimation {...this.props}>
      <h1>添加或删除时EnterChild才起效，进出场仍然是EnterAnimation的参数</h1>
      <p style={{background: "#fff000"}} enter-data={{type: 'left'}} key='1'><Link to="/page1">a link to page 2 </Link>我是页面2.</p>
      <p style={{background: "#fff000"}} enter-data={{type: 'left'}} key='2'><Link to="/page1">a link to page 2 </Link>我是页面2.</p>
      <p style={{background: "#fff000"}} enter-data={{type: 'left'}} key='3'><Link to="/page1">a link to page 2 </Link>我是页面2.</p>
      </EnterAnimation>
  }
});
<EnterAnimation.EnterRouteGroup>
   <Page1 key='demo'/>
</EnterAnimation.EnterRouteGroup>
```
具体看demo,routerAdd.html;

##startAnimation的动画参数(EnterAnimation.to)；

页面进场动画的类，通过ＣＳＳ来快速完成页面刷新后的动画进场或子块的动画进场；

### 用法
<pre><code>
//js触发式：
var EnterAnimation=requre('enter-animation');
EnterAnimation.to(node,vars);</code></pre>

### 参数说明

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|node             |string|要执行动画的dom（class,id）;必要;  |
|vars|object|动画参数 |

#### vars参数
|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|direction        |"enter"         |动画进场或出场样式,以`enter``leave`两值;默认为"enter"|
|data             |string / object|执行动画的参数，有object和string两种类型，下面详解；默认为null|
|duration         |0.5             |动画的时间；|
|delay            |number     |整个区块的延时，默认为0；</br>同startAnimation的delay|
|ease             |cubic-bezier(0.165, 0.84, 0.44, 1);|样式缓动;|
|interval         |递增延时值。默认0.1|
|hideen           |boolean|在开始动画前隐藏掉html,默认为true;                     |
|reverse            |boolean|是否倒放,从最后一个dom开始往上播放,默认false|
|onComplete       |function |动画完成后回调|

####data参数（string|object）;
##### data={}
|参数             |类型           |详细                                                 |
|-----------------|----------------|----------------------------------------------------|
|enter|object|进场的样式|
|leave|object|出场样式|
|direction        |string |动画进场或出场样式,以`enter``leave`两值;默认为"enter",有值覆盖vars参数的direction|


#### enter={} or leave={}

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|type             |string            |内置动画样式：<br/>`left` `right` `top` `bottom` `scale` `scaleFrom` `scaleX` `scaleY`;|
|style            |object / string           |style样式，如transform: translateX(100px),每个样式必须以;结束；`type`有值此项无效|
|duration         |vars参数的duration             |动画的时间；有值覆盖vars参数的duration|
|ease             |vars参数的ease|样式缓动;有值覆盖vars参数的ease|
|delay            |0               |动画的延时;默认0,依照结构递增以上的`interval`|
|queueId          |0               |动画的线程，可为多线程|



支持style直接添加动画；

为string时，自动遍历node下的子节点来执行data样式；


为object时，树状形dom结构，以({})为一档标签；
