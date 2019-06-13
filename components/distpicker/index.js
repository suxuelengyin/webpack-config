/**
 * 地区选择器 by suxue in 2019/5/29
 */
// 如何传入列表值
import './distpicker.css'
function DistPicker(params) {
    const defaultParams = {
        key: 1,
        nameKey: "name",
        dataEventsList: [],
        scrollSelect: false,
        title: "请选择地区"
    }
    // 传入参数
    for (let key in defaultParams) {
        this[key] = params[key] ? params[key] : defaultParams[key]
    }
    //内置参数 
    this.dataList = []
    this.step = 0
    this.value = []

    // 初始化
    this.init();
    console.log(this)
}

// 扩展原型
DistPicker.extend = function (obj) {
    DistPicker.prototype = { ...DistPicker.prototype, ...obj }
}
// 扩展静态方法
DistPicker.extendStatic = function (obj) {
    for (let key in obj) {
        DistPicker[key] = obj[key]
    }
}

DistPicker.prototype = {
    // 初始化
    init: function () {
        this.dataList[this.step] = this.dataEventsList[this.step]()
        this.createEle()
        var ul = document.getElementsByClassName('su-list-ul')[0]
        var pre = document.getElementById('su-pre')
        var cancel = document.getElementById('su-cancel')
        var wrap = document.getElementById('su-pickerWrap')
        // 点击遮罩层消失
        wrap.addEventListener('click', e => {
            if (e.target.id === "su-pickerWrap") {
                this.closeList()
            }
        })
        // 取消按钮
        cancel.addEventListener('click', e => {
            this.closeList()
        })
        // 上一步
        pre.addEventListener('click', e => {
            this.pre()
        })
        // 点击li，获取数据并刷新
        ul.addEventListener('click', (e) => {
            // 赋值操作
            this.value[this.step] = e.target.innerText;
            this.step++
            if (this.step < this.dataEventsList.length - 1) {
                this.dataList[this.step] = this.dataEventsList[this.step](this.value, this.dataList[this.step - 1])
                this.updatedList(this.dataList[this.step])
            } else {
                this.dataEventsList[this.step](this.value, this.dataList[this.step - 1])
                this.closeList(this.dataList[this.dataList.length - 1])
                return
            }
            e.stopPropagation()
            e.preventDefault()
        })
        this.updatedList(this.dataList[this.step])
    },
    // 每次出现都会删除dom，防止事件堆叠
    createEle: function () {
        var suDistPicker = document.getElementById("su-distPicker");
        if (suDistPicker) {
            suDistPicker.innerHTML = ""
        } else {
            var body = document.getElementsByTagName('body')[0];
            suDistPicker = document.createElement('div');
            suDistPicker.id = "su-distPicker"
            body.appendChild(suDistPicker)
        }

        suDistPicker.innerHTML =
            `
                    <div id="su-pickerWrap"></div>
                    <div id="su-picker">
                    <div class="su-banner">
                        <span id="su-pre">上一步</span>
                        <span>${this.title}</span>
                        <span id="su-cancel">取消</span>
                    </div>
                    <div class="su-list">
                        <ul class="su-list-ul">
                        </ul>
                        </div>
                    </div>
                `
        this.showList()
    },
    // 刷新li列表
    updatedList: function (data) {
        var x = document.getElementsByClassName('su-list-ul')[0]
        x.innerHTML = ""
        DistPicker.promiseCallback(data, (data) => {
            data.map(item => {
                var text
                if (typeof item !== "object") {
                    text = item
                } else if (typeof item === "object") {
                    text = item[this.nameKey]
                }
                x.innerHTML = x.innerHTML + `<li>${text}</li>`
            })
        })
    },
    // 展示选择器
    showList: function () {
        var distPicker = document.getElementById('su-picker')
        var distPickerWrap = document.getElementById('su-pickerWrap')
        // 需要延迟触发才会有动画
        setTimeout(() => {
            distPickerWrap.className = "su-pickerWrapIn"
            distPicker.style.height = "250px";

        }, 0)

    },
    loading: function () {
        var x = document.getElementsByClassName('su-list-ul')[0]
        // x.innerHTML = 
    },
    // 关闭选择器
    closeList: function () {
        var distPicker = document.getElementById('su-picker')
        var distPickerWrap = document.getElementById('su-pickerWrap')
        this.step = 0
        distPicker.style.height = 0
        distPickerWrap.className = "su-pickerWrapOut"
        // 需要和动画的时间一致
        setTimeout(() => {
            distPickerWrap.style.display = "none"
        }, 300);

    },
    // 上一步
    pre: function () {
        // 第一步就返回
        if (this.step === 0) {
            return
        }
        this.step--;
        this.value[this.step] = ""
        this.updatedList(this.dataList[this.step])
    },
}

// utils 工具函数
DistPicker.extendStatic({
    promiseCallback(promise, callback) {
        if (promise.then) {
            promise.then(data => {
                callback(data)
            })
        } else {
            callback(promise)
        }
    },
    typeOf(obj) {
        return Object.prototype.toString.call(obj)
    },
    equalObjectDeep(obj, another) {
        const typeOf = DistPicker.typeOf
        for (let key in obj) {
            if (typeOf(obj[key]) !== "[object Object]" || "[object Array]") {
                if (obj[key] !== another[key]) {
                    return false
                }
            } else if (typeOf(obj[key]) !== "[object Object]") {
                if (!DistPicker.equalObjectDeep(obj[key], another[key])) {
                    return false
                }
            } else if (typeOf(obj[key]) !== "[object Array]") {
                if (!DistPicker.equalArrayDeep(obj[key], another[key])) {
                    return false
                }
            }
        }
        return true
    },
    equalArrayDeep(arr, another) {
        for (let i = 0; i < arr.length; i++) {
            if (!DistPicker.equalObjectDeep(arr[i], another[i])) {
                return false
            }
        }
        return true
    }
})

// 数据缓存
DistPicker.dataCache = {}
DistPicker.extend({
    getStepObj(obj) {
        if (obj.step == this.step) {
            return obj
        } else if (obj.children) {
            return this.getStep(obj.children)
        } else {
            return null
        }
    },
    setData(arr) {
        return arr.map(item => {
            const newItem = {}
            newItem.step === this.step;
            newItem.value === item
            return newItem
        })
    },
    // 是否已经设置过缓存，判断数据结构符合即可     
    hasSetData(data) {
        return !!data.step
    },
    // 获取缓存，发生在用户点击列表某项拿数据之前
    getDataCache(preVal) {
        if (DistPicker.dataCache[key]) {
            const dataCache = DistPicker.dataCache[key]
            // 没有上一个值，则返回初始列表
            if (!preVal) {
                return dataCache.map(item => item.value)
            }
            return dataCache
                .map(item => this.getStepObj(item))
                .filter(item => DistPicker.equalObjectDeep(item.value, preVal))[0].children
                .map(item => item.value)

        } else {
            return undefined
        }
    },
    // 设置缓存，发生在用户点击列表某项拿数据之后
    setDataCache(preVal, data) {
        if (DistPicker.dataCache[key]) {
            const dataCache = DistPicker.dataCache[key]
            // 没有上一个值，则返回初始列表
            if (!preVal) {
                dataCache = this.setData(data)
            }
            const datas = dataCache
                .map(item => this.getStepObj(item))
                .filter(item => DistPicker.equalObjectDeep(item.value, preVal))[0].children
            if (!this.hasSetData(datas)) {
                data = this.setData(data)
            }

        } else {
            return undefined
        }
    },
})

export default DistPicker