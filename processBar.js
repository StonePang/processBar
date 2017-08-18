var log = console.log.bind(console)

class ProBar {
    constructor(obj) {
        this.className = obj.className
        this.width = obj.width
        this.height = obj.height || '10px'
        this.d = obj.d || '20px'
        this.color = obj. color || 'red'
        this.bgcolor = obj.bgcolor || 'grey'
        this.dragable = false
        this.totalValue = obj.totalValue
        this.parentSelector = obj.parentSelector || 'body'
        this.continue = obj.continue || false
        this.startPercentage = obj.startPercentage || 0
        this.callback1 = obj.callback1
        this.callback2 = obj.callback2
        this.setup()
    }

    setup() {
        var h = this.creatHtml()
        var p = document.querySelector(this.parentSelector)
        var name = this.className
        p.insertAdjacentHTML('beforeend', h)
        var fa = document.querySelector(`.${name}`)
        this.totalBar = fa.querySelector('.pro-bar-total')
        this.nowBar = fa.querySelector('.pro-bar-now')
        this.cycle = fa.querySelector('.pro-cycle')
        this.totalWidth = this.tw()
        this.bindEvents()
        this.newValue = this.setupnv()
    }

    creatHtml() {
        var html =
            `
            <div class="${this.className}" style='width:${this.width}; height:${this.d};position:absolute; left:50%; top:50%; transform:translate(-50%, -50%);'>
                <div class="pro-bar-now" data-action='progress' style='width:0; height:${this.height}; background-color:${this.color}; z-index:3;'></div>
                <div class="pro-bar-total" data-action='progress' style='width:${this.width}; height:${this.height}; background-color:${this.bgcolor};'></div>
                <div class="pro-cycle" data-action='cycle' style='width:${this.d}; height:${this.d};border:1px solid black; border-radius:50%; background-color:${this.color};z-index:3'></div>
            </div>

            `
        return html
    }

    tw() {
        var cw = this.cycle.style.width
        var tw = this.totalBar.style.width
        var totalWidth = Number(tw.slice(0, -2)) - Number(cw.slice(0, -2))
        return totalWidth
    }

    setupnv() {
        var tw = this.totalWidth
        var per = this.startPercentage
        var startValue = tw * per
        this.cycle.style.left = startValue + 'px'
        this.nowBar.style.width = startValue + 'px'
        return startValue
    }

    //计算得到newValue的函数
    nv(x) {
        var cw = this.cycle.style.width
        var tw = this.totalBar.style.width
        var tv = this.totalValue
        var totalWidth = Number(tw.slice(0, -2)) - Number(cw.slice(0, -2))
        var newValue = Math.floor(x / totalWidth * tv)
        return newValue
    }

    nw(v) {
        var cw = this.cycle.style.width
        var tw = this.totalBar.style.width
        var tv = this.totalValue
        var totalWidth = Number(tw.slice(0, -2)) - Number(cw.slice(0, -2))
        var nw = Math.floor(v / tv * totalWidth) + Number(cw.slice(0, -2))
        return nw
    }

    //callback1若没有定义则不执行，实现callback1的可选
    callback(arg) {
        if (this.callback1 != undefined) {
            this.callback1(arg)
        }
    }

    bindEvents() {
        // var actions = this.actions
        //that绑定为类对象this,在之后的绑定时间中庸that代替this,this代表调用的DOM对象document，
        var that = this
        document.addEventListener('click', function(event) {
            var k = event.target.dataset.action
            if (k == 'progress') {
                that.progress(event)
            }
        })

        document.addEventListener('mousedown', function(event) {
            var k = event.target.dataset.action
            if (k == 'cycle') {
                // log('mousedown_cycle', event)
                var cycle = that.cycle
                that.pageX = event.pageX
                that.dragable = true
            }
        })

        document.addEventListener('mouseup', function(event) {
            if (that.dragable) {
                that.dragable = false
                if (!that.continue) {
                    var x = that.cycle.style.left.slice(0, -2)
                    var newValue = that.nv(x)
                    that.newValue = newValue
                    that.callback(that.newValue)
                }
            }
        })

        document.addEventListener('mousemove', function(event) {
            that.mousemove_cycle(event)
        })

    }

    progress(event) {
        var x = event.offsetX
        var bar = this.nowBar
        var cycle = this.cycle
        var totalWidth = this.totalWidth
        var newValue = this.nv(x)
        if (x <= totalWidth ) {
            bar.style.width = String(x) + 'px'
            cycle.style.left = String(x) + 'px'
            this.newValue = newValue
        } else {
            bar.style.width = totalWidth + 'px'
            cycle.style.left = totalWidth + 'px'
            this.newValue = this.totalValue
        }
        var v = this.newValue
        this.callback(v)
     }

    mousemove_cycle(event) {
        if (this.dragable) {
            var cycle = this.cycle
            var parentX = cycle.offsetLeft
            var now = this.nowBar
            var x1 = this.pageX
            var x2 = event.pageX
            var move = x2 - x1
             if (parentX <= 0 && move <= 0) {
                cycle.style.left = 0
                now.style.width = 0
            } else if (parentX >= this.totalWidth && move >= 0) {
                cycle.style.left = this.totalWidth + 'px'
                now.style.width = this.totalWidth + 'px'
            }else {
                var m = String(parentX + move) + 'px'
                cycle.style.left = m
                now.style.width = m
                this.pageX = event.pageX
            }
            if (this.continue) {
                var nw = Number(cycle.style.left.slice(0, -2))
                this.newValue = this.nv(nw)
                var v = this.newValue
                this.callback(v)
            }
        }
    }

    setWidth(value) {
        if (value < 0 || value > this.totalValue) {
            return
        }
        var cycle = this.cycle
        var now = this.nowBar
        this.newValue = value
        this.newWidth = this.nw(this.newValue)
        cycle.style.left = this.newWidth + 'px'
        now.style.width = this.newWidth + 'px'
        var w = this.newWidth
        //if以后callback2可选
        if (this.callback2 != undefined ) {
            this.callback2(w)
        }
    }
}

var progressBar = function(obj) {
    var d = new ProBar(obj)
    return d
}
