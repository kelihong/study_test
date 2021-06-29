(function(global, factory) {

    typeof exports === 'object' && module !== 'undefined' ?
        module.exports = factory() :
        (global = global, global.$$ ? global.ktool = factory() : global.$$ = global.ktool = factory())

})(this, function() {


    let ktool = {}

    // 常量、 公共方法

    // 设置 cookie 
    /**
     * 设置cookie
     * @param {String} cname cookie 名
     * @param {*} cvalue cookie 值
     * @param {*} exdays 有效天数
     */
    function setCookie(cname, cvalue, exdays) {

        // 设置过期时间：
        let date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000))
        let expires = "expires=" + date.toGMTString()

        // 设置cookie
        document.cookie = cname + '=' + cvalue + ';' + expires
        return true
    }


    function removeCookie(cname) {
        setCookie(cname, '')
        return cname
    }

    // 获取 cookie
    /**
     * 
     * @param {String} cname cookie 名
     */
    function getCookie(cname) {

        let name = cname + '='
        let carray = document.cookie.split(';')

        for (let i = 0; i < carray.length; i++) {

            let citem = carray[i].trim() // 注意去空格
            if (citem.indexOf(name) == 0) {
                return citem.substring(name.length, citem.length)
            }
        }
        return ''
    }

    // 设置 localstorage: 
    /**
     * 
     * @param {String} key storageKey
     * @param {*} value 
     */
    function setStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
        return true
    }


    // 获取 localstorage: 
    /**
     * 
     * @param {String} key storageKey
     */
    function getStorage(key) {
        return JSON.parse(window.localStorage.getItem(key))
    }

    // 删除 localstorage: 
    /**
     * 
     * @param {String} key storageKey
     */
    function removeStorage(key) {
        window.localStorage.removeItem(key)
        return key
    }

    // 清空 localstorage: 
    /**
     * 
     * @param {String} key storageKey
     */
    function clearStorage(key) {
        window.localStorage.clear()
    }

    // 新增 dom 元素
    /**
     * 
     * 
     * @param {Element} parentNode: 父级元素，默认 body,
     * @param {String} tagName:   新增元素标签, 默认 div
     * @param {String} id:   新增元素标签, 默认 为空''
     * @param {Array} classLists:    类名数组, 默认 空数组[]
     * @param {String || Element} html: '', html 内容
     * @param {Object} styles: {},  样式
     * @param {Object} otherAttr: {}    其他属性
     */
    function createEl(params) {
        const defaultParams = {
            parentNode: document.body,
            tagName: 'div',
            id: '',
            classLists: [],
            html: '',
            styles: {},
            otherAttr: {}
        }

        // 处理参数
        Object.keys(defaultParams).forEach(key => {
            if (!params[key]) {
                params[key] = defaultParams[key]
            }
        })

        // 参数解构赋值
        const { parentNode, tagName, id, classLists, html, styles, otherAttr } = params

        // 生成元素
        var el = document.createElement(tagName)

        // 类名：
        for (var i = 0; i < classLists.length; i++) {
            if (classList[i]) {
                el.classList.add(classList[i])
            }
        }

        // html 内容：
        el.innerHTML = html

        // 行内样式
        if (Object.keys(styles)) {
            for (let key in styles) {
                el.style[key] = styles[key]
            }
        }

        // 其他属性
        if (Object.keys(otherAttr)) {
            for (let key in otherAttr) {
                console.log(el)
                el.setAttribute(key, otherAttr[key])
            }
        }

        // 添加
        parentNode.appendChild(el)

    }

    // 判断表单是否为空
    function isEmpty(data = {}, notFilter = []) {
        for (let key in data) {
            console.log(data[key])
            if (!data[key]) {
                var isRealEmpty = true
                for (var i = 0; i < notFilter.length; i++) {

                    // 一旦匹配到可为空的选项，立即退出循环
                    if (key === notFilter[i]) {
                        isRealEmpty = false
                        break
                    }
                }
                return isRealEmpty
            }
        }
        return false
    }

    // 生成随机数
    function randomNum(max, min) {
        max = max + 0.1 || 1
        min = min || 0
        return Math.floor(Math.random() * (max - min)) + min
    }

    // 生成随机颜色
    function randomColor() {
        let r = randomNum(255)
        let g = randomNum(255)
        let b = randomNum(255)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }

    /**
     * 参数与 console.log 无异
     * 打印格式： 
     * param1============>
     * param2
     * param3
     * ...
     */
    function log() {

        // 生成随机样式
        function randomStyle() {
            return `
              color: ${randomColor()};
              background: #efefef;       
              `
        }
        for (let i = 0; i < arguments.length; i++) {
            if ((typeof arguments[i] === 'string') || (typeof arguments[i] === 'number') || (typeof arguments[i] === 'boolean')) {

                // 给第一个参数添加 ======>
                if (arguments.length > 1 && i === 0) {
                    console.log('%c' + arguments[i] + '============>', randomStyle())
                } else {
                    console.log('%c' + arguments[i], randomStyle())
                }
            } else {
                console.log(arguments[i])
            }
        }
    }


    // 弹窗
    /**
     * 
     * @param {} param 
     */
    function showMsg(param) {
        let params = {
            msg: '',
            type: '' // ' ' / 'success' / 'error' / 'waring' 
        }
        if (typeof param === 'string') {
            params.msg = param
        } else {
            params = param
        }
        let msgBox = document.getElementById('kbbMsgBox')

        if (msgBox) {
            msgBox.remove()
        }
        let div = document.createElement('div')
        div.id = 'kbbMsgBox'
        div.style.position = 'fixed'
        div.style.top = 300 + 'px'
        div.style.left = '50%'
        div.style.transform = 'translateX(-50%)'
        div.style.backgroundColor = '#8c8c8c'
        div.style.opacity = '0.9'
        div.style.color = '#fff'
        div.style.borderRadius = '8px'
        div.style.fontSize = '14px'
        div.style.padding = '15px 35px'
        div.style.zIndex = 19999
        div.innerHTML = params.msg || ''

        if (params.type === 'success') {
            div.style.backgroundColor = '#4CAF50'
        } else if (params.type === 'error') {
            div.style.backgroundColor = '#d61313'
        } else if (params.type === 'warning') {
            div.style.backgroundColor = 'rgb(231 144 32)'
        } else {
            div.style.backgroundColor = '#8c8c8c'
        }
        document.body.appendChild(div)
        setTimeout(() => {
            div.remove()
        }, 2000);
    }

    // sin和 cos, tan: （传入角度值，求三角函数值）
    function mathSin(angle) {
        angle = angle % 360
        return Math.sin((angle * 2 * Math.PI) / 360)
    }

    function mathCos(angle) {
        angle = angle % 360
        return Math.cos((angle * 2 * Math.PI) / 360)
    }

    function mathTan(angle) {
        angle = angle % 360
        return Math.tan((angle * 2 * Math.PI) / 360)
    }

    // 压缩图片
    /**
     * 
     * @param {String} src 图片src
     * @param {String} width 宽度 【默认图片宽度】
     * @param {String} height 高度 【默认图片高度】
     * @param {String} type 类型 【默认 'png'】
     * @param {Function} callback 参数：新图片的src
     */
    function imageZip({ src, width, height, type, callback } = {}) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let image = new Image()
        image.src = src
        let _w = image.width
        let _h = image.height
        width = width || _w
        height = height || _h
        type = type || 'png'
        image.onload = function() {
            ctx.drawImage(image, 0, 0, width, height)
            let url = canvas.toDataURL('image/' + type)
            callback(url)
        }

    }


    Object.assign(ktool, {

        setCookie, // 设置 cookie
        getCookie, // 获取 cookie
        removeCookie, // 清空 cookie
        setStorage, // 设置 localStorage
        getStorage, // 获取 localStorage
        removeStorage, // 移除 localStorage
        clearStorage, // 清空 localStorage
        createEl, // 创建 DOM 元素
        isEmpty, // 判断表单是否为空
        randomNum, // 生成随机数
        randomColor, // 生成随机颜色
        log, // 改良版 console.log
        showMsg, // 弹窗
        mathSin, // 角度的正弦值
        mathCos, // 角度的余弦值
        mathTan, // 角度的正切值
        imageZip, // 压缩图片
    })

    return ktool
})