// let AjaxUrlData = "http://192.168.88.200:8082/api/goods/listGoodsCompositeGraph";
let curImageHost = "https://nimg5.hicustom.com/";

let urlResult = "/static/images/test23.png";
// create3DBox({ urlData, curImageHost, urlResult });
/**
 * 多面展示思路
 *
 * 1. 获取到生成的 png 图
 * 2. 获取到多面展示底图
 * 3. 根据每个底图的数据渲染图片
 * 4. 展示到swiper
 *
 * desc:
 * 1. 每次渲染只修改当前面的图片，优化性能
 * 2. 每次加载时展示 loading ， 考虑放在 swiper-container 上
 *
 *
 */


var create3D = {
    datas: {
        styleList: [],
    },

    init: function() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "post",
                url: AjaxUrlData,
                data: {
                    productId: 12,
                },
                success: function(res) {
                    let styles = res.data;

                    // 先创建 轮播图
                    create3D.createImageSwiper(styles);
                    create3D.datas.styleList = styles;
                    console.log(1)
                    resolve(styles)

                    // 获取到图片列表渲染 swiper
                },
                error: function(error) {
                    reject(error)
                },
            });
        })
    },

    async funInit(imageUrl) {
        // let styles = await create3D.init()
        let styles = create3D.datas.styleList
            // 等canvas 渲染好了，用dataURL 填充这个函数
        for (let i = 0; i < styles.length; i++) {
            create3D.createAppointIndexSwiperImage(i, imageUrl);
        }

    },

    // 渲染 swiper 框架
    createImageSwiper(styleList) {
        let sliderArr = [];

        sliderArr.push(' <div class="swiper-wrapper">');
        // 根据 图片列表数量，添加 swiper-slide
        for (let i = 0; i < styleList.length; i++) {
            let styleItem = styleList[i];

            // 添加图片
            sliderArr.push(
                '<div class="swiper-slide">' +
                '<div class="img-wrap">' +
                "<img />" +
                "</div>" +
                "</div>"
            );
        }
        sliderArr.push("</div>");

        // 左右切换
        sliderArr.push(
            '<div class="swiper-button-next kbb-swiper-next"></div>' +
            '<div class="swiper-button-prev kbb-swiper-prev"></div>'
        );

        // 分页器
        sliderArr.push(
            '<div class="swiper-pagination kbb-swiper-pagination"></div>'
        );

        let sliderStr = sliderArr.join("");

        $("#kbbSwiper").html(sliderStr);

        // 渲染 swiper 轮播图

        let kbbSwiper = new Swiper(".kbb-swiper-container", {
            pagination: {
                el: ".kbb-swiper-pagination",
                clickable: true,
            },
            mousewheel: true, // 鼠标滚动效果
            navigation: {
                nextEl: ".kbb-swiper-next",
                prevEl: ".kbb-swiper-prev",
            },
            speed: 0, //  slide 的动画切换速度(注意不是自动切换的duration)
            on: {
                slideChange: function() {
                    create3D.setLargeBoxImage(this.activeIndex);
                },
            },
        });
    },


    // 为大图设置对应索引的图片
    setLargeBoxImage(index) {
        let imgSrc = $("#kbbSwiper .swiper-slide")
            .eq(index)
            .find("img")
            .attr("src");

        $(".kbb-show-large-box img").attr("src", imgSrc);
    },

    // 给单个 swiper 的 image 填充具体 src
    createSwiperSingleImage(index, src) {
        let curImgEl = $("#kbbSwiper .swiper-slide").eq(index).find("img");
        curImgEl.attr("src", src);
    },

    // 合成 cover 图 + 修饰图 （参数是 image 对象）
    // 传入需要合成的图片 src， 即可合成图片
    compositePictures: async function(imgUrlList) {
        if (!imgUrlList) {
            return;
        }
        let imgElList = [];
        for (let i = 0; i < imgUrlList.length; i++) {
            imgElList.push(await create3D.createImage(imgUrlList[i]));
        }
        let canvas = create3D.canvasDrawImage({ imgElList: imgElList });
        let dataURL = create3D.canvasToDataURL(canvas);
        return dataURL;
    },

    // 创建指定索引的图：
    createAppointIndexSwiperImage(index, url) {
        let imgUrlList = [
            curImageHost + create3D.datas.styleList[index].texture,
            //   curImageHost + create3D.datas.styleList[index].image,
        ];

        // 如果有传入 cover 图，则渲染 cover 图
        if (url) {
            // 获取到定位点，将图片变形
            // let canvasParams = JSON.parse(create3D.datas.styleList[index].goodsPagesPartVoList[0].canvasConfig)
            let canvasModel = create3D.datas.styleList[index].goodsPagesPartVoList;
            // 变形图片
            setTransformImage();
            async function setTransformImage() {
                let canvasUrlList = [];
                for (let i = 0; i < canvasModel.length; i++) {
                    let imgUrl = await createTransformImage({
                        imgUrl: url,
                        canvasSize: {
                            width: 600,
                            height: 600,
                        },
                        options: JSON.parse(canvasModel[i].canvasConfig),
                    });
                    canvasUrlList.push(imgUrl);
                }

                console.log(imgUrlList);

                res = canvasUrlList.concat(imgUrlList);
                finalRender(res);
            }

            // 用最后生成的图片融合：
            function finalRender(imgUrlList) {
                // 合成最终的 swiper 图片
                create3D.compositePictures(imgUrlList).then((urlData) => {
                    create3D.createSwiperSingleImage(index, urlData);
                    create3D.setLargeBoxImage(0);
                });
            }
        } else {
            create3D.compositePictures(imgUrlList).then((urlData) => {
                create3D.createSwiperSingleImage(index, urlData);
                create3D.setLargeBoxImage(0);
            });
        }
    },

    // 图片 转 canvas
    createImage(imgUrl) {
        let img = new Image();
        img.src = imgUrl;
        img.setAttribute("crossOrigin", "anonymous"); // 解决图片跨域报错问题
        return new Promise((resolve) => {
            img.onload = function() {
                resolve(img);
            };
        });
    },
    // canvas 绘制图片
    canvasDrawImage({
        imgElList,
        size = {
            width: undefined,
            height: undefined,
        },
    } = {}) {
        // size 为canvas 手动定义的大小，否则取第一张图片大小渲染
        let width = size.width || 600;
        let height = size.height || 600;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        imgElList.forEach((imgEl) => {
            ctx.drawImage(imgEl, 0, 0, width, height);
        });
        return canvas;
    },


    // canvas 转 base64
    canvasToDataURL(canvas, type) {
        type = type || "png";
        let dataURL = canvas.toDataURL("image/" + type);
        return dataURL;
    },

    // 转换分辨率
    resetImageSize: async function({ url, size }) {
        let img = await create3D.createImage(url);
        // let let =
    }





}

// function create3DBox({ urlData, curImageHost, urlResult } = {}) {


//     //  获取到生成的图片地址：

//     // 获取接口数据之图片的底图+ 位置信息



//     // create3D.init(urlResult);

// }

// create3D.init(AjaxUrlData)
create3D.funInit()