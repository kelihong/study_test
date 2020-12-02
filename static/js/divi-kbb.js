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

//  获取到生成的图片地址： 

let urlData = 'http://localhost:1314/'

let urlResult = '/static/images/index_bg.png'

// 获取接口数据之图片的底图+ 位置信息

fetchImageData(urlResult)
function fetchImageData(imageUrl) {
   $.ajax({
      type: 'get',
      url: urlData,
      success: function (res) {
         console.log(res);

         createImageSwiper(res.data.styles)

         // 获取到图片列表渲染 swiper
      },
      error: function (error) {
         console.log(error);
      }

   })

}

// 渲染 swiper 框架
function createImageSwiper(styleList) {

   let sliderArr = []
   // 根据 图片列表数量，添加 swiper-slide 
   for (let i = 0; i < styleList.length; i++) {
      let styleItem = styleList[i]

      // 添加图片
      sliderArr.push('<div class="swiper-slide">')
      sliderArr.push(i)
      sliderArr.push('</div>')
   }
   let sliderStr = sliderArr.join("")

   $('#kbbSwiperWrap').html(sliderStr)

   // 渲染 swiper 轮播图

   setTimeout(() => {
      let kbbSwiper = new Swiper('.kbb-swiper-container', {
         autoplay: true
      })
   }, 1000);
   // console.log(kbbSwiper);
}