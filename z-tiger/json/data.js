let data = {
    "code": 200, //http状态，200=成功，500=失败
    "msg": "成功", //消息
    "data": {
        "id": 37, //产品id
        "name": "男士连帽拉链衫", //产品名称
        "enName": " Men's hoodie", //英文名称
        "dpi": 0, //dpi
        "designHeight": 0, //设计区域的高度
        "designWidth": 0, //设计区域的宽度
        "categoryId": 19, //分类id
        "isRelease": true, //是否是已发布的
        "sort": 1, //排序
        "isNew": true, //是否是新的
        "sizeType": "亚码", //尺码类型 通用码，亚码，欧码，美码
        "defaultSkuId": 26, //默认的skuId
        "defaultProductTypeColorId": 18, //默认的产品颜色id
        "designNotes": "A面印刷区域图片大小：3859 * 3859 px", //设计提示
        //描述
        "description": "<span class=\"detailDesccon dib break-all vt\" style=\"max-width: calc(100% - 65px);\">【设计说明】全幅印花<br>【材质说明】100%涤<br>【产品性能】采用全涤的面料，手感舒适，高弹。前面袋鼠式口袋，可存放日常小物件，袖口下摆松紧带，更合身。全幅印花，彰显青春个性。<br>【适用场景】适合日常穿着，闲逛，旅游，居家装等等，适合春季、秋季和冬季穿着。<br>【适用人群】男士<br>【配件构造】带帽加黑色帽绳，前面中间拉链开衫，前面有袋鼠式口袋。袖口下摆内置松紧带。<br>【洗涤说明】手洗机洗均可，请勿漂白<br>【特别说明】此尺码数据在衣服平铺下测量所得，因测量方法不同，误差在2-4cm内的属于正常现象<br>【FBA说明】由50*41*51cm纸箱包装，可装入45件产品（因码数尺寸不同，件数稍有差别）。</span>",
        /*
        根据产品分类而定的自定义字段集合,因为不同的分类可能有不同的属性，如鞋子，电器，电器有3c认真，鞋子不需要这样的属性

        */
        "fields": [{
                "fieldId": 15, //字段id
                "name": "生产工艺", //字段名称
                "value": " 转移印花", //字段值
                "isText": true //是否是文本，做了2种考虑，可能是纯文本，也可能是html源码
            },
            {
                "fieldId": 16,
                "name": "产品材质",
                "value": " 涤纶",
                "isText": true
            }
        ],
        //部位集合
        "parts": [{
            "id": 32, //部位id
            //部位纸板地址
            "path": "http://www.artskicks.com:9980/pic/20200813-3bfd6bcdbc9c4be089993bfa53bdad05.svg",
            "name": "A面", //部位名称
            "clipWidth": 1200.00, //模板区域宽度
            "clipHeight": 1200.00 //模板区域高度
        }],
        //颜色集合
        "colors": [{
            "id": 18, //颜色id
            "name": "黑色", //颜色名称
            "enName": "Black", //颜色英文名称
            "colorValue": "#000000", //颜色色值
            "sort": 1, //排序
            //颜色下的图片集合
            "imgs": [{
                "id": 51, //图片id
                "path": "http://www.artskicks.com:9980/pic/20200813-602dc165928d46aa951ef23cc9c06518.png", //源图路径            
                "middlePath": "http://www.artskicks.com:9980/pic/20200813-ab24b03d4322452eb5b4367ef4e9636d.png", //中图路径
                "smallPath": "http://www.artskicks.com:9980/pic/20200813-21d8277120814f90af5d013b84112376.png", //小图路径
                "sort": 1, //排序
                "partId": 32, //所属部位id
                layers: [{
                        id: 1,
                        sort: '', // 图层顺序
                        productTypePartId: '', // 部位id， 比如衣服正面、衣服袖子、衣服腰带等部位，由生成的衣服部位产生
                        transformType: '', // 变换类型 2d、 3d、3dPlus 变换
                        transformConfig: "{\"PositionX\":0,\"PositionY\":0.21,\"PositionZ\":0,\"RotateX\":0,\"RotateY\":0,\"RotateZ\":0,\"EyeX\":0,\"EyeY\":0,\"EyeZ\":3.71}",
                        cutType: '', // 切割类型 规则、不规则
                        cutImage: '', // 切割不规则图
                        clipConfig: " { width: '', height: ''}", // 切割数据JSON,需要两个输入框，分别天width 和 height
                        desc: '' // 描述文件
                    },

                ],
            }, ],
            //sku集合
            "skus": [{
                    "id": 26, //skuID
                    "sizeName": "S", //尺寸名字
                    "sizeEnName": "S", //尺寸英文名字
                    "count": 2, //数量
                    "salesVolume": 0, //销售量
                    "price": 100.00 //价格
                },
                {
                    "id": 27,
                    "sizeName": "M",
                    "sizeEnName": "M",
                    "count": 2,
                    "salesVolume": 0,
                    "price": 100.00
                }
            ]
        }],
        "sizes": [{
                "id": 40, //尺寸id
                "sizeEnName": "M", //尺寸英文名称
                "attachFields": {}, //附加字段
                "packageCm": "25.00*20.00*4.50", //包装尺寸（厘米）
                "packageIn": "9.84*7.87*1.77", //包装尺寸（英寸）
                "volumeCm": 2250.00, //包装体积(厘米)
                "volumeIn": 137.25, //包装体积(英寸)
                "packageG": 476.00, //含包装重量（g）
                "packgaeLB": 1.05, //含包装重量（lb）
                "manufactureClipWidth": 700.00, //裁剪的宽度
                "manufactureClipHeight": 700.00 //裁剪的高度
            },
            {
                "id": 39,
                "sizeEnName": "S",
                "attachFields": {},
                "packageCm": "25.00*20.00*4.00",
                "packageIn": "9.84*7.87*1.57",
                "volumeCm": 2000.00,
                "volumeIn": 122.00,
                "packageG": 446.00,
                "packgaeLB": 0.98,
                "manufactureClipWidth": 700.00,
                "manufactureClipHeight": 700.00
            }
        ],
        //裁剪方案集合
        //生产图裁剪方案集合

    }
};