/**
 * 
 * @param {String} selfSelector 自定义的分页器选择器名
 * @param {Object} data 数据（包含详细数据 与 分页 ，即为接口返回的 data 值） 
 * @param {Function} callback // 返回三个参数：nextPage: 下一页，  curPage: 当前页，  data:上面的data， 
 */

// 代码库之创建分页器
function pagination({
    selfSelector = "",
    data = {
        index: 1,
        list: [],
        totalCount: 1,
        limit: 9,
    },
    callback = function (nextPage, curPage, data) { }
} = {}) {

    // 判断是否存在相同的元素：
    console.log($(selfSelector))
    if ($(selfSelector).length > 1) {
        console.error('请保证每个分页器 .kbb-pagination 拥有不同类名！');
    }

    var curPage = 1;
    callback = callback || function () { }

    init(selfSelector)


    var page = Math.ceil(data.totalCount / data.limit)

    // 点击页码切换
    $(document).on('click', selfSelector + ' ' + '.kbb-click-btn', function () {
        curPage = parseInt($(this).html())
        pageChange(data, curPage)
    })


    // 点击向后切换
    $(document).on('click', selfSelector + ' ' + '.kbb-page-next', function () {
        if (curPage < page) {
            curPage++;
            pageChange(data, curPage)
        }
    })

    // 点击向前切换
    $(document).on('click', selfSelector + ' ' + '.kbb-page-prev', function () {
        if (curPage > 1) {
            curPage--;
            pageChange(data, curPage)
        }
    })

    // 点击向前跳3格
    $(document).on('click', selfSelector + ' ' + '.kbb-page-item-prev', function () {

        if (curPage > 3 && curPage <= 5) {
            curPage = 3;
        } else if (curPage > 5) {
            curPage -= 3
        }

        pageChange(data, curPage)
    })

    // 点击向后跳3格
    $(document).on('click', selfSelector + ' ' + '.kbb-page-item-next', function () {

        if (curPage < page - 2 && curPage > page - 5) {
            curPage = page - 3
        } else if (curPage <= page - 5) {
            curPage += 3
        }

        pageChange(data, curPage)
    })



    function init(selfSelector) {
        selfSelector = selfSelector || ''
        var pagination = $('.kbb-pagination' + selfSelector)
        var paginationWrap = $('<div class="kbb-pagination-wrap"></div>')
        console.log(paginationWrap)
        paginationWrap.append($(
            '<div class="kbb-page-prev hide">&lt;</div>'
            + '     <div class="kbb-click-btn kbb-page-first"></div>'
            + '     <div class="kbb-page-item-prev hide">...</div>'
            + '     <div class="kbb-page-list">'
            + '     </div >'
            + '<div class=" kbb-page-item-next hide">...</div>'
            + '<div class="kbb-click-btn kbb-page-last hide"></div>'
            + '<div class="kbb-page-next hide">&gt;</div>'
        ))
        pagination.append(paginationWrap)

    }

    // 创建、切换页码操作
    setPagination(data)
    function setPagination(data) {

        // 定义中间数字段的首尾：
        var start = 0
        var end = 0

        // 设置首尾两个数字
        setPage(1, page)

        // 设置中间 list 

        // 
        if (page === 1) {
            $(selfSelector + ' ' + '.kbb-page-first').addClass('active')
            return
        }
        $(selfSelector + ' ' + '.kbb-page-last').removeClass('hide')
        // 如果页码小于 8  则全部展示
        if (page < 8) {


            start = 2
            end = page

            // 如果页码等于 8 则 根据 curPage 选择性展示 左或右 省略框
        } else if (page === 8) {

            if (curPage <= 4) {
                showPageNext()
                start = 2
                end = 7
            } else {
                start = 3
                end = 8
                showPagePrev()
            }
        } else {
            // 展示双省略
            showPageBoth()

            if (curPage <= 4 || page - 4 < 5) {
                showPageNext()
                start = 2, end = 8
            } else if (curPage >= page - 3) {
                showPagePrev()
                start = page - 6;
                end = page
            } else {
                start = curPage - 2
                end = curPage + 3
            }
        }
        setPageList(start, end)

        setActivePage()
    }

    // 突出当前页
    function setActivePage() {
        var kbbBtnList = $(selfSelector + ' ' + '.kbb-click-btn')
        kbbBtnList.removeClass('active')
        for (var i = 0; i < kbbBtnList.length; i++) {
            var item = $(kbbBtnList[i])
            if (parseInt(item.html()) === parseInt(curPage)) {
                item.addClass('active')
                break
            }
        }
    }

    // 展示快速切换按钮
    function showPageBtn() {
        $(selfSelector + ' ' + '.kbb-page-next').removeClass('hide')
        $(selfSelector + ' ' + '.kbb-page-prev').removeClass('hide')
    }

    // 隐藏快速切换按钮
    function hidePageBtn() {
        $(selfSelector + ' ' + '.kbb-page-next').addClass('hide')
        $(selfSelector + ' ' + '.kbb-page-prev').addClass('hide')
    }

    // 只展示左侧省略号
    function showPagePrev() {
        showPageBtn()
        $(selfSelector + ' ' + '.kbb-page-item-prev').removeClass('hide')
        $(selfSelector + ' ' + '.kbb-page-item-next').addClass('hide')
    }

    // 只展示右侧省略号
    function showPageNext() {
        showPageBtn()
        $(selfSelector + ' ' + '.kbb-page-item-next').removeClass('hide')
        $(selfSelector + ' ' + '.kbb-page-item-prev').addClass('hide')
    }

    // 展示双侧省略号
    function showPageBoth() {
        showPageBtn()
        $(selfSelector + ' ' + '.kbb-page-item-next').removeClass('hide')
        $(selfSelector + ' ' + '.kbb-page-item-prev').removeClass('hide')
    }

    // 设置首尾页：
    function setPage(start, end) {
        $(selfSelector + ' ' + '.kbb-page-first').html(start)
        $(selfSelector + ' ' + '.kbb-page-last').html(end)
    }

    // 设置中间的页码
    function setPageList(start, end) {
        var list = $(selfSelector + ' ' + '.kbb-page-list')
        list.empty()
        for (var i = start; i < end; i++) {
            var el = $('<div class="kbb-click-btn kbb-page-item">' + i + '</div>')
            list.append(el)
        }
    }

    function pageChange(data, curPage) {
        setPagination(data)
        curPage = parseInt(curPage)
        var nextPage = 1
        if (curPage < page) {
            nextPage = curPage + 1
        } else {
            nextPage = page
        }
        callback(nextPage, curPage, data)
    }
}