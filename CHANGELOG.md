## 0.4.0 (2015-8-28)

* 增加与router 1.0.0-beta3的兼容，需要靠key；
* 修改steState元素都刷新动画，增加控制函数 `close`， close 为 true 时，setState 将不产生动画，
* 增加参数 `leave` , 出场的参数，为object，里面参数和标签一样，如leave:{type:'top'},`component` EnterAnimation替换的标签名;
* 修改部分startAnimation的bug;
* 增加案例router,修改demo
* 去除标签上的direction，内部执行进与出；

## 0.3.0 (2015-8-12)

* 增加回调callback;
* 修改部分bug

## 0.2.5 (2015-08-06)

* 修改removeStyle的中间有空格时不能删除。
* 修改vars为null时默认为object。

## 0.2.3 (2015-08-05)

* 增加大标签（EnterAnimation）的componentWillReceiveProps。


## 0.2.3 (2015-08-05)

* 增加大标签（EnterAnimation）上的可控性参数 `upend` ,倒放功能。

## 0.2.2 (2015-08-05)

* 修改leave时alpha的错误。
* 增加大标签（EnterAnimation）上的可控性参数 `duration` `direction` `ease` ,如 `enter-data` 有同样的数据直接覆盖。
* 大标签上的 `style` 改名为 `eStyle`
* 修改 `.to` 下的参数，合并为 `vars`

