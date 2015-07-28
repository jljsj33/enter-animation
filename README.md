##EnterAnimation进场动画

### 用法
<pre><code>
var EnterAnimation = require('enter-animation');
var React = require('react');
React.render(&lt;EnterAnimation enter-transition={"left"}&gt
&lt;div&gtanim1&lt;/div&gt
&lt;div&gtanim2&lt;/div&gt
&lt;div&gtanim3&lt;/div&gt
&lt;/EnterAnimation&gt, container);

</code></pre>

### api
动画默认`right`

EnterAnimation标签下：


|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|type|string|执行动画的内置参数，默认；`right`  |
|style|string|同上，style的样式动画,`type`有值，此项无效， 默认null|
|delay|number|整个区块的延时，默认为0；</br>同startAnimation的delay|
|interval|number|递增延时值，默认0.1|


子dom标签下：


|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|enter-data       |null            |如下data值;|

注：如子节点enter-type或enter-style有值，则忽略enter-transition的数据；

##startAnimation的动画参数(EnterAnimation.to)；

页面进场动画的类，通过ＣＳＳ来快速完成页面刷新后的动画进场或子块的动画进场；

### 用法
<pre><code>
//js触发式：
var EnterAnimation=requre('enter-animation');
EnterAnimation.to(node,string);
EnterAnimation.to(node,data,delay);</code></pre>

### 参数说明

|参数             |类型    |详细                                                 |
|-----------------|-------|----------------------------------------------------|
|node             |string|要执行动画的dom（class,tag,id）;必要;  |
|data             |string / object|执行动画的参数，有object和string两种类型，下面详解；默认为null|
|delay            |number|整个区块的延时，默认为0                                |
|interval         |递增延时值。默认0.1|
|hideen           |boolean|在开始动画前隐藏掉html,默认为true;                     |

####data参数（string|array）;

支持style直接添加动画；

为string时，自动遍历node下的子节点来执行data样式；

为object时，树状形dom结构，以({})为一档标签；
如：

<pre><code>&lt;div class="a"&gt;
&lt;div class="b"&gt;&lt;/div&gt;
&lt;div class="c"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>

node用的是".a",做b,c的动画，那data为：{}为最外层div;
<pre><code>{////外层div
children:[//子下的两div
{type:"left"},
{type:"left"}
]
}</code></pre>

如果元素为多个时：

<pre><code>&lt;div class="a"&gt;
&lt;ul&gt;
&lt;li&gt;&lt;span&gt;&lt;/span&gt;&lt;/li&gt;
&lt;li&gt;&lt;span&gt;&lt;/span&gt;&lt;/li&gt;
&lt;li&gt;&lt;span&gt;&lt;/span&gt;&lt;/li&gt;
&lt;/ul&gt;
&lt;/div&gt;</code></pre>

处理每个li里的span的动画时，data为:

<pre><code>{//外层div
children:[//ul
{children:[//li
{children:[{type:'left'}]},
{children:[{type:'left'}]},
{children:[{type:'left'}]}
]}
]
}</code></pre>


#####data参数详细

|参数             |默认值           |详细                                                 |
|-----------------|----------------|----------------------------------------------------|
|type            |null            |内置动画样式：<br/>`left` `right` `top` `bottom` `scale` `scaleFrom` `scaleX` `scaleY`;|
|style            |null           |style样式，如transform: translateX(100px),每个样式必须以;结束；`type`有值此项无效|
|direction        |"enter"         |动画进场或出场样式,以`enter``leave`两值;默认为"enter",|
|duration         |0.5             |动画的时间；|
|ease             |cubic-bezier(0.165, 0.84, 0.44, 1);|样式缓动;|
|delay            |0               |动画的延时;默认0,依照结构递增以上的`interval`|
|queueId          |0               |动画的线程，可为多线程|
