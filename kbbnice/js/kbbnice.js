window.kbbnice = {

    /**
     * 菜单页面
     */
    menulist: {
        init: function () {

            // 获取分类列表
            kbbnice.menulist.getMenuClassifyList()

            // 分类选项点击事件
            kbbnice.menulist.chooseClassifyItem(function (keyName, keyId) {
                console.log(keyName, keyId)
                kbbnice.menulist.menuClaasifyAjaxData[keyName] = keyId
                console.log(kbbnice.menulist.menuClaasifyAjaxData);
            })

            // 获取产品列表
            kbbnice.menulist.getProductList({})

        },

        // 
        menuClaasifyAjaxData: {
            
        },

        // 获取分类列表
        getMenuClassifyList: function () {
            $.ajax({
                type: 'get',
                url: '/kbbnice/js/menulist.json',
                success: function (res) {

                    let htmlStr = kbbnice.menulist.addMenuCllasifyItem(res.data, 'list')

                    let newEl = $('#kbbClassify').html(htmlStr)
                    console.log(newEl);
                },
                error: function (err) {
                    console.log(err);

                }
            })
        },

        // 添加菜单项
        addMenuCllasifyItem: function (list, subKey) {
            let htmlArr = []

            for (let i = 0; i < list.length; i++) {

                htmlArr.push('<div class="kbb-classify-wrap">')
                htmlArr.push('<div class="kbb-classify-label">' + list[i].label + '</div>')
                htmlArr.push(' <div class="kbb-classify-list"  key_name="' + list[i].key + '">')
                var subList = list[i][subKey]
                for (let j = 0; j < subList.length; j++) {
                    let item = list[i][subKey][j]
                    // 添加是否选中
                    let isActive = item.id == 0 ? ' active': ''
                    console.log('<div class="kbb-classify-item' + isActive + '"' + ' key_id=' + item.id + ' ' + '>')
                    htmlArr.push('<div class="kbb-classify-item' + isActive +'"' + ' key_id=' + item.id + ' ' + '>')
                    htmlArr.push(' <span>' + item.name + '</span>')
                    htmlArr.push('</div>')
                }
                htmlArr.push('</div>')
            }
            htmlArr.push('</div>')
            return htmlArr.join("")
        },

        // 分类选项点击事件
        chooseClassifyItem: function (callback) {
            callback = callback || function () { }
            $(document).on('click', '.kbb-classify-item', function () {
                let item = $(this)
                item.addClass('active')
                    .siblings().removeClass('active')
                callback(item.parents('.kbb-classify-list').eq(0).attr('key_name'), item.attr('key_id'), item, item.index())

            })
        },

        // 获取产品列表
        getProductList: function (data) {
            $.ajax({
                type: 'get',
                url: '/kbbnice/js/product.json',
                data: data,

            })
        }
    },

    /**
     * 工具列表
     */
    util: {
        test: function () {

        }
    }
}