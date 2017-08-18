调用一个函数即可生成一个带滑块的进度条组件

>var o = {
>    //定义本模块的className
>   className: 'pro-1',
    //定义模块长度
    width: '500px',
    //定义模块高度
    height: '10px',
    //定义圆形滑块直径
    d: '15px',
    //定义已过部分有颜色
    color: 'red',
    //定义未过部分颜色
    bgcolor: 'grey',
    //定义总长度代表的量的值
    totalValue: 300,
    //定义父元素标签
    parentSelector: 'body',
    //定义滑动滑块是是否连续输出
    continue: true,
    //定义初始的滑块位置比例
    startPercentage: 0.2,
    //回调函数1，滑动滑块或点击进度条时执行，参数是触发后得到的新的value。可选
    callback1: function(value) {
        nv.innerText = 'new value : ' + value
    },
    //回调函数2， 设定滑块代表量的值后的执行，参数是新值所对应的滑块长度。可选
    //作为外部量传入而不是定义构造的参数更好
    callback2: function(width) {
        nw.innerText = 'new width : ' + width
    },
}
//执行此语句即创建一个实例
var a = progressBar(o)
//此函数传入一个值，设置值对应的滑块位置和进度条长度，之后的回调在callback2定义
a.setWidth(150)
